import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import Navbar from "../navbar/navbar";
import "./collectionPage.css";

type CollectionConfig = {
  pageClass: string;
  cardSelector: string;
  titleLines: string[];
  eyebrow: string;
  description: string[];
  image: string;
  imageAlt: string;
  imageCaption: string;
  collectionNumber: string;
};

type ImageOrigin = {
  top: number;
  left: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

type CollectionState = {
  image: string;
  origin: ImageOrigin;
};

type CollectionPageProps = CollectionConfig;

function CollectionPage({
  pageClass,
  cardSelector,
  titleLines,
  eyebrow,
  description,
  image,
  imageAlt,
  imageCaption,
  collectionNumber,
}: CollectionPageProps) {
  const [collection, setCollection] = useState<CollectionState | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const openRef = useRef(false);
  const closingRef = useRef(false);

  const openingTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const closingTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const marqueeRef = useRef<gsap.core.Tween | null>(null);

  // --------------------------------------------------
  // GET IMAGE POSITION
  // --------------------------------------------------

  const getImageOrigin = useCallback(
    (element: HTMLImageElement): ImageOrigin => {
      const rect = element.getBoundingClientRect();

      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      };
    },
    [],
  );

  // --------------------------------------------------
  // OPEN COLLECTION FROM HOMEPAGE CARD
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

      const card = target.closest<HTMLElement>(cardSelector);

      if (!card || openRef.current) return;

      const cardImage =
        card.querySelector<HTMLImageElement>(".panel-image img");

      if (!cardImage) return;

      const origin = getImageOrigin(cardImage);

      if (!origin.width || !origin.height) return;

      event.preventDefault();

      openRef.current = true;
      closingRef.current = false;

      setCollection({
        image: cardImage.currentSrc || cardImage.src || image,
        origin,
      });
    };

    document.addEventListener("click", handleCollectionClick);

    return () => {
      document.removeEventListener("click", handleCollectionClick);
    };
  }, [cardSelector, getImageOrigin, image]);

  // --------------------------------------------------
  // OPENING ANIMATION
  // --------------------------------------------------

  useLayoutEffect(() => {
    if (!collection || !rootRef.current) return;

    const root = rootRef.current;
    const aperture = apertureRef.current;
    const imageElement = imageRef.current;

    if (!aperture || !imageElement) return;

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

      gsap.set(imageElement, {
        position: "fixed",
        top: origin.top,
        left: origin.left,
        width: origin.width,
        height: origin.height,
        opacity: 1,
        borderRadius: 0,
      });

      gsap.set(aperture, {
        clipPath: `circle(0px at ${origin.centerX}px ${origin.centerY}px)`,
      });

      gsap.set(".collection-page__nav", {
        y: -15,
        opacity: 0,
      });

      gsap.set(".collection-page__eyebrow", {
        y: 20,
        opacity: 0,
      });

      gsap.set(".collection-page__title-line", {
        yPercent: 110,
      });

      gsap.set(".collection-page__description", {
        y: 20,
        opacity: 0,
      });

      gsap.set(".collection-page__meta", {
        y: 15,
        opacity: 0,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // 1. Expand aperture from the selected card.

      timeline.to(aperture, {
        clipPath: `circle(${apertureSize}px at ${origin.centerX}px ${origin.centerY}px)`,
        duration: reducedMotion ? 0 : 1.6,
        ease: "power4.inOut",
      });

      // 2. Move selected image into editorial position.

      timeline.to(
        imageElement,
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

      // 3. Navigation.

      timeline.to(
        ".collection-page__nav",
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.7,
          stagger: 0.1,
        },
        0.85,
      );

      // 4. Eyebrow.

      timeline.to(
        ".collection-page__eyebrow",
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.7,
        },
        1.1,
      );

      // 5. Title.

      timeline.to(
        ".collection-page__title-line",
        {
          yPercent: 0,
          duration: reducedMotion ? 0 : 1.05,
          stagger: 0.13,
          ease: "power4.out",
        },
        1.15,
      );

      // 6. Description.

      timeline.to(
        ".collection-page__description",
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.75,
        },
        1.55,
      );

      // 7. Footer.

      timeline.to(
        ".collection-page__meta",
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
          marqueeRef.current = gsap.to(".collection-page__title-track", {
            xPercent: -8,
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
  // ABOUT / CONTACT NAVIGATION HANDOFF
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
  // SMOOTH RETURN TO THE CORRECT HOMEPAGE CARD
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
    const imageElement = imageRef.current;

    const originalCard = document.querySelector<HTMLElement>(cardSelector);

    const originalImage =
      originalCard?.querySelector<HTMLImageElement>(".panel-image img");

    const liveRect = originalImage?.getBoundingClientRect();

    const origin =
      liveRect && liveRect.width && liveRect.height
        ? getImageOrigin(originalImage!)
        : collection.origin;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const duration = reducedMotion ? 0 : 0.95;

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

    // Image returns to its own homepage card.

    timeline.to(
      imageElement,
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

    // Aperture contracts around the original card.

    timeline.to(
      aperture,
      {
        clipPath: `circle(0px at ${origin.centerX}px ${origin.centerY}px)`,
        duration,
        ease: "power4.inOut",
      },
      0,
    );

    // Navigation disappears.

    timeline.to(
      ".collection-page__nav",
      {
        y: -12,
        opacity: 0,
        duration: reducedMotion ? 0 : 0.35,
        stagger: 0.035,
        ease: "power2.in",
      },
      0,
    );

    // Eyebrow disappears.

    timeline.to(
      ".collection-page__eyebrow",
      {
        y: -12,
        opacity: 0,
        duration: reducedMotion ? 0 : 0.3,
        ease: "power2.in",
      },
      0,
    );

    // Title disappears.

    timeline.to(
      ".collection-page__title-line",
      {
        yPercent: 35,
        opacity: 0,
        duration: reducedMotion ? 0 : 0.42,
        stagger: 0.035,
        ease: "power2.in",
      },
      0,
    );

    // Description disappears.

    timeline.to(
      ".collection-page__description",
      {
        y: 18,
        opacity: 0,
        duration: reducedMotion ? 0 : 0.32,
        ease: "power2.in",
      },
      0,
    );

    // Footer disappears.

    timeline.to(
      ".collection-page__meta",
      {
        y: 12,
        opacity: 0,
        duration: reducedMotion ? 0 : 0.3,
        stagger: 0.025,
        ease: "power2.in",
      },
      0,
    );
  }, [collection, cardSelector, getImageOrigin]);

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
      className={`collection-page ${pageClass}`}
      ref={rootRef}
      aria-label={`${titleLines.join(" ")} collection`}
    >
      <div className="collection-page__background" ref={apertureRef} />

      {/* NAVIGATION */}

      <Navbar variant="collection" />

      {/* COLLECTION CONTENT */}

      <main className="collection-page__content">
        <div className="collection-page__copy">
          <div className="collection-page__eyebrow">
            <span />
            <p>{eyebrow}</p>
          </div>

          <div className="collection-page__title">
            {titleLines.map((line, index) => (
              <div
                className="collection-page__title-mask"
                key={`${line}-${index}`}
              >
                <div className="collection-page__title-line">
                  {line}
                  {index === titleLines.length - 1 && (
                    <span className="collection-page__title-dot">.</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="collection-page__description">
            <p>
              {description.map((line, index) => (
                <span key={`${line}-${index}`}>
                  {line}
                  {index !== description.length - 1 && <br />}
                </span>
              ))}
            </p>

            <button
              type="button"
              onClick={closeCollection}
              className="collection-page__back"
            >
              <span>EXPLORE COLLECTION</span>
              <span className="collection-page__back-arrow">↗</span>
            </button>
          </div>
        </div>

        {/* PROPERTY IMAGE */}

        <div className="collection-page__image" ref={imageRef}>
          <img src={collection.image} alt={imageAlt} />

          <div className="collection-page__image-caption">
            <span>{collectionNumber} / 04</span>
            <span>{imageCaption}</span>
          </div>
        </div>
      </main>

      {/* FOOTER */}

      <footer className="collection-page__footer">
        <div className="collection-page__meta">
          <span>(SCROLL TO DISCOVER)</span>
        </div>

        <div className="collection-page__meta collection-page__footer-right">
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

export default CollectionPage;
