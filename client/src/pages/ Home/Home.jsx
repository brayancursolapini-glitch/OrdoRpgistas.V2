import {
    motion,
} from "framer-motion";

import {
    ArrowRight,
    BookOpen,
    Crown,
    Map,
    Shield,
    Sparkles,
    Swords,
    Users,
} from "lucide-react";

import SideMenu
    from "../../components/Menu/SideMenu";

import ThemeSwitcher
    from "../../components/ThemeSwitcher/ThemeSwitcher";

import ThemeParticles
    from "../../components/ThemeParticles/ThemeParticles";

import AmbientAudio
    from "../../components/AmbientAudio/AmbientAudio";

import {
    useTheme,
} from "../../context/ThemeContext";

import {
    useUser,
} from "../../context/UserContext";

import "./Home.css";


export default function Home({
    onLogout,
}) {

    const {
        theme,
        setTheme,
    } = useTheme();


    const {
        user,
    } = useUser();


    const isDnd =
        theme === "dnd";


    const homeBackground =
        isDnd
            ? `${import.meta.env.BASE_URL}assets/Home-dnd.jpg`
            : `${import.meta.env.BASE_URL}assets/Home-ordem.jpg`;


    const currentSystem =
        isDnd
            ? {
                name: "DUNGEONS & DRAGONS",
                description:
                    "Reinos, aventuras e lendas aguardam.",
                icon: Swords,
            }
            : {
                name: "ORDEM PARANORMAL",
                description:
                    "A realidade não é o que parece.",
                icon: Shield,
            };


    const SystemIcon =
        currentSystem.icon;


    const quickActions = [
        {
            icon: Users,
            title: "Personagens",
            text: "Crie e organize suas fichas.",
        },
        {
            icon: Crown,
            title: "Campanhas",
            text: "Reúna sua mesa e conte histórias.",
        },
        {
            icon: Map,
            title: "Mapas",
            text: "Prepare cenários para suas aventuras.",
        },
        {
            icon: BookOpen,
            title: "Livros",
            text: "Acesse regras e conteúdos do sistema.",
        },
    ];


    return (

        <main
            className={`home home-${theme}`}
            style={{
                "--home-background":
                    `url("${homeBackground}")`,
            }}
        >

            <div className="home-background" />

            <div className="home-background-overlay" />

            <ThemeParticles amount={42} />


            <SideMenu
                onLogout={onLogout}
            />


            <header className="home-header">

                <div className="home-brand">

                    <span>
                        ORDO
                    </span>

                    <strong>
                        RPGISTAS
                    </strong>

                </div>


                <div className="home-header-actions">

                    <ThemeSwitcher />

                    <AmbientAudio />

                </div>

            </header>


            <section className="home-layout">

                <motion.div
                    className="home-main"
                    initial={{
                        opacity: 0,
                        y: 24,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: .65,
                    }}
                >

                    <span className="home-eyebrow">
                        BEM-VINDO,
                        {" "}
                        {user?.username ||
                            user?.name ||
                            "AVENTUREIRO"}
                    </span>


                    <h1>
                        O seu próximo
                        <strong>
                            mundo começa agora.
                        </strong>
                    </h1>


                    <p className="home-description">

                        Escolha o sistema, organize sua mesa
                        e construa histórias que podem durar
                        uma única noite ou se tornar uma lenda.

                    </p>


                    <div className="home-system-card">

                        <div className="home-system-icon">

                            <SystemIcon
                                size={28}
                            />

                        </div>


                        <div>

                            <small>
                                SISTEMA ATUAL
                            </small>

                            <strong>
                                {currentSystem.name}
                            </strong>

                            <span>
                                {currentSystem.description}
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="home-enter-button"
                    >

                        Entrar na aventura

                        <ArrowRight
                            size={19}
                        />

                    </button>

                </motion.div>


                <motion.aside
                    className="home-systems"
                    initial={{
                        opacity: 0,
                        x: 30,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration: .7,
                        delay: .1,
                    }}
                >

                    <span className="home-panel-title">
                        ESCOLHA O SEU MUNDO
                    </span>


                    <button
                        type="button"
                        className={`home-world-card ${
                            isDnd
                                ? "selected"
                                : ""
                        }`}
                        onClick={() => {
                            setTheme("dnd");
                        }}
                    >

                        <span className="home-world-card-number">
                            01
                        </span>

                        <strong>
                            DUNGEONS & DRAGONS
                        </strong>

                        <small>
                            Fantasia, reinos e aventura.
                        </small>

                    </button>


                    <button
                        type="button"
                        className={`home-world-card ${
                            !isDnd
                                ? "selected"
                                : ""
                        }`}
                        onClick={() => {
                            setTheme("ordem");
                        }}
                    >

                        <span className="home-world-card-number">
                            02
                        </span>

                        <strong>
                            ORDEM PARANORMAL
                        </strong>

                        <small>
                            Mistério, horror e paranormal.
                        </small>

                    </button>

                </motion.aside>

            </section>


            <section className="home-quick-section">

                <div className="home-quick-heading">

                    <div>

                        <span>
                            COMEÇAR
                        </span>

                        <h2>
                            Tudo para sua mesa.
                        </h2>

                    </div>


                    <Sparkles
                        size={26}
                    />

                </div>


                <div className="home-quick-grid">

                    {quickActions.map(
                        action => {

                            const Icon =
                                action.icon;

                            return (

                                <button
                                    key={action.title}
                                    type="button"
                                    className="home-quick-card"
                                >

                                    <Icon
                                        size={23}
                                    />

                                    <strong>
                                        {action.title}
                                    </strong>

                                    <span>
                                        {action.text}
                                    </span>

                                </button>

                            );

                        }
                    )}

                </div>

            </section>


            <footer className="home-footer">

                <span>
                    ORDO RPGISTAS
                </span>

                <span>
                    SISTEMA ATIVO:
                    {" "}
                    {isDnd
                        ? "D&D"
                        : "ORDEM PARANORMAL"}
                </span>

            </footer>

        </main>

    );

}
