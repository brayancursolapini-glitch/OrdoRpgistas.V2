import {
    createContext,
    useContext,
    useState,
} from "react";


const UserContext =
    createContext(
        null
    );


export function UserProvider({
    children,
}) {

    const [
        user,
        setUser,
    ] = useState(() => {

        try {

            const savedUser =
                localStorage.getItem(
                    "ordo-rpgistas-user"
                );


            if (
                savedUser
            ) {

                return JSON.parse(
                    savedUser
                );

            }

        } catch {

            return null;

        }


        return null;

    });


    function login({
        email,
        username,
    }) {

        const newUser = {

            email:
                email ||
                "",

            username:
                username ||
                email
                    ?.split("@")[0]
                    ||
                "RPGista",

            name:
                username ||
                email
                    ?.split("@")[0]
                    ||
                "RPGista",

        };


        localStorage.setItem(
            "ordo-rpgistas-user",
            JSON.stringify(
                newUser
            )
        );


        setUser(
            newUser
        );

    }


    function register({
        name,
        username,
        email,
    }) {

        const newUser = {

            name,

            username,

            email,

        };


        localStorage.setItem(
            "ordo-rpgistas-user",
            JSON.stringify(
                newUser
            )
        );


        setUser(
            newUser
        );

    }


    function logout() {

        localStorage.removeItem(
            "ordo-rpgistas-user"
        );


        setUser(
            null
        );

    }


    return (

        <UserContext.Provider

            value={{
                user,
                login,
                register,
                logout,
            }}

        >

            {children}

        </UserContext.Provider>

    );

}


export function useUser() {

    const context =
        useContext(
            UserContext
        );


    if (!context) {

        throw new Error(
            "useUser deve ser usado dentro de UserProvider."
        );

    }


    return context;

}
