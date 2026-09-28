import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
    Shield,
    Plus,
    Search,
    Sword,
    Sparkles,
    MoreVertical,
    Edit3,
    Trash2,
    BookOpen,
    UserRound,
} from "lucide-react";

import PageBase from "../PageBase";

import "./Personagens.css";

export default function Personagens({ onNavigate }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("todos");

    /*
     * Por enquanto os personagens ficam em memória.
     * Na próxima etapa vamos ligar isso ao sistema real
     * de criação e salvamento de personagens.
     */
    const [characters, setCharacters] = useState([]);

    const filteredCharacters = useMemo(() => {
        return characters.filter((character) => {
            const matchesSearch =
                character.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                character.system
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesFilter =
                filter === "todos" ||
                character.systemId === filter;

            return matchesSearch && matchesFilter;
        });
    }, [characters, search, filter]);

    function handleCreateCharacter() {
        /*
         * Próxima etapa:
         * abrir o criador de personagem.
         */
        console.log("Abrir criador de personagem");
    }

    function handleDeleteCharacter(id) {
        const confirmed = window.confirm(
            "Deseja realmente excluir este personagem?"
        );

        if (!confirmed) return;

        setCharacters((current) =>
            current.filter((character) => character.id !== id)
        );
    }

    return (
        <PageBase
            title="Meus Personagens"
            subtitle="Crie, organize e acompanhe seus personagens em todos os seus sistemas de RPG."
            icon={Shield}
            onNavigate={onNavigate}
        >
            <div className="personagens-page">

                {/* CABEÇALHO DA PÁGINA */}
                <section className="personagens-toolbar">

                    <div className="personagens-toolbar-info">
                        <span className="personagens-section-label">
                            SUA COLEÇÃO
                        </span>

                        <h2>
                            Personagens
                            <span>{characters.length}</span>
                        </h2>

                        <p>
                            Seus aventureiros ficam reunidos aqui.
                        </p>
                    </div>

                    <motion.button
                        type="button"
                        className="personagens-create-button"
                        onClick={handleCreateCharacter}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Plus size={19} />
                        <span>Criar personagem</span>
                    </motion.button>

                </section>

                {/* FILTROS */}
                <section className="personagens-controls">

                    <div className="personagens-search">

                        <Search size={18} />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Buscar personagem..."
                        />

                        {search && (
                            <button
                                type="button"
                                className="personagens-search-clear"
                                onClick={() => setSearch("")}
                            >
                                ×
                            </button>
                        )}

                    </div>

                    <div className="personagens-filters">

                        <button
                            type="button"
                            className={
                                filter === "todos"
                                    ? "active"
                                    : ""
                            }
                            onClick={() => setFilter("todos")}
                        >
                            Todos
                        </button>

                        <button
                            type="button"
                            className={
                                filter === "dnd"
                                    ? "active"
                                    : ""
                            }
                            onClick={() => setFilter("dnd")}
                        >
                            <Sword size={15} />
                            D&D
                        </button>

                        <button
                            type="button"
                            className={
                                filter === "ordem"
                                    ? "active"
                                    : ""
                            }
                            onClick={() => setFilter("ordem")}
                        >
                            <Shield size={15} />
                            Ordem
                        </button>

                    </div>

                </section>

                {/* PERSONAGENS */}
                {filteredCharacters.length > 0 ? (

                    <section className="personagens-grid">

                        {filteredCharacters.map((character) => (

                            <motion.article
                                key={character.id}
                                className={`personagem-card personagem-card-${character.systemId}`}
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    duration: 0.35,
                                }}
                            >

                                <div className="personagem-card-top">

                                    <div className="personagem-avatar">
                                        {character.avatar ? (
                                            <img
                                                src={character.avatar}
                                                alt={character.name}
                                            />
                                        ) : (
                                            <UserRound size={30} />
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        className="personagem-menu-button"
                                        aria-label="Opções do personagem"
                                    >
                                        <MoreVertical size={19} />
                                    </button>

                                </div>

                                <div className="personagem-card-info">

                                    <span className="personagem-system">
                                        {character.system}
                                    </span>

                                    <h3>{character.name}</h3>

                                    <p>
                                        {character.race ||
                                            "Personagem"}
                                        {character.class
                                            ? ` • ${character.class}`
                                            : ""}
                                    </p>

                                </div>

                                <div className="personagem-card-stats">

                                    <div>
                                        <span>NÍVEL</span>
                                        <strong>
                                            {character.level || 1}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>STATUS</span>
                                        <strong>
                                            {character.status ||
                                                "Ativo"}
                                        </strong>
                                    </div>

                                </div>

                                <div className="personagem-card-actions">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            console.log(
                                                "Abrir personagem",
                                                character.id
                                            )
                                        }
                                    >
                                        <BookOpen size={16} />
                                        Abrir ficha
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            console.log(
                                                "Editar personagem",
                                                character.id
                                            )
                                        }
                                    >
                                        <Edit3 size={16} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteCharacter(
                                                character.id
                                            )
                                        }
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                </div>

                            </motion.article>

                        ))}

                    </section>

                ) : (

                    /* ESTADO VAZIO */
                    <motion.section
                        className="personagens-empty"
                        initial={{
                            opacity: 0,
                            scale: 0.98,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: 0.4,
                        }}
                    >

                        <div className="personagens-empty-symbol">
                            <Sparkles size={32} />
                        </div>

                        <span className="personagens-empty-label">
                            SUA AVENTURA COMEÇA AQUI
                        </span>

                        <h2>
                            Nenhum personagem ainda
                        </h2>

                        <p>
                            Crie seu primeiro personagem e comece
                            a construir sua história dentro do
                            Ordo RPGistas.
                        </p>

                        <button
                            type="button"
                            className="personagens-empty-button"
                            onClick={handleCreateCharacter}
                        >
                            <Plus size={18} />
                            Criar meu primeiro personagem
                        </button>

                    </motion.section>

                )}

                {/* INFORMAÇÕES */}
                <section className="personagens-footer-info">

                    <div className="personagens-footer-icon">
                        <Sparkles size={18} />
                    </div>

                    <div>
                        <strong>
                            Seus personagens, suas histórias.
                        </strong>

                        <span>
                            Em breve você poderá criar fichas
                            completas para D&D, Ordem Paranormal
                            e outros sistemas.
                        </span>
                    </div>

                </section>

            </div>
        </PageBase>
    );
}
