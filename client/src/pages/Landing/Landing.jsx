import {

    Sparkles,

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

            <section
                className="landing-world landing-dnd"
                style={{

                    backgroundImage:
                        `url(${dndBackground})`,

                }}
            >

                <div
                    className="landing-world-dark"
                />


                <div
                    className="landing-world-content landing-dnd-content"
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

                        Reinos, aventuras e
                        lendas aguardam.

                    </p>

                </div>

            </section>


            <section
                className="landing-world landing-ordem"
                style={{

                    backgroundImage:
                        `url(${ordemBackground})`,

                }}
            >

                <div
                    className="landing-world-dark"
                />


                <div
                    className="landing-world-content landing-ordem-content"
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

            </section>


            <div
                className="landing-magic-divider"
            >

                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />

            </div>


            <div
                className="landing-frame"
            />


            <section
                className="landing-panel"
            >

                <Sparkles
                    className="landing-symbol"
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

                    Escolha seu sistema,
                    reúna sua mesa e
                    comece uma nova história.

                </p>


                <div
                    className="landing-actions"
                >

                    <MagicalButton
                        onClick={onLogin}
                    >

                        Entrar

                    </MagicalButton>


                    <button

                        type="button"

                        className="landing-register"

                        onClick={onRegister}

                    >

                        Criar conta

                    </button>

                </div>

            </section>


            <div
                className="landing-footer"
            >

                ORDO RPGISTAS
                <span>•</span>
                ONDE HISTÓRIAS GANHAM VIDA

            </div>

        </main>

    );

}
