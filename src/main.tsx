import { createRoot } from "react-dom/client";
import App from "./app";

const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

const isAboutPage = currentPath === "/about";
const isContactPage = currentPath === "/contact";

if (isAboutPage) {
  document.documentElement.classList.add("about-route");
}

if (isContactPage) {
  document.documentElement.classList.add("contact-route");
}

const rootElement = document.getElementById("app-root");

if (!rootElement) {
  throw new Error("React mount element #app-root was not found.");
}

createRoot(rootElement).render(<App />);
