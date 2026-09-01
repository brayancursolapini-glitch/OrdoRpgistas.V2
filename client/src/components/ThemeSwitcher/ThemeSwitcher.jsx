import {

    Moon,
    Sword,

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
                ${theme}
            `}

            onClick={
                toggleTheme
            }

            aria-label="Trocar sistema"

        >

            <span
                className="theme-switcher-icon"
            >

                {isDnd
                    ? <Sword size={16} />
                    : <Moon size={16} />
                }

            </span>


            <span
                className="theme-switcher-text"
            >

                <small>
                    SISTEMA
                </small>

                <strong>

                    {isDnd
                        ? "D&D"
                        : "ORDEM"
                    }

                </strong>

            </span>

        </button>

    );

}
