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
    ".nav-item:not(:nth-child(2)) a, .hero-copy > p, footer p",
    "lines",
    "line",
  );

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

  // Measure actual digit height

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
  // ALL COUNTS RUN WHILE SCREEN IS BLACK
  // ==========================================

  gsap.delayedCall(0.25, () => animateCounterTo(0));

  gsap.delayedCall(1, () => animateCounterTo(27));

  gsap.delayedCall(1.75, () => animateCounterTo(42));

  gsap.delayedCall(2.5, () => animateCounterTo(68));

  gsap.delayedCall(3.25, () => animateCounterTo(99));

  // ==========================================
  // MARQUEE ANIMATION
  // ==========================================

  const marqueeTrack = document.querySelector(".marquee-track");

  if (marqueeTrack) {
    const marqueeItem = marqueeTrack.querySelector("h1");

    if (marqueeItem) {
      const marqueeItemWidth = marqueeItem.offsetWidth;

      gsap.to(marqueeTrack, {
        x: -marqueeItemWidth,
        duration: 7.5,
        ease: "none",
        repeat: -1,
      });
    }
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
      heroImage.querySelector("img"),
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
  // THIS HAPPENS AFTER ALL IMAGES REVEAL
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
  // EXHIBITION CALLOUT
  // ==========================================

  tl.to(
    ".hero-callout p",
    {
      ...revealProps,

      opacity: 1,
    },
    "<0.125",
  );

  // ==========================================
  // FOOTER
  // ==========================================

  tl.to(
    "footer .line",
    {
      ...revealProps,
    },
    "<0.125",
  );
});
