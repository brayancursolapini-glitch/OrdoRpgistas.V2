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

import CriarPersonagem from "../pages/CriarPersonagem/CriarPersonagem";
import CriarPersonagemOrdem from "../pages/CriarPersonagemOrdem/CriarPersonagemOrdem";

export default function AppNavigation({
    currentPage,
    setCurrentPage,
}) {
    function navigate(page) {
        setCurrentPage(page);
    }

    switch (currentPage) {
        case "home":
            return (
                <Home onNavigate={navigate} />
            );

        case "perfil":
        case "profile":
            return (
                <Perfil onNavigate={navigate} />
            );

        case "personagens":
        case "characters":
            return (
                <Personagens onNavigate={navigate} />
            );

        case "criar-personagem":
            return (
                <CriarPersonagem onNavigate={navigate} />
            );

        case "criar-personagem-ordem":
            return (
                <CriarPersonagemOrdem onNavigate={navigate} />
            );

        case "campanhas":
        case "campaigns":
            return (
                <Campanhas onNavigate={navigate} />
            );

        case "mapas":
        case "maps":
            return (
                <Mapas onNavigate={navigate} />
            );

        case "livros":
        case "books":
            return (
                <Livros onNavigate={navigate} />
            );

        case "grupos":
        case "groups":
            return (
                <Grupos onNavigate={navigate} />
            );

        case "procurar-jogadores":
        case "players":
            return (
                <ProcurarJogadores onNavigate={navigate} />
            );

        case "configuracoes":
        case "settings":
            return (
                <Configuracoes onNavigate={navigate} />
            );

        case "doacao":
        case "donation":
            return (
                <Doacao onNavigate={navigate} />
            );

        default:
            return (
                <Home onNavigate={navigate} />
            );
    }
}
