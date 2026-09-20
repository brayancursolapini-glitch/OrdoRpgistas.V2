import { Map } from "lucide-react";

import PageBase from "../PageBase";
import "../page-placeholder.css";

export default function Mapas({ onNavigate }) {
    return (
        <PageBase
            title="Mapas"
            subtitle="Explore e organize mapas para suas aventuras."
            icon={Map}
            onNavigate={onNavigate}
        >
            <div className="page-placeholder">
                <Map size={42} />

                <h2>Biblioteca de mapas</h2>

                <p>
                    O sistema de mapas será desenvolvido aqui.
                </p>
            </div>
        </PageBase>
    );
}
