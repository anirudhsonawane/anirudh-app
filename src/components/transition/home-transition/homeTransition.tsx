import { useLayoutEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";

import "./hometransitionAsset.css";

const HOME_PATH = "/";

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

function HomeTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;

    if (!overlay) return;

    const strips = Array.from(
      overlay.querySelectorAll<HTMLElement>(".home-transition__strip"),
    );

    if (!strips.length) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let timeline: gsap.core.Timeline | null = null;
    let navigating = false;

    const hideOverlay = () => {
      gsap.set(overlay, {
        autoAlpha: 0,
        pointerEvents: "none",
      });

      gsap.set(strips, {
        xPercent: 110,
      });
    };

    hideOverlay();

    /*
    ==========================================
    CLIENT-SIDE HOMEPAGE NAVIGATION
    ==========================================
    */

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

    /*
    ==========================================
    TRANSITION CLEANUP
    ==========================================
    */

    const finishTransition = () => {
      hideOverlay();

      timeline = null;
      navigating = false;
    };

    /*
    ==========================================
    NAVIGATION CLICK HANDLER
    ==========================================
    */

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

      /*
      Only animate navigation from an internal
      page back to the homepage.
      */

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

      /*
      ==========================================
      REDUCED MOTION
      ==========================================
      */

      if (reducedMotion) {
        navigateHome(destination);
        finishTransition();
        return;
      }

      /*
      ==========================================
      PREPARE COLOUR STRIPS
      ==========================================
      */

      gsap.set(overlay, {
        autoAlpha: 1,
        pointerEvents: "auto",
      });

      gsap.set(strips, {
        xPercent: 110,
      });

      /*
      ==========================================
      MAIN GSAP TIMELINE
      ==========================================
      */

      timeline = gsap.timeline({
        onComplete: finishTransition,
      });

      timeline

        /*
        01 — COLOUR STRIPS SLIDE IN

        Each strip enters from the right.
        The stagger creates the layered effect.
        */

        .to(strips, {
          xPercent: 0,
          duration: 0.72,
          stagger: {
            each: 0.105,
            from: "start",
          },
          ease: "power4.inOut",
        })

        /*
        02 — CHANGE TO HOMEPAGE

        The coloured strips completely cover
        the outgoing page before navigation.
        */

        .add(() => {
          navigateHome(destination);
        })

        /*
        03 — HOLD

        A short pause lets the homepage render
        beneath the transition.
        */

        .to(
          {},
          {
            duration: 0.12,
          },
        )

        /*
        04 — COLOUR STRIPS SLIDE OUT

        The strips travel towards the left,
        revealing the homepage progressively.
        */

        .to(strips, {
          xPercent: -110,
          duration: 0.78,
          stagger: {
            each: 0.09,
            from: "start",
          },
          ease: "power4.inOut",
        });
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);

      timeline?.kill();

      gsap.killTweensOf([overlay, ...strips]);
    };
  }, []);

  return (
    <div ref={overlayRef} className="home-transition" aria-hidden="true">
      <div className="home-transition__strip home-transition__strip--gold" />

      <div className="home-transition__strip home-transition__strip--olive" />

      <div className="home-transition__strip home-transition__strip--antique" />

      <div className="home-transition__strip home-transition__strip--yellow" />
    </div>
  );
}

export default HomeTransition;
