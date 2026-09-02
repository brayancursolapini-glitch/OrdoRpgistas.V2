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
        email,
        setEmail,
    ] = useState(
        ""
    );


    const [
        password,
        setPassword,
    ] = useState(
        ""
    );


    const [
        error,
        setError,
    ] = useState(
        ""
    );


    function handleSubmit(
        event
    ) {

        event.preventDefault();


        if (
            !email.trim() ||
            !password.trim()
        ) {

            setError(
                "Preencha seu email e senha."
            );

            return;

        }


        login({

            email:
                email.trim(),

        });


        onLoginSuccess();

    }


    return (

        <main
            className="auth-page"
        >

            <section
                className="auth-card"
            >

                <button

                    type="button"

                    className="auth-back"

                    onClick={
                        onBack
                    }

                >

                    <ArrowLeft
                        size={18}
                    />

                    Voltar

                </button>


                <LogIn
                    className="auth-icon"
                    size={32}
                />


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
                    onSubmit={
                        handleSubmit
                    }
                >

                    <label>

                        Email

                        <input

                            type="email"

                            value={
                                email
                            }

                            onChange={
                                event => {

                                    setEmail(
                                        event.target.value
                                    );

                                }
                            }

                            placeholder="seu@email.com"

                        />

                    </label>


                    <label>

                        Senha

                        <input

                            type="password"

                            value={
                                password
                            }

                            onChange={
                                event => {

                                    setPassword(
                                        event.target.value
                                    );

                                }
                            }

                            placeholder="Sua senha"

                        />

                    </label>


                    {

                        error && (

                            <p
                                className="auth-error"
                            >

                                {error}

                            </p>

                        )

                    }


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

                        onClick={
                            onRegister
                        }

                    >

                        Criar conta

                    </button>

                </p>

            </section>

        </main>

    );

}
