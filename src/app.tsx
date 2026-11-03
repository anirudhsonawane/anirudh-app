import About from "./components/about/about";
import ContactUS from "./components/contact-us/contactUS";

function App() {
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

  switch (currentPath) {
    case "/about":
      return <About />;

    case "/contact":
      return <ContactUS />;

    default:
      return null;
  }
}

export default App;
