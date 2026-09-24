import Home from "../pages/Home/Home";

import Perfil from "../pages/Perfil/Perfil";
import Personagens from "../pages/Personagens/Personagens";
import Campanhas from "../pages/Campanhas/Campanhas";
import Mapas from "../pages/Mapas/Mapas";
import Livros from "../pages/Livros/Livros";
import Grupos from "../pages/Grupos/Grupos";
import ProcurarJogadores from "../pages/ProcurarJogadores/ProcurarJogadores";
import Configuracoes from "../pages/Configuracoes/Configuracoes";
import Doacao from "../pages/Doacao/Doacao";

export default function AppNavigation({
    currentPage,
    setCurrentPage,
}) {

    function navigate(page) {
        setCurrentPage(page);
    }


    switch (currentPage) {

        /* =========================================
           HOME
        ========================================= */

        case "home":
            return (
                <Home
                    onNavigate={navigate}
                />
            );


        /* =========================================
           PERFIL
        ========================================= */

        case "perfil":
        case "profile":
            return (
                <Perfil
                    onNavigate={navigate}
                />
            );


        /* =========================================
           PERSONAGENS
        ========================================= */

        case "personagens":
        case "characters":
            return (
                <Personagens
                    onNavigate={navigate}
                />
            );


        /* =========================================
           CAMPANHAS
        ========================================= */

        case "campanhas":
        case "campaigns":
            return (
                <Campanhas
                    onNavigate={navigate}
                />
            );


        /* =========================================
           MAPAS
        ========================================= */

        case "mapas":
        case "maps":
            return (
                <Mapas
                    onNavigate={navigate}
                />
            );


        /* =========================================
           LIVROS
        ========================================= */

        case "livros":
        case "books":
            return (
                <Livros
                    onNavigate={navigate}
                />
            );


        /* =========================================
           GRUPOS
        ========================================= */

        case "grupos":
        case "groups":
            return (
                <Grupos
                    onNavigate={navigate}
                />
            );


        /* =========================================
           PROCURAR JOGADORES
        ========================================= */

        case "procurar-jogadores":
        case "players":
            return (
                <ProcurarJogadores
                    onNavigate={navigate}
                />
            );


        /* =========================================
           CONFIGURAÇÕES
        ========================================= */

        case "configuracoes":
        case "settings":
            return (
                <Configuracoes
                    onNavigate={navigate}
                />
            );


        /* =========================================
           DOAÇÃO
        ========================================= */

        case "doacao":
        case "donation":
            return (
                <Doacao
                    onNavigate={navigate}
                />
            );


        /* =========================================
           PADRÃO
        ========================================= */

        default:
            return (
                <Home
                    onNavigate={navigate}
                />
            );
    }
}
