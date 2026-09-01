import { useTheme } from "../../context/ThemeContext";

import SideMenu from "../../components/Menu/SideMenu";
import ThemeSwitcher from "../../components/ThemeSwitcher/ThemeSwitcher";
import ThemeParticles from "../../components/ThemeParticles/ThemeParticles";
import ThemeAudio from "../../components/Audio/ThemeAudio";

import "./Home.css";


export default function Home() {

    const {
        theme,
    } = useTheme();


    const isDnd =
        theme === "dnd";


    const backgroundImage =
        isDnd
            ? `${import.meta.env.BASE_URL}images/Home-dnd.jpg`
            : `${import.meta.env.BASE_URL}images/Home-ordem.jpg`;


    return (

        <main
            className={`home home-${theme}`}
            style={{
                backgroundImage:
                    `url("${backgroundImage}")`,
            }}
        >

            <ThemeAudio />

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
                className="home-content"
            >

                <span
                    className="home-system-label"
                >

                    {isDnd
                        ? "DUNGEONS & DRAGONS"
                        : "ORDEM PARANORMAL"}

                </span>


                <h1>

                    Bem-vindo ao

                    <strong>
                        ORDO RPGISTAS
                    </strong>

                </h1>


                <p>

                    Escolha seu caminho,
                    reúna sua mesa e
                    comece uma nova história.

                </p>

            </section>

        </main>

    );

}
