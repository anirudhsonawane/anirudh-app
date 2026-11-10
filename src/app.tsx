import { useEffect, useLayoutEffect, useState } from "react";

import About from "./components/about/about";
import ContactUS from "./components/contact-us/contactUS";

import PageTransition from "./components/transition/pageTransition";
import HomeTransition from "./components/transition/home-transition/homeTransition";

import CollectionP1 from "./components/collection/collectionP1";
import CollectionP2 from "./components/collection/collectionP2";
import CollectionP3 from "./components/collection/collectionP3";
import CollectionP4 from "./components/collection/collectionP4";

/*
 * NORMALIZE ROUTES
 */

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

function App() {
  const [currentPath, setCurrentPath] = useState(() =>
    normalizePath(window.location.pathname),
  );

  /*
   * HANDLE BROWSER BACK / FORWARD
   */

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  /*
   * UPDATE HTML ROUTE CLASSES
   *
   * These classes control visibility of the
   * static homepage and secondary React pages.
   */

  useLayoutEffect(() => {
    const isAbout = currentPath === "/about";
    const isContact = currentPath === "/contact";

    document.documentElement.classList.toggle("about-route", isAbout);

    document.documentElement.classList.toggle("contact-route", isContact);
  }, [currentPath]);

  /*
   * PAGE ROUTING
   */

  let page = null;

  switch (currentPath) {
    case "/about":
      page = <About />;
      break;

    case "/contact":
      page = <ContactUS />;
      break;

    default:
      page = null;
      break;
  }

  /*
   * APPLICATION
   */

  return (
    <>
      {/* SECONDARY PAGES */}

      {page}

      {/* EXISTING ABOUT / CONTACT TRANSITION */}

      <PageTransition />

      {/* HOMEPAGE RETURN CINEMATIC WIPE */}

      <HomeTransition currentPath={currentPath} onNavigate={setCurrentPath} />

      {/* COLLECTION PAGES */}

      <CollectionP1 />
      <CollectionP2 />
      <CollectionP3 />
      <CollectionP4 />
    </>
  );
}

export default App;
