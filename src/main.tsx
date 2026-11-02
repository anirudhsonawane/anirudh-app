import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import PageTransition from "./components/pageTransition/page";
import CollectionsSection from "./components/sections/section";

import "./components/sections/section.css";
import "./components/pageTransition/transition.css";

const mountNode = document.getElementById("collections-root");

if (!mountNode) {
  throw new Error(
    'React mount element "#collections-root" was not found in index.html.',
  );
}

createRoot(mountNode).render(
  <StrictMode>
    <>
      <PageTransition />
      <CollectionsSection />
    </>
  </StrictMode>,
);
