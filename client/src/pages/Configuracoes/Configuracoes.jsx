import { Settings } from "lucide-react";

import PageBase from "../PageBase";
import "../page-placeholder.css";

export default function Configuracoes({ onNavigate }) {
    return (
        <PageBase
            title="Configurações"
            subtitle="Personalize sua experiência no Ordo RPGistas."
            icon={Settings}
            onNavigate={onNavigate}
        >
            <div className="page-placeholder">
                <Settings size={42} />

                <h2>Configurações</h2>

                <p>
                    Preferências da conta, aparência e outras opções
                    ficarão disponíveis aqui.
                </p>
            </div>
        </PageBase>
    );
}
