import {
    motion,
} from "framer-motion";

import {
    Sparkles,
    Sword,
    Shield,
} from "lucide-react";

import ThemeParticles
    from "../../components/ThemeParticles/ThemeParticles";

import MagicalButton
    from "../../components/Buttons/MagicalButton";

import "./Landing.css";


export default function Landing({

    onLogin,

    onRegister,

}) {

    const dndBackground =
        `${import.meta.env.BASE_URL}images/dnd-background.jpg`;


    const ordemBackground =
        `${import.meta.env.BASE_URL}images/ordem-background.jpg`;


    return (

        <main
            className="landing"
        >

            <section

                className="landing-world
                landing-world-dnd"

                style={{
                    backgroundImage:
                        `url(${dndBackground})`,
                }}

            >

                <div
                    className="landing-world-overlay"
                />


                <ThemeParticles
                    variant="dnd"
                    amount={24}
                />


                <div
                    className="landing-world-content"
                >

                    <span>

                        <Sword
                            size={15}
                        />

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

                </div>

            </section>


            <section

                className="landing-world
                landing-world-ordem"

                style={{
                    backgroundImage:
                        `url(${ordemBackground})`,
                }}

            >

                <div
                    className="landing-world-overlay"
                />


                <ThemeParticles
                    variant="ordem"
                    amount={24}
                />


                <div
                    className="landing-world-content"
                >

                    <span>

                        <Shield
                            size={15}
                        />

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

            </section>


            <div
                className="landing-magic-divider"
            >

                <div
                    className="landing-magic-core"
                />

            </div>


            <ThemeParticles
                variant="magic"
                amount={50}
            />


            <motion.section

                className="landing-panel"

                initial={{
                    opacity:
                        0,

                    y:
                        30,

                    scale:
                        0.96,
                }}

                animate={{
                    opacity:
                        1,

                    y:
                        0,

                    scale:
                        1,
                }}

                transition={{
                    duration:
                        0.7,
                }}

            >

                <Sparkles
                    size={28}
                />


                <span
                    className="landing-eyebrow"
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

                    Escolha seu mundo,
                    reúna sua mesa e
                    comece uma nova história.

                </p>


                <div
                    className="landing-actions"
                >

                    <MagicalButton
                        onClick={
                            onLogin
                        }
                    >

                        Entrar

                    </MagicalButton>


                    <button

                        type="button"

                        className="landing-register"

                        onClick={
                            onRegister
                        }

                    >

                        Criar conta

                    </button>

                </div>


                <span
                    className="landing-footer-text"
                >

                    Onde histórias ganham vida.

                </span>

            </motion.section>


            <div
                className="landing-corner
                landing-corner-top"
            />


            <div
                className="landing-corner
                landing-corner-bottom"
            />

        </main>

    );

}
