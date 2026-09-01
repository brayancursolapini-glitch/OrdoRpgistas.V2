import {
    useState,
} from "react";

import IntroLoader
    from "./components/Loading/IntroLoader";

import Landing
    from "./pages/Landing/Landing";

import Login
    from "./pages/Login/Login";

import Cadastro
    from "./pages/Cadastro/Cadastro";

import Home
    from "./pages/Home/Home";


export default function App() {

    const [
        currentPage,
        setCurrentPage,
    ] = useState("landing");


    const [
        loading,
        setLoading,
    ] = useState(true);


    if (loading) {

        return (

            <IntroLoader
                onComplete={() => {

                    setLoading(false);

                }}
            />

        );

    }


    if (currentPage === "landing") {

        return (

            <Landing

                onLogin={() => {

                    setCurrentPage("login");

                }}

                onRegister={() => {

                    setCurrentPage("cadastro");

                }}

            />

        );

    }


    if (currentPage === "login") {

        return (

            <Login

                onBack={() => {

                    setCurrentPage("landing");

                }}

                onRegister={() => {

                    setCurrentPage("cadastro");

                }}

                onLoginSuccess={() => {

                    setCurrentPage("home");

                }}

            />

        );

    }


    if (currentPage === "cadastro") {

        return (

            <Cadastro

                onBack={() => {

                    setCurrentPage("landing");

                }}

                onLogin={() => {

                    setCurrentPage("login");

                }}

                onRegisterSuccess={() => {

                    setCurrentPage("home");

                }}

            />

        );

    }


    if (currentPage === "home") {

        return (

            <Home />

        );

    }


    return (

        <Landing

            onLogin={() => {

                setCurrentPage("login");

            }}

            onRegister={() => {

                setCurrentPage("cadastro");

            }}

        />

    );

}
