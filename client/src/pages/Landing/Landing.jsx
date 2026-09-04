import { useState } from "react";
import { ArrowLeft, LogIn } from "lucide-react";

import "./Login.css";

export default function Login({ setCurrentPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    setCurrentPage("home");
  };

  return (
    <main className="login-page">
      <div className="login-background" />

      <section className="login-container">
        <button
          type="button"
          className="login-back-button"
          onClick={() => setCurrentPage("landing")}
        >
          <ArrowLeft size={18} />

          Voltar
        </button>

        <div className="login-card">
          <span className="login-eyebrow">
            BEM-VINDO DE VOLTA
          </span>

          <h1>
            Entrar no
            <span> ORDO RPGISTAS</span>
          </h1>

          <p>
            Continue sua jornada e retorne à sua mesa.
          </p>

          <form onSubmit={handleLogin}>
            <label>
              Usuário ou E-mail

              <input
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
              />
            </label>

            <label>
              Senha

              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />
            </label>

            <button
              type="submit"
              className="login-submit-button"
            >
              <LogIn size={18} />

              Entrar
            </button>
          </form>

          <div className="login-register">
            <span>Ainda não possui uma conta?</span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage("cadastro")
              }
            >
              Criar conta
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
