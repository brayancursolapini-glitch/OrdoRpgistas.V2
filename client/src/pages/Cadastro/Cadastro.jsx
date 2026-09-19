import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  UserPlus,
} from "lucide-react";

import "./Cadastro.css";

export default function Cadastro({ setCurrentPage }) {
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [favoriteSystem, setFavoriteSystem] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const goToPage = (page) => {
    if (typeof setCurrentPage === "function") {
      setCurrentPage(page);
    }
  };

  const validateStepOne = () => {
    const newErrors = {};

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    if (!cleanUsername) {
      newErrors.username = "Digite um nome de usuário.";
    } else if (
      !/^[a-zA-Z0-9_.-]{3,20}$/.test(cleanUsername)
    ) {
      newErrors.username =
        "Use de 3 a 20 caracteres: letras, números, . _ ou -.";
    }

    if (!cleanEmail) {
      newErrors.email = "Digite seu e-mail.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      newErrors.email = "Digite um e-mail válido.";
    }

    if (!password) {
      newErrors.password = "Digite uma senha.";
    } else if (password.length < 8) {
      newErrors.password =
        "A senha precisa ter pelo menos 8 caracteres.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Confirme sua senha.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword =
        "As senhas não são iguais.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const goToStepTwo = () => {
    setMessage("");

    if (validateStepOne()) {
      setStep(2);
      setErrors({});
    }
  };

  const finishRegistration = (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!favoriteSystem) {
      newErrors.favoriteSystem =
        "Escolha um sistema para continuar.";
    }

    if (!acceptedTerms) {
      newErrors.acceptedTerms =
        "Você precisa aceitar os termos.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const userData = {
      username: username.trim(),
      email: email.trim(),
      password,
      favoriteSystem,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "ordoRpgistasUser",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "ordoRpgistasLogged",
      "true"
    );

    setMessage("Conta criada com sucesso!");

    setTimeout(() => {
      goToPage("home");
    }, 900);
  };

  return (
    <main className="cadastro-page">
      {/* Fundos */}
      <div className="cadastro-background cadastro-background-dnd" />
      <div className="cadastro-background cadastro-background-ordem" />
      <div className="cadastro-background-overlay" />

      {/* Partículas */}
      <div className="cadastro-particles">
        {Array.from({ length: 30 }).map((_, index) => (
          <span
            key={index}
            className="cadastro-particle"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 61) % 100}%`,
              animationDelay: `${(index % 8) * 0.5}s`,
            }}
          />
        ))}
      </div>

      <section className="cadastro-wrapper">

        {/* Botão voltar */}
        <button
          type="button"
          className="cadastro-back"
          onClick={() => goToPage("landing")}
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="cadastro-card">

          {/* Cabeçalho */}
          <div className="cadastro-header">

            <div className="cadastro-icon">
              <UserPlus size={24} />
            </div>

            <span className="cadastro-eyebrow">
              CRIE SUA IDENTIDADE
            </span>

            <h1>
              Entre para o
              <span> ORDO RPGISTAS</span>
            </h1>

            <p>
              Crie sua conta e prepare-se para
              viver novas histórias.
            </p>
          </div>

          {/* Indicador das etapas */}
          <div className="cadastro-steps">

            <div
              className={`cadastro-step ${
                step >= 1 ? "active" : ""
              }`}
            >
              <span>
                {step > 1 ? <Check size={15} /> : "1"}
              </span>

              <small>
                Sua conta
              </small>
            </div>

            <div
              className={`cadastro-step-line ${
                step >= 2 ? "active" : ""
              }`}
            />

            <div
              className={`cadastro-step ${
                step >= 2 ? "active" : ""
              }`}
            >
              <span>2</span>

              <small>
                Seu sistema
              </small>
            </div>

          </div>

          {message && (
            <div className="cadastro-success">
              <Check size={18} />
              {message}
            </div>
          )}

          {/* ETAPA 1 */}
          {step === 1 && (
            <form
              className="cadastro-form"
              onSubmit={(event) => {
                event.preventDefault();
                goToStepTwo();
              }}
            >

              <div className="cadastro-field">
                <label htmlFor="username">
                  Nome de usuário
                </label>

                <input
                  id="username"
                  type="text"
                  placeholder="Ex.: MestreDoCaos"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  autoComplete="username"
                />

                {errors.username && (
                  <span className="cadastro-error">
                    {errors.username}
                  </span>
                )}
              </div>

              <div className="cadastro-field">
                <label htmlFor="email">
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="seuemail@email.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                />

                {errors.email && (
                  <span className="cadastro-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="cadastro-field">
                <label htmlFor="password">
                  Senha
                </label>

                <div className="cadastro-password">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Mínimo de 8 caracteres"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <span className="cadastro-error">
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="cadastro-field">
                <label htmlFor="confirmPassword">
                  Confirmar senha
                </label>

                <div className="cadastro-password">
                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Digite a senha novamente"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <span className="cadastro-error">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="cadastro-primary-button"
              >
                Continuar
                <ArrowRight size={18} />
              </button>

            </form>
          )}

          {/* ETAPA 2 */}
          {step === 2 && (
            <form
              className="cadastro-form"
              onSubmit={finishRegistration}
            >

              <div className="cadastro-system-title">
                <Sparkles size={18} />

                <div>
                  <strong>
                    Escolha seu universo
                  </strong>

                  <span>
                    Qual sistema combina com você?
                  </span>
                </div>
              </div>

              <div className="cadastro-systems">

                <button
                  type="button"
                  className={`cadastro-system-card ${
                    favoriteSystem === "dnd"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setFavoriteSystem("dnd")
                  }
                >
                  <div className="cadastro-system-image cadastro-system-dnd" />

                  <div className="cadastro-system-info">
                    <strong>
                      Dungeons & Dragons
                    </strong>

                    <span>
                      Fantasia, aventuras e grandes
                      jornadas.
                    </span>
                  </div>

                  {favoriteSystem === "dnd" && (
                    <div className="cadastro-system-check">
                      <Check size={16} />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  className={`cadastro-system-card ${
                    favoriteSystem === "ordem"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setFavoriteSystem("ordem")
                  }
                >
                  <div className="cadastro-system-image cadastro-system-ordem" />

                  <div className="cadastro-system-info">
                    <strong>
                      Ordem Paranormal
                    </strong>

                    <span>
                      Mistério, investigação e
                      o inexplicável.
                    </span>
                  </div>

                  {favoriteSystem === "ordem" && (
                    <div className="cadastro-system-check">
                      <Check size={16} />
                    </div>
                  )}
                </button>

              </div>

              {errors.favoriteSystem && (
                <span className="cadastro-error">
                  {errors.favoriteSystem}
                </span>
              )}

              <label className="cadastro-terms">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(
                      event.target.checked
                    )
                  }
                />

                <span>
                  Eu aceito os termos de uso e
                  concordo com a criação da minha
                  conta.
                </span>
              </label>

              {errors.acceptedTerms && (
                <span className="cadastro-error">
                  {errors.acceptedTerms}
                </span>
              )}

              <div className="cadastro-actions">

                <button
                  type="button"
                  className="cadastro-secondary-button"
                  onClick={() => {
                    setStep(1);
                    setErrors({});
                  }}
                >
                  <ArrowLeft size={17} />
                  Voltar
                </button>

                <button
                  type="submit"
                  className="cadastro-primary-button"
                >
                  <Shield size={17} />
                  Criar conta
                </button>

              </div>

            </form>
          )}

          <div className="cadastro-login">
            <span>
              Já possui uma conta?
            </span>

            <button
              type="button"
              onClick={() => goToPage("login")}
            >
              Entrar
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}
