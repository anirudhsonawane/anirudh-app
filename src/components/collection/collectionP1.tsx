import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import "./collectionP1page.css";

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

function CollectionP1() {
  const [collection, setCollection] = useState<CollectionState | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);

  const openRef = useRef(false);
  const closingRef = useRef(false);
  const openingTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const closingTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const getImageOrigin = useCallback((image: HTMLImageElement): ImageOrigin => {
    const rect = image.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
    };
  }, []);

  // Open P1 from the existing By The Sea collection card.
  useEffect(() => {
    const handleCollectionClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const card = target.closest<HTMLElement>(".collection-panel.sea");
      if (!card || openRef.current) return;

      const image = card.querySelector<HTMLImageElement>(".panel-image img");
      if (!image) return;

      const origin = getImageOrigin(image);
      if (!origin.width || !origin.height) return;

      event.preventDefault();
      openRef.current = true;
      closingRef.current = false;
      setCollection({ image: image.currentSrc || image.src, origin });
    };

    document.addEventListener("click", handleCollectionClick);
    return () => document.removeEventListener("click", handleCollectionClick);
  }, [getImageOrigin]);

  // Aperture expansion, image travel and editorial content reveal.
  useLayoutEffect(() => {
    if (!collection || !rootRef.current) return;

    const root = rootRef.current;
    const aperture = apertureRef.current;
    const image = imageRef.current;
    if (!aperture || !image) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const { origin } = collection;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mobile = vw <= 768;

    // Matches the portrait placement in the supplied editorial reference.
    const finalWidth = mobile
      ? Math.min(vw * 0.86, 480)
      : Math.min(vw * 0.31, 520);
    const finalHeight = mobile
      ? Math.min(vh * 0.37, 360)
      : Math.min(vh * 0.74, 590);
    const finalLeft = mobile ? (vw - finalWidth) / 2 : vw * 0.662;
    const finalTop = mobile ? vh * 0.105 : vh * 0.153;
    const apertureSize = Math.hypot(vw, vh) * 1.5;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const context = gsap.context(() => {
      gsap.set(root, { visibility: "visible", pointerEvents: "auto" });
      gsap.set(image, {
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

      gsap.set(".aperture-p1__nav", { y: -12, opacity: 0 });
      gsap.set(".aperture-p1__intro-label, .aperture-p1__intro-copy", {
        y: 18,
        opacity: 0,
      });
      gsap.set(".aperture-p1__title-line", { yPercent: 110 });
      gsap.set(".aperture-p1__details", { y: 18, opacity: 0 });
      gsap.set(".aperture-p1__image-index", { y: 12, opacity: 0 });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline.to(aperture, {
        clipPath: `circle(${apertureSize}px at ${origin.centerX}px ${origin.centerY}px)`,
        duration: reducedMotion ? 0 : 1.2,
        ease: "power4.inOut",
      });
      timeline.to(
        image,
        {
          top: finalTop,
          left: finalLeft,
          width: finalWidth,
          height: finalHeight,
          duration: reducedMotion ? 0 : 1.35,
          ease: "power4.inOut",
        },
        0.1,
      );
      timeline.to(
        ".aperture-p1__nav",
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.65,
          stagger: 0.08,
        },
        0.78,
      );
      timeline.to(
        ".aperture-p1__intro-label, .aperture-p1__intro-copy",
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.65,
          stagger: 0.1,
        },
        0.9,
      );
      timeline.to(
        ".aperture-p1__title-line",
        {
          yPercent: 0,
          duration: reducedMotion ? 0 : 0.95,
          stagger: 0.12,
          ease: "power4.out",
        },
        1.08,
      );
      timeline.to(
        ".aperture-p1__details",
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.65,
        },
        1.48,
      );
      timeline.to(
        ".aperture-p1__image-index",
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.55,
        },
        1.42,
      );

      openingTimelineRef.current = timeline;
    }, root);

    return () => {
      openingTimelineRef.current?.kill();
      context.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, [collection]);

  // Close the overlay when the homepage transition takes control.
  useEffect(() => {
    const handleCloseFromHome = () => {
      openingTimelineRef.current?.kill();
      closingTimelineRef.current?.kill();
      openRef.current = false;
      closingRef.current = false;
      setCollection(null);
    };

    window.addEventListener("ascent:close-collection", handleCloseFromHome);
    return () =>
      window.removeEventListener(
        "ascent:close-collection",
        handleCloseFromHome,
      );
  }, []);

  // Hand off cleanly to the About and Contact routes.
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.replace(/\/+$/, "") || "/";
      if (path !== "/about" && path !== "/contact") return;
      openingTimelineRef.current?.kill();
      closingTimelineRef.current?.kill();
      openRef.current = false;
      closingRef.current = false;
      setCollection(null);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  // Reverse the hero image back into its original collection card.
  const closeCollection = useCallback(() => {
    if (
      !collection ||
      !rootRef.current ||
      !apertureRef.current ||
      !imageRef.current ||
      closingRef.current
    )
      return;

    closingRef.current = true;
    openingTimelineRef.current?.kill();

    const root = rootRef.current;
    const aperture = apertureRef.current;
    const image = imageRef.current;
    const originalImage = document
      .querySelector<HTMLElement>(".collection-panel.sea")
      ?.querySelector<HTMLImageElement>(".panel-image img");
    const liveRect = originalImage?.getBoundingClientRect();

    const origin: ImageOrigin =
      liveRect?.width && liveRect.height
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
    gsap.set(root, { pointerEvents: "none" });

    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        openRef.current = false;
        closingRef.current = false;
        setCollection(null);
      },
    });
    closingTimelineRef.current = timeline;

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
    timeline.to(
      aperture,
      {
        clipPath: `circle(0px at ${origin.centerX}px ${origin.centerY}px)`,
        duration,
        ease: "power4.inOut",
      },
      0,
    );
    timeline.to(
      ".aperture-p1__nav, .aperture-p1__intro-label, .aperture-p1__intro-copy, .aperture-p1__details, .aperture-p1__image-index",
      {
        y: -12,
        opacity: 0,
        duration: reducedMotion ? 0 : 0.32,
        stagger: 0.025,
        ease: "power2.in",
      },
      0,
    );
    timeline.to(
      ".aperture-p1__title-line",
      {
        yPercent: 35,
        opacity: 0,
        duration: reducedMotion ? 0 : 0.4,
        stagger: 0.03,
        ease: "power2.in",
      },
      0,
    );
  }, [collection]);

  useEffect(() => {
    if (!collection) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCollection();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [collection, closeCollection]);

  if (!collection) return null;

  return (
    <div
      className="aperture-p1"
      ref={rootRef}
      aria-label="Ingrid Solberg collection"
    >
      <div className="aperture-p1__background" ref={apertureRef} />

      <header className="aperture-p1__header">
        <nav className="aperture-p1__navigation" aria-label="Main navigation">
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

      <main className="aperture-p1__content">
        <div className="aperture-p1__intro-label">(Intro)</div>
        <p className="aperture-p1__intro-copy">
          I’m a brand and art director in Oslo. I build identities
          <br className="desktop-break" />
          for studios and makers, and I teach what I learn
          <br className="desktop-break" />
          along the way.
        </p>

        <section
          className="aperture-p1__identity"
          aria-label="Profile introduction"
        >
          <div className="aperture-p1__title">
            <div className="aperture-p1__title-mask">
              <div className="aperture-p1__title-line">Ingrid</div>
            </div>
            <div className="aperture-p1__title-mask">
              <div className="aperture-p1__title-line">
                Solberg<span>©</span>
              </div>
            </div>
          </div>

          <div className="aperture-p1__details">
            <div className="aperture-p1__detail-column">
              <span className="aperture-p1__detail-label">Services</span>
              <p>
                Brand identity
                <br />
                Art direction
                <br />
                Packaging
                <br />
                Workshops
              </p>
            </div>
            <div className="aperture-p1__detail-column">
              <span className="aperture-p1__detail-label">Based in</span>
              <p>Oslo, Norway</p>
            </div>
            <div className="aperture-p1__detail-column aperture-p1__availability">
              <span className="aperture-p1__detail-label">Availability</span>
              <p>
                <i />
                Projects from November
              </p>
            </div>
          </div>
        </section>

        <div className="aperture-p1__image" ref={imageRef}>
          <img
            src={collection.image}
            alt="Portrait for the Ingrid Solberg profile"
          />
        </div>
        <div className="aperture-p1__image-index">/26</div>
      </main>

      <footer className="aperture-p1__footer">
        <span>INDEPENDENT CREATIVE PRACTICE</span>
        <button type="button" onClick={closeCollection}>
          BACK TO COLLECTIONS <span>↗</span>
        </button>
      </footer>
    </div>
  );
}

export default CollectionP1;
