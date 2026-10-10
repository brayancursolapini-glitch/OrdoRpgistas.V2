import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Save,
    Shield,
    UserRound,
    Heart,
    Brain,
    Zap,
    Plus,
    Trash2,
} from "lucide-react";

import PageBase from "../PageBase";

import "./CriarPersonagemOrdem.css";

const STORAGE_KEY = "ordo-rpgistas-personagens";
const EDITING_KEY = "ordo-rpgistas-personagem-editando";

const ORIGENS = [
    "Acadêmico",
    "Agente de Saúde",
    "Amnésico",
    "Artista",
    "Atleta",
    "Chef",
    "Criminoso",
    "Cultista Arrependido",
    "Desgarrado",
    "Engenheiro",
    "Executivo",
    "Investigador",
    "Lutador",
    "Magnata",
    "Militar",
    "Operário",
    "Policial",
    "Religioso",
    "Servidor Público",
    "Teórico da Conspiração",
    "T.I.",
    "Trabalhador Rural",
    "Universitário",
];

const CLASSES = [
    "Combatente",
    "Especialista",
    "Ocultista",
];

const TRILHAS = {
    Combatente: [
        "Aniquilador",
        "Comandante de Campo",
        "Guerreiro",
        "Operações Especiais",
        "Tropa de Choque",
    ],
    Especialista: [
        "Atirador de Elite",
        "Infiltrador",
        "Médico de Campo",
        "Negociador",
        "Técnico",
    ],
    Ocultista: [
        "Conduíte",
        "Flagelador",
        "Graduado",
        "Intuitivo",
        "Lâmina Paranormal",
    ],
};

const ATRIBUTOS = [
    "Agilidade",
    "Força",
    "Intelecto",
    "Presença",
    "Vigor",
];

const PERICIAS = [
    "Acrobacia",
    "Adestramento",
    "Artes",
    "Atletismo",
    "Atualidades",
    "Ciências",
    "Crime",
    "Diplomacia",
    "Enganação",
    "Fortitude",
    "Furtividade",
    "Iniciativa",
    "Intimidação",
    "Intuição",
    "Investigação",
    "Luta",
    "Medicina",
    "Ocultismo",
    "Percepção",
    "Pilotagem",
    "Pontaria",
    "Profissão",
    "Reflexos",
    "Religião",
    "Sobrevivência",
    "Tática",
    "Tecnologia",
    "Vontade",
];

function createEmptyCharacter() {
    return {
        name: "",
        system: "ordem",
        systemName: "ORDEM PARANORMAL",
        nex: 5,
        origem: "",
        classe: "",
        trilha: "",
        patente: "Recruta",
        atributos: {
            Agilidade: 1,
            Força: 1,
            Intelecto: 1,
            Presença: 1,
            Vigor: 1,
        },
        pericias: [],
        pv: 0,
        pe: 0,
        san: 0,
        defesa: 10,
        inventory: "",
        historia: "",
        anotacoes: "",
    };
}

function loadCharacters() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Erro ao carregar personagens:", error);
        return [];
    }
}

