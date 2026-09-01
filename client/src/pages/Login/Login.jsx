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


        const finalName =
            username.trim() ||
            email.trim().split("@")[0] ||
            "RPGista";


        login({
            username: finalName,
            email: email.trim(),
        });


        onLoginSuccess?.();

    }


    return (

        <main className="auth-page">

            <button
                type="button"
                className="auth-back"
                onClick={onBack}
            >

                <ArrowLeft size={18} />
                Voltar

            </button>


            <section className="auth-card">

                <div className="auth-symbol">
                    <LogIn size={30} />
                </div>

                <span className="auth-eyebrow">
                    BEM-VINDO DE VOLTA
                </span>

                <h1>
                    Entrar no
                    <strong> Ordo RPGistas</strong>
                </h1>

                <p>
                    Continue sua aventura.
                </p>


                <form onSubmit={handleSubmit}>

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
                            placeholder="Seu nome de aventureiro"
                        />

                    </label>


                    <label>

                        E-mail

                        <input
                            type="email"
                            required
                            value={email}
                            onChange={event => {
                                setEmail(
                                    event.target.value
                                );
                            }}
                            placeholder="voce@email.com"
                        />

                    </label>


                    <label>

                        Senha

                        <input
                            type="password"
                            required
                            minLength="3"
                            value={password}
                            onChange={event => {
                                setPassword(
                                    event.target.value
                                );
                            }}
                            placeholder="Sua senha"
                        />

                    </label>


                    <button
                        type="submit"
                        className="auth-submit"
                    >
                        Entrar na aventura
                    </button>

                </form>


                <div className="auth-footer">

                    Ainda não possui uma conta?

                    <button
                        type="button"
                        onClick={onRegister}
                    >
                        Criar conta
                    </button>

                </div>

            </section>

        </main>

    );

}
