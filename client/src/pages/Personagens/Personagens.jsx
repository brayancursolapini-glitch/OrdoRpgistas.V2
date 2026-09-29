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
    Crown,
    Dice5,
} from "lucide-react";

import PageBase from "../PageBase";

import "./Personagens.css";

export default function Personagens({ onNavigate }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("todos");

    const [characters, setCharacters] = useState([]);

    // Controle da janela de escolha do sistema
    const [showSystemSelector, setShowSystemSelector] = useState(false);

    // Sistema escolhido para criação
    const [selectedSystem, setSelectedSystem] = useState(null);

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

    /*
     * Abre a escolha de sistema.
     */
    function handleCreateCharacter() {
        setSelectedSystem(null);
        setShowSystemSelector(true);
    }

    /*
     * Fecha a escolha de sistema.
     */
    function handleCloseSystemSelector() {
        setShowSystemSelector(false);
        setSelectedSystem(null);
    }

    /*
     * Seleciona o sistema para criação.
     */
    function handleSelectSystem(system) {
        setSelectedSystem(system);
    }

    /*
     * Continua para o criador do personagem.
     *
     * Nesta etapa estamos preparando a estrutura.
     * O próximo passo será colocar aqui o criador
     * completo de D&D 5e e, depois, Ordem Paranormal.
     */
    function handleContinueToCreator() {
        if (!selectedSystem) return;

        if (selectedSystem === "dnd") {
            console.log("Abrir criador de personagem D&D 5e");
            return;
        }

        if (selectedSystem === "ordem") {
            console.log("Abrir criador de personagem Ordem Paranormal");
        }
    }

    /*
     * Exclui um personagem.
     */
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
                                            aria-label="Editar personagem"
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
                                            aria-label="Excluir personagem"
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
                        RODAPÉ INFORMATIVO
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
                SELETOR DE SISTEMA
            ========================================================== */}

            <AnimatePresence>
                {showSystemSelector && (
                    <motion.div
                        className="personagens-system-modal"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        onClick={handleCloseSystemSelector}
                    >

                        <motion.div
                            className="personagens-system-modal-content"
                            initial={{
                                opacity: 0,
                                scale: 0.94,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.94,
                                y: 20,
                            }}
                            transition={{
                                duration: 0.3,
                            }}
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            {/* =================================================
                                CABEÇALHO DO MODAL
                            ================================================== */}

                            <div className="personagens-system-modal-header">

                                <div>
                                    <span>
                                        NOVA AVENTURA
                                    </span>

                                    <h2>
                                        Escolha seu sistema
                                    </h2>

                                    <p>
                                        Cada sistema terá sua própria
                                        ficha, regras, atributos,
                                        habilidades e mecânicas.
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

                            {/* =================================================
                                SISTEMAS
                            ================================================== */}

                            <div className="personagens-system-options">

                                {/* =================================================
                                    D&D
                                ================================================== */}

                                <button
                                    type="button"
                                    className={`personagens-system-option personagens-system-option-dnd ${
                                        selectedSystem === "dnd"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleSelectSystem("dnd")
                                    }
                                >

                                    <div className="personagens-system-option-icon">
                                        <Sword size={28} />
                                    </div>

                                    <div className="personagens-system-option-info">

                                        <span>
                                            SISTEMA
                                        </span>

                                        <h3>
                                            Dungeons & Dragons
                                        </h3>

                                        <p>
                                            Crie seu aventureiro,
                                            escolha sua raça,
                                            classe, antecedente
                                            e construa sua ficha.
                                        </p>

                                    </div>

                                    <ChevronRight
                                        className="personagens-system-option-arrow"
                                        size={22}
                                    />

                                </button>

                                {/* =================================================
                                    ORDEM PARANORMAL
                                ================================================== */}

                                <button
                                    type="button"
                                    className={`personagens-system-option personagens-system-option-ordem ${
                                        selectedSystem === "ordem"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleSelectSystem("ordem")
                                    }
                                >

                                    <div className="personagens-system-option-icon">
                                        <Shield size={28} />
                                    </div>

                                    <div className="personagens-system-option-info">

                                        <span>
                                            SISTEMA
                                        </span>

                                        <h3>
                                            Ordem Paranormal
                                        </h3>

                                        <p>
                                            Crie um agente e prepare
                                            sua ficha para enfrentar
                                            o paranormal.
                                        </p>

                                    </div>

                                    <ChevronRight
                                        className="personagens-system-option-arrow"
                                        size={22}
                                    />

                                </button>

                                {/* =================================================
                                    FUTUROS SISTEMAS
                                ================================================== */}

                                <div className="personagens-system-coming">

                                    <div className="personagens-system-coming-icon">
                                        <Dice5 size={21} />
                                    </div>

                                    <div>
                                        <strong>
                                            Outros sistemas
                                        </strong>

                                        <span>
                                            One Piece, Jujutsu Kaisen
                                            e outros sistemas poderão
                                            ser adicionados futuramente.
                                        </span>
                                    </div>

                                </div>

                            </div>

                            {/* =================================================
                                RODAPÉ DO MODAL
                            ================================================== */}

                            <div className="personagens-system-modal-footer">

                                <div className="personagens-system-selected">

                                    {selectedSystem ? (
                                        <>
                                            <Sparkles size={16} />

                                            <span>
                                                Sistema selecionado:{" "}
                                                <strong>
                                                    {selectedSystem ===
                                                    "dnd"
                                                        ? "D&D 5e"
                                                        : "Ordem Paranormal"}
                                                </strong>
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Crown size={16} />

                                            <span>
                                                Selecione um sistema
                                                para continuar.
                                            </span>
                                        </>
                                    )}

                                </div>

                                <button
                                    type="button"
                                    className="personagens-system-continue"
                                    disabled={!selectedSystem}
                                    onClick={
                                        handleContinueToCreator
                                    }
                                >
                                    Continuar
                                    <ChevronRight size={18} />
                                </button>

                            </div>

                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
