import { useState } from "react";
import {
  ArrowLeft,
  UserPlus,
} from "lucide-react";

import "./Cadastro.css";

export default function Cadastro({ setCurrentPage }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    alert("Conta criada com sucesso!");

    setCurrentPage("home");
  };

  return (
    <main className="cadastro-page">
      <div className="cadastro-background" />

      <section className="cadastro-container">
        <button
          type="button"
          className="cadastro-back-button"
          onClick={() =>
            setCurrentPage("landing")
          }
        >
          <ArrowLeft size={18} />

          Voltar
        </button>

        <div className="cadastro-card">
          <span className="cadastro-eyebrow">
            COMECE SUA HISTÓRIA
          </span>

          <h1>
            Criar
            <span> Conta</span>
          </h1>

          <p>
            Seu mundo está esperando por você.
          </p>

          <form onSubmit={handleRegister}>
            <label>
              Nome de usuário

              <input
                type="text"
                placeholder="Escolha seu nome"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
              />
            </label>

            <label>
              E-mail

              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </label>

            <label>
              Senha

              <input
                type="password"
                placeholder="Crie uma senha"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />
            </label>

            <button
              type="submit"
              className="cadastro-submit-button"
            >
              <UserPlus size={18} />

              Criar conta
            </button>
          </form>

          <div className="cadastro-login">
            <span>Já possui uma conta?</span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage("login")
              }
            >
              Entrar
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
