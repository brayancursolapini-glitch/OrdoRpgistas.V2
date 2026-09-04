import "./Landing.css";
import { Sparkles, Sword, Shield, ArrowRight, UserPlus } from "lucide-react";

export default function Landing({ onNavigate, setPage }) {
  const navigateTo = (page) => {
    // Compatibilidade com diferentes versões do App.jsx
    if (typeof onNavigate === "function") {
      onNavigate(page);
      return;
    }

    if (typeof setPage === "function") {
      setPage(page);
      return;
    }

    // Fallback caso o App utilize eventos personalizados
    window.dispatchEvent(
      new CustomEvent("ordo:navigate", {
        detail: { page },
      })
    );
  };

  return (
    <main className="landing-page">
      {/* =========================
          FUNDOS
      ========================== */}

      <section className="landing-side landing-dnd">
        <div className="landing-background-overlay" />

        <div className="landing-system-content landing-system-left">
          <span className="landing-eyebrow">
            <Sword size={13} />
            UM MUNDO DE AVENTURAS
          </span>

          <h1>
            DUNGEONS
            <br />
            <span>&amp; DRAGONS</span>
          </h1>

          <p>Reinos, aventuras e lendas aguardam.</p>

          <span className="landing-system-tag">
            <span className="landing-tag-dot" />
            SISTEMA D&amp;D
          </span>
        </div>
      </section>

      <section className="landing-side landing-ordem">
        <div className="landing-background-overlay" />

        <div className="landing-system-content landing-system-right">
          <span className="landing-eyebrow">
            <Shield size={13} />
            A REALIDADE NÃO É O QUE PARECE
          </span>

          <h1>
            ORDEM
            <br />
            <span>PARANORMAL</span>
          </h1>

          <p>O paranormal observa cada movimento.</p>

          <span className="landing-system-tag">
            <span className="landing-tag-dot" />
            SISTEMA ORDEM
          </span>
        </div>
      </section>

      {/* =========================
          CONTORNO MÁGICO
      ========================== */}

      <div className="landing-magic-border" />

      {/* =========================
          DIVISÓRIA MÁGICA
      ========================== */}

      <div className="landing-magic-divider">
        <div className="magic-divider-core" />

        <span className="magic-particle particle-1" />
        <span className="magic-particle particle-2" />
        <span className="magic-particle particle-3" />
        <span className="magic-particle particle-4" />
        <span className="magic-particle particle-5" />
        <span className="magic-particle particle-6" />
        <span className="magic-particle particle-7" />
        <span className="magic-particle particle-8" />
      </div>

      {/* =========================
          PAINEL CENTRAL
      ========================== */}

      <section className="landing-panel">
        <div className="landing-panel-glow" />

        <div className="landing-panel-content">
          <Sparkles className="landing-panel-icon" size={22} />

          <span className="landing-panel-kicker">
            SEU MUNDO ESTÁ PRONTO
          </span>

          <h2>
            ORDO
            <strong>RPGISTAS</strong>
          </h2>

          <p className="landing-panel-description">
            Escolha um sistema, reúna sua mesa e comece uma nova história.
          </p>

          <div className="landing-panel-system">
            <div className="landing-panel-system-icon">
              <Sparkles size={16} />
            </div>

            <div>
              <span>SEU MUNDO INICIA UMA</span>
              <strong>AVENTURA COMEÇA AQUI</strong>
            </div>
          </div>

          <div className="landing-panel-actions">
            <button
              type="button"
              className="landing-enter-button"
              onClick={() => navigateTo("login")}
            >
              <span>Entrar</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="landing-register-button"
              onClick={() => navigateTo("cadastro")}
            >
              <UserPlus size={16} />
              <span>Criar conta</span>
            </button>
          </div>

          <small>Onde histórias ganham vida.</small>
        </div>
      </section>

      {/* =========================
          TEXTO INFERIOR
      ========================== */}

      <div className="landing-footer-text">
        ORDO RPGISTAS · DOIS MUNDOS. INFINITAS HISTÓRIAS.
      </div>
    </main>
  );
}
