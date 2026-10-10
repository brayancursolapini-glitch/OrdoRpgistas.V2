import { useEffect, useMemo, useState } from "react";
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

const STORAGE_KEY = "ordo-rpgistas-personagens";

const EDITING_KEY = "ordo-rpgistas-personagem-editando";

const SELECTED_CHARACTER_KEY =
    "ordo-rpgistas-personagem-selecionado";

function loadCharacters() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed;
    } catch (error) {
        console.error(
            "Não foi possível carregar os personagens:",
            error
        );

        return [];
    }
}

function saveCharacters(characters) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(characters)
        );

        return true;
    } catch (error) {
        console.error(
            "Não foi possível salvar os personagens:",
            error
        );

        return false;
    }
}

function getCharacterId(character) {
    if (character?.id) {
        return String(character.id);
    }

    return [
        character?.name || "personagem",
        character?.createdAt || "",
        character?.system || "dnd",
    ].join("-");
}

function normalizeCharacter(character) {
    if (!character || typeof character !== "object") {
        return null;
    }

    const normalizedSystem =
        character.system === "dnd5e"
            ? "dnd"
            : character.system === "ordem" ||
                character.system === "ordem-paranormal"
              ? "ordem"
              : "dnd";

    const normalizedSystemName =
        character.systemName ||
        (normalizedSystem === "ordem"
            ? "ORDEM PARANORMAL"
            : "DUNGEONS & DRAGONS");

    return {
        ...character,

        id: getCharacterId(character),

        name: character.name || "Personagem sem nome",

        system: normalizedSystem,

        systemName: normalizedSystemName,

        level: Number(character.level) || 1,

        race:
            character.race ||
            character.origem ||
            "Não definida",

        class:
            character.class ||
            character.classe ||
            "Não definida",

        background:
            character.background ||
            character.trilha ||
            "",

        createdAt:
            character.createdAt ||
            new Date().toISOString(),
    };
}

function normalizeCharacters(characters) {
    if (!Array.isArray(characters)) {
        return [];
    }

    return characters
        .map(normalizeCharacter)
        .filter(Boolean);
}

function getCharacterSystem(character) {
    return character?.system === "ordem"
        ? "ordem"
        : "dnd";
}

function getCharacterProgress(character) {
    if (getCharacterSystem(character) === "ordem") {
        const nex = character.nex;

        if (
            nex !== undefined &&
            nex !== null &&
            String(nex).trim() !== ""
        ) {
            const nexText = String(nex);

            return nexText.includes("%")
                ? `NEX ${nexText}`
                : `NEX ${nexText}%`;
        }

        return "NEX não definido";
    }

    return `Nível ${character.level || 1}`;
}

function getCharacterDescription(character) {
    if (getCharacterSystem(character) === "ordem") {
        const origem =
            character.origem ||
            character.race ||
            "Origem não definida";

        const trilha =
            character.trilha ||
            character.background ||
            "";

        const classe =
            character.classe ||
            character.class ||
            "Classe não definida";

        const details = [origem, classe];

        if (trilha && trilha !== classe) {
            details.push(trilha);
        }

        return details.join(" • ");
    }

    return `${character.race || "Raça não definida"} • ${
        character.class || "Classe não definida"
    }`;
}

