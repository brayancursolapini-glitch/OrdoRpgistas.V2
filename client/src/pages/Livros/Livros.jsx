import { BookOpen } from "lucide-react";

import PageBase from "../PageBase";
import "../page-placeholder.css";

export default function Livros({ onNavigate }) {
    return (
        <PageBase
            title="Livros"
            subtitle="Consulte materiais e conteúdos dos seus sistemas de RPG."
            icon={BookOpen}
            onNavigate={onNavigate}
        >
            <div className="page-placeholder">
                <BookOpen size={42} />

                <h2>Biblioteca</h2>

                <p>
                    Os livros e materiais de RPG ficarão disponíveis aqui.
                </p>
            </div>
        </PageBase>
    );
}
