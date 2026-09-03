import { motion } from "framer-motion";

import {
    Sparkles,
    Shield,
    Sword,
} from "lucide-react";

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

            {/* =====================================
                FUNDOS
            ===================================== */}

            <div
                className="landing-backgrounds"
            >

                {/* D&D */}

                <section
                    className="landing-world
                    landing-world-dnd"
                    style={{
                        backgroundImage:
                            `url("${dndBackground}")`,
                    }}
                >

                    <div
                        className="landing-world-darkness"
                    />

                    <div
                        className="landing-world-vignette"
                    />


                    <motion.div
                        className="landing-world-text
                        landing-world-text-dnd"

                        initial={{
                            opacity: 0,
                            x: -40,
                        }}

                        animate={{
                            opacity: 1,
                            x: 0,
                        }}

                        transition={{
                            duration: 0.9,
                            delay: 0.2,
                        }}
                    >

                        <span
                            className="landing-world-eyebrow"
                        >

                            UM MUNDO DE AVENTURAS

                        </span>


                        <h1>

                            DUNGEONS

                            <br />

                            & DRAGONS

                        </h1>


                        <p>

                            Reinos, aventuras e
                            lendas aguardam.

                        </p>


                        <div
                            className="landing-world-system"
                        >

                            <Sword
                                size={15}
                            />

                            <span>

                                SISTEMA D&D

                            </span>

                        </div>

                    </motion.div>

                </section>


                {/* ORDEM */}

                <section
                    className="landing-world
                    landing-world-ordem"
                    style={{
                        backgroundImage:
                            `url("${ordemBackground}")`,
                    }}
                >

                    <div
                        className="landing-world-darkness"
                    />

                    <div
                        className="landing-world-vignette"
                    />


                    <motion.div
                        className="landing-world-text
                        landing-world-text-ordem"

                        initial={{
                            opacity: 0,
                            x: 40,
                        }}

                        animate={{
                            opacity: 1,
                            x: 0,
                        }}

                        transition={{
                            duration: 0.9,
                            delay: 0.35,
                        }}
                    >

                        <span
                            className="landing-world-eyebrow"
                        >

                            A REALIDADE NÃO É O QUE PARECE

                        </span>


                        <h1>

                            ORDEM

                            <br />

                            PARANORMAL

                        </h1>


                        <p>

                            O paranormal observa
                            cada movimento.

                        </p>


                        <div
                            className="landing-world-system"
                        >

                            <Shield
                                size={15}
                            />

                            <span>

                                SISTEMA ORDEM

                            </span>

                        </div>

                    </motion.div>

                </section>

            </div>


            {/* =====================================
                ESCURECIMENTO GERAL
            ===================================== */}

            <div
                className="landing-global-overlay"
            />


            {/* =====================================
                BORDA MÁGICA
            ===================================== */}

            <div
                className="landing-magic-border"
            >

                <div
                    className="landing-magic-border-glow"
                />

            </div>


            {/* =====================================
                DIVISÃO CENTRAL
            ===================================== */}

            <div
                className="landing-magical-divider"
            >

                <div
                    className="landing-divider-glow"
                />

                <div
                    className="landing-divider-core"
                />

                <div
                    className="landing-divider-energy
                    landing-divider-energy-one"
                />

                <div
                    className="landing-divider-energy
                    landing-divider-energy-two"
                />

                <div
                    className="landing-divider-energy
                    landing-divider-energy-three"
                />

            </div>


            {/* =====================================
                PARTÍCULAS MÁGICAS
            ===================================== */}

            <div
                className="landing-particles"
            >

                <span className="landing-particle particle-1" />
                <span className="landing-particle particle-2" />
                <span className="landing-particle particle-3" />
                <span className="landing-particle particle-4" />
                <span className="landing-particle particle-5" />
                <span className="landing-particle particle-6" />
                <span className="landing-particle particle-7" />
                <span className="landing-particle particle-8" />
                <span className="landing-particle particle-9" />
                <span className="landing-particle particle-10" />
                <span className="landing-particle particle-11" />
                <span className="landing-particle particle-12" />

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
                    delay: 0.15,
                    ease: "easeOut",
                }}
            >

                <div
                    className="landing-panel-top-glow"
                />


                <div
                    className="landing-panel-content"
                >

                    {/* ÍCONE */}

                    <div
                        className="landing-panel-icon"
                    >

                        <Sparkles
                            size={22}
                        />

                    </div>


                    {/* EYEBROW */}

                    <span
                        className="landing-panel-eyebrow"
                    >

                        SEU MUNDO ESTÁ PRONTO

                    </span>


                    {/* LOGO */}

                    <h2>

                        ORDO

                        <strong>

                            RPGISTAS

                        </strong>

                    </h2>


                    {/* DESCRIÇÃO */}

                    <p
                        className="landing-panel-description"
                    >

                        Escolha um sistema,
                        reúna sua mesa e comece
                        uma nova história.

                    </p>


                    {/* SISTEMA */}

                    <div
                        className="landing-current-system"
                    >

                        <div
                            className="landing-current-system-icon"
                        >

                            <Sword
                                size={18}
                            />

                        </div>


                        <div
                            className="landing-current-system-info"
                        >

                            <small>

                                SEU MUNDO INICIAL

                            </small>


                            <strong>

                                SUA AVENTURA COMEÇA AQUI

                            </strong>

                        </div>

                    </div>


                    {/* BOTÕES */}

                    <div
                        className="landing-panel-actions"
                    >

                        <MagicalButton
                            type="button"
                            onClick={onLogin}
                        >

                            Entrar

                        </MagicalButton>


                        <button
                            type="button"
                            className="landing-register-button"
                            onClick={onRegister}
                        >

                            Criar conta

                        </button>

                    </div>


                    {/* FRASE */}

                    <span
                        className="landing-panel-footer"
                    >

                        Onde histórias ganham vida.

                    </span>

                </div>

            </motion.section>


            {/* =====================================
                RODAPÉ
            ===================================== */}

            <div
                className="landing-bottom-brand"
            >

                <span>

                    ORDO RPGISTAS

                </span>

                <span>

                    •

                </span>

                <span>

                    DOIS MUNDOS. INFINITAS HISTÓRIAS.

                </span>

            </div>

        </main>

    );

}
