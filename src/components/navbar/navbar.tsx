import "./navbarAsset.css";

type NavbarProps = {
  variant?: "default" | "light" | "collection" | "collection-p1";
};

type NavbarPosition = "left" | "center" | "right";

const Navbar = ({ variant = "default" }: NavbarProps) => {
  const isCollection = variant === "collection";
  const isCollectionP1 = variant === "collection-p1";

  const headerClasses = [
    "shared-navbar__header",
    `shared-navbar__header--${variant}`,
  ];

  if (isCollection) {
    headerClasses.push("shared-navbar__header--collection");
  }

  if (isCollectionP1) {
    headerClasses.push("shared-navbar__header--collection-p1");
  }

  const navigationClasses = ["shared-navbar", `shared-navbar--${variant}`];

  if (isCollection) {
    navigationClasses.push("collection-page__navigation");
  }

  if (isCollectionP1) {
    navigationClasses.push(
      "shared-navbar--collection",
      "aperture-p1__navigation",
    );
  }

  const getItemClass = (position: NavbarPosition) => {
    const classes = ["shared-navbar__item", `shared-navbar__item--${position}`];

    if (isCollection) {
      classes.push("collection-page__nav", `collection-page__nav-${position}`);
    }

    if (isCollectionP1) {
      classes.push("aperture-p1__nav", `aperture-p1__nav-${position}`);
    }

    return classes.join(" ");
  };

  return (
    <header className={headerClasses.join(" ")}>
      <nav className={navigationClasses.join(" ")} aria-label="Main navigation">
        {/* LEFT: ABOUT */}

        <div className={getItemClass("left")}>
          <a href="/about">About</a>
        </div>

        {/* CENTER: LOGO */}

        <div className={getItemClass("center")}>
          <a href="/" aria-label="Ascent Home">
            <img
              src="/Ascent™ Black Geometric Logo.png"
              alt="Ascent"
              className="shared-navbar__logo"
            />
          </a>
        </div>

        {/* RIGHT: CONTACT */}

        <div className={getItemClass("right")}>
          <a href="/contact">Contact Us</a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
