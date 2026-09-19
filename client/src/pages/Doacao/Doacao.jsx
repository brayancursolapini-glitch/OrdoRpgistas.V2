import { Heart } from "lucide-react";

import PageBase from "../PageBase";

export default function Doacao({ onNavigate }) {
    return (
        <PageBase
            title="Doação"
            subtitle="Ajude o Ordo RPGistas a continuar crescendo."
            icon={Heart}
            onNavigate={onNavigate}
        >
            <div className="page-placeholder">
                <Heart size={42} />

                <h2>Apoie o projeto</h2>

                <p>
                    A área de apoio ao projeto será desenvolvida aqui.
                </p>
            </div>
        </PageBase>
    );
}
