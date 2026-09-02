import {
    motion,
} from "framer-motion";

import {
    Sparkles,
    Sword,
    Shield,
} from "lucide-react";

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

            {/* =====================================
                FUNDOS
            ===================================== */}

            <section
                className="landing-world landing-world-dnd"
                style={{
                    backgroundImage:
                        `url(${dndBackground})`,
                }}
            >

                <div
                    className="landing-world-overlay"
                />


                <div
                    className="landing-world-content"
                >

                    <span>

                        UM MUNDO DE AVENTURAS

                    </span>


                    <h1>

                        DUNGEONS

                        <br />

                        & DRAGONS

                    </h1>


                    <p>

                        Reinos,
                        aventuras
                        e lendas
                        aguardam.

                    </p>

                </div>

            </section>


            <section
                className="landing-world landing-world-ordem"
                style={{
                    backgroundImage:
                        `url(${ordemBackground})`,
                }}
            >

                <div
                    className="landing-world-overlay"
                />


                <div
                    className="landing-world-content"
                >

                    <span>

                        A REALIDADE NÃO É O QUE PARECE

                    </span>


                    <h1>

                        ORDEM

                        <br />

                        PARANORMAL

                    </h1>


                    <p>

                        O paranormal
                        observa cada
                        movimento.

                    </p>

                </div>

            </section>


            {/* =====================================
                DIVISÃO MÁGICA
            ===================================== */}

            <div
                className="landing-magic-divider"
            >

                <div
                    className="landing-magic-line"
                />


                <div
                    className="landing-magic-glow"
                />


                <div
                    className="landing-magic-dust"
                >

                    {Array
                        .from({
                            length: 36,
                        })
                        .map(
                            (
                                _,
                                index
                            ) => (

                                <span
                                    key={index}
                                    style={{
                                        "--delay":
                                            `${(
                                                index *
                                                0.23
                                            ) % 4}s`,

                                        "--offset":
                                            `${(
                                                (
                                                    index *
                                                    37
                                                ) %
                                                80
                                            ) -
                                            40}px`,
                                    }}
                                />

                            )
                        )}

                </div>

            </div>


            {/* =====================================
                CONTORNO MÁGICO
            ===================================== */}

            <div
                className="landing-magic-frame"
                aria-hidden="true"
            >

                <span
                    className="landing-frame-particle p1"
                />

                <span
                    className="landing-frame-particle p2"
                />

                <span
                    className="landing-frame-particle p3"
                />

                <span
                    className="landing-frame-particle p4"
                />

                <span
                    className="landing-frame-particle p5"
                />

                <span
                    className="landing-frame-particle p6"
                />

            </div>


            {/* =====================================
                PAINEL CENTRAL
            ===================================== */}

            <motion.section
                className="landing-panel"
                initial={{
                    opacity: 0,
                    scale: 0.92,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.7,
                    ease: "easeOut",
                }}
            >

                <Sparkles
                    className="landing-panel-icon"
                    size={25}
                />


                <span
                    className="landing-panel-eyebrow"
                >

                    SEU MUNDO ESTÁ PRONTO

                </span>


                <h2>

                    ORDO

                    <strong>

                        RPGISTAS

                    </strong>

                </h2>


                <p>

                    Escolha um sistema,
                    reúna sua mesa
                    e comece uma
                    nova história.

                </p>


                <div
                    className="landing-system-preview"
                >

                    <div
                        className="landing-system-icon"
                    >

                        <Sword
                            size={18}
                        />

                    </div>


                    <div>

                        <small>

                            DOIS MUNDOS.
                            UM LUGAR.

                        </small>


                        <strong>

                            SUA AVENTURA
                            COMEÇA AQUI

                        </strong>

                    </div>

                </div>


                <button
                    type="button"
                    className="landing-enter-button"
                    onClick={onLogin}
                >

                    <Shield
                        size={17}
                    />

                    Entrar

                </button>


                <button
                    type="button"
                    className="landing-register-button"
                    onClick={onRegister}
                >

                    Criar conta

                </button>


                <small
                    className="landing-footer-text"
                >

                    Onde histórias ganham vida.

                </small>

            </motion.section>

        </main>

    );

}
