import { Sparkles, Sword, Shield } from "lucide-react";

import MagicalButton from "../../components/Buttons/MagicalButton/MagicalButton";

import "./Landing.css";


export default function Landing({
    onLogin,
    onCadastro,
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
                CENÁRIO D&D
            ====================================== */}

            <section
                className="landing-world landing-world-dnd"
                style={{
                    backgroundImage:
                        `url("${dndBackground}")`,
                }}
            >

                <div
                    className="landing-world-dark"
                />


                <div
                    className="landing-world-content landing-dnd-content"
                >

                    <span
                        className="landing-world-eyebrow"
                    >

                        UM MUNDO DE AVENTURAS

                    </span>


                    <h1>

                        DUNGEONS

                        <br />

                        <span>
                            & DRAGONS
                        </span>

                    </h1>


                    <p>

                        Reinos, aventuras e lendas aguardam.

                    </p>


                    <div
                        className="landing-system-tag"
                    >

                        <Sword
                            size={14}
                        />

                        <span>

                            SISTEMA D&D

                        </span>

                    </div>

                </div>

            </section>


            {/* =====================================
                CENÁRIO ORDEM
            ====================================== */}

            <section
                className="landing-world landing-world-ordem"
                style={{
                    backgroundImage:
                        `url("${ordemBackground}")`,
                }}
            >

                <div
                    className="landing-world-dark"
                />


                <div
                    className="landing-world-content landing-ordem-content"
                >

                    <span
                        className="landing-world-eyebrow"
                    >

                        A REALIDADE NÃO É O QUE PARECE

                    </span>


                    <h1>

                        ORDEM

                        <br />

                        <span>
                            PARANORMAL
                        </span>

                    </h1>


                    <p>

                        O paranormal observa cada movimento.

                    </p>


                    <div
                        className="landing-system-tag"
                    >

                        <Shield
                            size={14}
                        />

                        <span>

                            SISTEMA ORDEM

                        </span>

                    </div>

                </div>

            </section>


            {/* =====================================
                DIVISÓRIA MÁGICA CENTRAL
            ====================================== */}

            <div
                className="landing-magic-divider"
                aria-hidden="true"
            >

                <div
                    className="landing-divider-glow"
                />


                <div
                    className="landing-divider-line"
                />


                <div
                    className="landing-divider-particles"
                >

                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />

                </div>

            </div>


            {/* =====================================
                PAINEL CENTRAL
            ====================================== */}

            <section
                className="landing-panel"
            >

                <div
                    className="landing-panel-icon"
                >

                    <Sparkles
                        size={22}
                    />

                </div>


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


                <p
                    className="landing-panel-description"
                >

                    Escolha um sistema,
                    reúna sua mesa e comece
                    uma nova história.

                </p>


                <div
                    className="landing-panel-system"
                >

                    <Sparkles
                        size={16}
                    />


                    <div>

                        <small>

                            SEU MUNDO INICIA

                        </small>


                        <strong>

                            SUA AVENTURA COMEÇA AQUI

                        </strong>

                    </div>

                </div>


                <div
                    className="landing-panel-actions"
                >

                    <MagicalButton
                        onClick={onLogin}
                    >

                        Entrar

                    </MagicalButton>


                    <button
                        type="button"
                        className="landing-create-button"
                        onClick={onCadastro}
                    >

                        Criar conta

                    </button>

                </div>


                <span
                    className="landing-panel-footer"
                >

                    Onde histórias ganham vida.

                </span>

            </section>


            {/* =====================================
                PARTÍCULAS GERAIS
            ====================================== */}

            <div
                className="landing-ambient-particles"
                aria-hidden="true"
            >

                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />

            </div>


            {/* =====================================
                CONTORNO MÁGICO
            ====================================== */}

            <div
                className="landing-magic-border"
                aria-hidden="true"
            />


            {/* =====================================
                RODAPÉ
            ====================================== */}

            <div
                className="landing-footer"
            >

                ORDO RPGISTAS
                <span>•</span>
                DOIS MUNDOS. INFINITAS HISTÓRIAS.

            </div>

        </main>

    );

}
