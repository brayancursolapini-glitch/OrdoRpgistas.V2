import {
    Moon,
    Sun,
} from "lucide-react";

import {
    useTheme,
} from "../../context/ThemeContext";

import "./ThemeSwitcher.css";


export default function ThemeSwitcher() {

    const {
        theme,
        toggleTheme,
    } = useTheme();


    const isDnd =
        theme === "dnd";


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
                toggleTheme
            }

        >

            {

                isDnd
                    ? <Sun size={16} />
                    : <Moon size={16} />

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