export default function Personagens({ onNavigate }) {
    const [characters, setCharacters] = useState([]);

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("todos");

    const [
        showSystemSelector,
        setShowSystemSelector,
    ] = useState(false);

    useEffect(() => {
        const storedCharacters = loadCharacters();

        const normalizedCharacters =
            normalizeCharacters(storedCharacters);

        setCharacters(normalizedCharacters);

        /*
         * Normaliza fichas antigas sem alterar
         * os atributos específicos de cada sistema.
         */
        if (
            JSON.stringify(normalizedCharacters) !==
            JSON.stringify(storedCharacters)
        ) {
            saveCharacters(normalizedCharacters);
        }
    }, []);

    useEffect(() => {
        function handleStorageChange(event) {
            if (event.key !== STORAGE_KEY) {
                return;
            }

            setCharacters(
                normalizeCharacters(loadCharacters())
            );
        }

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };
    }, []);

    const filteredCharacters = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return characters.filter((character) => {
            const searchableFields = [
                character.name,
                character.systemName,
                character.class,
                character.classe,
                character.race,
                character.origem,
                character.background,
                character.trilha,
            ];

            const matchesSearch =
                !normalizedSearch ||
                searchableFields.some((field) =>
                    String(field || "")
                        .toLowerCase()
                        .includes(normalizedSearch)
                );

            const matchesFilter =
                filter === "todos" ||
                getCharacterSystem(character) === filter;

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
        setShowSystemSelector(false);

        localStorage.removeItem(EDITING_KEY);

        if (system === "dnd") {
            onNavigate?.("criar-personagem");
            return;
        }

        if (system === "ordem") {
            onNavigate?.("criar-personagem-ordem");
        }
    }

    function handleDeleteCharacter(id) {
        const character = characters.find(
            (item) => String(item.id) === String(id)
        );

        if (!character) {
            return;
        }

        const confirmed = window.confirm(
            `Deseja realmente excluir o personagem "${character.name}"?`
        );

        if (!confirmed) {
            return;
        }

        setCharacters((currentCharacters) => {
            const updatedCharacters = currentCharacters.filter(
                (item) => String(item.id) !== String(id)
            );

            saveCharacters(updatedCharacters);

            return updatedCharacters;
        });
    }

    function handleEditCharacter(character) {
        if (!character) {
            return;
        }

        localStorage.setItem(
            EDITING_KEY,
            String(character.id)
        );

        if (getCharacterSystem(character) === "ordem") {
            onNavigate?.("criar-personagem-ordem");
            return;
        }

        onNavigate?.("criar-personagem");
    }

    function handleOpenCharacter(character) {
        try {
            sessionStorage.setItem(
                SELECTED_CHARACTER_KEY,
                JSON.stringify(character)
            );

            /*
             * A visualização completa da ficha será
             * conectada quando criarmos a tela de
             * consulta de personagens.
             */
            alert(`Ficha de "${character.name}" selecionada.`);
        } catch (error) {
            console.error(
                "Não foi possível selecionar a ficha:",
                error
            );
        }
    }

    return (
        <PageBase
            title="Personagens"
            subtitle="Crie, organize e gerencie seus aventureiros."
            icon={UserRound}
            onNavigate={onNavigate}
        >
            <div className="personagens-page">
                <motion.section
                    className="personagens-toolbar"
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                >
                    <div className="personagens-toolbar-text">
                        <span>SEUS AVENTUREIROS</span>

                        <h2>Personagens salvos</h2>

                        <p>
                            Todas as suas fichas organizadas em um
                            só lugar.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="personagens-create-button"
                        onClick={openCharacterCreator}
                    >
                        <Plus size={18} />
                        Criar personagem
                    </button>
                </motion.section>

                <section className="personagens-filters">
                    <div className="personagens-search">
                        <Search size={17} />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Pesquisar personagem..."
                        />

                        {search && (
                            <button
                                type="button"
                                className="personagens-search-clear"
                                onClick={() => setSearch("")}
                                title="Limpar pesquisa"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    <div className="personagens-filter-buttons">
                        <button
                            type="button"
                            className={filter === "todos" ? "active" : ""}
                            onClick={() => setFilter("todos")}
                        >
                            Todos
                        </button>

                        <button
                            type="button"
                            className={filter === "dnd" ? "active" : ""}
                            onClick={() => setFilter("dnd")}
                        >
                            <Sword size={14} />
                            D&D
                        </button>

                        <button
                            type="button"
                            className={
                                filter === "ordem" ? "active" : ""
                            }
                            onClick={() => setFilter("ordem")}
                        >
                            <Shield size={14} />
                            Ordem
                        </button>
                    </div>
                </section>

                {filteredCharacters.length > 0 ? (
                    <section className="personagens-grid">
                        {filteredCharacters.map(
                            (character, index) => {
                                const isDnd =
                                    getCharacterSystem(character) ===
                                    "dnd";

                                return (
                                    <motion.article
                                        key={character.id}
                                        className={`personagem-card ${
                                            isDnd
                                                ? "personagem-card-dnd"
                                                : "personagem-card-ordem"
                                        }`}
                                        initial={{
                                            opacity: 0,
                                            y: 20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.05,
                                        }}
                                    >
                                        <div className="personagem-card-top">
                                            <div className="personagem-system-icon">
                                                {isDnd ? (
                                                    <Sword size={20} />
                                                ) : (
                                                    <Shield size={20} />
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                className="personagem-more"
                                                onClick={() =>
                                                    handleEditCharacter(
                                                        character
                                                    )
                                                }
                                                title="Editar personagem"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>

                                        <div className="personagem-card-content">
                                            <span className="personagem-system">
                                                {character.systemName}
                                            </span>

                                            <h3>{character.name}</h3>

                                            <p>
                                                {getCharacterDescription(
                                                    character
                                                )}
                                            </p>

                                            <div className="personagem-level">
                                                <span>
                                                    {getCharacterProgress(
                                                        character
                                                    )}
                                                </span>

                                                <span>
                                                    {isDnd
                                                        ? character.background ||
                                                          "Antecedente não definido"
                                                        : character.trilha ||
                                                          character.background ||
                                                          "Trilha não definida"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="personagem-card-actions">
                                            <button
                                                type="button"
                                                className="personagem-card-open"
                                                onClick={() =>
                                                    handleOpenCharacter(
                                                        character
                                                    )
                                                }
                                            >
                                                <BookOpen size={15} />
                                                Abrir ficha
                                            </button>

                                            <button
                                                type="button"
                                                className="personagem-card-edit"
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
                                                className="personagem-card-delete"
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
                                );
                            }
                        )}
                    </section>
                ) : (
                    <motion.section
                        className="personagens-empty"
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                    >
                        <div className="personagens-empty-icon">
                            <UserRound size={34} />
                        </div>

                        <span className="personagens-empty-eyebrow">
                            NENHUMA FICHA ENCONTRADA
                        </span>

                        <h2>
                            {characters.length === 0
                                ? "Sua aventura começa aqui."
                                : "Nenhum personagem corresponde à pesquisa."}
                        </h2>

                        <p>
                            {characters.length === 0
                                ? "Escolha um sistema, construa seu aventureiro e prepare-se para entrar em uma nova história."
                                : "Tente alterar a pesquisa ou o filtro selecionado para encontrar sua ficha."}
                        </p>

                        {characters.length === 0 && (
                            <button
                                type="button"
                                className="personagens-empty-button"
                                onClick={openCharacterCreator}
                            >
                                <Plus size={18} />
                                Criar meu primeiro personagem
                            </button>
                        )}
                    </motion.section>
                )}

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
                                Fichas organizadas conforme o sistema
                                de cada personagem.
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
                                equipamentos e informações da
                                aventura.
                            </p>
                        </div>
                    </article>
                </section>

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
                            <div className="personagens-modal-header">
                                <div>
                                    <span>NOVA AVENTURA</span>

                                    <h2>Escolha o sistema</h2>

                                    <p>
                                        Selecione o sistema que deseja
                                        usar para criar sua ficha.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="personagens-modal-close"
                                    onClick={closeSystemSelector}
                                    title="Fechar"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="personagens-system-options">
                                <button
                                    type="button"
                                    className="personagens-system-choice personagens-system-choice-dnd"
                                    onClick={() =>
                                        handleSelectSystem("dnd")
                                    }
                                >
                                    <div className="personagens-system-choice-icon">
                                        <Sword size={26} />
                                    </div>

                                    <div className="personagens-system-choice-content">
                                        <span>DUNGEONS & DRAGONS</span>

                                        <strong>D&D 5e</strong>

                                        <p>
                                            Crie um aventureiro para
                                            explorar reinos, masmorras
                                            e grandes aventuras.
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    className="personagens-system-choice personagens-system-choice-ordem"
                                    onClick={() =>
                                        handleSelectSystem("ordem")
                                    }
                                >
                                    <div className="personagens-system-choice-icon">
                                        <Shield size={26} />
                                    </div>

                                    <div className="personagens-system-choice-content">
                                        <span>ORDEM PARANORMAL</span>

                                        <strong>
                                            Ordem Paranormal RPG
                                        </strong>

                                        <p>
                                            Crie seu agente,
                                            configure atributos,
                                            perícias e NEX para
                                            enfrentar o paranormal.
                                        </p>
                                    </div>
                                </button>
                            </div>

                            <div className="personagens-modal-footer">
                                <Sparkles size={15} />

                                <span>
                                    Mais sistemas poderão ser
                                    adicionados futuramente.
                                </span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </PageBase>
    );
}
