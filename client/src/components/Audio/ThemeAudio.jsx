import {

    useEffect,
    useRef,

} from "react";

import {
    useTheme,
} from "../../context/ThemeContext";


export default function ThemeAudio() {

    const {
        theme,
    } = useTheme();


    const audioRef =
        useRef(null);


    useEffect(() => {

        const audio =
            audioRef.current;


        if (!audio) {

            return;

        }


        const audioSource =
            theme === "dnd"
                ? `${import.meta.env.BASE_URL}audio/dnd-ambient.mp3`
                : `${import.meta.env.BASE_URL}audio/ordem-ambient.mp3`;


        if (
            audio.src !==
            new URL(
                audioSource,
                window.location.origin
            ).href
        ) {

            audio.src =
                audioSource;

        }


        audio.volume =
            0.18;


        audio.play()
            .catch(() => {

                /*
                O navegador pode bloquear
                autoplay até a primeira
                interação do usuário.
                */

            });

    }, [
        theme,
    ]);


    return (

        <audio

            ref={audioRef}

            loop

        />

    );

}
