import { useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import "./page-transition.css";

const STORAGE_KEY = "realevate-page-transition";

const ABOUT_PATH = "/about";
const CONTACT_PATH = "/contact";

const TRANSITION_PATHS = [ABOUT_PATH, CONTACT_PATH];

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

const getTransitionWord = (path: string) => {
  if (path === ABOUT_PATH) return "About";
  if (path === CONTACT_PATH) return "Contact";
  return "About";
};

function PageTransition() {
  const currentPath = normalizePath(window.location.pathname);

  const [transitionWord, setTransitionWord] = useState(
    getTransitionWord(currentPath),
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

    const isTransitionPage = TRANSITION_PATHS.includes(currentPath);

    let timeline: gsap.core.Timeline | null = null;
    let navigating = false;

    const hideOverlay = () => {
      gsap.set(overlay, {
        autoAlpha: 0,
        clipPath: "inset(100% 0 0 0)",
      });

      overlay.style.pointerEvents = "none";
    };

    const revealDestinationPage = () => {
      if (reducedMotion) {
        hideOverlay();
        return;
      }

      gsap.set(overlay, {
        autoAlpha: 1,
        clipPath: "inset(0% 0 0 0)",
        pointerEvents: "none",
      });

      gsap.set(track, {
        yPercent: 0,
      });

      timeline = gsap.timeline({
        onComplete: hideOverlay,
      });

      timeline
        .to(track, {
          yPercent: -33.333,
          duration: 1.15,
          ease: "power3.inOut",
        })
        .to(
          overlay,
          {
            clipPath: "inset(100% 0 0 0)",
            duration: 1.05,
            ease: "power4.inOut",
          },
          "-=0.65",
        );
    };

    /*
     * INITIAL PAGE STATE
     */

    hideOverlay();

    /*
     * DESTINATION PAGE ENTRANCE
     */

    const storedDestination = sessionStorage.getItem(STORAGE_KEY);

    if (isTransitionPage && storedDestination === currentPath) {
      sessionStorage.removeItem(STORAGE_KEY);
      revealDestinationPage();
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }

    /*
     * NAVIGATION TO ABOUT OR CONTACT
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

      const destinationPath = normalizePath(destination.pathname);

      if (!TRANSITION_PATHS.includes(destinationPath)) return;

      if (destinationPath === currentPath || navigating) return;

      event.preventDefault();

      navigating = true;

      /*
       * SET DESTINATION TYPOGRAPHY
       */

      setTransitionWord(getTransitionWord(destinationPath));

      /*
       * SAVE DESTINATION FOR PAGE ENTRANCE
       */

      sessionStorage.setItem(STORAGE_KEY, destinationPath);

      /*
       * REDUCED MOTION
       */

      if (reducedMotion) {
        window.location.assign(destination.href);
        return;
      }

      /*
       * INITIAL OVERLAY POSITION
       */

      overlay.style.pointerEvents = "auto";

      gsap.set(overlay, {
        autoAlpha: 1,
        clipPath: "inset(100% 0 0 0)",
      });

      gsap.set(track, {
        yPercent: 0,
      });

      timeline?.kill();

      /*
       * OUTGOING PAGE TRANSITION
       */

      timeline = gsap.timeline({
        onComplete: () => {
          window.location.assign(destination.href);
        },
      });

      timeline
        .to(overlay, {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.05,
          ease: "power4.inOut",
        })
        .to(
          track,
          {
            yPercent: -33.333,
            duration: 1.15,
            ease: "power3.inOut",
          },
          "-=0.65",
        );
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);

      timeline?.kill();

      gsap.killTweensOf([overlay, track]);
    };
  }, [currentPath]);

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
