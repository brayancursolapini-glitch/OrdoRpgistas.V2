import {
    useState,
} from "react";

import {
    ArrowLeft,
    UserPlus,
} from "lucide-react";

import {
    useUser,
} from "../../context/UserContext";

import "./Cadastro.css";


export default function Cadastro({
    onBack,
    onLogin,
    onRegisterSuccess,
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


        login({
            username: username.trim(),
            email: email.trim(),
        });


        onRegisterSuccess?.();

    }


    return (

        <main className="cadastro-page">

            <button
                type="button"
                className="cadastro-back"
                onClick={onBack}
            >

                <ArrowLeft size={18} />
                Voltar

            </button>


            <section className="cadastro-card">

                <div className="cadastro-symbol">
                    <UserPlus size={30} />
                </div>

                <span className="cadastro-eyebrow">
                    SUA JORNADA COMEÇA AQUI
                </span>

                <h1>
                    Criar conta no
                    <strong> Ordo RPGistas</strong>
                </h1>

                <p>
                    Escolha sua identidade e entre no seu mundo.
                </p>


                <form onSubmit={handleSubmit}>

                    <label>

                        Nome de usuário

                        <input
                            type="text"
                            required
                            minLength="3"
                            value={username}
                            onChange={event => {
                                setUsername(
                                    event.target.value
                                );
                            }}
                            placeholder="Este nome será sua identidade"
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
                            placeholder="Crie uma senha"
                        />

                    </label>


                    <p className="cadastro-warning">
                        Nesta versão, os dados são armazenados
                        apenas no navegador para teste da interface.
                    </p>


                    <button
                        type="submit"
                        className="cadastro-submit"
                    >
                        Criar minha conta
                    </button>

                </form>


                <div className="cadastro-footer">

                    Já possui uma conta?

                    <button
                        type="button"
                        onClick={onLogin}
                    >
                        Entrar
                    </button>

                </div>

            </section>

        </main>

    );

}