export default function CriarPersonagemOrdem({ onNavigate }) {
    const [character, setCharacter] = useState(createEmptyCharacter);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const id = localStorage.getItem(EDITING_KEY);

        if (!id) {
            return;
        }

        const existing = loadCharacters().find(
            (item) =>
                String(item.id) === String(id) &&
                (item.system === "ordem" ||
                    item.system === "ordem-paranormal")
        );

        if (!existing) {
            return;
        }

        setEditingId(String(existing.id));

        setCharacter({
            ...createEmptyCharacter(),
            ...existing,
            system: "ordem",
            systemName: "ORDEM PARANORMAL",
            atributos: {
                ...createEmptyCharacter().atributos,
                ...(existing.atributos || {}),
            },
            pericias: Array.isArray(existing.pericias)
                ? existing.pericias
                : [],
        });
    }, []);

    function updateField(field, value) {
        setCharacter((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function updateAttribute(attribute, value) {
        setCharacter((current) => ({
            ...current,
            atributos: {
                ...current.atributos,
                [attribute]: Number(value),
            },
        }));
    }

    function togglePericia(pericia) {
        setCharacter((current) => {
            const selected = current.pericias.includes(pericia);

            return {
                ...current,
                pericias: selected
                    ? current.pericias.filter(
                          (item) => item !== pericia
                      )
                    : [...current.pericias, pericia],
            };
        });
    }

    function handleClassChange(value) {
        setCharacter((current) => ({
            ...current,
            classe: value,
            trilha: "",
        }));
    }

    function validate() {
        const nextErrors = {};

        if (!character.name.trim()) {
            nextErrors.name = "Informe o nome do agente.";
        }

        if (!character.origem) {
            nextErrors.origem = "Selecione uma origem.";
        }

        if (!character.classe) {
            nextErrors.classe = "Selecione uma classe.";
        }

        if (
            character.trilha &&
            !TRILHAS[character.classe]?.includes(character.trilha)
        ) {
            nextErrors.trilha =
                "Selecione uma trilha válida para a classe.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    }

    function handleSave(event) {
        event.preventDefault();

        if (!validate()) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
            return;
        }

        const characters = loadCharacters();

        const now = new Date().toISOString();

        const savedCharacter = {
            ...character,
            id: editingId || `ordem-${Date.now()}`,
            name: character.name.trim(),
            system: "ordem",
            systemName: "ORDEM PARANORMAL",
            level: 1,
            race: character.origem,
            class: character.classe,
            background: character.trilha,
            createdAt:
                editingId
                    ? character.createdAt || now
                    : now,
            updatedAt: now,
        };

        const updatedCharacters = editingId
            ? characters.map((item) =>
                  String(item.id) === String(editingId)
                      ? savedCharacter
                      : item
              )
            : [...characters, savedCharacter];

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updatedCharacters)
            );

            localStorage.removeItem(EDITING_KEY);

            onNavigate?.("personagens");
        } catch (error) {
            console.error("Erro ao salvar personagem:", error);

            window.alert(
                "Não foi possível salvar a ficha. Verifique o armazenamento do navegador."
            );
        }
    }

    function handleCancel() {
        localStorage.removeItem(EDITING_KEY);
        onNavigate?.("personagens");
    }

    return (
        <PageBase
            title="Ordem Paranormal"
            subtitle="Crie e configure seu agente."
            icon={Shield}
            onNavigate={onNavigate}
        >
            <div className="ordem-creator">
                <motion.div
                    className="ordem-creator-heading"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <span className="ordem-eyebrow">
                            ARQUIVO DA ORDO REALITAS
                        </span>

                        <h1>
                            {editingId
                                ? "Editar agente"
                                : "Novo agente"}
                        </h1>

                        <p>
                            Registre os dados do seu personagem e
                            prepare-se para investigar o paranormal.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="ordem-secondary-button"
                        onClick={handleCancel}
                    >
                        <ArrowLeft size={17} />
                        Voltar
                    </button>
                </motion.div>

                <form
                    className="ordem-form"
                    onSubmit={handleSave}
                >
                    <section className="ordem-panel">
                        <div className="ordem-section-title">
                            <UserRound size={19} />

                            <div>
                                <h2>Identificação</h2>
                                <p>Informações principais do agente.</p>
                            </div>
                        </div>

                        <div className="ordem-form-grid">
                            <label className="ordem-field ordem-field-wide">
                                <span>Nome do agente *</span>

                                <input
                                    value={character.name}
                                    onChange={(event) =>
                                        updateField(
                                            "name",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Nome do personagem"
                                />

                                {errors.name && (
                                    <small>{errors.name}</small>
                                )}
                            </label>

                            <label className="ordem-field">
                                <span>Origem *</span>

                                <select
                                    value={character.origem}
                                    onChange={(event) =>
                                        updateField(
                                            "origem",
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Selecione a origem
                                    </option>

                                    {ORIGENS.map((origem) => (
                                        <option
                                            key={origem}
                                            value={origem}
                                        >
                                            {origem}
                                        </option>
                                    ))}
                                </select>

                                {errors.origem && (
                                    <small>{errors.origem}</small>
                                )}
                            </label>

                            <label className="ordem-field">
                                <span>Classe *</span>

                                <select
                                    value={character.classe}
                                    onChange={(event) =>
                                        handleClassChange(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Selecione a classe
                                    </option>

                                    {CLASSES.map((classe) => (
                                        <option
                                            key={classe}
                                            value={classe}
                                        >
                                            {classe}
                                        </option>
                                    ))}
                                </select>

                                {errors.classe && (
                                    <small>{errors.classe}</small>
                                )}
                            </label>

                            <label className="ordem-field">
                                <span>Trilha</span>

                                <select
                                    value={character.trilha}
                                    onChange={(event) =>
                                        updateField(
                                            "trilha",
                                            event.target.value
                                        )
                                    }
                                    disabled={!character.classe}
                                >
                                    <option value="">
                                        Selecione a trilha
                                    </option>

                                    {(TRILHAS[character.classe] || []).map(
                                        (trilha) => (
                                            <option
                                                key={trilha}
                                                value={trilha}
                                            >
                                                {trilha}
                                            </option>
                                        )
                                    )}
                                </select>

                                {errors.trilha && (
                                    <small>{errors.trilha}</small>
                                )}
                            </label>

                            <label className="ordem-field">
                                <span>Patente</span>

                                <select
                                    value={character.patente}
                                    onChange={(event) =>
                                        updateField(
                                            "patente",
                                            event.target.value
                                        )
                                    }
                                >
                                    {[
                                        "Recruta",
                                        "Operador",
                                        "Agente Especial",
                                        "Oficial de Operações",
                                        "Agente de Elite",
                                    ].map((patente) => (
                                        <option
                                            key={patente}
                                            value={patente}
                                        >
                                            {patente}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="ordem-field">
                                <span>NEX (%)</span>

                                <select
                                    value={character.nex}
                                    onChange={(event) =>
                                        updateField(
                                            "nex",
                                            Number(event.target.value)
                                        )
                                    }
                                >
                                    {[
                                        5, 10, 15, 20, 25, 30, 35,
                                        40, 45, 50, 55, 60, 65, 70,
                                        75, 80, 85, 90, 95, 99,
                                    ].map((nex) => (
                                        <option
                                            key={nex}
                                            value={nex}
                                        >
                                            {nex}%
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </section>

                    <section className="ordem-panel">
                        <div className="ordem-section-title">
                            <Zap size={19} />

                            <div>
                                <h2>Atributos</h2>
                                <p>
                                    Configure os cinco atributos do
                                    agente.
                                </p>
                            </div>
                        </div>

                        <div className="ordem-attributes-grid">
                            {ATRIBUTOS.map((attribute) => (
                                <label
                                    className="ordem-attribute"
                                    key={attribute}
                                >
                                    <span>{attribute}</span>

                                    <strong>
                                        {character.atributos[attribute]}
                                    </strong>

                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        value={
                                            character.atributos[
                                                attribute
                                            ]
                                        }
                                        onChange={(event) =>
                                            updateAttribute(
                                                attribute,
                                                event.target.value
                                            )
                                        }
                                    />

                                    <div className="ordem-attribute-controls">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateAttribute(
                                                    attribute,
                                                    Math.max(
                                                        0,
                                                        character
                                                            .atributos[
                                                            attribute
                                                        ] - 1
                                                    )
                                                )
                                            }
                                            aria-label={`Diminuir ${attribute}`}
                                        >
                                            −
                                        </button>

                                        <span>
                                            Valor do atributo
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateAttribute(
                                                    attribute,
                                                    Math.min(
                                                        5,
                                                        character
                                                            .atributos[
                                                            attribute
                                                        ] + 1
                                                    )
                                                )
                                            }
                                            aria-label={`Aumentar ${attribute}`}
                                        >
                                            +
                                        </button>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <p className="ordem-note">
                            Os valores são editáveis para facilitar a
                            montagem da ficha. Confira os limites
                            aplicáveis ao NEX e à criação de personagem
                            na versão do livro que sua mesa utiliza.
                        </p>
                    </section>

                    <section className="ordem-panel">
                        <div className="ordem-section-title">
                            <Heart size={19} />

                            <div>
                                <h2>Recursos e defesa</h2>
                                <p>
                                    Registre os valores atuais da ficha.
                                </p>
                            </div>
                        </div>

                        <div className="ordem-resource-grid">
                            <label className="ordem-resource ordem-resource-pv">
                                <Heart size={18} />
                                <span>Pontos de Vida (PV)</span>

                                <input
                                    type="number"
                                    min="0"
                                    value={character.pv}
                                    onChange={(event) =>
                                        updateField(
                                            "pv",
                                            Math.max(
                                                0,
                                                Number(event.target.value)
                                            )
                                        )
                                    }
                                />
                            </label>

                            <label className="ordem-resource ordem-resource-pe">
                                <Zap size={18} />
                                <span>Pontos de Esforço (PE)</span>

                                <input
                                    type="number"
                                    min="0"
                                    value={character.pe}
                                    onChange={(event) =>
                                        updateField(
                                            "pe",
                                            Math.max(
                                                0,
                                                Number(event.target.value)
                                            )
                                        )
                                    }
                                />
                            </label>

                            <label className="ordem-resource ordem-resource-san">
                                <Brain size={18} />
                                <span>Sanidade (SAN)</span>

                                <input
                                    type="number"
                                    min="0"
                                    value={character.san}
                                    onChange={(event) =>
                                        updateField(
                                            "san",
                                            Math.max(
                                                0,
                                                Number(event.target.value)
                                            )
                                        )
                                    }
                                />
                            </label>

                            <label className="ordem-resource ordem-resource-defense">
                                <Shield size={18} />
                                <span>Defesa</span>

                                <input
                                    type="number"
                                    min="0"
                                    value={character.defesa}
                                    onChange={(event) =>
                                        updateField(
                                            "defesa",
                                            Math.max(
                                                0,
                                                Number(event.target.value)
                                            )
                                        )
                                    }
                                />
                            </label>
                        </div>

                        <p className="ordem-note">
                            PV, PE, SAN e Defesa começam editáveis em
                            branco de regra (valores iniciais zerados
                            para recursos e 10 para Defesa). Preencha
                            conforme a classe, o NEX e as regras da sua
                            ficha.
                        </p>
                    </section>

                    <section className="ordem-panel">
                        <div className="ordem-section-title">
                            <Shield size={19} />

                            <div>
                                <h2>Perícias treinadas</h2>
                                <p>
                                    Selecione as perícias do agente.
                                </p>
                            </div>
                        </div>

                        <div className="ordem-skills-grid">
                            {PERICIAS.map((pericia) => {
                                const checked =
                                    character.pericias.includes(pericia);

                                return (
                                    <label
                                        className={`ordem-skill ${
                                            checked ? "selected" : ""
                                        }`}
                                        key={pericia}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() =>
                                                togglePericia(pericia)
                                            }
                                        />

                                        <span>{pericia}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </section>

                    <section className="ordem-panel">
                        <div className="ordem-section-title">
                            <UserRound size={19} />

                            <div>
                                <h2>Equipamentos e história</h2>
                                <p>
                                    Registre detalhes importantes do
                                    personagem.
                                </p>
                            </div>
                        </div>

                        <label className="ordem-field">
                            <span>Equipamentos e inventário</span>

                            <textarea
                                rows="4"
                                value={character.inventory}
                                onChange={(event) =>
                                    updateField(
                                        "inventory",
                                        event.target.value
                                    )
                                }
                                placeholder="Armas, itens, equipamentos e objetos..."
                            />
                        </label>

                        <label className="ordem-field">
                            <span>História do agente</span>

                            <textarea
                                rows="5"
                                value={character.historia}
                                onChange={(event) =>
                                    updateField(
                                        "historia",
                                        event.target.value
                                    )
                                }
                                placeholder="Origem, motivações e acontecimentos importantes..."
                            />
                        </label>

                        <label className="ordem-field">
                            <span>Anotações</span>

                            <textarea
                                rows="3"
                                value={character.anotacoes}
                                onChange={(event) =>
                                    updateField(
                                        "anotacoes",
                                        event.target.value
                                    )
                                }
                                placeholder="Informações extras da campanha..."
                            />
                        </label>
                    </section>

                    <div className="ordem-form-actions">
                        <button
                            type="button"
                            className="ordem-secondary-button"
                            onClick={handleCancel}
                        >
                            <ArrowLeft size={17} />
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="ordem-save-button"
                        >
                            <Save size={18} />
                            {editingId
                                ? "Salvar alterações"
                                : "Salvar personagem"}
                        </button>
                    </div>
                </form>
            </div>
        </PageBase>
    );
}
