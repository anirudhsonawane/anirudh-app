import { useLayoutEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";

import "./hometransitionAsset.css";

const HOME_PATH = "/";

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

function HomeTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const black = blackRef.current;
    const white = whiteRef.current;

    if (!overlay || !black || !white) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let timeline: gsap.core.Timeline | null = null;
    let navigating = false;

    const reset = () => {
      gsap.set(overlay, {
        autoAlpha: 0,
        pointerEvents: "none",
      });

      gsap.set([black, white], {
        xPercent: 100,
      });

      timeline = null;
      navigating = false;
    };

    reset();

    const navigateHome = (destination: URL) => {
      window.history.pushState(
        {},
        "",
        destination.pathname + destination.search + destination.hash,
      );

      flushSync(() => {
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");

      if (!anchor) return;

      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.hasAttribute("data-no-transition")
      ) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);

      if (destination.origin !== window.location.origin) {
        return;
      }

      const currentPath = normalizePath(window.location.pathname);

      const destinationPath = normalizePath(destination.pathname);

      // Only internal page -> homepage.
      if (currentPath === HOME_PATH || destinationPath !== HOME_PATH) {
        return;
      }

      if (navigating) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      navigating = true;

      timeline?.kill();

      if (reducedMotion) {
        navigateHome(destination);
        reset();
        return;
      }

      gsap.set(overlay, {
        autoAlpha: 1,
        pointerEvents: "auto",
      });

      gsap.set(black, { xPercent: 100 });
      gsap.set(white, { xPercent: 100 });

      timeline = gsap.timeline({
        onComplete: reset,
      });

      timeline

        // 01. FULL BLACK SCREEN ENTERS
        .to(black, {
          xPercent: 0,
          duration: 0.9,
          ease: "power4.inOut",
        })

        // 02. NAVIGATE UNDER THE BLACK SCREEN
        .add(() => {
          navigateHome(destination);
        })

        // 03. FULL WHITE SCREEN ENTERS
        .to(
          white,
          {
            xPercent: 0,
            duration: 0.85,
            ease: "power4.inOut",
          },
          "-=0.15",
        )

        // 04. BOTH FULL-SCREEN LAYERS EXIT
        .to(
          [black, white],
          {
            xPercent: -100,
            duration: 1,
            stagger: 0.12,
            ease: "power4.inOut",
          },
          "+=0.08",
        );
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);

      timeline?.kill();

      gsap.killTweensOf([overlay, black, white]);
    };
  }, []);

  return (
    <div ref={overlayRef} className="home-transition" aria-hidden="true">
      <div ref={blackRef} className="home-transition__black" />

      <div ref={whiteRef} className="home-transition__white" />
    </div>
  );
}

export default HomeTransition;
