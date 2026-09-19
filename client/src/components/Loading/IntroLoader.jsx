import { useEffect, useState } from "react";

import "./IntroLoader.css";

export default function IntroLoader({ onFinish }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const closeTimer = setTimeout(() => {
      setClosing(true);
    }, 1500);

    const finishTimer = setTimeout(() => {
      if (typeof onFinish === "function") {
        onFinish();
      }
    }, 1850);

    return () => {
      clearTimeout(closeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`intro-loader ${
        closing ? "intro-loader-closing" : ""
      }`}
    >
      <div className="intro-loader-dnd" />
      <div className="intro-loader-ordem" />

      <div className="intro-loader-overlay" />

      <div className="intro-loader-content">

        <div className="intro-loader-symbol">
          ✦
        </div>

        <span className="intro-loader-small">
          UM MUNDO DE AVENTURAS
        </span>

        <h1>
          ORDO
          <span>RPGISTAS</span>
        </h1>

        <p>
          PREPARANDO SUA AVENTURA
        </p>

        <div className="intro-loader-line">
          <span />
        </div>

        <small>
          Onde histórias ganham vida.
        </small>

      </div>
    </div>
  );
}
