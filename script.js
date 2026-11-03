import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase, SplitText);

  CustomEase.create("hop", "0.8, 0, 0.02, 1");

  // ==========================================
  // SHARED TRANSITION STATE
  // ==========================================

  let introComplete = false;
  let transitionCompleted = false;
  let transitionRunning = false;

  // ==========================================
  // SPLIT TEXT
  // ==========================================

  const splitText = (selector, type, className) => {
    return SplitText.create(selector, {
      type,
      [`${type}Class`]: className,
      mask: type,
    });
  };

  splitText(
    ".nav-item:not(:nth-child(2)) a, .hero-copy > p, .footer-copyright",
    "lines",
    "line",
  );

  // ==========================================
  // CUSTOM HOVER CURSOR
  // ==========================================

  const hoverCursor = document.querySelector(".hover-cursor");

  const canUseCustomCursor = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  if (hoverCursor && canUseCustomCursor) {
    document.body.classList.add("custom-cursor-active");

    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType !== "mouse") return;

        hoverCursor.style.left = `${event.clientX}px`;
        hoverCursor.style.top = `${event.clientY}px`;
      },
      { passive: true },
    );

    const interactiveElements = document.querySelectorAll(
      "a, button, [role='button']",
    );

    interactiveElements.forEach((element) => {
      if (element.closest(".nav-brand")) return;

      element.classList.add("custom-cursor-target");

      element.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "mouse") return;

        hoverCursor.classList.add("is-visible");
        hoverCursor.classList.add("is-hovering");
      });

      element.addEventListener("pointerleave", (event) => {
        if (event.pointerType !== "mouse") return;

        hoverCursor.classList.remove("is-visible");
        hoverCursor.classList.remove("is-hovering");
      });
    });

    document.addEventListener("pointerout", (event) => {
      if (!event.relatedTarget) {
        hoverCursor.classList.remove("is-visible");
        hoverCursor.classList.remove("is-hovering");
      }
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

    const digitHeight = counterColumns[0]
      .querySelector("span")
      .getBoundingClientRect().height;

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================

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

    // ==========================================
    // IMAGE COUNTER TIMING
    // ==========================================

    gsap.delayedCall(0.25, () => animateCounterTo(0));
    gsap.delayedCall(1, () => animateCounterTo(27));
    gsap.delayedCall(1.75, () => animateCounterTo(42));
    gsap.delayedCall(2.5, () => animateCounterTo(68));
    gsap.delayedCall(3.25, () => animateCounterTo(99));
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
  // NAVIGATION
  // ==========================================

  tl.to(
    "nav .line, nav .nav-brand",
    {
      ...revealProps,
      autoAlpha: 1,
      stagger: 0.1,
    },
    "<0.125",
  );

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
  // INTRO COMPLETION GATE
  // ==========================================

  tl.eventCallback("onComplete", () => {
    introComplete = true;
  });

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
        const atPageTop = window.scrollY <= 2;

        // Ignore gestures when outside the transition scene.

        if (!atPageTop) {
          return;
        }

        // Ignore zero or horizontal-only wheel movement.

        if (event.deltaY === 0) {
          return;
        }

        const scrollingDown = event.deltaY > 0;
        const scrollingUp = event.deltaY < 0;

        // Keep the browser from scrolling during an active
        // transition or an ongoing wheel gesture.

        if (transitionRunning || wheelGestureActive) {
          event.preventDefault();

          releaseWheelLock();

          return;
        }

        // Do not start before the homepage intro finishes.

        if (!introComplete) {
          event.preventDefault();
          return;
        }

        // --------------------------------------
        // ONE DOWNWARD SCROLL = FULL TRANSITION
        // --------------------------------------

        if (scrollingDown && !transitionCompleted) {
          event.preventDefault();

          wheelGestureActive = true;

          releaseWheelLock();

          transitionTimeline.play();

          return;
        }

        // --------------------------------------
        // UPWARD SCROLL = REVERSE TRANSITION
        // --------------------------------------

        if (scrollingUp && transitionCompleted) {
          event.preventDefault();

          wheelGestureActive = true;

          releaseWheelLock();

          transitionTimeline.reverse();
        }
      }

      window.addEventListener("wheel", handleWheel, { passive: false });

      // ==========================================
      // TOUCH INPUT CONTROL
      // ==========================================

      let touchStartY = 0;
      let touchActive = false;
      let touchGestureTriggered = false;

      function handleTouchStart(event) {
        touchStartY = event.touches[0].clientY;

        touchActive = true;

        touchGestureTriggered = false;
      }

      function handleTouchMove(event) {
        const atPageTop = window.scrollY <= 2;

        if (!atPageTop) {
          return;
        }

        // Prevent page movement while transition runs.

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

        // Ignore tiny touch movements.

        if (Math.abs(difference) < 8) {
          return;
        }

        // Finger moving upwards = downward scroll.

        if (difference > 0 && !transitionCompleted) {
          event.preventDefault();

          touchGestureTriggered = true;

          transitionTimeline.play();

          return;
        }

        // Finger moving downwards = upward scroll.

        if (difference < 0 && transitionCompleted) {
          event.preventDefault();

          touchGestureTriggered = true;

          transitionTimeline.reverse();
        }
      }

      function handleTouchEnd() {
        touchActive = false;

        // Release touch gesture only after animation ends.

        if (!transitionRunning) {
          touchGestureTriggered = false;
        }
      }

      function releaseTouchAfterAnimation() {
        if (!touchActive) {
          touchGestureTriggered = false;
        }
      }

      // Attach touch listeners.

      window.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });

      window.addEventListener("touchmove", handleTouchMove, { passive: false });

      window.addEventListener("touchend", handleTouchEnd, { passive: true });

      window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

      // Release touch lock after forward or reverse completion.

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
});
