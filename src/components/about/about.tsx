import { useEffect } from "react";
import "./aboutPageTransition.css";

const About = () => {
  useEffect(() => {
    let cancelled = false;

    const initializeAboutMarquee = async () => {
      /*
       * RESET MARQUEE STATE
       *
       * Keep the animation paused until the correct
       * Google Sans Flex font has finished loading.
       */

      document.documentElement.classList.remove("about-font-ready");

      try {
        /*
         * LOAD THE EXACT MARQUEE FONT WEIGHT
         */

        if (document.fonts && document.fonts.load) {
          await document.fonts.load('650 12vw "Google Sans Flex"', "About Us");

          await document.fonts.ready;
        }
      } catch (error) {
        console.warn("About marquee font loading failed:", error);
      }

      /*
       * START THE MARQUEE
       *
       * Only activate if the About component
       * is still mounted.
       */

      if (!cancelled) {
        document.documentElement.classList.add("about-font-ready");
      }
    };

    initializeAboutMarquee();

    /*
     * CLEANUP
     */

    return () => {
      cancelled = true;

      document.documentElement.classList.remove("about-font-ready");
    };
  }, []);

  return (
    <main className="about-page">
      <section className="about-hero" id="about">
        {/* =====================================
            BACKGROUND IMAGE
        ===================================== */}

        <div className="about-background">
          <img
            src="https://realevate.agency/assets/hero-load-visual.avif"
            alt="Luxury Mediterranean coastal balcony"
          />
        </div>

        {/* =====================================
            NAVIGATION
        ===================================== */}

        <nav className="navigation about-navigation">
          <div className="nav-item nav-left">
            <a href="#about">About</a>
          </div>

          <div className="nav-item nav-brand">
            <a href="/" aria-label="Realevate Home">
              <img
                src="/Ascent™ Black Geometric Logo.png"
                alt="Realevate"
                className="nav-logo"
              />
            </a>
          </div>

          <div className="nav-item nav-right">
            <a href="/contact">Contact Us</a>
          </div>
        </nav>

        {/* =====================================
            CONTINUOUS ABOUT US MARQUEE
        ===================================== */}

        <div className="about-marquee" aria-label="About Us">
          <div className="about-marquee-track">
            {/* FIRST GROUP */}

            <div className="about-marquee-group">
              <h1>About Us</h1>
              <h1>About Us</h1>
              <h1>About Us</h1>
              <h1>About Us</h1>
            </div>

            {/* DUPLICATE GROUP */}

            <div className="about-marquee-group" aria-hidden="true">
              <h1>About Us</h1>
              <h1>About Us</h1>
              <h1>About Us</h1>
              <h1>About Us</h1>
            </div>
          </div>
        </div>

        {/* =====================================
            BOTTOM NAVIGATION
        ===================================== */}

        <div className="about-bottom">
          {/* SCROLL INDICATOR */}

          <div className="about-scroll">
            <span>(Scroll)</span>
          </div>

          {/* ACTION BUTTONS */}

          <div className="about-actions">
            <a href="/#collections-root" className="about-selection">
              <span>Our Selection</span>

              <span className="about-selection-grid" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </a>

            <button className="about-menu" type="button" aria-label="Open menu">
              <span />
              <span />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
