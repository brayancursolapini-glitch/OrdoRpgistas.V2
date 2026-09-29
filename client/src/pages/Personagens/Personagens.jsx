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
    X,
} from "lucide-react";

import PageBase from "../PageBase";

import "./Personagens.css";

export default function Personagens({ onNavigate }) {
    const [characters, setCharacters] = useState([]);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("todos");

    const [showSystemSelector, setShowSystemSelector] = useState(false);

    const filteredCharacters = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return characters.filter((character) => {
            const matchesSearch =
                !normalizedSearch ||
                character.name.toLowerCase().includes(normalizedSearch) ||
                character.systemName.toLowerCase().includes(normalizedSearch);

            const matchesFilter =
                filter === "todos" ||
                character.system === filter;

            return matchesSearch && matchesFilter;
        });
    }, [characters, search, filter]);

    function openCharacterCreator() {
        setShowSystemSelector(true);
    }

    function closeSystemSelector() {
        setShowSystemSelector(false);
    }

    function handleSelectSystem(system) {
        if (system === "dnd") {
            setShowSystemSelector(false);
            onNavigate?.("criar-personagem");
            return;
        }

        if (system === "ordem") {
            setShowSystemSelector(false);

            alert(
                "O criador de personagem de Ordem Paranormal será desenvolvido em seguida."
            );

            return;
        }
    }

    function handleDeleteCharacter(id) {
        const character = characters.find(
            (item) => item.id === id
        );

        if (!character) return;

        const confirmed = window.confirm(
            `Deseja realmente excluir o personagem "${character.name}"?`
        );

        if (!confirmed) return;

        setCharacters((currentCharacters) =>
            currentCharacters.filter(
                (item) => item.id !== id
            )
        );
    }

    function handleEditCharacter(character) {
        console.log(
            "Editar personagem:",
            character
        );

        alert(
            "A edição completa da ficha será conectada ao criador de personagem."
        );
    }

    return (
        <PageBase
            title="Personagens"
            subtitle="Crie, organize e acompanhe todos os seus personagens."
            icon={Shield}
            onNavigate={onNavigate}
        >
            <div className="personagens-page">

                {/* TOPO */}
                <motion.section
                    className="personagens-toolbar"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="personagens-toolbar-text">
                        <span>SEU ARQUIVO DE AVENTUREIROS</span>

                        <h2>
                            {characters.length === 0
                                ? "Nenhum personagem ainda"
                                : `${characters.length} personagem${characters.length > 1 ? "s" : ""}`}
                        </h2>

                        <p>
                            Crie fichas para suas aventuras de
                            D&D e outros sistemas.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="personagens-create-button"
                        onClick={openCharacterCreator}
                    >
                        <Plus size={18} />
                        <span>Criar personagem</span>
                    </button>
                </motion.section>

                {/* FILTROS */}
                <section className="personagens-filters">

                    <div className="personagens-search">
                        <Search size={18} />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Pesquisar personagem..."
                        />
                    </div>

                    <div className="personagens-filter-buttons">

                        <button
                            type="button"
                            className={
                                filter === "todos"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setFilter("todos")
                            }
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
                            onClick={() =>
                                setFilter("dnd")
                            }
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
                            onClick={() =>
                                setFilter("ordem")
                            }
                        >
                            <Shield size={15} />
                            Ordem
                        </button>

                    </div>
                </section>

                {/* LISTA */}
                {filteredCharacters.length > 0 ? (
                    <section className="personagens-grid">

                        {filteredCharacters.map(
                            (character) => (
                                <motion.article
                                    key={character.id}
                                    className={`personagem-card personagem-card-${character.system}`}
                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                    }}
                                >
                                    <div className="personagem-card-top">

                                        <div className="personagem-system-icon">
                                            {character.system === "dnd" ? (
                                                <Sword size={22} />
                                            ) : (
                                                <Shield size={22} />
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className="personagem-more"
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                    </div>

                                    <div className="personagem-card-content">

                                        <span className="personagem-system">
                                            {character.systemName}
                                        </span>

                                        <h3>
                                            {character.name}
                                        </h3>

                                        <p>
                                            {character.race ||
                                                "Raça não definida"}{" "}
                                            •{" "}
                                            {character.class ||
                                                "Classe não definida"}
                                        </p>

                                        <div className="personagem-level">
                                            <span>
                                                Nível{" "}
                                                {character.level ||
                                                    1}
                                            </span>

                                            <span>
                                                {character.status ||
                                                    "Em aventura"}
                                            </span>
                                        </div>

                                    </div>

                                    <div className="personagem-card-actions">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditCharacter(
                                                    character
                                                )
                                            }
                                        >
                                            <Edit3 size={15} />
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteCharacter(
                                                    character.id
                                                )
                                            }
                                        >
                                            <Trash2 size={15} />
                                            Excluir
                                        </button>

                                    </div>
                                </motion.article>
                            )
                        )}

                    </section>
                ) : (
                    /* ESTADO VAZIO */
                    <motion.section
                        className="personagens-empty"
                        initial={{
                            opacity: 0,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: 0.5,
                        }}
                    >
                        <div className="personagens-empty-icon">
                            <Sparkles size={32} />
                        </div>

                        <span className="personagens-empty-eyebrow">
                            SUA JORNADA COMEÇA AQUI
                        </span>

                        <h2>
                            Crie seu primeiro personagem
                        </h2>

                        <p>
                            Escolha um sistema, construa seu
                            aventureiro e prepare-se para
                            entrar em uma nova história.
                        </p>

                        <button
                            type="button"
                            className="personagens-empty-button"
                            onClick={openCharacterCreator}
                        >
                            <Plus size={18} />
                            Criar meu primeiro personagem
                        </button>
                    </motion.section>
                )}

                {/* RODAPÉ INFORMATIVO */}
                <section className="personagens-info-grid">

                    <article className="personagens-info-card">
                        <div className="personagens-info-icon">
                            <BookOpen size={20} />
                        </div>

                        <div>
                            <span>SISTEMAS</span>
                            <strong>
                                D&D e Ordem Paranormal
                            </strong>
                            <p>
                                Outros sistemas poderão ser
                                adicionados futuramente.
                            </p>
                        </div>
                    </article>

                    <article className="personagens-info-card">
                        <div className="personagens-info-icon">
                            <UserRound size={20} />
                        </div>

                        <div>
                            <span>SUAS FICHAS</span>
                            <strong>
                                Tudo organizado em um só lugar
                            </strong>
                            <p>
                                Personagens, atributos,
                                equipamentos e informações
                                da aventura.
                            </p>
                        </div>
                    </article>

                </section>

                {/* MODAL DE ESCOLHA DO SISTEMA */}
                {showSystemSelector && (
                    <div
                        className="personagens-modal-overlay"
                        onClick={closeSystemSelector}
                    >
                        <motion.div
                            className="personagens-system-modal"
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
                            transition={{
                                duration: 0.25,
                            }}
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <button
                                type="button"
                                className="personagens-modal-close"
                                onClick={closeSystemSelector}
                            >
                                <X size={19} />
                            </button>

                            <div className="personagens-modal-header">
                                <div className="personagens-modal-symbol">
                                    <Sparkles size={22} />
                                </div>

                                <span>
                                    NOVO PERSONAGEM
                                </span>

                                <h2>
                                    Escolha o sistema
                                </h2>

                                <p>
                                    Cada sistema possui suas
                                    próprias regras, atributos
                                    e formas de criação.
                                </p>
                            </div>

                            <div className="personagens-system-options">

                                {/* D&D */}
                                <button
                                    type="button"
                                    className="personagens-system-choice personagens-system-choice-dnd"
                                    onClick={() =>
                                        handleSelectSystem(
                                            "dnd"
                                        )
                                    }
                                >
                                    <div className="personagens-system-choice-icon">
                                        <Sword size={28} />
                                    </div>

                                    <div className="personagens-system-choice-content">
                                        <span>
                                            SISTEMA
                                        </span>

                                        <strong>
                                            Dungeons & Dragons
                                        </strong>

                                        <p>
                                            Crie um personagem
                                            para aventuras de
                                            fantasia.
                                        </p>
                                    </div>

                                    <Plus size={20} />
                                </button>

                                {/* ORDEM */}
                                <button
                                    type="button"
                                    className="personagens-system-choice personagens-system-choice-ordem"
                                    onClick={() =>
                                        handleSelectSystem(
                                            "ordem"
                                        )
                                    }
                                >
                                    <div className="personagens-system-choice-icon">
                                        <Shield size={28} />
                                    </div>

                                    <div className="personagens-system-choice-content">
                                        <span>
                                            SISTEMA
                                        </span>

                                        <strong>
                                            Ordem Paranormal
                                        </strong>

                                        <p>
                                            Entre em uma
                                            realidade onde o
                                            paranormal está
                                            presente.
                                        </p>
                                    </div>

                                    <Plus size={20} />
                                </button>

                            </div>
                        </motion.div>
                    </div>
                )}

            </div>
        </PageBase>
    );
}
