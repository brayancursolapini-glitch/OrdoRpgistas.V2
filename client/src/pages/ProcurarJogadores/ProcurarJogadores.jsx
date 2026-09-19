import { Search } from "lucide-react";

import PageBase from "../PageBase";

export default function ProcurarJogadores({ onNavigate }) {
    return (
        <PageBase
            title="Procurar jogadores"
            subtitle="Encontre pessoas para formar novas mesas."
            icon={Search}
            onNavigate={onNavigate}
        >
            <div className="page-placeholder">
                <Search size={42} />

                <h2>Encontrar jogadores</h2>

                <p>
                    O sistema de busca de jogadores será desenvolvido aqui.
                </p>
            </div>
        </PageBase>
    );
}
