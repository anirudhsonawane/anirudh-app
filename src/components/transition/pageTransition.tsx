import { useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import "./page-transition.css";

const HOME_PATH = "/";
const ABOUT_PATH = "/about";
const CONTACT_PATH = "/contact";

const TRANSITION_PATHS = [ABOUT_PATH, CONTACT_PATH];

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

const isTransitionPage = (path: string) =>
  TRANSITION_PATHS.includes(normalizePath(path));

const getTransitionWord = (path: string) => {
  const normalized = normalizePath(path);

  if (normalized === ABOUT_PATH) return "About";
  if (normalized === CONTACT_PATH) return "Contact";

  return "Explore";
};

function PageTransition() {
  const [transitionWord, setTransitionWord] = useState(() =>
    getTransitionWord(window.location.pathname),
  );

  useLayoutEffect(() => {
    const overlay = document.querySelector<HTMLElement>(".page-transition");

    const track = document.querySelector<HTMLElement>(
      ".page-transition__track",
    );

    if (!overlay || !track) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let timeline: gsap.core.Timeline | null = null;
    let navigating = false;

    /*
     * INITIAL OVERLAY STATE
     */

    const hideOverlay = () => {
      gsap.set(overlay, {
        autoAlpha: 0,
        clipPath: "inset(100% 0 0 0)",
        pointerEvents: "none",
      });

      gsap.set(track, {
        yPercent: 0,
      });
    };

    hideOverlay();

    /*
     * CLIENT-SIDE NAVIGATION
     * Used only for About and Contact Us transitions.
     */

    const navigateWithoutReload = (destination: URL) => {
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
     * TRANSITION COMPLETION
     */

    const finishTransition = () => {
      hideOverlay();
      timeline = null;
      navigating = false;
    };

    /*
     * NAVIGATION CLICK HANDLER
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

      if (destination.origin !== window.location.origin) return;

      const currentPath = normalizePath(window.location.pathname);

      const destinationPath = normalizePath(destination.pathname);

      /*
       * IGNORE SAME-PAGE NAVIGATION
       */

      if (destinationPath === currentPath) return;

      /*
       * IMPORTANT:
       * HOME MUST USE ITS EXISTING PRELOADER.
       *
       * Do not prevent the default browser navigation.
       * Do not use the custom page transition.
       * Do not use SPA navigation.
       *
       * The normal page load will initialize the
       * existing homepage preloader.
       */

      if (destinationPath === HOME_PATH) {
        return;
      }

      /*
       * TRANSITIONS ONLY WHEN ABOUT OR CONTACT
       * IS THE CURRENT OR DESTINATION PAGE.
       */

      const shouldTransition =
        isTransitionPage(currentPath) || isTransitionPage(destinationPath);

      if (!shouldTransition) return;

      if (navigating) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      navigating = true;

      timeline?.kill();

      /*
       * UPDATE TRANSITION TITLE
       */

      flushSync(() => {
        setTransitionWord(getTransitionWord(destinationPath));
      });

      /*
       * REDUCED MOTION
       */

      if (reducedMotion) {
        navigateWithoutReload(destination);
        finishTransition();
        return;
      }

      /*
       * PREPARE OVERLAY
       */

      gsap.set(overlay, {
        autoAlpha: 1,
        clipPath: "inset(100% 0 0 0)",
        pointerEvents: "auto",
      });

      gsap.set(track, {
        yPercent: 0,
      });

      /*
       * SINGLE CONTINUOUS TIMELINE
       */

      timeline = gsap.timeline({
        onComplete: finishTransition,
      });

      timeline

        /*
         * 1. COVER CURRENT PAGE
         */

        .to(overlay, {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.9,
          ease: "power4.inOut",
        })

        /*
         * 2. CHANGE PAGE WHILE COVERED
         */

        .add(() => {
          navigateWithoutReload(destination);
        })

        /*
         * 3. REVEAL DESTINATION PAGE
         */

        .to(track, {
          yPercent: -33.333,
          duration: 1.1,
          ease: "power3.inOut",
        })

        .to(
          overlay,
          {
            clipPath: "inset(100% 0 0 0)",
            duration: 1.05,
            ease: "power4.inOut",
          },
          "<",
        );
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);

      timeline?.kill();

      gsap.killTweensOf([overlay, track]);
    };
  }, []);

  return (
    <div className="page-transition" aria-hidden="true">
      <div className="page-transition__viewport">
        <div className="page-transition__track">
          <div className="page-transition__word">
            <span>{transitionWord}</span>
          </div>

          <div className="page-transition__word">
            <span>{transitionWord}</span>
          </div>

          <div className="page-transition__word">
            <span>{transitionWord}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageTransition;
