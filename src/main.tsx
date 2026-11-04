import { createRoot } from "react-dom/client";
import App from "./app";

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

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

/*
 * INITIAL ROUTE CLASSES
 */

updateRouteClasses();

/*
 * UPDATE CLASSES ON SPA NAVIGATION
 */

window.addEventListener("popstate", updateRouteClasses);

/*
 * REACT MOUNT
 */

const rootElement = document.getElementById("app-root");

if (!rootElement) {
  throw new Error("React mount element #app-root was not found.");
}

createRoot(rootElement).render(<App />);
