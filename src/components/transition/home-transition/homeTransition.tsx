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

    // Used when returning from About or Contact.
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

    // Used when returning from the P1 overlay.
    // The URL is already "/", so do not push another history entry.
    const returnFromCollection = () => {
      flushSync(() => {
        window.dispatchEvent(new Event("ascent:close-collection"));
      });

      window.dispatchEvent(new Event("ascent:home-return"));
    };

    const finishTransition = () => {
      resetTransition();
      timeline = null;
      navigating = false;
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

      if (destination.origin !== window.location.origin) return;

      const destinationPath = normalizePath(destination.pathname);
      const activePath = currentPathRef.current;

      // P1 is an overlay on the homepage, not a separate route.
      const isCollectionViewActive = Boolean(
        document.querySelector(".aperture-p1"),
      );

      const isReturningFromCollection =
        destinationPath === HOME_PATH &&
        activePath === HOME_PATH &&
        isCollectionViewActive;

      // Only handle links returning to the homepage.
      // Ignore the homepage logo when no collection overlay is open.
      if (
        destinationPath !== HOME_PATH ||
        (activePath === HOME_PATH && !isCollectionViewActive)
      ) {
        return;
      }

      if (navigating) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      navigating = true;

      timeline?.kill();

      const completeNavigation = () => {
        if (isReturningFromCollection) {
          returnFromCollection();
        } else {
          navigateHome(destination);
        }
      };

      // Reduced-motion fallback.
      if (reducedMotion) {
        completeNavigation();
        finishTransition();
        return;
      }

      // Prepare the transition overlay.
      gsap.set(overlay, {
        autoAlpha: 1,
        clipPath: "inset(0 100% 0 0)",
        pointerEvents: "auto",
      });

      gsap.set(content, {
        autoAlpha: 1,
        y: 0,
      });

      timeline = gsap.timeline({
        onComplete: finishTransition,
      });

      timeline
        // 1. Cover the current page.
        .to(overlay, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.35,
          ease: "power4.inOut",
        })

        // 2. Change page or close P1 while covered.
        .add(() => {
          completeNavigation();
        })

        // 3. Give the homepage transition time to reverse.
        .to(
          {},
          {
            duration: isReturningFromCollection ? 0.5 : 0.1,
          },
        )

        // 4. Reveal the homepage.
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
