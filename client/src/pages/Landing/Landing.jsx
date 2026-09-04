import { ArrowRight, UserPlus, Sparkles } from "lucide-react";

import "./Landing.css";

export default function Landing({ setCurrentPage }) {
  const goToPage = (page) => {
    if (typeof setCurrentPage === "function") {
      setCurrentPage(page);
    }
  };

  return (
    <main className="landing-page">
      {/* Fundo D&D */}
      <section className="landing-side landing-dnd">
        <div className="landing-overlay" />

        <div className="landing-theme-content landing-theme-left">
          <span className="landing-eyebrow">
            UM MUNDO DE AVENTURAS
          </span>

          <h1>
            DUNGEONS
            <br />
            <span>&amp;</span>
            <br />
            DRAGONS
          </h1>

          <p>
            Reinos, aventuras e lendas aguardam.
          </p>

          <span className="landing-system">
            ◈ SISTEMA D&amp;D
          </span>
        </div>
      </section>

      {/* Fundo Ordem */}
      <section className="landing-side landing-ordem">
        <div className="landing-overlay" />

        <div className="landing-theme-content landing-theme-right">
          <span className="landing-eyebrow">
            A REALIDADE NÃO É O QUE PARECE
          </span>

          <h1>
            ORDEM
            <br />
            PARANORMAL
          </h1>

          <p>
            O paranormal observa cada movimento.
          </p>

          <span className="landing-system">
            ◈ SISTEMA ORDEM
          </span>
        </div>
      </section>

      {/* Partículas mágicas */}
      <div className="landing-magic-particles">
        {Array.from({ length: 35 }).map((_, index) => (
          <span
            className="landing-particle"
            key={index}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Divisória mágica */}
      <div className="landing-magic-divider">
        <div className="landing-divider-glow" />

        {Array.from({ length: 20 }).map((_, index) => (
          <span
            className="landing-divider-particle"
            key={index}
            style={{
              top: `${index * 5}%`,
              animationDelay: `${index * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Contorno mágico */}
      <div className="landing-magic-border" />

      {/* Painel */}
      <section className="landing-panel-wrapper">
        <div className="landing-panel">
          <Sparkles
            className="landing-panel-icon"
            size={22}
          />

          <span className="landing-panel-small-title">
            SEU MUNDO ESTÁ PRONTO
          </span>

          <h2>
            ORDO<span>RPGISTAS</span>
          </h2>

          <p className="landing-panel-description">
            Escolha um sistema, reúna sua mesa e comece uma nova história.
          </p>

          <div className="landing-panel-divider" />

          <p className="landing-panel-highlight">
            SEU MUNDO INICIA
            <strong> SUA AVENTURA COMEÇA AQUI</strong>
          </p>

          <button
            type="button"
            className="landing-enter-button"
            onClick={() => goToPage("login")}
          >
            <span>Entrar</span>

            <ArrowRight size={17} />
          </button>

          <button
            type="button"
            className="landing-register-button"
            onClick={() => goToPage("cadastro")}
          >
            <UserPlus size={16} />

            <span>Criar conta</span>
          </button>

          <small>
            Onde histórias ganham vida.
          </small>
        </div>
      </section>

      {/* Rodapé */}
      <div className="landing-footer">
        ORDO RPGISTAS · DOIS MUNDOS. INFINITAS HISTÓRIAS.
      </div>
    </main>
  );
}
