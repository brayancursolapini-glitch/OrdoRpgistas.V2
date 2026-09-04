import { useState } from "react";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import Home from "./pages/Home/Home";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  switch (currentPage) {
    case "login":
      return (
        <Login
          setCurrentPage={setCurrentPage}
        />
      );

    case "cadastro":
      return (
        <Cadastro
          setCurrentPage={setCurrentPage}
        />
      );

    case "home":
      return (
        <Home
          setCurrentPage={setCurrentPage}
        />
      );

    case "landing":
    default:
      return (
        <Landing
          setCurrentPage={setCurrentPage}
        />
      );
  }
}

export default App;
