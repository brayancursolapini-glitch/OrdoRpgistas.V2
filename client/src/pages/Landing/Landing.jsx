import {
    useState,
} from "react";

import {
    motion,
} from "framer-motion";

import {
    LogIn,
    Sparkles,
} from "lucide-react";

import MagicalButton
    from "../../components/Buttons/MagicalButton";

import WelcomeModal
    from "../../components/Welcome/WelcomeModal";

import "./Landing.css";


export default function Landing({
    onLogin,
    onRegister,
}) {

    const [
        welcomeOpen,
        setWelcomeOpen,
    ] = useState(false);


    const dndBackground =
        `${import.meta.env.BASE_URL}assets/dnd-background.jpg`;

    const ordemBackground =
        `${import.meta.env.BASE_URL}assets/ordem-background.jpg`;


    return (

        <main className="landing">

            <div
                className="landing-world landing-dnd"
                style={{
                    backgroundImage:
                        `url(${dndBackground})`,
                }}
            >

                <div className="landing-world-overlay" />

                <div className="landing-world-text">

                    <span>
                        UM MUNDO DE AVENTURAS
                    </span>

                    <h2>
                        DUNGEONS
                        <br />
                        & DRAGONS
                    </h2>

                </div>

            </div>


            <div
                className="landing-world landing-ordem"
                style={{
                    backgroundImage:
                        `url(${ordemBackground})`,
                }}
            >

                <div className="landing-world-overlay" />

                <div className="landing-world-text">

                    <span>
                        A REALIDADE NÃO É O QUE PARECE
                    </span>

                    <h2>
                        ORDEM
                        <br />
                        PARANORMAL
                    </h2>

                </div>

            </div>


            <div
                className="landing-magic-border"
                aria-hidden="true"
            >

                {Array.from(
                    { length: 18 },
                    (_, index) => (
                        <span
                            key={index}
                            className={`magic-border-particle p-${index}`}
                        />
                    )
                )}

            </div>


            <div
                className="landing-magic-divider"
                aria-hidden="true"
            >

                <div className="landing-magic-core" />

                {Array.from(
                    { length: 26 },
                    (_, index) => (
                        <span
                            key={index}
                            className={`landing-magic-spark s-${index}`}
                        />
                    )
                )}

            </div>


            <motion.section
                className="landing-panel"

                initial={{
                    opacity: 0,
                    y: 28,
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

                <Sparkles
                    className="landing-symbol"
                    size={34}
                />

                <span className="landing-welcome">
                    BEM-VINDO À
                </span>

                <h1>
                    ORDO
                    <strong>RPGISTAS</strong>
                </h1>

                <p>
                    Onde histórias ganham vida.
                </p>

                <div className="landing-divider">
                    <span />
                    ✦
                    <span />
                </div>

                <div className="landing-actions">

                    <MagicalButton
                        type="button"
                        onClick={onRegister}
                    >
                        Criar minha conta
                    </MagicalButton>

                    <MagicalButton
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            setWelcomeOpen(true);
                        }}
                    >
                        Conheça o RPG
                    </MagicalButton>

                </div>

                <button
                    type="button"
                    className="landing-login"
                    onClick={onLogin}
                >

                    <LogIn size={16} />
                    Já tenho uma conta

                </button>

            </motion.section>


            <WelcomeModal
                open={welcomeOpen}
                onClose={() => {
                    setWelcomeOpen(false);
                }}
            />

        </main>

    );

}
