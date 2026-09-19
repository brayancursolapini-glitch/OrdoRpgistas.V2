import { Shield } from "lucide-react";

import PageBase from "../PageBase";

import "./Personagens.css";

export default function Personagens({ onNavigate }) {
    return (
        <PageBase
            title="Personagens"
            subtitle="Crie, organize e gerencie seus personagens de RPG."
            icon={Shield}
            onNavigate={onNavigate}
        >
            <div className="personagens-grid">
                <div className="personagens-empty">
                    <Shield size={42} />

                    <h2>Nenhum personagem ainda</h2>

                    <p>
                        Em breve você poderá criar personagens
                        para os diferentes sistemas de RPG.
                    </p>

                    <button type="button">
                        Criar personagem
                    </button>
                </div>
            </div>
        </PageBase>
    );
}
