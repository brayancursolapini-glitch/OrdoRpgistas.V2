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
        case "home":
            return <Home onNavigate={navigate} />;

        case "perfil":
            return <Perfil onNavigate={navigate} />;

        case "personagens":
            return <Personagens onNavigate={navigate} />;

        case "campanhas":
            return <Campanhas onNavigate={navigate} />;

        case "mapas":
            return <Mapas onNavigate={navigate} />;

        case "livros":
            return <Livros onNavigate={navigate} />;

        case "grupos":
            return <Grupos onNavigate={navigate} />;

        case "procurar-jogadores":
            return <ProcurarJogadores onNavigate={navigate} />;

        case "configuracoes":
            return <Configuracoes onNavigate={navigate} />;

        case "doacao":
            return <Doacao onNavigate={navigate} />;

        default:
            return <Home onNavigate={navigate} />;
    }
}
