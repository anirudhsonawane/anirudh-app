import { useEffect, useState } from "react";

import About from "./components/about/about";
import ContactUS from "./components/contact-us/contactUS";

import PageTransition from "./components/transition/pageTransition";
import HomeTransition from "./components/transition/home-transition/homeTransition";

import CollectionP1 from "./components/collection/collectionP1";
import CollectionP2 from "./components/collection/collectionP2";
import CollectionP3 from "./components/collection/collectionP3";
import CollectionP4 from "./components/collection/collectionP4";

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

function App() {
  const [currentPath, setCurrentPath] = useState(() =>
    normalizePath(window.location.pathname),
  );

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

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
  }

  return (
    <>
      {page}

      {/* EXISTING PAGE TRANSITION */}
      <PageTransition />

      {/* HOMEPAGE RETURN TRANSITION */}
      <HomeTransition />

      {/* COLLECTION PAGES */}
      <CollectionP1 />
      <CollectionP2 />
      <CollectionP3 />
      <CollectionP4 />
    </>
  );
}

export default App;
