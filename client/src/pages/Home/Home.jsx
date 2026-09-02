import {
    motion,
} from "framer-motion";

import {

    Sparkles,

    ArrowRight,

    Sword,

    Shield,

    Users,

    Crown,

    Map,

    BookOpen,

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


export default function Home({

    onLogout,

}) {

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


    const features = [

        {

            icon:
                Users,

            title:
                "Personagens",

            text:
                "Crie e gerencie seus aventureiros.",

        },

        {

            icon:
                Crown,

            title:
                "Campanhas",

            text:
                "Reúna sua mesa e conte histórias.",

        },

        {

            icon:
                Map,

            title:
                "Mapas",

            text:
                "Explore mundos e batalhas.",

        },

        {

            icon:
                BookOpen,

            title:
                "Livros",

            text:
                "Acesse regras e conteúdos.",

        },

    ];


    function handleNavigation(
        destination
    ) {

        console.log(
            "Navegação futura:",
            destination
        );

    }


    return (

        <main

            className={`
                home
                home-${theme}
            `}

        >

            <ThemeAudio />


            <div
                className="home-background"
            >

                <div

                    className={`
                        home-background-image
                        ${
                            isDnd
                                ? "home-background-dnd"
                                : "home-background-ordem"
                    }
                    `}

                    style={{
                        backgroundImage:
                            `url(${
                                isDnd
                                    ? dndBackground
                                    : ordemBackground
                            })`,
                    }}

                />

                <div
                    className="home-background-overlay"
                />

            </div>


            <ThemeParticles
                amount={55}
            />


            <SideMenu

                onNavigate={
                    handleNavigation
                }

                onLogout={
                    onLogout
                }

            />


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
                className="home-main"
            >

                <motion.div

                    className="home-introduction"

                    initial={{
                        opacity:
                            0,

                        y:
                            25,
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
                    }}

                >

                    <div
                        className="home-symbol"
                    >

                        <Sparkles
                            size={26}
                        />

                    </div>


                    <span
                        className="home-eyebrow"
                    >

                        SEU MUNDO ESTÁ PRONTO

                    </span>


                    <h1>

                        Bem-vindo ao

                        <strong>

                            ORDO
                            RPGISTAS

                        </strong>

                    </h1>


                    <p>

                        Escolha seu sistema,
                        reúna sua mesa e
                        transforme imaginação
                        em história.

                    </p>


                    <div
                        className="home-current-system"
                    >

                        <div
                            className="home-current-icon"
                        >

                            <SystemIcon
                                size={24}
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

                        onClick={() => {

                            handleNavigation(
                                "campaigns"
                            );

                        }}

                    >

                        <span>

                            Entrar na aventura

                        </span>


                        <ArrowRight
                            size={18}
                        />

                    </button>

                </motion.div>


                <div
                    className="home-system-selector"
                >

                    <button

                        type="button"

                        onClick={() => {

                            setTheme(
                                "dnd"
                            );

                        }}

                        className={`
                            home-system-card
                            home-system-dnd
                            ${
                                isDnd
                                    ? "active"
                                    : ""
                            }
                        `}

                    >

                        <Sword
                            size={25}
                        />

                        <span>

                            D&D

                        </span>

                        <small>

                            Fantasia e aventura

                        </small>

                    </button>


                    <button

                        type="button"

                        onClick={() => {

                            setTheme(
                                "ordem"
                            );

                        }}

                        className={`
                            home-system-card
                            home-system-ordem
                            ${
                                !isDnd
                                    ? "active"
                                    : ""
                            }
                        `}

                    >

                        <Shield
                            size={25}
                        />

                        <span>

                            Ordem Paranormal

                        </span>

                        <small>

                            O outro lado observa

                        </small>

                    </button>

                </div>

            </section>


            <section
                className="home-features"
            >

                {

                    features.map(
                        feature => {

                            const Icon =
                                feature.icon;


                            return (

                                <article

                                    key={
                                        feature.title
                                    }

                                    className="home-feature-card"

                                >

                                    <Icon
                                        size={22}
                                    />

                                    <strong>

                                        {
                                            feature.title
                                        }

                                    </strong>

                                    <span>

                                        {
                                            feature.text
                                        }

                                    </span>

                                </article>

                            );

                        }
                    )

                }

            </section>


            <div
                className="home-bottom-info"
            >

                ORDO RPGISTAS

                <span>
                    •
                </span>

                {

                    isDnd
                        ? "DUNGEONS & DRAGONS"
                        : "ORDEM PARANORMAL"

                }

            </div>

        </main>

    );

}
