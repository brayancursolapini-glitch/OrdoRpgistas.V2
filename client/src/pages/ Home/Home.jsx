import {

    motion,

} from "framer-motion";

import {

    ArrowRight,
    Shield,
    Sparkles,
    Sword,

} from "lucide-react";

import SideMenu
    from "../../components/Menu/SideMenu";

import ThemeSwitcher
    from "../../components/ThemeSwitcher/ThemeSwitcher";

import ThemeParticles
    from "../../components/ThemeParticles/ThemeParticles";

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


    const dndBackground =
        `${import.meta.env.BASE_URL}images/Home-dnd.jpg`;


    const ordemBackground =
        `${import.meta.env.BASE_URL}images/Home-ordem.jpg`;


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

            className={`
                home
                home-${theme}
            `}

        >

            <ThemeParticles />


            <SideMenu />


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


            <section
                className="home-worlds"
            >

                <button

                    type="button"

                    className={`
                        home-world
                        home-world-dnd
                        ${
                            isDnd
                                ? "selected"
                                : ""
                        }
                    `}

                    style={{

                        backgroundImage:
                            `url(${dndBackground})`,

                    }}

                    onClick={() => {

                        setTheme("dnd");

                    }}

                >

                    <div
                        className="home-world-overlay"
                    />


                    <div
                        className="home-world-content"
                    >

                        <span>
                            UM MUNDO DE AVENTURAS
                        </span>

                        <h2>

                            DUNGEONS
                            <br />
                            & DRAGONS

                        </h2>

                        <p>

                            Reinos, aventuras
                            e lendas aguardam.

                        </p>

                    </div>

                </button>


                <button

                    type="button"

                    className={`
                        home-world
                        home-world-ordem
                        ${
                            !isDnd
                                ? "selected"
                                : ""
                        }
                    `}

                    style={{

                        backgroundImage:
                            `url(${ordemBackground})`,

                    }}

                    onClick={() => {

                        setTheme("ordem");

                    }}

                >

                    <div
                        className="home-world-overlay"
                    />


                    <div
                        className="home-world-content"
                    >

                        <span>
                            A REALIDADE NÃO É O QUE PARECE
                        </span>

                        <h2>

                            ORDEM
                            <br />
                            PARANORMAL

                        </h2>

                        <p>

                            O paranormal observa
                            cada movimento.

                        </p>

                    </div>

                </button>

            </section>


            <motion.section

                className="home-hero"

                initial={{

                    opacity:
                        0,

                    y:
                        30,

                }}

                animate={{

                    opacity:
                        1,

                    y:
                        0,

                }}

                transition={{

                    duration:
                        0.7,

                    ease:
                        "easeOut",

                }}

            >

                <Sparkles
                    size={24}
                    className="home-hero-symbol"
                />


                <span
                    className="home-hero-eyebrow"
                >

                    SEU MUNDO ESTÁ PRONTO

                </span>


                <h1>

                    ORDO

                    <strong>
                        RPGISTAS
                    </strong>

                </h1>


                <p>

                    Escolha um sistema,
                    reúna sua mesa e
                    comece uma nova história.

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


                    <div>

                        <small>
                            SISTEMA ATUAL
                        </small>

                        <strong>

                            {
                                currentSystem.name
                            }

                        </strong>

                        <span>

                            {
                                currentSystem.description
                            }

                        </span>

                    </div>

                </div>


                <button

                    type="button"

                    className="home-enter-button"

                >

                    Entrar na aventura

                    <ArrowRight
                        size={18}
                    />

                </button>

            </motion.section>


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
                        : "ORDEM PARANORMAL"
                    }

                </span>

            </div>

        </main>

    );

}
