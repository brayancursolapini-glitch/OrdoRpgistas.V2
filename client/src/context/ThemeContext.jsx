import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";


const ThemeContext =
    createContext(
        null
    );


export function ThemeProvider({
    children,
}) {

    const [
        theme,
        setTheme,
    ] = useState(() => {

        const savedTheme =
            localStorage.getItem(
                "ordo-rpgistas-theme"
            );


        if (
            savedTheme === "dnd" ||
            savedTheme === "ordem"
        ) {

            return savedTheme;

        }


        return "dnd";

    });


    useEffect(() => {

        localStorage.setItem(
            "ordo-rpgistas-theme",
            theme
        );


        document
            .documentElement
            .setAttribute(
                "data-theme",
                theme
            );

    }, [
        theme,
    ]);


    function toggleTheme() {

        setTheme(
            currentTheme => {

                return (
                    currentTheme === "dnd"
                        ? "ordem"
                        : "dnd"
                );

            }
        );

    }


    return (

        <ThemeContext.Provider

            value={{
                theme,
                setTheme,
                toggleTheme,
            }}

        >

            {children}

        </ThemeContext.Provider>

    );

}


export function useTheme() {

    const context =
        useContext(
            ThemeContext
        );


    if (!context) {

        throw new Error(
            "useTheme deve ser usado dentro de ThemeProvider."
        );

    }


    return context;

}
