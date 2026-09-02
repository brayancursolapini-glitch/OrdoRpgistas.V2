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
        useRef(
            null
        );


    useEffect(() => {

        if (
            !audioRef.current
        ) {

            return;

        }


        const audio =
            audioRef.current;


        audio.pause();


        audio.currentTime =
            0;


        audio.src =
            theme === "dnd"
                ? `${import.meta.env.BASE_URL}audio/dnd-ambient.mp3`
                : `${import.meta.env.BASE_URL}audio/ordem-ambient.mp3`;


        audio.load();


        audio
            .play()
            .catch(() => {

                /*
                    O navegador pode bloquear
                    autoplay até existir interação.
                */

            });

    }, [
        theme,
    ]);


    return (

        <audio

            ref={
                audioRef
            }

            loop

        />

    );

}
