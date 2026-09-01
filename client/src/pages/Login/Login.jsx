import {
    useState,
} from "react";

import {

    ArrowLeft,
    LogIn,

} from "lucide-react";

import {
    useUser,
} from "../../context/UserContext";

import MagicalButton
    from "../../components/Buttons/MagicalButton";

import "./Login.css";


export default function Login({

    onBack,
    onRegister,
    onLoginSuccess,

}) {

    const {
        login,
    } = useUser();


    const [
        username,
        setUsername,
    ] = useState("");


    const [
        email,
        setEmail,
    ] = useState("");


    const [
        password,
        setPassword,
    ] = useState("");


    function handleSubmit(event) {

        event.preventDefault();


        const userData = {

            name:
                username.trim() ||
                email.split("@")[0],

            username:
                username.trim() ||
                email.split("@")[0],

            email,

        };


        login(userData);


        if (onLoginSuccess) {

            onLoginSuccess();

        }

    }


    return (

        <main
            className="auth-page"
        >

            <div
                className="auth-background"
            />


            <section
                className="auth-card"
            >

                <button

                    type="button"

                    className="auth-back"

                    onClick={onBack}

                >

                    <ArrowLeft
                        size={18}
                    />

                    Voltar

                </button>


                <div
                    className="auth-icon"
                >

                    <LogIn
                        size={26}
                    />

                </div>


                <span
                    className="auth-eyebrow"
                >

                    BEM-VINDO DE VOLTA

                </span>


                <h1>

                    Entrar no
                    <strong>
                        Ordo RPGistas
                    </strong>

                </h1>


                <form
                    onSubmit={handleSubmit}
                >

                    <label>

                        Nome de usuário

                        <input

                            type="text"

                            value={username}

                            onChange={event => {

                                setUsername(
                                    event.target.value
                                );

                            }}

                            required

                        />

                    </label>


                    <label>

                        E-mail

                        <input

                            type="email"

                            value={email}

                            onChange={event => {

                                setEmail(
                                    event.target.value
                                );

                            }}

                            required

                        />

                    </label>


                    <label>

                        Senha

                        <input

                            type="password"

                            value={password}

                            onChange={event => {

                                setPassword(
                                    event.target.value
                                );

                            }}

                            required

                        />

                    </label>


                    <MagicalButton
                        type="submit"
                    >

                        Entrar na aventura

                    </MagicalButton>

                </form>


                <p
                    className="auth-switch"
                >

                    Ainda não possui uma conta?

                    <button

                        type="button"

                        onClick={onRegister}

                    >

                        Criar conta

                    </button>

                </p>

            </section>

        </main>

    );

}
