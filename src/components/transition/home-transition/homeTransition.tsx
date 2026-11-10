import { useLayoutEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";

import "./hometransitionAsset.css";

const HOME_PATH = "/";

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

type HomeTransitionProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

function HomeTransition({ currentPath, onNavigate }: HomeTransitionProps) {
  const currentPathRef = useRef(normalizePath(currentPath));
  const onNavigateRef = useRef(onNavigate);

  currentPathRef.current = normalizePath(currentPath);
  onNavigateRef.current = onNavigate;

  useLayoutEffect(() => {
    const overlay = document.querySelector<HTMLElement>(".home-transition");

    if (!overlay) return;

    const content = overlay.querySelector<HTMLElement>(
      ".home-transition__content",
    );

    if (!content) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let timeline: gsap.core.Timeline | null = null;
    let navigating = false;

    // Reset overlay to its hidden starting position.
    const resetTransition = () => {
      gsap.set(overlay, {
        autoAlpha: 0,
        clipPath: "inset(0 100% 0 0)",
        pointerEvents: "none",
      });

      gsap.set(content, {
        autoAlpha: 1,
        y: 0,
      });
    };

    resetTransition();

    // Navigate to homepage while the overlay covers the screen.
    const navigateHome = (destination: URL) => {
      window.history.pushState(
        {},
        "",
        destination.pathname + destination.search + destination.hash,
      );

      flushSync(() => {
        onNavigateRef.current(HOME_PATH);
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
    };

    // Finish and clean up the transition.
    const finishTransition = () => {
      resetTransition();
      timeline = null;
      navigating = false;
    };

    // Intercept links returning to homepage.
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

      const destinationPath = normalizePath(destination.pathname);

      const activePath = currentPathRef.current;

      // Only animate when returning to homepage.
      if (destinationPath !== HOME_PATH || activePath === HOME_PATH) {
        return;
      }

      if (navigating) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      navigating = true;

      timeline?.kill();

      // Reduced-motion fallback.
      if (reducedMotion) {
        navigateHome(destination);
        finishTransition();
        return;
      }

      // Prepare overlay.
      gsap.set(overlay, {
        autoAlpha: 1,
        clipPath: "inset(0 100% 0 0)",
        pointerEvents: "auto",
      });

      // Ensure typography is visible before the wipe starts.
      gsap.set(content, {
        autoAlpha: 1,
        y: 0,
      });

      // Page wipe animation. Typography remains static.
      timeline = gsap.timeline({
        onComplete: finishTransition,
      });

      timeline
        // 1. Cover current page.
        .to(overlay, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.35,
          ease: "power4.inOut",
        })

        // 2. Change route while covered.
        .add(() => {
          navigateHome(destination);
        })

        // 3. Hold the static typography.
        .to(
          {},
          {
            duration: 0.1,
          },
        )

        // 4. Reveal homepage.
        .to(overlay, {
          clipPath: "inset(0 0 0 100%)",
          duration: 1.45,
          ease: "power4.inOut",
        });
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);

      timeline?.kill();

      gsap.killTweensOf(overlay);
      gsap.killTweensOf(content);
    };
  }, []);

  return (
    <div className="home-transition" aria-hidden="true">
      <div className="home-transition__content">
        <span className="home-transition__word">ASCENT</span>

        <span className="home-transition__word">LONG</span>

        <span className="home-transition__word">
          EXPOSURE<span className="home-transition__dot">.</span>
        </span>
      </div>
    </div>
  );
}

export default HomeTransition;
