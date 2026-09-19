import { useState } from "react";
import { ArrowLeft, LogIn } from "lucide-react";

import "./Login.css";

export default function Login({ setCurrentPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const goToPage = (page) => {
    if (typeof setCurrentPage === "function") {
      setCurrentPage(page);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    goToPage("home");
  };

  return (
    <main className="login-page">

      {/* Fundo */}
      <div className="login-background" />

      {/* Escurecimento */}
      <div className="login-overlay" />

      {/* Partículas */}
      <div className="login-particles">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="login-particle"
            style={{
              left: `${(index * 43) % 100}%`,
              top: `${(index * 67) % 100}%`,
              animationDelay: `${(index % 6) * 0.8}s`,
            }}
          />
        ))}
      </div>

      <section className="login-container">

        <button
          type="button"
          className="login-back-button"
          onClick={() => goToPage("landing")}
        >
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </button>

        <div className="login-card">

          <div className="login-card-glow" />

          <span className="login-eyebrow">
            BEM-VINDO DE VOLTA
          </span>

          <h1>
            Entrar no
            <span> ORDO RPGISTAS</span>
          </h1>

          <p className="login-description">
            Continue sua jornada e retorne à sua mesa.
          </p>

          <div className="login-divider" />

          <form onSubmit={handleLogin}>

            <label className="login-field">
              <span>Usuário ou E-mail</span>

              <input
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                autoComplete="username"
              />
            </label>

            <label className="login-field">
              <span>Senha</span>

              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
              />
            </label>

            <button
              type="submit"
              className="login-submit-button"
            >
              <LogIn size={18} />

              <span>Entrar</span>
            </button>

          </form>

          <div className="login-register">

            <span>
              Ainda não possui uma conta?
            </span>

            <button
              type="button"
              onClick={() => goToPage("cadastro")}
            >
              Criar conta
            </button>

          </div>

          <small className="login-footer-text">
            Onde histórias ganham vida.
          </small>

        </div>

      </section>

    </main>
  );
}
