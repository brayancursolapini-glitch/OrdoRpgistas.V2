import {
    Moon,
    Swords,
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
            className={`theme-switcher ${
                isDnd
                    ? "theme-switcher-dnd"
                    : "theme-switcher-ordem"
            }`}
            onClick={toggleTheme}
            aria-label="Trocar sistema"
        >

            <span className="theme-switcher-icon">
                {isDnd
                    ? <Swords size={17} />
                    : <Moon size={17} />
                }
            </span>

            <span className="theme-switcher-text">
                {isDnd
                    ? "D&D"
                    : "ORDEM"}
            </span>

        </button>

    );

}
