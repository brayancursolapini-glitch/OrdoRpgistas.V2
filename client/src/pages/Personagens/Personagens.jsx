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

    /*
     * Compatibilidade com fichas antigas que possam ter
     * sido salvas antes de possuírem um ID.
     */
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

    return {
        ...character,

        id: getCharacterId(character),

        name:
            character.name ||
            "Personagem sem nome",

        system:
            character.system ||
            "dnd",

        systemName:
            character.systemName ||
            "DUNGEONS & DRAGONS",

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

export default function Personagens({ onNavigate }) {
    const [characters, setCharacters] = useState(
        []
    );

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState(
        "todos"
    );

    const [
        showSystemSelector,
        setShowSystemSelector,
    ] = useState(false);

    /*
     * CARREGA AS FICHAS SALVAS ASSIM QUE A PÁGINA
     * DE PERSONAGENS É ABERTA.
     */
    useEffect(() => {
        const storedCharacters =
            loadCharacters();

        const normalizedCharacters =
            storedCharacters
                .map(normalizeCharacter)
                .filter(Boolean);

        setCharacters(
            normalizedCharacters
        );

        /*
         * Caso existam fichas antigas sem ID,
         * normalizamos e salvamos novamente.
         */
        if (
            normalizedCharacters.length !==
                storedCharacters.length ||
            normalizedCharacters.some(
                (character, index) =>
                    character.id !==
                    storedCharacters[index]?.id
            )
        ) {
            saveCharacters(
                normalizedCharacters
            );
        }
    }, []);

    /*
     * Mantém a lista sincronizada quando outra parte
     * do site alterar o localStorage e disparar o
     * evento "storage".
     */
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
                storedCharacters
                    .map(normalizeCharacter)
                    .filter(Boolean)
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

                /*
                 * IMPORTANTE:
                 * também remove do localStorage.
                 */
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
         * Por enquanto a edição completa ainda
         * não está conectada ao criador.
         *
         * Mantemos a função para não quebrar
         * o botão existente.
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
        /*
         * Guarda a ficha que o usuário selecionou
         * para que outras telas possam utilizá-la.
         */
        try {
            sessionStorage.setItem(
                "ordo-rpgistas-personagem-selecionado",
                JSON.stringify(character)
            );
        } catch (error) {
            console.error(
                "Não foi possível selecionar o personagem:",
                error
            );
        }

        /*
         * No momento, a abertura da ficha é
         * representada pelo console e pelo alerta.
         *
         * A ficha completa poderá ser conectada
         * depois ao visualizador/editor.
         */
        console.log(
            "Abrir ficha:",
            character
        );

        alert(
            `Ficha de ${character.name} selecionada.`
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
                            SEU ARQUIVO DE AVENTUREIROS
                        </span>

                        <h2>
                            {characters.length ===
                            0
                                ? "Nenhum personagem ainda"
                                : `${characters.length} personagem${
                                      characters.length >
                                      1
                                          ? "s"
                                          : ""
                                  }`}
                        </h2>

                        <p>
                            Crie fichas para suas
                            aventuras de D&D e
                            outros sistemas.
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

                        <span>
                            Criar personagem
                        </span>
                    </button>
                </motion.section>

                {/* FILTROS */}

                <motion.section
                    className="personagens-filters"
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.1,
                    }}
                >
                    <div className="personagens-search">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Pesquisar personagem..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target
                                        .value
                                )
                            }
                        />

                        {search && (
                            <button
                                type="button"
                                className="personagens-search-clear"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                <X size={16} />
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
                            <Sword size={15} />
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
                            <Shield size={15} />
                            Ordem
                        </button>

                    </div>
                </motion.section>

                {/* LISTA */}

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

                                            <div className="personagem-card-system-icon">

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

                                            <span className="personagem-card-system">
                                                {character.systemName ||
                                                    (isDnd
                                                        ? "DUNGEONS & DRAGONS"
                                                        : "ORDEM PARANORMAL")}
                                            </span>

                                            <button
                                                type="button"
                                                className="personagem-card-menu"
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

                                        <div className="personagem-card-main">

                                            <div className="personagem-card-avatar">

                                                <UserRound
                                                    size={
                                                        30
                                                    }
                                                />

                                            </div>

                                            <div className="personagem-card-title">

                                                <h3>
                                                    {character.name ||
                                                        "Personagem sem nome"}
                                                </h3>

                                                <span>
                                                    {character.race ||
                                                        "Raça não definida"}
                                                    {" • "}
                                                    {character.class ||
                                                        "Classe não definida"}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="personagem-card-stats">

                                            <div>
                                                <span>
                                                    NÍVEL
                                                </span>

                                                <strong>
                                                    {character.level ||
                                                        1}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    RAÇA
                                                </span>

                                                <strong>
                                                    {character.race ||
                                                        "—"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    CLASSE
                                                </span>

                                                <strong>
                                                    {character.class ||
                                                        "—"}
                                                </strong>
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
                            {characters.length ===
                            0 ? (
                                <Sparkles
                                    size={32}
                                />
                            ) : (
                                <Search
                                    size={32}
                                />
                            )}
                        </div>

                        <span className="personagens-empty-eyebrow">
                            {characters.length ===
                            0
                                ? "SUA JORNADA COMEÇA AQUI"
                                : "NENHUM RESULTADO"}
                        </span>

                        <h2>
                            {characters.length ===
                            0
                                ? "Crie seu primeiro personagem"
                                : "Nenhum personagem encontrado"}
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

                {/* RODAPÉ INFORMATIVO */}

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

                {/* MODAL DE ESCOLHA DO SISTEMA */}

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
                                    onClick={
                                        closeSystemSelector
                                    }
                                >
                                    <X size={20} />
                                </button>

                            </div>

                            <div className="personagens-system-options">

                                <button
                                    type="button"
                                    className="personagens-system-option personagens-system-option-dnd"
                                    onClick={() =>
                                        handleSelectSystem(
                                            "dnd"
                                        )
                                    }
                                >

                                    <div className="personagens-system-option-icon">
                                        <Sword
                                            size={
                                                26
                                            }
                                        />
                                    </div>

                                    <div>
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
                                    className="personagens-system-option personagens-system-option-ordem"
                                    onClick={() =>
                                        handleSelectSystem(
                                            "ordem"
                                        )
                                    }
                                >

                                    <div className="personagens-system-option-icon">
                                        <Shield
                                            size={
                                                26
                                            }
                                        />
                                    </div>

                                    <div>
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
