import { Crown } from "lucide-react";

import PageBase from "../PageBase";
import "../page-placeholder.css";

export default function Campanhas({ onNavigate }) {
    return (
        <PageBase
            title="Campanhas"
            subtitle="Crie e participe de aventuras com seu grupo."
            icon={Crown}
            onNavigate={onNavigate}
        >
            <div className="page-placeholder">

                <Crown size={42} />

                <h2>
                    Suas campanhas
                </h2>

                <p>
                    Aqui ficarão suas campanhas,
                    mestres e grupos de aventura.
                </p>

            </div>
        </PageBase>
    );
}
