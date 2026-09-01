import {
    useState,
} from "react";

import IntroLoader
    from "./components/Loading/IntroLoader";

import ThemeAudio
    from "./components/Audio/ThemeAudio";

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


    return (

        <>

            <ThemeAudio />


            {currentPage === "landing" && (

                <Landing

                    onLogin={() => {

                        setCurrentPage("login");

                    }}

                    onRegister={() => {

                        setCurrentPage("cadastro");

                    }}

                />

            )}


            {currentPage === "login" && (

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

            )}


            {currentPage === "cadastro" && (

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

            )}


            {currentPage === "home" && (

                <Home />

            )}

        </>

    );

}
