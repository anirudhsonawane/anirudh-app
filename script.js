import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

// ==========================================
// ROUTE PROTECTION
// ==========================================

const normalizePath = (path) => path.replace(/\/+$/, "") || "/";

if (normalizePath(window.location.pathname) === "/") {
  // ==========================================
  // HOMEPAGE INITIALIZATION
  // ==========================================

  const initializeHomepage = () => {
    gsap.registerPlugin(CustomEase, SplitText);

    CustomEase.create("hop", "0.8, 0, 0.02, 1");

    // ==========================================
    // SHARED TRANSITION STATE
    // ==========================================

    let introComplete = false;
    let transitionCompleted = false;
    let transitionRunning = false;

    // ==========================================
    // COLLECTION PAGE PROTECTION
    // ==========================================

    const isCollectionPageActive = () => {
      return Boolean(document.querySelector(".aperture-p1, .collection-page"));
    };

    // ==========================================
    // SPLIT TEXT
    // ==========================================

    const splitText = (selector, type, className) => {
      if (!document.querySelector(selector)) {
        return null;
      }

      return SplitText.create(selector, {
        type,
        [`${type}Class`]: className,
        mask: type,
      });
    };

    /*
     * Split only the homepage content text.
     *
     * The shared navbar is animated as three complete
     * items, so its logo is not included in SplitText.
     */

    splitText(".hero-copy > p, .footer-copyright", "lines", "line");

    // ==========================================
    // SHARED NAVBAR INITIAL STATE
    // ==========================================

    const navbarItems = gsap.utils.toArray(
      ".shared-navbar--default .shared-navbar__item",
    );

    /*
     * Keep About, logo and Contact Us hidden until
     * the navbar reveal point in the intro timeline.
     */

    if (navbarItems.length) {
      gsap.set(navbarItems, {
        autoAlpha: 0,
        y: 18,
      });
    }

    // ==========================================
    // COUNTER SETUP
    // ==========================================

    const counterColumns = gsap.utils.toArray(".digit-col");

    if (counterColumns.length === 2) {
      counterColumns.forEach((column) => {
        for (let digit = 0; digit <= 9; digit++) {
          const digitElement = document.createElement("span");

          digitElement.textContent = digit;

          column.appendChild(digitElement);
        }
      });

      const firstDigit = counterColumns[0].querySelector("span");

      if (firstDigit) {
        const digitHeight = firstDigit.getBoundingClientRect().height;

        const animateCounterTo = (value) => {
          const tens = Math.floor(value / 10);
          const ones = value % 10;

          gsap.to(counterColumns[0], {
            y: -tens * digitHeight,
            duration: 0.75,
            ease: "hop",
            overwrite: true,
          });

          gsap.to(counterColumns[1], {
            y: -ones * digitHeight,
            duration: 0.75,
            ease: "hop",
            overwrite: true,
          });
        };

        gsap.delayedCall(0.25, () => animateCounterTo(0));
        gsap.delayedCall(1, () => animateCounterTo(27));
        gsap.delayedCall(1.75, () => animateCounterTo(42));
        gsap.delayedCall(2.5, () => animateCounterTo(68));
        gsap.delayedCall(3.25, () => animateCounterTo(99));
      }
    } else {
      console.error("Counter requires exactly two digit columns.");
    }

    // ==========================================
    // INFINITE SEAMLESS MARQUEE
    // ==========================================

    const marqueeTrack = document.querySelector(".marquee-track");

    if (marqueeTrack) {
      gsap.killTweensOf(marqueeTrack);

      gsap.set(marqueeTrack, {
        x: 0,
      });

      gsap.to(marqueeTrack, {
        xPercent: -50,
        duration: 18,
        ease: "none",
        repeat: -1,
      });
    }

    // ==========================================
    // HOMEPAGE INTRO TIMELINE
    // ==========================================

    const tl = gsap.timeline({
      delay: 0.5,
      onComplete: () => {
        introComplete = true;
      },
    });

    // ==========================================
    // SEQUENTIAL IMAGE REVEAL
    // ==========================================

    document.querySelectorAll(".hero-img").forEach((heroImage, index) => {
      const startTime = index * 0.5;

      const image = heroImage.querySelector("img");

      if (!image) return;

      tl.to(
        heroImage,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.5,
          ease: "hop",
        },
        startTime,
      );

      tl.to(
        image,
        {
          scale: 1,
          duration: 1.5,
          ease: "hop",
        },
        startTime,
      );
    });

    // ==========================================
    // BLACK SCREEN EXIT
    // ==========================================

    tl.to(".hero-overlay", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1,
      ease: "hop",
    });

    // ==========================================
    // HERO IMAGE MOVEMENT
    // ==========================================

    tl.to(
      ".hero-img-wrapper",
      {
        y: "-25%",
        duration: 1,
        ease: "hop",
      },
      "<",
    );

    // ==========================================
    // TEXT REVEAL SETTINGS
    // ==========================================

    const revealProps = {
      y: "0%",
      duration: 1,
      ease: "power4.out",
    };

    // ==========================================
    // MARQUEE TEXT
    // ==========================================

    tl.to(
      ".marquee-track h1",
      {
        ...revealProps,
      },
      "<0.65",
    );

    // ==========================================
    // SHARED NAVBAR REVEAL
    // ==========================================

    if (navbarItems.length) {
      tl.to(
        navbarItems,
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power4.out",
          stagger: 0.1,
        },
        "<0.125",
      );
    }

    // ==========================================
    // HERO DESCRIPTION
    // ==========================================

    tl.to(
      ".hero-copy > p .line",
      {
        ...revealProps,
        stagger: 0.1,
      },
      "<0.125",
    );

    // ==========================================
    // CALLOUT ELEMENTS
    // ==========================================

    const calloutTop = document.querySelector(".hero-callout-border-top");
    const calloutRight = document.querySelector(".hero-callout-border-right");
    const calloutBottom = document.querySelector(".hero-callout-border-bottom");
    const calloutLeft = document.querySelector(".hero-callout-border-left");
    const calloutText = document.querySelector(".hero-callout p");

    // ==========================================
    // CLOCKWISE BORDER DRAW
    // ==========================================

    if (calloutTop && calloutRight && calloutBottom && calloutLeft) {
      tl.to(
        calloutTop,
        {
          scaleX: 1,
          duration: 0.22,
          ease: "power2.inOut",
        },
        "<0.125",
      );

      tl.to(
        calloutRight,
        {
          scaleY: 1,
          duration: 0.33,
          ease: "power2.inOut",
        },
        ">-0.02",
      );

      tl.to(
        calloutBottom,
        {
          scaleX: 1,
          duration: 0.33,
          ease: "power2.inOut",
        },
        ">-0.02",
      );

      tl.to(
        calloutLeft,
        {
          scaleY: 1,
          duration: 0.33,
          ease: "power2.inOut",
        },
        ">-0.02",
      );

      tl.addLabel("calloutComplete", ">");

      // CALLOUT TEXT

      if (calloutText) {
        tl.to(
          calloutText,
          {
            y: "0%",
            opacity: 1,
            duration: 0.85,
            ease: "power4.out",
          },
          "calloutComplete",
        );
      }

      // FOOTER COPYRIGHT

      tl.to(
        ".footer-copyright .line",
        {
          y: "0%",
          duration: 0.85,
          ease: "power4.out",
        },
        "calloutComplete",
      );

      // FOOTER BUTTONS

      tl.to(
        ".footer-actions",
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: "power4.out",
        },
        "calloutComplete",
      );
    }

    // ==========================================
    // HOMEPAGE -> FOUR COLLECTIONS TRANSITION
    // ==========================================

    const transitionScene = document.querySelector("#transition-scene");
    const homepage = document.querySelector("#main-content");
    const underneathGrid = document.querySelector("#underneath-grid");

    if (transitionScene && homepage && underneathGrid) {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // ==========================================
      // REDUCED MOTION
      // ==========================================

      if (reducedMotion) {
        gsap.set(underneathGrid, {
          clipPath: "inset(0% 0% 0% 0%)",
        });

        introComplete = true;
      } else {
        // ==========================================
        // INITIAL HOMEPAGE STATE
        // ==========================================

        gsap.set(homepage, {
          scale: 1,
          x: 0,
          y: 0,
          transformOrigin: "50% 100%",
          force3D: true,
        });

        // ==========================================
        // INITIAL COLLECTION STATE
        // ==========================================

        gsap.set(underneathGrid, {
          clipPath: "inset(100% 0% 0% 0%)",
        });

        // ==========================================
        // TRANSITION TIMELINE
        // ==========================================

        const transitionTimeline = gsap.timeline({
          paused: true,

          onStart: () => {
            transitionRunning = true;
          },

          onComplete: () => {
            transitionCompleted = true;
            transitionRunning = false;
          },

          onReverseComplete: () => {
            transitionCompleted = false;
            transitionRunning = false;
          },
        });

        // ==========================================
        // REVEAL FOUR COLLECTION PANELS
        // ==========================================

        transitionTimeline.to(
          underneathGrid,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power3.inOut",
          },
          0,
        );

        // ==========================================
        // SHRINK AND MOVE HOMEPAGE DOWN
        // ==========================================

        transitionTimeline.to(
          homepage,
          {
            scale: 0.45,
            x: 0,
            y: "22%",
            duration: 1.4,
            ease: "power3.inOut",
          },
          0,
        );

        // ==========================================
        // WHEEL INPUT CONTROL
        // ==========================================

        let wheelGestureActive = false;
        let wheelIdleTimer = null;

        const WHEEL_IDLE_DELAY = 220;

        function releaseWheelLock() {
          clearTimeout(wheelIdleTimer);

          wheelIdleTimer = setTimeout(() => {
            if (transitionRunning) {
              releaseWheelLock();
              return;
            }

            wheelGestureActive = false;
          }, WHEEL_IDLE_DELAY);
        }

        function handleWheel(event) {
          if (isCollectionPageActive()) {
            return;
          }

          const atPageTop = window.scrollY <= 2;

          if (!atPageTop || event.deltaY === 0) {
            return;
          }

          const scrollingDown = event.deltaY > 0;
          const scrollingUp = event.deltaY < 0;

          if (transitionRunning || wheelGestureActive) {
            event.preventDefault();
            releaseWheelLock();
            return;
          }

          if (!introComplete) {
            event.preventDefault();
            return;
          }

          // DOWNWARD SCROLL: OPEN COLLECTIONS

          if (scrollingDown && !transitionCompleted) {
            event.preventDefault();

            wheelGestureActive = true;
            releaseWheelLock();

            transitionTimeline.play();

            return;
          }

          // UPWARD SCROLL: RETURN TO HOMEPAGE

          if (scrollingUp && transitionCompleted) {
            event.preventDefault();

            wheelGestureActive = true;
            releaseWheelLock();

            transitionTimeline.reverse();
          }
        }

        window.addEventListener("wheel", handleWheel, {
          passive: false,
        });

        // ==========================================
        // TOUCH INPUT CONTROL
        // ==========================================

        let touchStartY = 0;
        let touchActive = false;
        let touchGestureTriggered = false;

        function handleTouchStart(event) {
          if (!event.touches.length) return;

          touchStartY = event.touches[0].clientY;
          touchActive = true;
          touchGestureTriggered = false;
        }

        function handleTouchMove(event) {
          if (isCollectionPageActive()) {
            return;
          }

          if (!event.touches.length) return;

          const atPageTop = window.scrollY <= 2;

          if (!atPageTop) {
            return;
          }

          if (transitionRunning || touchGestureTriggered) {
            event.preventDefault();
            return;
          }

          if (!introComplete) {
            event.preventDefault();
            return;
          }

          const currentY = event.touches[0].clientY;
          const difference = touchStartY - currentY;

          if (Math.abs(difference) < 8) {
            return;
          }

          // FINGER MOVING UP: OPEN COLLECTIONS

          if (difference > 0 && !transitionCompleted) {
            event.preventDefault();

            touchGestureTriggered = true;
            transitionTimeline.play();

            return;
          }

          // FINGER MOVING DOWN: RETURN TO HOMEPAGE

          if (difference < 0 && transitionCompleted) {
            event.preventDefault();

            touchGestureTriggered = true;
            transitionTimeline.reverse();
          }
        }

        function handleTouchEnd() {
          touchActive = false;

          if (!transitionRunning) {
            touchGestureTriggered = false;
          }
        }

        function releaseTouchAfterAnimation() {
          if (!touchActive) {
            touchGestureTriggered = false;
          }
        }

        // ATTACH TOUCH LISTENERS

        window.addEventListener("touchstart", handleTouchStart, {
          passive: true,
        });

        window.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });

        window.addEventListener("touchend", handleTouchEnd, {
          passive: true,
        });

        window.addEventListener("touchcancel", handleTouchEnd, {
          passive: true,
        });

        // RELEASE TOUCH LOCK AFTER ANIMATION

        transitionTimeline.eventCallback("onComplete", () => {
          transitionCompleted = true;
          transitionRunning = false;
          releaseTouchAfterAnimation();
        });

        transitionTimeline.eventCallback("onReverseComplete", () => {
          transitionCompleted = false;
          transitionRunning = false;
          releaseTouchAfterAnimation();
        });
      }
    }
  };

  // ==========================================
  // SAFE HOMEPAGE INITIALIZATION
  // ==========================================

  let homepageInitialized = false;
  let navbarObserver = null;

  const startHomepage = () => {
    if (normalizePath(window.location.pathname) !== "/") {
      return;
    }

    if (homepageInitialized) {
      return;
    }

    const navbarRoot = document.getElementById("home-navbar-root");

    if (!navbarRoot) {
      console.error("Homepage navbar mount #home-navbar-root was not found.");
      return;
    }

    const initializeWhenNavbarIsReady = () => {
      if (homepageInitialized) {
        return;
      }

      const navbar = navbarRoot.querySelector(".shared-navbar--default");

      if (!navbar) {
        return;
      }

      homepageInitialized = true;

      if (navbarObserver) {
        navbarObserver.disconnect();
      }

      initializeHomepage();
    };

    navbarObserver = new MutationObserver(initializeWhenNavbarIsReady);

    navbarObserver.observe(navbarRoot, {
      childList: true,
      subtree: true,
    });

    initializeWhenNavbarIsReady();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startHomepage, {
      once: true,
    });
  } else {
    startHomepage();
  }
}
