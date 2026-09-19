import {
    useEffect,
    useState,
} from "react";

import {
    Sparkles,
} from "lucide-react";

import "./IntroLoader.css";


export default function IntroLoader({
    onComplete,
    duration = 2400,
}) {

    const [
        leaving,
        setLeaving,
    ] = useState(false);


    useEffect(() => {

        /*
        =========================================
        INICIA A SAÍDA DO LOADER
        =========================================
        */

        const exitTimer = setTimeout(() => {

            setLeaving(true);

        }, duration);


        /*
        =========================================
        FINALIZA O LOADER
        =========================================
        */

        const completeTimer = setTimeout(() => {

            if (typeof onComplete === "function") {

                onComplete();

            }

        }, duration + 500);


        /*
        =========================================
        LIMPEZA
        =========================================
        */

        return () => {

            clearTimeout(exitTimer);

            clearTimeout(completeTimer);

        };

    }, [
        duration,
        onComplete,
    ]);


    return (
        <div
            className={`
                intro-loader
                ${leaving
                    ? "intro-loader-leaving"
                    : ""
                }
            `}
        >

            {/* Fundo mágico */}

            <div
                className="intro-loader-background"
            />


            {/* Conteúdo */}

            <div
                className="intro-loader-content"
            >

                <Sparkles
                    className="intro-loader-icon"
                    size={42}
                />


                <span
                    className="intro-loader-small"
                >
                    PREPARE-SE PARA ENTRAR
                </span>


                <h1>
                    ORDO

                    <strong>
                        RPGISTAS
                    </strong>
                </h1>


                <div
                    className="intro-loader-line"
                >

                    <span />

                </div>


                <p>
                    Onde histórias ganham vida.
                </p>

            </div>

        </div>
    );
}
