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
    duration = 2200,
}) {

    const [
        leaving,
        setLeaving,
    ] = useState(false);


    useEffect(() => {

        const exitTimer =
            setTimeout(() => {

                setLeaving(true);

            }, duration);


        const completeTimer =
            setTimeout(() => {

                onComplete?.();

            }, duration + 500);


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
            className={`intro-loader ${
                leaving
                    ? "intro-loader-leaving"
                    : ""
            }`}
        >

            <div className="intro-loader-background" />


            <div className="intro-loader-content">

                <Sparkles
                    className="intro-loader-icon"
                    size={44}
                />

                <span className="intro-loader-small">
                    PREPARE-SE PARA ENTRAR
                </span>

                <h1>
                    ORDO
                    <strong>RPGISTAS</strong>
                </h1>

                <div className="intro-loader-line">
                    <span />
                </div>

                <p>
                    Onde histórias ganham vida.
                </p>

            </div>

        </div>

    );

}
