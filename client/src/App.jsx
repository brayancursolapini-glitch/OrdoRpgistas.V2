import { useState } from "react";

import IntroLoader from "./components/Loading/IntroLoader";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";

import AppNavigation from "./navigation/AppNavigation";

export default function App() {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState("landing");

    if (loading) {
        return (
            <IntroLoader
                onComplete={() => {
                    setLoading(false);
                }}
            />
        );
    }

    if (currentPage === "landing") {
        return (
            <Landing
                setCurrentPage={setCurrentPage}
            />
        );
    }

    if (currentPage === "login") {
        return (
            <Login
                setCurrentPage={setCurrentPage}
            />
        );
    }

    if (currentPage === "cadastro") {
        return (
            <Cadastro
                setCurrentPage={setCurrentPage}
            />
        );
    }

    return (
        <AppNavigation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
    );
}
