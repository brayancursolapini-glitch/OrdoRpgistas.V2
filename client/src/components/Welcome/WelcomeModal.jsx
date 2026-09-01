import {
    Sparkles,
    X,
} from "lucide-react";

import "./WelcomeModal.css";


export default function WelcomeModal({
    open,
    onClose,
}) {

    if (!open) {
        return null;
    }


    return (

        <div className="welcome-modal-backdrop">

            <section
                className="welcome-modal"
                role="dialog"
                aria-modal="true"
            >

                <button
                    type="button"
                    className="welcome-modal-close"
                    onClick={onClose}
                    aria-label="Fechar"
                >

                    <X size={20} />

                </button>


                <Sparkles
                    className="welcome-modal-icon"
                    size={34}
                />

                <span>
                    O QUE É RPG?
                </span>

                <h2>
                    Uma história onde
                    <strong> você decide.</strong>
                </h2>

                <p>
                    RPG de mesa é uma aventura colaborativa.
                    Você cria um personagem, toma decisões,
                    enfrenta desafios e ajuda a construir uma
                    história junto com outras pessoas.
                </p>

                <p>
                    No Ordo RPGistas você poderá organizar
                    campanhas, personagens, mapas e ferramentas
                    para tornar sua mesa mais imersiva.
                </p>

                <button
                    type="button"
                    className="welcome-modal-action"
                    onClick={onClose}
                >
                    Quero começar
                </button>

            </section>

        </div>

    );

}
