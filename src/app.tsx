import About from "./components/about/about";

function App() {
  const currentPath = window.location.pathname.replace(/\/+$/, "");

  if (currentPath === "/about") {
    return <About />;
  }

  return null;
}

export default App;
