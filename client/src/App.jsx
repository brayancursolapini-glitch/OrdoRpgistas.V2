import { useState } from "react";

import IntroLoader from "./components/Loading/IntroLoader";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import Home from "./pages/Home/Home";

export default function App() {
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] =
        useState("landing");


    /*
    =========================================
    CARREGAMENTO INICIAL
    =========================================
    */

    if (loading) {
        return (
            <IntroLoader
                onComplete={() => {
                    setLoading(false);
                }}
            />
        );
    }


    /*
    =========================================
    LANDING
    =========================================
    */

    if (currentPage === "landing") {
        return (
            <Landing
                setCurrentPage={setCurrentPage}
            />
        );
    }


    /*
    =========================================
    LOGIN
    =========================================
    */

    if (currentPage === "login") {
        return (
            <Login
                setCurrentPage={setCurrentPage}
            />
        );
    }


    /*
    =========================================
    CADASTRO
    =========================================
    */

    if (currentPage === "cadastro") {
        return (
            <Cadastro
                setCurrentPage={setCurrentPage}
            />
        );
    }


    /*
    =========================================
    HOME
    =========================================
    */

    if (currentPage === "home") {
        return (
            <Home
                setCurrentPage={setCurrentPage}
            />
        );
    }


    /*
    =========================================
    FALLBACK
    =========================================
    */

    return (
        <Landing
            setCurrentPage={setCurrentPage}
        />
    );
}
