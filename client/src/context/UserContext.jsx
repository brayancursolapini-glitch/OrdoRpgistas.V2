import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const UserContext =
    createContext(null);


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

            return savedUser
                ? JSON.parse(savedUser)
                : null;

        } catch {

            return null;

        }

    });


    useEffect(() => {

        try {

            if (user) {

                localStorage.setItem(
                    "ordo-rpgistas-user",
                    JSON.stringify(user)
                );

            } else {

                localStorage.removeItem(
                    "ordo-rpgistas-user"
                );

            }

        } catch {
            // Ignora.
        }

    }, [
        user,
    ]);


    function login(userData) {

        setUser(userData);

    }


    function logout() {

        setUser(null);

    }


    return (

        <UserContext.Provider
            value={{
                user,
                login,
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
