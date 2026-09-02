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
        form,
        setForm,
    ] = useState({

        name:
            "",

        username:
            "",

        email:
            "",

        password:
            "",

    });


    const [
        error,
        setError,
    ] = useState(
        ""
    );


    function updateField(
        field,
        value
    ) {

        setForm(
            current => ({

                ...current,

                [field]:
                    value,

            })
        );

    }


    function handleSubmit(
        event
    ) {

        event.preventDefault();


        if (
            !form.name.trim() ||
            !form.username.trim() ||
            !form.email.trim() ||
            !form.password.trim()
        ) {

            setError(
                "Preencha todos os campos."
            );

            return;

        }


        register({

            name:
                form.name.trim(),

            username:
                form.username.trim(),

            email:
                form.email.trim(),

        });


        onRegisterSuccess();

    }


    return (

        <main
            className="cadastro-page"
        >

            <section
                className="cadastro-card"
            >

                <button

                    type="button"

                    className="cadastro-back"

                    onClick={
                        onBack
                    }

                >

                    <ArrowLeft
                        size={18}
                    />

                    Voltar

                </button>


                <UserPlus
                    className="cadastro-icon"
                    size={32}
                />


                <span>

                    INICIE SUA JORNADA

                </span>


                <h1>

                    Criar conta

                </h1>


                <p>

                    Seu nome de usuário será
                    sua identidade dentro do
                    Ordo RPGistas.

                </p>


                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <label>

                        Nome

                        <input

                            value={
                                form.name
                            }

                            onChange={
                                event => {

                                    updateField(
                                        "name",
                                        event.target.value
                                    );

                                }
                            }

                            placeholder="Seu nome"

                        />

                    </label>


                    <label>

                        Nome de usuário

                        <input

                            value={
                                form.username
                            }

                            onChange={
                                event => {

                                    updateField(
                                        "username",
                                        event.target.value
                                    );

                                }
                            }

                            placeholder="Ex: MestreBrayan"

                        />

                    </label>


                    <label>

                        Email

                        <input

                            type="email"

                            value={
                                form.email
                            }

                            onChange={
                                event => {

                                    updateField(
                                        "email",
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
                                form.password
                            }

                            onChange={
                                event => {

                                    updateField(
                                        "password",
                                        event.target.value
                                    );

                                }
                            }

                            placeholder="Crie uma senha"

                        />

                    </label>


                    {

                        error && (

                            <p
                                className="cadastro-error"
                            >

                                {error}

                            </p>

                        )

                    }


                    <MagicalButton
                        type="submit"
                    >

                        Criar minha conta

                    </MagicalButton>

                </form>


                <p
                    className="cadastro-login"
                >

                    Já possui uma conta?

                    <button

                        type="button"

                        onClick={
                            onLogin
                        }

                    >

                        Entrar

                    </button>

                </p>

            </section>

        </main>

    );

}
