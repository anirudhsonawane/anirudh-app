import About from "./components/about/about";
import ContactUS from "./components/contact-us/contactUS";
import PageTransition from "./components/transition/pageTransition";

function App() {
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

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
