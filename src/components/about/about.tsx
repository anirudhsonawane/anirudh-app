import "./aboutPageTransition.css";

const About = () => {
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
            SAME STRUCTURE AS HOMEPAGE
        ===================================== */}

        <nav className="navigation about-navigation">
          {/* LEFT NAVIGATION */}

          <div className="nav-item nav-left">
            <a href="#about">About</a>
          </div>

          {/* CENTER BRAND LOGO */}

          <div className="nav-item nav-brand">
            <a href="/" aria-label="Realevate Home">
              <img
                src="/Ascent™ Black Geometric Logo.png"
                alt="Realevate"
                className="nav-logo"
              />
            </a>
          </div>

          {/* RIGHT NAVIGATION */}

          <div className="nav-item nav-right">
            <a href="/#commission">Contact Us</a>
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

            {/* DUPLICATE GROUP
                REQUIRED FOR SEAMLESS LOOP */}

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
            {/* OUR SELECTION */}

            <a href="/#collections-root" className="about-selection">
              <span>Our Selection</span>

              <span className="about-selection-grid" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </a>

            {/* MENU BUTTON */}

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
