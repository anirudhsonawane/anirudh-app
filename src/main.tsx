import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";

import App from "./app";
import Navbar from "./components/navbar/navbar";

// ==========================================
// ROUTE NORMALIZATION
// ==========================================

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

// ==========================================
// ROUTE CLASSES
// ==========================================

const updateRouteClasses = () => {
  const currentPath = normalizePath(window.location.pathname);

  document.documentElement.classList.toggle(
    "about-route",
    currentPath === "/about",
  );

  document.documentElement.classList.toggle(
    "contact-route",
    currentPath === "/contact",
  );
};

// ==========================================
// INITIAL ROUTE CLASSES
// ==========================================

updateRouteClasses();

// ==========================================
// UPDATE CLASSES ON BROWSER BACK / FORWARD
// ==========================================

window.addEventListener("popstate", updateRouteClasses);

// ==========================================
// MAIN REACT APPLICATION
// ==========================================

const rootElement = document.getElementById("app-root");

if (!rootElement) {
  throw new Error("React mount element #app-root was not found.");
}

const appRoot = createRoot(rootElement);

flushSync(() => {
  appRoot.render(<App />);
});

// ==========================================
// SHARED HOMEPAGE NAVBAR
// ==========================================

const homeNavbarElement = document.getElementById("home-navbar-root");

if (homeNavbarElement) {
  const homeNavbarRoot = createRoot(homeNavbarElement);

  flushSync(() => {
    homeNavbarRoot.render(<Navbar variant="default" />);
  });
}

// ==========================================
// LOAD HOMEPAGE GSAP AFTER NAVBAR MOUNT
// ==========================================

if (normalizePath(window.location.pathname) === "/") {
  const existingScript = document.querySelector(
    'script[data-homepage-script="true"]',
  );

  if (!existingScript) {
    const homepageScript = document.createElement("script");

    homepageScript.type = "module";
    homepageScript.src = "/script.js";
    homepageScript.dataset.homepageScript = "true";

    document.body.appendChild(homepageScript);
  }
}
