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
                name: "DUNGEONS & DRAGONS",
                description:
                    "Reinos, aventuras e lendas.",
                icon: Sword,
            }
            : {
                name: "ORDEM PARANORMAL",
                description:
                    "O paranormal observa.",
                icon: Shield,
            };


    const SystemIcon =
        currentSystem.icon;


    return (

        <main
            className={`home ${theme}`}
        >

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


                <div
                    className="home-header-actions"
                >

                    <ThemeSwitcher />

                </div>

            </header>


            <section
                className="home-worlds"
            >

                <button
                    type="button"

                    className={
                        `home-world home-world-dnd ${
                            isDnd
                                ? "selected"
                                : ""
                        }`
                    }

                    style={{
                        backgroundImage:
                            `url("${dndBackground}")`,
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

                        <span
                            className="home-world-label"
                        >

                            UM MUNDO DE AVENTURAS

                        </span>


                        <h2>

                            DUNGEONS
                            <br />
                            & DRAGONS

                        </h2>


                        <p>

                            Reinos, aventuras e
                            lendas aguardam.

                        </p>


                        <span
                            className="home-world-status"
                        >

                            {isDnd
                                ? "SISTEMA ATIVO"
                                : "SELECIONAR SISTEMA"}

                        </span>

                    </div>

                </button>


                <button
                    type="button"

                    className={
                        `home-world home-world-ordem ${
                            !isDnd
                                ? "selected"
                                : ""
                        }`
                    }

                    style={{
                        backgroundImage:
                            `url("${ordemBackground}")`,
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

                        <span
                            className="home-world-label"
                        >

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


                        <span
                            className="home-world-status"
                        >

                            {!isDnd
                                ? "SISTEMA ATIVO"
                                : "SELECIONAR SISTEMA"}

                        </span>

                    </div>

                </button>

            </section>


            <motion.section
                className="home-hero"

                initial={{
                    opacity: 0,
                    y: 30,
                }}

                animate={{
                    opacity: 1,
                    y: 0,
                }}

                transition={{
                    duration: 0.7,
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

                    SEU MUNDO ESTÁ PRONTO

                </span>


                <h1>

                    ORDO

                    <strong>
                        RPGISTAS
                    </strong>

                </h1>


                <p
                    className="home-hero-description"
                >

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


                    <div
                        className="home-current-info"
                    >

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

                    <span>
                        Entrar na aventura
                    </span>

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
                        : "ORDEM PARANORMAL"}

                </span>

            </div>

        </main>

    );

}
