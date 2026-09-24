import { useState } from "react";

import IntroLoader from "./components/Loading/IntroLoader";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";

import AppNavigation from "./navigation/AppNavigation";

export default function App() {
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState("landing");


    /*
    |--------------------------------------------------------------------------
    | INTRO LOADER
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | LANDING
    |--------------------------------------------------------------------------
    */

    if (currentPage === "landing") {
        return (
            <Landing
                setCurrentPage={setCurrentPage}
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    if (currentPage === "login") {
        return (
            <Login
                setCurrentPage={setCurrentPage}
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | CADASTRO
    |--------------------------------------------------------------------------
    */

    if (currentPage === "cadastro") {
        return (
            <Cadastro
                setCurrentPage={setCurrentPage}
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | APLICAÇÃO PRINCIPAL
    |--------------------------------------------------------------------------
    |
    | Todas as páginas internas passam pelo AppNavigation.
    |
    | Exemplos:
    |
    | home
    | perfil
    | personagens
    | campanhas
    | mapas
    | livros
    | grupos
    | procurar-jogadores
    | configuracoes
    | doacao
    |
    */

    return (
        <AppNavigation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
    );
}
