import { Users } from "lucide-react";

import PageBase from "../PageBase";
import "../page-placeholder.css";

export default function Grupos({ onNavigate }) {
    return (
        <PageBase
            title="Grupos"
            subtitle="Encontre e organize seus grupos de RPG."
            icon={Users}
            onNavigate={onNavigate}
        >
            <div className="page-placeholder">
                <Users size={42} />

                <h2>Seus grupos</h2>

                <p>
                    Aqui você poderá administrar seus grupos de jogadores.
                </p>
            </div>
        </PageBase>
    );
}
