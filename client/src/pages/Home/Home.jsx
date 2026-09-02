import {
    motion,
} from "framer-motion";

import {
    Sparkles,
    ArrowRight,
    Sword,
    Shield,
} from "lucide-react";

import SideMenu
    from "../../components/Menu/SideMenu";

import ThemeSwitcher
    from "../../components/ThemeSwitcher/ThemeSwitcher";

import ThemeParticles
    from "../../components/ThemeParticles/ThemeParticles";

import ThemeAudio
    from "../../components/Audio/ThemeAudio";

import {
    useTheme,
} from "../../context/ThemeContext";

import "./Home.css";


export default function Home() {

    const {
        theme,
        setTheme,
    } = useTheme();


    const isDnd =
        theme === "dnd";


    const backgroundImage =
        isDnd
            ? `${import.meta.env.BASE_URL}images/Home-dnd.jpg`
            : `${import.meta.env.BASE_URL}images/Home-ordem.jpg`;


    const currentSystem =
        isDnd
            ? {
                name:
                    "DUNGEONS & DRAGONS",

                description:
                    "Reinos, aventuras e lendas.",

                icon:
                    Sword,
            }
            : {
                name:
                    "ORDEM PARANORMAL",

                description:
                    "O paranormal observa.",

                icon:
                    Shield,
            };


    const SystemIcon =
        currentSystem.icon;


    return (

        <main
            className={
                `home home-${theme}`
            }
            style={{
                backgroundImage:
                    `url(${backgroundImage})`,
            }}
        >

            {/* ÁUDIO */}

            <ThemeAudio />


            {/* PARTÍCULAS */}

            <ThemeParticles />


            {/* OVERLAY */}

            <div
                className="home-background-overlay"
            />


            {/* MENU */}

            <SideMenu />


            {/* =====================================
                TOPO
            ===================================== */}

            <header
                className="home-header"
            >

                <div
                    className="home-logo"
                >

                    <span>

                        ORDO

                    </span>

                    <strong>

                        RPGISTAS

                    </strong>

                </div>


                <ThemeSwitcher />

            </header>


            {/* =====================================
                HERO
            ===================================== */}

            <motion.section
                className="home-hero"
                initial={{
                    opacity: 0,
                    y: 35,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.8,
                    ease: "easeOut",
                }}
            >

                <div
                    className="home-hero-symbol"
                >

                    <Sparkles
                        size={24}
                    />

                </div>


                <span
                    className="home-hero-eyebrow"
                >

                    {isDnd
                        ? "UM MUNDO DE AVENTURAS"
                        : "A REALIDADE NÃO É O QUE PARECE"}

                </span>


                <h1>

                    {isDnd
                        ? "DUNGEONS & DRAGONS"
                        : "ORDEM PARANORMAL"}

                </h1>


                <p
                    className="home-hero-description"
                >

                    {isDnd
                        ? "Reúna sua mesa e atravesse reinos onde aventuras e lendas aguardam."
                        : "Entre em uma realidade onde o paranormal observa cada movimento."}

                </p>


                <div
                    className="home-current-system"
                >

                    <div
                        className="home-current-icon"
                    >

                        <SystemIcon
                            size={22}
                        />

                    </div>


                    <div
                        className="home-current-info"
                    >

                        <small>

                            SISTEMA ATIVO

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

                    <span>

                        Entrar na aventura

                    </span>


                    <ArrowRight
                        size={18}
                    />

                </button>

            </motion.section>


            {/* =====================================
                SELETOR DE SISTEMA
            ===================================== */}

            <section
                className="home-system-selector"
            >

                <button
                    type="button"
                    className={
                        `home-system-option ${
                            isDnd
                                ? "active"
                                : ""
                        }`
                    }
                    onClick={() => {

                        setTheme(
                            "dnd"
                        );

                    }}
                >

                    <Sword
                        size={18}
                    />

                    <span>

                        D&D

                    </span>

                </button>


                <button
                    type="button"
                    className={
                        `home-system-option ${
                            !isDnd
                                ? "active"
                                : ""
                        }`
                    }
                    onClick={() => {

                        setTheme(
                            "ordem"
                        );

                    }}
                >

                    <Shield
                        size={18}
                    />

                    <span>

                        ORDEM

                    </span>

                </button>

            </section>


            {/* =====================================
                INFORMAÇÃO INFERIOR
            ===================================== */}

            <div
                className="home-bottom-info"
            >

                <span>

                    ORDO RPGISTAS

                </span>


                <span>

                    •

                </span>


                <span>

                    {isDnd
                        ? "D&D"
                        : "ORDEM PARANORMAL"}

                </span>

            </div>

        </main>

    );

}
