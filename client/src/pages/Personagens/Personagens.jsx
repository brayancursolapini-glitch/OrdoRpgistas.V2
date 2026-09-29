import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    X,
    ChevronRight,
    Lock,
} from "lucide-react";

import PageBase from "../PageBase";

import "./Personagens.css";

export default function Personagens({ onNavigate }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("todos");

    const [characters, setCharacters] = useState([]);

    const [showSystemSelector, setShowSystemSelector] = useState(false);

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
        setShowSystemSelector(true);
    }

    function handleCloseSystemSelector() {
        setShowSystemSelector(false);
    }

    function handleSelectSystem(system) {
        if (system === "dnd") {
            console.log("Abrir criador D&D 5e");

            // Próximo passo:
            // abrir o criador completo de D&D 5e.
            setShowSystemSelector(false);

            return;
        }

        if (system === "ordem") {
            console.log("Abrir criador Ordem Paranormal");

            // Futuramente:
            // abrir o criador completo de Ordem Paranormal.
            setShowSystemSelector(false);

            return;
        }
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
        <>
            <PageBase
                title="Meus Personagens"
                subtitle="Crie, organize e acompanhe seus personagens em todos os seus sistemas de RPG."
                icon={Shield}
                onNavigate={onNavigate}
            >
                <div className="personagens-page">

                    {/* =====================================================
                        CABEÇALHO
                    ====================================================== */}

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


                    {/* =====================================================
                        BUSCA E FILTROS
                    ====================================================== */}

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


                    {/* =====================================================
                        PERSONAGENS
                    ====================================================== */}

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

                                        <h3>
                                            {character.name}
                                        </h3>

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


                    {/* =====================================================
                        RODAPÉ
                    ====================================================== */}

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


            {/* =========================================================
                MODAL — ESCOLHA DO SISTEMA
            ========================================================== */}

            <AnimatePresence>

                {showSystemSelector && (

                    <motion.div
                        className="personagens-system-modal-overlay"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        onMouseDown={(event) => {
                            if (
                                event.target === event.currentTarget
                            ) {
                                handleCloseSystemSelector();
                            }
                        }}
                    >

                        <motion.div
                            className="personagens-system-modal"
                            initial={{
                                opacity: 0,
                                y: 25,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 20,
                                scale: 0.96,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                        >

                            {/* CABEÇALHO DO MODAL */}

                            <div className="personagens-system-modal-header">

                                <div>

                                    <span>
                                        NOVO PERSONAGEM
                                    </span>

                                    <h2>
                                        Escolha seu sistema
                                    </h2>

                                    <p>
                                        Cada sistema possui suas próprias
                                        regras, mecânicas e ficha.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="personagens-system-modal-close"
                                    onClick={
                                        handleCloseSystemSelector
                                    }
                                    aria-label="Fechar"
                                >
                                    <X size={20} />
                                </button>

                            </div>


                            {/* SISTEMAS */}

                            <div className="personagens-system-options">

                                {/* =================================================
                                    D&D
                                ================================================== */}

                                <motion.button
                                    type="button"
                                    className="personagens-system-card personagens-system-card-dnd"
                                    onClick={() =>
                                        handleSelectSystem("dnd")
                                    }
                                    whileHover={{
                                        y: -4,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                >

                                    <div className="personagens-system-card-icon">
                                        <Sword size={30} />
                                    </div>


                                    <div className="personagens-system-card-content">

                                        <span>
                                            D&D 5e
                                        </span>

                                        <h3>
                                            Dungeons & Dragons
                                        </h3>

                                        <p>
                                            Crie um aventureiro,
                                            escolha sua raça,
                                            classe e construa sua ficha.
                                        </p>

                                    </div>


                                    <ChevronRight
                                        className="personagens-system-card-arrow"
                                        size={22}
                                    />

                                </motion.button>


                                {/* =================================================
                                    ORDEM PARANORMAL
                                ================================================== */}

                                <motion.button
                                    type="button"
                                    className="personagens-system-card personagens-system-card-ordem"
                                    onClick={() =>
                                        handleSelectSystem("ordem")
                                    }
                                    whileHover={{
                                        y: -4,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                >

                                    <div className="personagens-system-card-icon">
                                        <Shield size={30} />
                                    </div>


                                    <div className="personagens-system-card-content">

                                        <span>
                                            ORDEM PARANORMAL
                                        </span>

                                        <h3>
                                            Investigação e horror
                                        </h3>

                                        <p>
                                            Crie seu agente e prepare-se
                                            para enfrentar o paranormal.
                                        </p>

                                    </div>


                                    <ChevronRight
                                        className="personagens-system-card-arrow"
                                        size={22}
                                    />

                                </motion.button>


                                {/* =================================================
                                    OUTROS SISTEMAS
                                ================================================== */}

                                <div className="personagens-system-card personagens-system-card-disabled">

                                    <div className="personagens-system-card-icon">
                                        <Lock size={27} />
                                    </div>


                                    <div className="personagens-system-card-content">

                                        <span>
                                            EM DESENVOLVIMENTO
                                        </span>

                                        <h3>
                                            Outros sistemas
                                        </h3>

                                        <p>
                                            One Piece, Jujutsu Kaisen
                                            e outros sistemas chegarão
                                            futuramente.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* RODAPÉ DO MODAL */}

                            <div className="personagens-system-modal-footer">

                                <Sparkles size={16} />

                                <span>
                                    Cada sistema terá seu próprio
                                    criador de personagem.
                                </span>

                            </div>

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>
        </>
    );
}
