import {
    Moon,
    Sun,
} from "lucide-react";

import {
    useTheme,
} from "../../context/ThemeContext";

import {
    useAudio,
} from "../../context/AudioContext";

import "./ThemeSwitcher.css";


export default function ThemeSwitcher() {

    const {
        theme,
        toggleTheme,
    } = useTheme();


    const {
        setAudioTheme,
    } = useAudio();


    const isDnd =
        theme === "dnd";


    function handleThemeChange() {

        const nextTheme =
            theme === "dnd"
                ? "ordem"
                : "dnd";


        /*
        |--------------------------------------------------------------------------
        | Troca o tema visual
        |--------------------------------------------------------------------------
        */

        toggleTheme();


        /*
        |--------------------------------------------------------------------------
        | Troca o áudio e dá PLAY imediatamente.
        |
        | Essa chamada acontece dentro do clique do usuário,
        | permitindo que o navegador autorize a reprodução.
        |--------------------------------------------------------------------------
        */

        setAudioTheme(
            nextTheme
        );

    }


    return (

        <button

            type="button"

            className={`
                theme-switcher
                ${
                    isDnd
                        ? "theme-switcher-dnd"
                        : "theme-switcher-ordem"
                }
            `}

            onClick={
                handleThemeChange
            }

        >

            {

                isDnd
                    ? (
                        <Sun
                            size={16}
                        />
                    )
                    : (
                        <Moon
                            size={16}
                        />
                    )

            }


            <span>

                {

                    isDnd
                        ? "D&D"
                        : "ORDEM"

                }

            </span>

        </button>

    );

}
