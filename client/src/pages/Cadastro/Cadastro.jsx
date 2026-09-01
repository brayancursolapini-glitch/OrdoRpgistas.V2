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

import MagicalButton
    from "../../components/Buttons/MagicalButton";

import "./Cadastro.css";


export default function Cadastro({

    onBack,
    onLogin,
    onRegisterSuccess,

}) {

    const {
        register,
    } = useUser();


    const [
        name,
        setName,
    ] = useState("");


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


        register({

            name,
            username,
            email,

        });


        if (onRegisterSuccess) {

            onRegisterSuccess();

        }

    }


    return (

        <main
            className="register-page"
        >

            <div
                className="register-background"
            />


            <section
                className="register-card"
            >

                <button

                    type="button"

                    className="register-back"

                    onClick={onBack}

                >

                    <ArrowLeft
                        size={18}
                    />

                    Voltar

                </button>


                <div
                    className="register-icon"
                >

                    <UserPlus
                        size={26}
                    />

                </div>


                <span
                    className="register-eyebrow"
                >

                    COMECE SUA JORNADA

                </span>


                <h1>

                    Crie sua conta
                    <strong>
                        RPGista
                    </strong>

                </h1>


                <form
                    onSubmit={handleSubmit}
                >

                    <label>

                        Nome

                        <input

                            value={name}

                            onChange={event => {

                                setName(
                                    event.target.value
                                );

                            }}

                            required

                        />

                    </label>


                    <label>

                        Nome de usuário

                        <input

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

                        Criar minha conta

                    </MagicalButton>

                </form>


                <p
                    className="register-switch"
                >

                    Já possui uma conta?

                    <button

                        type="button"

                        onClick={onLogin}

                    >

                        Entrar

                    </button>

                </p>

            </section>

        </main>

    );

}
