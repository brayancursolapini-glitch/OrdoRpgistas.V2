import {
    useEffect,
    useRef,
} from "react";

import {
    useTheme,
} from "../../context/ThemeContext";


export default function ThemeAudio() {

    const audioRef =
        useRef(null);


    const {
        theme,
    } = useTheme();


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


        audio.pause();

        audio.src =
            audioSource;

        audio.load();

        audio.volume =
            0.35;


        const playAudio =
            () => {

                audio
                    .play()
                    .catch(() => {

                        /*
                        O navegador pode bloquear autoplay.
                        O áudio será liberado na próxima
                        interação do usuário.
                        */

                    });

            };


        playAudio();


        const enableAudio =
            () => {

                playAudio();

            };


        window.addEventListener(
            "pointerdown",
            enableAudio,
            {
                once: true,
            }
        );


        window.addEventListener(
            "keydown",
            enableAudio,
            {
                once: true,
            }
        );


        return () => {

            window.removeEventListener(
                "pointerdown",
                enableAudio
            );

            window.removeEventListener(
                "keydown",
                enableAudio
            );

        };

    }, [
        theme,
    ]);


    return (

        <audio
            ref={audioRef}
            loop
            preload="auto"
            aria-hidden="true"
        />

    );

}
