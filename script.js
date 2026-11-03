import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase, SplitText);

  CustomEase.create("hop", "0.8, 0, 0.02, 1");

  // ==========================================
  // SPLIT TEXT
  // ==========================================

  const splitText = (selector, type, className) => {
    return SplitText.create(selector, {
      type: type,
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

    // FOLLOW MOUSE MOVEMENT

    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType !== "mouse") {
          return;
        }

        hoverCursor.style.left = `${event.clientX}px`;
        hoverCursor.style.top = `${event.clientY}px`;
      },
      { passive: true },
    );

    // FIND INTERACTIVE ELEMENTS

    const interactiveElements = document.querySelectorAll(
      "a, button, [role='button']",
    );

    interactiveElements.forEach((element) => {
      // DO NOT USE CUSTOM CURSOR ON CENTRE LOGO

      if (element.closest(".nav-brand")) {
        return;
      }

      element.classList.add("custom-cursor-target");

      // SHOW CUSTOM CURSOR

      element.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "mouse") {
          return;
        }

        hoverCursor.classList.add("is-visible");
        hoverCursor.classList.add("is-hovering");
      });

      // HIDE CUSTOM CURSOR

      element.addEventListener("pointerleave", (event) => {
        if (event.pointerType !== "mouse") {
          return;
        }

        hoverCursor.classList.remove("is-visible");
        hoverCursor.classList.remove("is-hovering");
      });
    });

    // HIDE CURSOR WHEN LEAVING WINDOW

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

  if (counterColumns.length !== 2) {
    console.error("Counter requires exactly two digit columns.");
    return;
  }

  counterColumns.forEach((column) => {
    for (let digit = 0; digit <= 9; digit++) {
      const digitElement = document.createElement("span");

      digitElement.textContent = digit;

      column.appendChild(digitElement);
    }
  });

  // MEASURE ACTUAL DIGIT HEIGHT

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
  // MAIN REVEAL TIMELINE
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

    if (!image) {
      return;
    }

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
  // CALLOUT BORDER ELEMENTS
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
    // STEP 1:
    // TOP-LEFT TO TOP-RIGHT

    tl.to(
      calloutTop,
      {
        scaleX: 1,
        duration: 0.22,
        ease: "power2.inOut",
      },
      "<0.125",
    );

    // STEP 2:
    // TOP-RIGHT TO BOTTOM-RIGHT

    tl.to(
      calloutRight,
      {
        scaleY: 1,
        duration: 0.33,
        ease: "power2.inOut",
      },
      ">-0.02",
    );

    // STEP 3:
    // BOTTOM-RIGHT TO BOTTOM-LEFT

    tl.to(
      calloutBottom,
      {
        scaleX: 1,
        duration: 0.33,
        ease: "power2.inOut",
      },
      ">-0.02",
    );

    // STEP 4:
    // BOTTOM-LEFT TO TOP-LEFT
    // RECTANGLE IS NOW COMPLETE

    tl.to(
      calloutLeft,
      {
        scaleY: 1,
        duration: 0.33,
        ease: "power2.inOut",
      },
      ">-0.02",
    );

    // ==========================================
    // CALLOUT COMPLETE
    // ==========================================

    // This label is placed after the final border
    // animation. All following reveal animations
    // begin from this exact point in the timeline.

    tl.addLabel("calloutComplete", ">");

    // ==========================================
    // CALLOUT TEXT REVEAL
    // ==========================================

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

    // ==========================================
    // FOOTER COPYRIGHT REVEAL
    // ==========================================

    tl.to(
      ".footer-copyright .line",
      {
        y: "0%",
        duration: 0.85,
        ease: "power4.out",
      },
      "calloutComplete",
    );

    // ==========================================
    // FOOTER BUTTONS REVEAL
    // OUR SELECTION + MENU
    // ==========================================

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
});
