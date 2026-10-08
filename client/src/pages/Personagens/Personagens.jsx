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
            : character.system === "ordem"
                ? "ordem"
                : "dnd";

    const normalizedSystemName =
        character.systemName ||
        (
            normalizedSystem === "ordem"
                ? "ORDEM PARANORMAL"
                : "DUNGEONS & DRAGONS"
        );

    return {
        ...character,

        id: getCharacterId(character),

        name:
            character.name ||
            "Personagem sem nome",

        system: normalizedSystem,

        systemName: normalizedSystemName,

        level:
            Number(character.level) || 1,

        race:
            character.race ||
            "Humano",

        class:
            character.class ||
            "Aventureiro",

        background:
            character.background ||
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

export default function Personagens({ onNavigate }) {
    const [characters, setCharacters] = useState([]);

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState(
        "todos"
    );

    const [
        showSystemSelector,
        setShowSystemSelector,
    ] = useState(false);

    useEffect(() => {
        const storedCharacters =
            loadCharacters();

        const normalizedCharacters =
            normalizeCharacters(
                storedCharacters
            );

        setCharacters(
            normalizedCharacters
        );

        /*
         * Salva novamente a versão normalizada.
         *
         * Isso corrige fichas antigas que:
         * - não tinham ID;
         * - usavam system: "dnd5e";
         * - não tinham systemName.
         */
        if (
            JSON.stringify(
                normalizedCharacters
            ) !==
            JSON.stringify(
                storedCharacters
            )
        ) {
            saveCharacters(
                normalizedCharacters
            );
        }
    }, []);

    useEffect(() => {
        function handleStorageChange(event) {
            if (
                event.key !== STORAGE_KEY
            ) {
                return;
            }

            const storedCharacters =
                loadCharacters();

            setCharacters(
                normalizeCharacters(
                    storedCharacters
                )
            );
        }

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };
    }, []);

    const filteredCharacters =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            return characters.filter(
                (character) => {
                    const characterName =
                        String(
                            character.name || ""
                        ).toLowerCase();

                    const systemName =
                        String(
                            character.systemName ||
                                ""
                        ).toLowerCase();

                    const characterClass =
                        String(
                            character.class || ""
                        ).toLowerCase();

                    const characterRace =
                        String(
                            character.race || ""
                        ).toLowerCase();

                    const matchesSearch =
                        !normalizedSearch ||
                        characterName.includes(
                            normalizedSearch
                        ) ||
                        systemName.includes(
                            normalizedSearch
                        ) ||
                        characterClass.includes(
                            normalizedSearch
                        ) ||
                        characterRace.includes(
                            normalizedSearch
                        );

                    const matchesFilter =
                        filter === "todos" ||
                        character.system ===
                            filter;

                    return (
                        matchesSearch &&
                        matchesFilter
                    );
                }
            );
        }, [
            characters,
            search,
            filter,
        ]);

    function openCharacterCreator() {
        setShowSystemSelector(true);
    }

    function closeSystemSelector() {
        setShowSystemSelector(false);
    }

    function handleSelectSystem(system) {
        if (system === "dnd") {
            setShowSystemSelector(false);

            onNavigate?.(
                "criar-personagem"
            );

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
        const character =
            characters.find(
                (item) =>
                    String(item.id) ===
                    String(id)
            );

        if (!character) {
            return;
        }

        const confirmed =
            window.confirm(
                `Deseja realmente excluir o personagem "${character.name}"?`
            );

        if (!confirmed) {
            return;
        }

        setCharacters(
            (currentCharacters) => {
                const updatedCharacters =
                    currentCharacters.filter(
                        (item) =>
                            String(item.id) !==
                            String(id)
                    );

                saveCharacters(
                    updatedCharacters
                );

                return updatedCharacters;
            }
        );
    }

    function handleEditCharacter(
        character
    ) {
        /*
         * A edição completa será conectada
         * posteriormente ao criador.
         */
        console.log(
            "Editar personagem:",
            character
        );

        alert(
            "A edição completa da ficha será conectada ao criador de personagem."
        );
    }

    function handleOpenCharacter(
        character
    ) {
        try {
            sessionStorage.setItem(
                "ordo-rpgistas-personagem-selecionado",
                JSON.stringify(character)
            );

            /*
             * Enquanto a tela completa da ficha
             * não estiver conectada, mostramos
             * uma confirmação simples.
             */
            alert(
                `Ficha de "${character.name}" selecionada.`
            );
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
                        <span>
                            SEUS AVENTUREIROS
                        </span>

                        <h2>
                            Personagens salvos
                        </h2>

                        <p>
                            Todas as suas fichas
                            organizadas em um só
                            lugar.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="personagens-create-button"
                        onClick={
                            openCharacterCreator
                        }
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
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Pesquisar personagem..."
                        />

                        {search && (
                            <button
                                type="button"
                                className="personagens-search-clear"
                                onClick={() =>
                                    setSearch("")
                                }
                                title="Limpar pesquisa"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    <div className="personagens-filter-buttons">

                        <button
                            type="button"
                            className={
                                filter ===
                                "todos"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setFilter(
                                    "todos"
                                )
                            }
                        >
                            Todos
                        </button>

                        <button
                            type="button"
                            className={
                                filter ===
                                "dnd"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setFilter(
                                    "dnd"
                                )
                            }
                        >
                            <Sword size={14} />
                            D&D
                        </button>

                        <button
                            type="button"
                            className={
                                filter ===
                                "ordem"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setFilter(
                                    "ordem"
                                )
                            }
                        >
                            <Shield size={14} />
                            Ordem
                        </button>

                    </div>
                </section>

                {filteredCharacters.length >
                0 ? (
                    <section className="personagens-grid">

                        {filteredCharacters.map(
                            (
                                character,
                                index
                            ) => {
                                const isDnd =
                                    character.system ===
                                    "dnd";

                                return (
                                    <motion.article
                                        key={
                                            character.id ||
                                            `${character.name}-${index}`
                                        }
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
                                            delay:
                                                index *
                                                0.05,
                                        }}
                                    >

                                        <div className="personagem-card-top">

                                            <div className="personagem-system-icon">
                                                {isDnd ? (
                                                    <Sword
                                                        size={
                                                            20
                                                        }
                                                    />
                                                ) : (
                                                    <Shield
                                                        size={
                                                            20
                                                        }
                                                    />
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
                                                title="Opções"
                                            >
                                                <MoreVertical
                                                    size={
                                                        18
                                                    }
                                                />
                                            </button>

                                        </div>

                                        <div className="personagem-card-content">

                                            <span className="personagem-system">
                                                {character.systemName ||
                                                    (isDnd
                                                        ? "DUNGEONS & DRAGONS"
                                                        : "ORDEM PARANORMAL")}
                                            </span>

                                            <h3>
                                                {character.name ||
                                                    "Personagem sem nome"}
                                            </h3>

                                            <p>
                                                {character.race ||
                                                    "Raça não definida"}
                                                {" • "}
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
                                                    {character.background ||
                                                        "Aventureiro"}
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
                                                <BookOpen
                                                    size={
                                                        15
                                                    }
                                                />

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
                                                <Edit3
                                                    size={
                                                        15
                                                    }
                                                />

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
                                                <Trash2
                                                    size={
                                                        15
                                                    }
                                                />

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
                            <UserRound
                                size={34}
                            />
                        </div>

                        <span className="personagens-empty-eyebrow">
                            NENHUMA FICHA ENCONTRADA
                        </span>

                        <h2>
                            {characters.length ===
                            0
                                ? "Sua aventura começa aqui."
                                : "Nenhum personagem corresponde à pesquisa."}
                        </h2>

                        <p>
                            {characters.length ===
                            0
                                ? "Escolha um sistema, construa seu aventureiro e prepare-se para entrar em uma nova história."
                                : "Tente alterar a pesquisa ou o filtro selecionado para encontrar sua ficha."}
                        </p>

                        {characters.length ===
                            0 && (
                            <button
                                type="button"
                                className="personagens-empty-button"
                                onClick={
                                    openCharacterCreator
                                }
                            >
                                <Plus
                                    size={18}
                                />

                                Criar meu primeiro
                                personagem
                            </button>
                        )}
                    </motion.section>
                )}

                <section className="personagens-info-grid">

                    <article className="personagens-info-card">

                        <div className="personagens-info-icon">
                            <BookOpen
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                SISTEMAS
                            </span>

                            <strong>
                                D&D e Ordem
                                Paranormal
                            </strong>

                            <p>
                                Outros sistemas
                                poderão ser
                                adicionados
                                futuramente.
                            </p>
                        </div>

                    </article>

                    <article className="personagens-info-card">

                        <div className="personagens-info-icon">
                            <UserRound
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                SUAS FICHAS
                            </span>

                            <strong>
                                Tudo organizado em
                                um só lugar
                            </strong>

                            <p>
                                Personagens,
                                atributos,
                                equipamentos e
                                informações da
                                aventura.
                            </p>
                        </div>

                    </article>

                </section>

                {showSystemSelector && (
                    <div
                        className="personagens-modal-overlay"
                        onClick={
                            closeSystemSelector
                        }
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
                                    <span>
                                        NOVA AVENTURA
                                    </span>

                                    <h2>
                                        Escolha o sistema
                                    </h2>

                                    <p>
                                        Selecione o
                                        sistema que
                                        deseja usar
                                        para criar
                                        sua ficha.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="personagens-modal-close"
                                    onClick={
                                        closeSystemSelector
                                    }
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
                                        handleSelectSystem(
                                            "dnd"
                                        )
                                    }
                                >

                                    <div className="personagens-system-choice-icon">
                                        <Sword
                                            size={
                                                26
                                            }
                                        />
                                    </div>

                                    <div className="personagens-system-choice-content">

                                        <span>
                                            DUNGEONS &
                                            DRAGONS
                                        </span>

                                        <strong>
                                            D&D 5e
                                        </strong>

                                        <p>
                                            Crie um
                                            aventureiro
                                            para
                                            explorar
                                            reinos,
                                            masmorras e
                                            grandes
                                            aventuras.
                                        </p>

                                    </div>

                                </button>

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
                                        <Shield
                                            size={
                                                26
                                            }
                                        />
                                    </div>

                                    <div className="personagens-system-choice-content">

                                        <span>
                                            ORDEM
                                            PARANORMAL
                                        </span>

                                        <strong>
                                            Ordem
                                            Paranormal
                                        </strong>

                                        <p>
                                            Enfrente o
                                            paranormal
                                            e descubra
                                            o que se
                                            esconde por
                                            trás da
                                            realidade.
                                        </p>

                                    </div>

                                </button>

                            </div>

                            <div className="personagens-modal-footer">

                                <Sparkles
                                    size={15}
                                />

                                <span>
                                    Mais sistemas
                                    poderão ser
                                    adicionados
                                    futuramente.
                                </span>

                            </div>

                        </motion.div>
                    </div>
                )}

            </div>
        </PageBase>
    );
}
