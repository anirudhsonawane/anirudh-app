import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import "./collectionP1page.css";

type CollectionState = {
  image: string;
  origin: {
    top: number;
    left: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
  };
};

function CollectionP1() {
  const [collection, setCollection] = useState<CollectionState | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);

  const openRef = useRef(false);
  const closingRef = useRef(false);

  const openingTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const closingTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const marqueeRef = useRef<gsap.core.Tween | null>(null);

  // --------------------------------------------------
  // OPEN COLLECTION
  // --------------------------------------------------

  useEffect(() => {
    const handleCollectionClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;

      if (
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

      const card = target.closest<HTMLElement>(".collection-panel.sea");

      if (!card || openRef.current) return;

      const image = card.querySelector<HTMLImageElement>(".panel-image img");

      if (!image) return;

      const rect = image.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      event.preventDefault();

      openRef.current = true;
      closingRef.current = false;

      setCollection({
        image: image.currentSrc || image.src,
        origin: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
        },
      });
    };

    document.addEventListener("click", handleCollectionClick);

    return () => {
      document.removeEventListener("click", handleCollectionClick);
    };
  }, []);

  // --------------------------------------------------
  // OPENING ANIMATION
  // --------------------------------------------------

  useLayoutEffect(() => {
    if (!collection || !rootRef.current) return;

    const root = rootRef.current;
    const aperture = apertureRef.current;
    const image = imageRef.current;

    if (!aperture || !image) return;

    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const { origin } = collection;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth <= 768;

    const finalWidth = isMobile
      ? Math.min(viewportWidth * 0.86, 480)
      : Math.min(viewportWidth * 0.39, 540);

    const finalHeight = isMobile
      ? Math.min(viewportHeight * 0.34, 340)
      : Math.min(viewportHeight * 0.57, 590);

    const finalLeft = isMobile
      ? (viewportWidth - finalWidth) / 2
      : viewportWidth * 0.54;

    const finalTop = isMobile
      ? viewportHeight * 0.09
      : (viewportHeight - finalHeight) / 2;

    const apertureSize = Math.hypot(viewportWidth, viewportHeight) * 1.5;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const context = gsap.context(() => {
      gsap.set(root, {
        visibility: "visible",
        pointerEvents: "auto",
      });

      // Image starts at the clicked card.

      gsap.set(image, {
        position: "fixed",
        top: origin.top,
        left: origin.left,
        width: origin.width,
        height: origin.height,
        opacity: 1,
        borderRadius: 0,
      });

      // Aperture starts at the clicked image centre.

      gsap.set(aperture, {
        clipPath: `circle(0px at ${origin.centerX}px ${origin.centerY}px)`,
      });

      // Initial navigation state.

      gsap.set(".aperture-p1__nav", {
        y: -15,
        opacity: 0,
      });

      gsap.set(".aperture-p1__eyebrow", {
        y: 20,
        opacity: 0,
      });

      gsap.set(".aperture-p1__title-line", {
        yPercent: 110,
      });

      gsap.set(".aperture-p1__description", {
        y: 20,
        opacity: 0,
      });

      gsap.set(".aperture-p1__meta", {
        y: 15,
        opacity: 0,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // 1. Expand the aperture.

      timeline.to(aperture, {
        clipPath: `circle(${apertureSize}px at ${origin.centerX}px ${origin.centerY}px)`,
        duration: reducedMotion ? 0 : 1.25,
        ease: "power4.inOut",
      });

      // 2. Move the image into its editorial position.

      timeline.to(
        image,
        {
          top: finalTop,
          left: finalLeft,
          width: finalWidth,
          height: finalHeight,
          duration: reducedMotion ? 0 : 1.4,
          ease: "power4.inOut",
        },
        0.12,
      );

      // 3. Navigation reveal.

      timeline.to(
        ".aperture-p1__nav",
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.7,
          stagger: 0.1,
        },
        0.85,
      );

      // 4. Eyebrow reveal.

      timeline.to(
        ".aperture-p1__eyebrow",
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.7,
        },
        1.1,
      );

      // 5. Title reveal.

      timeline.to(
        ".aperture-p1__title-line",
        {
          yPercent: 0,
          duration: reducedMotion ? 0 : 1.05,
          stagger: 0.13,
          ease: "power4.out",
        },
        1.15,
      );

      // 6. Description reveal.

      timeline.to(
        ".aperture-p1__description",
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.75,
        },
        1.55,
      );

      // 7. Footer reveal.

      timeline.to(
        ".aperture-p1__meta",
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.7,
          stagger: 0.12,
        },
        1.75,
      );

      if (!reducedMotion) {
        timeline.eventCallback("onComplete", () => {
          marqueeRef.current = gsap.to(".aperture-p1__title-track", {
            xPercent: -12,
            duration: 16,
            ease: "none",
            repeat: -1,
            yoyo: true,
          });
        });
      }

      openingTimelineRef.current = timeline;
    }, root);

    return () => {
      marqueeRef.current?.kill();
      openingTimelineRef.current?.kill();

      context.revert();

      document.body.style.overflow = previousBodyOverflow;
    };
  }, [collection]);

  // --------------------------------------------------
  // ROUTE NAVIGATION HANDOFF
  // --------------------------------------------------

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.replace(/\/+$/, "") || "/";

      if (path !== "/about" && path !== "/contact") return;

      marqueeRef.current?.kill();
      openingTimelineRef.current?.kill();
      closingTimelineRef.current?.kill();

      openRef.current = false;
      closingRef.current = false;

      setCollection(null);
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // --------------------------------------------------
  // SMOOTH RETURN TO COLLECTION GRID
  // --------------------------------------------------

  const closeCollection = useCallback(() => {
    if (
      !collection ||
      !rootRef.current ||
      !apertureRef.current ||
      !imageRef.current ||
      closingRef.current
    ) {
      return;
    }

    closingRef.current = true;

    marqueeRef.current?.kill();
    openingTimelineRef.current?.kill();

    const root = rootRef.current;
    const aperture = apertureRef.current;
    const image = imageRef.current;

    // Use the current card position if available.
    // This keeps the image aligned with the visible grid.

    const originalCard = document.querySelector<HTMLElement>(
      ".collection-panel.sea",
    );

    const originalImage =
      originalCard?.querySelector<HTMLImageElement>(".panel-image img");

    const liveRect = originalImage?.getBoundingClientRect();

    const origin =
      liveRect && liveRect.width && liveRect.height
        ? {
            top: liveRect.top,
            left: liveRect.left,
            width: liveRect.width,
            height: liveRect.height,
            centerX: liveRect.left + liveRect.width / 2,
            centerY: liveRect.top + liveRect.height / 2,
          }
        : collection.origin;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const duration = reducedMotion ? 0 : 0.95;

    // Prevent another interaction while the reverse animation runs.

    gsap.set(root, {
      pointerEvents: "none",
    });

    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.inOut",
      },
      onComplete: () => {
        openRef.current = false;
        closingRef.current = false;

        setCollection(null);
      },
    });

    closingTimelineRef.current = timeline;

    // IMAGE: travel back to the exact collection card.

    timeline.to(
      image,
      {
        top: origin.top,
        left: origin.left,
        width: origin.width,
        height: origin.height,
        duration,
        ease: "power4.inOut",
      },
      0,
    );

    // APERTURE: contract around the original card position.

    timeline.to(
      aperture,
      {
        clipPath: `circle(0px at ${origin.centerX}px ${origin.centerY}px)`,
        duration,
        ease: "power4.inOut",
      },
      0,
    );

    // NAVIGATION: fade and lift away.

    timeline.to(
      ".aperture-p1__nav",
      {
        y: -12,
        opacity: 0,
        duration: reducedMotion ? 0 : 0.35,
        stagger: 0.035,
        ease: "power2.in",
      },
      0,
    );

    // COLLECTION LABEL.

    timeline.to(
      ".aperture-p1__eyebrow",
      {
        y: -12,
        opacity: 0,
        duration: reducedMotion ? 0 : 0.3,
        ease: "power2.in",
      },
      0,
    );

    // TITLE: move down while fading out.

    timeline.to(
      ".aperture-p1__title-line",
      {
        yPercent: 35,
        opacity: 0,
        duration: reducedMotion ? 0 : 0.42,
        stagger: 0.035,
        ease: "power2.in",
      },
      0,
    );

    // DESCRIPTION AND BUTTON.

    timeline.to(
      ".aperture-p1__description",
      {
        y: 18,
        opacity: 0,
        duration: reducedMotion ? 0 : 0.32,
        ease: "power2.in",
      },
      0,
    );

    // FOOTER.

    timeline.to(
      ".aperture-p1__meta",
      {
        y: 12,
        opacity: 0,
        duration: reducedMotion ? 0 : 0.3,
        stagger: 0.025,
        ease: "power2.in",
      },
      0,
    );
  }, [collection]);

  // --------------------------------------------------
  // ESCAPE KEY
  // --------------------------------------------------

  useEffect(() => {
    if (!collection) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCollection();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [collection, closeCollection]);

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  if (!collection) return null;

  return (
    <div
      className="aperture-p1"
      ref={rootRef}
      aria-label="By The Sea collection"
    >
      {/* APERTURE BACKGROUND */}

      <div className="aperture-p1__background" ref={apertureRef} />

      {/* NAVIGATION */}

      <header className="aperture-p1__header">
        <nav className="aperture-p1__navigation">
          <div className="aperture-p1__nav aperture-p1__nav-left">
            <a href="/about">About</a>
          </div>

          <div className="aperture-p1__nav aperture-p1__nav-center">
            <a href="/" aria-label="Realevate home">
              <img src="/Ascent™ Black Geometric Logo.png" alt="Realevate" />
            </a>
          </div>

          <div className="aperture-p1__nav aperture-p1__nav-right">
            <a href="/contact">Contact</a>
          </div>
        </nav>
      </header>

      {/* EDITORIAL CONTENT */}

      <main className="aperture-p1__content">
        <div className="aperture-p1__copy">
          <div className="aperture-p1__eyebrow">
            <span />
            <p>COLLECTION NO. 01 — MEDITERRANEAN</p>
          </div>

          <div className="aperture-p1__title">
            <div className="aperture-p1__title-mask">
              <div className="aperture-p1__title-line">BY THE</div>
            </div>

            <div className="aperture-p1__title-mask">
              <div className="aperture-p1__title-line">
                SEA <span>.</span>
              </div>
            </div>
          </div>

          <div className="aperture-p1__description">
            <p>
              A collection shaped by the rhythm
              <br />
              of the coast and the art of living well.
            </p>

            <button
              type="button"
              onClick={closeCollection}
              className="aperture-p1__back"
            >
              <span>EXPLORE COLLECTION</span>
              <span className="aperture-p1__back-arrow">↗</span>
            </button>
          </div>
        </div>

        {/* PROPERTY IMAGE */}

        <div className="aperture-p1__image" ref={imageRef}>
          <img src={collection.image} alt="By The Sea coastal property" />

          <div className="aperture-p1__image-caption">
            <span>01 / 04</span>
            <span>COASTAL LIVING</span>
          </div>
        </div>
      </main>

      {/* FOOTER */}

      <footer className="aperture-p1__footer">
        <div className="aperture-p1__meta">
          <span>SCROLL TO DISCOVER</span>
        </div>

        <div className="aperture-p1__meta aperture-p1__footer-right">
          <span>CURATED PROPERTIES</span>

          <button type="button" onClick={closeCollection}>
            BACK TO COLLECTIONS
            <span>↗</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default CollectionP1;
