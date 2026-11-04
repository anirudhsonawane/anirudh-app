import { useEffect, useState } from "react";

import About from "./components/about/about";
import ContactUS from "./components/contact-us/contactUS";
import PageTransition from "./components/transition/pageTransition";

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
      <PageTransition />
    </>
  );
}

export default App;
