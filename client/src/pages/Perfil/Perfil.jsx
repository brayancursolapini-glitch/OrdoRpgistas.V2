import { UserRound } from "lucide-react";

import PageBase from "../PageBase";

import "./Perfil.css";

export default function Perfil({ onNavigate }) {
    return (
        <PageBase
            title="Perfil"
            subtitle="Seu espaço dentro do Ordo RPGistas."
            icon={UserRound}
            onNavigate={onNavigate}
        >
            <div className="perfil-card">
                <div className="perfil-avatar">
                    <UserRound size={42} />
                </div>

                <div className="perfil-info">
                    <span>AVENTUREIRO</span>

                    <h2>Seu perfil</h2>

                    <p>
                        Aqui ficarão suas informações,
                        personagens, campanhas e atividades.
                    </p>
                </div>
            </div>
        </PageBase>
    );
}
