import { useState } from "react";
import { motion } from "framer-motion";

import {
    ArrowLeft,
    ArrowRight,
    Sword,
    Shield,
    UserRound,
    Sparkles,
    Dices,
    ScrollText,
    Backpack,
    Heart,
    Check,
} from "lucide-react";

import PageBase from "../PageBase";

import "./CriarPersonagem.css";

export default function CriarPersonagem({
    onNavigate,
}) {
    const [currentStep, setCurrentStep] = useState(1);

    const [character, setCharacter] = useState({
        name: "",
        race: "",
        class: "",
        background: "",
        level: 1,

        attributes: {
            forca: 8,
            destreza: 8,
            constituicao: 8,
            inteligencia: 8,
            sabedoria: 8,
            carisma: 8,
        },

        alignment: "",

        concept: "",

        personality: "",
        ideals: "",
        bonds: "",
        flaws: "",

        equipment: "",
        spells: "",
    });

    const steps = [
        {
            id: 1,
            title: "Conceito",
            icon: Sparkles,
        },
        {
            id: 2,
            title: "Raça",
            icon: UserRound,
        },
        {
            id: 3,
            title: "Classe",
            icon: Sword,
        },
        {
            id: 4,
            title: "Antecedente",
            icon: ScrollText,
        },
        {
            id: 5,
            title: "Atributos",
            icon: Dices,
        },
        {
            id: 6,
            title: "Detalhes",
            icon: Shield,
        },
        {
            id: 7,
            title: "Finalizar",
            icon: Check,
        },
    ];

    const races = [
        "Anão",
        "Elfo",
        "Halfling",
        "Humano",
        "Draconato",
        "Gnomo",
        "Meio-Elfo",
        "Meio-Orc",
        "Tiefling",
    ];

    const classes = [
        "Bárbaro",
        "Bardo",
        "Bruxo",
        "Clérigo",
        "Druida",
        "Feiticeiro",
        "Guerreiro",
        "Ladino",
        "Mago",
        "Monge",
        "Paladino",
        "Patrulheiro",
    ];

    const backgrounds = [
        "Acólito",
        "Artesão de Guilda",
        "Artista",
        "Charlatão",
        "Criminoso",
        "Eremita",
        "Herói do Povo",
        "Nobre",
        "Sábio",
        "Soldado",
        "Órfão",
        "Forasteiro",
    ];

    const attributes = [
        {
            id: "forca",
            label: "Força",
            short: "FOR",
        },
        {
            id: "destreza",
            label: "Destreza",
            short: "DES",
        },
        {
            id: "constituicao",
            label: "Constituição",
            short: "CON",
        },
        {
            id: "inteligencia",
            label: "Inteligência",
            short: "INT",
        },
        {
            id: "sabedoria",
            label: "Sabedoria",
            short: "SAB",
        },
        {
            id: "carisma",
            label: "Carisma",
            short: "CAR",
        },
    ];

    const currentStepData = steps.find(
        (step) =>
            step.id === currentStep
    );

    const CurrentStepIcon =
        currentStepData?.icon;

    function updateCharacter(
        field,
        value
    ) {
        setCharacter((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function updateAttribute(
        attribute,
        value
    ) {
        setCharacter((current) => ({
            ...current,

            attributes: {
                ...current.attributes,

                [attribute]:
                    Number(value),
            },
        }));
    }

    function handleNext() {
        if (
            currentStep <
            steps.length
        ) {
            setCurrentStep(
                (current) =>
                    current + 1
            );
        }
    }

    function handlePrevious() {
        if (currentStep > 1) {
            setCurrentStep(
                (current) =>
                    current - 1
            );
        }
    }

    function handleCancel() {
        onNavigate?.(
            "personagens"
        );
    }

    function handleFinish() {
        console.log(
            "Personagem criado:",
            character
        );

        alert(
            `Personagem "${character.name || "Sem nome"}" criado com sucesso!`
        );

        onNavigate?.(
            "personagens"
        );
    }

    function renderStep() {
        switch (currentStep) {
            case 1:
                return (
                    <div className="criar-step-content">

                        <div className="criar-step-intro">
                            <span>
                                PASSO 1
                            </span>

                            <h2>
                                Comece sua aventura
                            </h2>

                            <p>
                                Defina o conceito
                                básico do seu
                                personagem antes
                                de escolher os
                                detalhes da ficha.
                            </p>
                        </div>

                        <div className="criar-form-grid">

                            <div className="criar-form-group criar-form-full">
                                <label>
                                    Nome do personagem
                                </label>

                                <input
                                    type="text"
                                    value={
                                        character.name
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateCharacter(
                                            "name",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Ex.: Arthen, Lyra, Kael..."
                                />
                            </div>

                            <div className="criar-form-group">
                                <label>
                                    Nível
                                </label>

                                <select
                                    value={
                                        character.level
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateCharacter(
                                            "level",
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                >
                                    {Array.from(
                                        {
                                            length: 20,
                                        },
                                        (
                                            _,
                                            index
                                        ) => (
                                            <option
                                                key={
                                                    index +
                                                    1
                                                }
                                                value={
                                                    index +
                                                    1
                                                }
                                            >
                                                Nível{" "}
                                                {index +
                                                    1}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="criar-form-group">
                                <label>
                                    Tendência
                                </label>

                                <select
                                    value={
                                        character.alignment
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateCharacter(
                                            "alignment",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                >
                                    <option value="">
                                        Selecione
                                    </option>

                                    <option>
                                        Leal e Bom
                                    </option>

                                    <option>
                                        Neutro e Bom
                                    </option>

                                    <option>
                                        Caótico e Bom
                                    </option>

                                    <option>
                                        Leal e Neutro
                                    </option>

                                    <option>
                                        Neutro
                                    </option>

                                    <option>
                                        Caótico e Neutro
                                    </option>

                                    <option>
                                        Leal e Mau
                                    </option>

                                    <option>
                                        Neutro e Mau
                                    </option>

                                    <option>
                                        Caótico e Mau
                                    </option>
                                </select>
                            </div>

                            <div className="criar-form-group criar-form-full">
                                <label>
                                    Conceito / História
                                </label>

                                <textarea
                                    rows="6"
                                    value={
                                        character.concept
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateCharacter(
                                            "concept",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Quem é seu personagem? De onde veio? O que busca?"
                                />
                            </div>

                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="criar-step-content">

                        <div className="criar-step-intro">
                            <span>
                                PASSO 2
                            </span>

                            <h2>
                                Escolha sua raça
                            </h2>

                            <p>
                                A raça define parte
                                da origem e das
                                características do
                                seu personagem.
                            </p>
                        </div>

                        <div className="criar-choice-grid">

                            {races.map(
                                (race) => (
                                    <button
                                        key={
                                            race
                                        }
                                        type="button"
                                        className={`criar-choice-card ${
                                            character.race ===
                                            race
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            updateCharacter(
                                                "race",
                                                race
                                            )
                                        }
                                    >
                                        <div className="criar-choice-icon">
                                            <UserRound
                                                size={
                                                    21
                                                }
                                            />
                                        </div>

                                        <span>
                                            {
                                                race
                                            }
                                        </span>
                                    </button>
                                )
                            )}

                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="criar-step-content">

                        <div className="criar-step-intro">
                            <span>
                                PASSO 3
                            </span>

                            <h2>
                                Escolha sua classe
                            </h2>

                            <p>
                                Sua classe
                                representa as
                                principais
                                capacidades e o
                                estilo de aventura
                                do personagem.
                            </p>
                        </div>

                        <div className="criar-choice-grid criar-choice-grid-large">

                            {classes.map(
                                (
                                    className
                                ) => (
                                    <button
                                        key={
                                            className
                                        }
                                        type="button"
                                        className={`criar-choice-card ${
                                            character.class ===
                                            className
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            updateCharacter(
                                                "class",
                                                className
                                            )
                                        }
                                    >
                                        <div className="criar-choice-icon">
                                            <Sword
                                                size={
                                                    21
                                                }
                                            />
                                        </div>

                                        <span>
                                            {
                                                className
                                            }
                                        </span>
                                    </button>
                                )
                            )}

                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="criar-step-content">

                        <div className="criar-step-intro">
                            <span>
                                PASSO 4
                            </span>

                            <h2>
                                Escolha seu
                                antecedente
                            </h2>

                            <p>
                                O antecedente ajuda
                                a definir a história
                                e a experiência do
                                seu personagem.
                            </p>
                        </div>

                        <div className="criar-choice-grid">

                            {backgrounds.map(
                                (
                                    background
                                ) => (
                                    <button
                                        key={
                                            background
                                        }
                                        type="button"
                                        className={`criar-choice-card ${
                                            character.background ===
                                            background
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            updateCharacter(
                                                "background",
                                                background
                                            )
                                        }
                                    >
                                        <div className="criar-choice-icon">
                                            <ScrollText
                                                size={
                                                    21
                                                }
                                            />
                                        </div>

                                        <span>
                                            {
                                                background
                                            }
                                        </span>
                                    </button>
                                )
                            )}

                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="criar-step-content">

                        <div className="criar-step-intro">
                            <span>
                                PASSO 5
                            </span>

                            <h2>
                                Defina seus
                                atributos
                            </h2>

                            <p>
                                Ajuste os valores
                                dos seis atributos
                                principais da ficha.
                            </p>
                        </div>

                        <div className="criar-attributes-grid">

                            {attributes.map(
                                (
                                    attribute
                                ) => {
                                    const value =
                                        character
                                            .attributes[
                                            attribute
                                                .id
                                        ];

                                    return (
                                        <div
                                            key={
                                                attribute.id
                                            }
                                            className="criar-attribute-card"
                                        >
                                            <div className="criar-attribute-top">

                                                <div>
                                                    <span>
                                                        {
                                                            attribute.short
                                                        }
                                                    </span>

                                                    <strong>
                                                        {
                                                            attribute.label
                                                        }
                                                    </strong>
                                                </div>

                                                <b>
                                                    {
                                                        value
                                                    }
                                                </b>

                                            </div>

                                            <input
                                                type="range"
                                                min="1"
                                                max="20"
                                                value={
                                                    value
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateAttribute(
                                                        attribute.id,
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            />

                                            <div className="criar-attribute-range">
                                                <span>
                                                    1
                                                </span>

                                                <span>
                                                    20
                                                </span>
                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="criar-step-content">

                        <div className="criar-step-intro">
                            <span>
                                PASSO 6
                            </span>

                            <h2>
                                Dê vida ao personagem
                            </h2>

                            <p>
                                Agora você pode
                                definir os detalhes
                                que tornam seu
                                personagem único.
                            </p>
                        </div>

                        <div className="criar-form-grid">

                            <div className="criar-form-group criar-form-full">
                                <label>
                                    Traços de
                                    personalidade
                                </label>

                                <textarea
                                    rows="4"
                                    value={
                                        character.personality
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateCharacter(
                                            "personality",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Como seu personagem costuma agir?"
                                />
                            </div>

                            <div className="criar-form-group">
                                <label>
                                    Ideais
                                </label>

                                <textarea
                                    rows="4"
                                    value={
                                        character.ideals
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateCharacter(
                                            "ideals",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="O que é importante para ele?"
                                />
                            </div>

                            <div className="criar-form-group">
                                <label>
                                    Vínculos
                                </label>

                                <textarea
                                    rows="4"
                                    value={
                                        character.bonds
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateCharacter(
                                            "bonds",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Com quem ou com o que ele possui ligação?"
                                />
                            </div>

                            <div className="criar-form-group criar-form-full">
                                <label>
                                    Fraquezas
                                </label>

                                <textarea
                                    rows="4"
                                    value={
                                        character.flaws
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateCharacter(
                                            "flaws",
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Quais são seus medos, defeitos ou limitações?"
                                />
                            </div>

                        </div>
                    </div>
                );

            case 7:
                return (
                    <div className="criar-step-content">

                        <div className="criar-step-intro">
                            <span>
                                PASSO 7
                            </span>

                            <h2>
                                Revise seu
                                personagem
                            </h2>

                            <p>
                                Confira as
                                informações antes
                                de finalizar a
                                criação.
                            </p>
                        </div>

                        <div className="criar-review">

                            <div className="criar-review-hero">

                                <div className="criar-review-avatar">
                                    <Sword
                                        size={30}
                                    />
                                </div>

                                <div>
                                    <span>
                                        PERSONAGEM
                                        D&D
                                    </span>

                                    <h3>
                                        {character.name ||
                                            "Personagem sem nome"}
                                    </h3>

                                    <p>
                                        {character.race ||
                                            "Raça não definida"}{" "}
                                        •{" "}
                                        {character.class ||
                                            "Classe não definida"}
                                    </p>
                                </div>

                            </div>

                            <div className="criar-review-grid">

                                <div className="criar-review-item">
                                    <span>
                                        Nível
                                    </span>

                                    <strong>
                                        {
                                            character.level
                                        }
                                    </strong>
                                </div>

                                <div className="criar-review-item">
                                    <span>
                                        Antecedente
                                    </span>

                                    <strong>
                                        {
                                            character.background ||
                                            "Não definido"
                                        }
                                    </strong>
                                </div>

                                <div className="criar-review-item">
                                    <span>
                                        Tendência
                                    </span>

                                    <strong>
                                        {
                                            character.alignment ||
                                            "Não definida"
                                        }
                                    </strong>
                                </div>

                            </div>

                            <div className="criar-review-attributes">

                                <div className="criar-review-section-title">
                                    <Dices
                                        size={
                                            18
                                        }
                                    />

                                    <span>
                                        ATRIBUTOS
                                    </span>
                                </div>

                                <div className="criar-review-attribute-grid">

                                    {attributes.map(
                                        (
                                            attribute
                                        ) => (
                                            <div
                                                key={
                                                    attribute.id
                                                }
                                            >
                                                <span>
                                                    {
                                                        attribute.short
                                                    }
                                                </span>

                                                <strong>
                                                    {
                                                        character
                                                            .attributes[
                                                            attribute
                                                                .id
                                                        ]
                                                    }
                                                </strong>
                                            </div>
                                        )
                                    )}

                                </div>

                            </div>

                            <div className="criar-review-note">

                                <Backpack
                                    size={
                                        19
                                    }
                                />

                                <p>
                                    A ficha será
                                    expandida
                                    posteriormente
                                    com proficiências,
                                    equipamentos,
                                    características
                                    de classe,
                                    habilidades,
                                    magias e demais
                                    elementos
                                    específicos do
                                    sistema.
                                </p>

                            </div>

                        </div>
                    </div>
                );

            default:
                return null;
        }
    }

    return (
        <PageBase
            title="Criar Personagem"
            subtitle="Construa seu próximo aventureiro."
            icon={
                CurrentStepIcon ||
                Shield
            }
            onNavigate={onNavigate}
        >
            <div className="criar-personagem-page">

                <button
                    type="button"
                    className="criar-back-button"
                    onClick={
                        handleCancel
                    }
                >
                    <ArrowLeft
                        size={17}
                    />

                    <span>
                        Voltar para personagens
                    </span>
                </button>

                <section className="criar-header">

                    <div className="criar-system-badge">
                        <Sword
                            size={16}
                        />

                        DUNGEONS & DRAGONS
                    </div>

                    <h2>
                        Criação de personagem
                    </h2>

                    <p>
                        Construa seu personagem
                        passo a passo.
                    </p>

                </section>

                <section className="criar-progress">

                    <div className="criar-progress-line">
                        <div
                            className="criar-progress-fill"
                            style={{
                                width: `${
                                    ((currentStep -
                                        1) /
                                        (steps.length -
                                            1)) *
                                    100
                                }%`,
                            }}
                        />
                    </div>

                    <div className="criar-progress-steps">

                        {steps.map(
                            (step) => {
                                const StepIcon =
                                    step.icon;

                                const isActive =
                                    step.id ===
                                    currentStep;

                                const isCompleted =
                                    step.id <
                                    currentStep;

                                return (
                                    <div
                                        key={
                                            step.id
                                        }
                                        className={`criar-progress-step ${
                                            isActive
                                                ? "active"
                                                : ""
                                        } ${
                                            isCompleted
                                                ? "completed"
                                                : ""
                                        }`}
                                    >
                                        <div className="criar-progress-icon">
                                            <StepIcon
                                                size={
                                                    17
                                                }
                                            />
                                        </div>

                                        <span>
                                            {
                                                step.title
                                            }
                                        </span>
                                    </div>
                                );
                            }
                        )}

                    </div>

                </section>

                <motion.section
                    className="criar-main-card"
                    key={
                        currentStep
                    }
                    initial={{
                        opacity: 0,
                        x: 18,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration: 0.3,
                    }}
                >

                    <div className="criar-main-card-header">

                        <div className="criar-main-card-icon">
                            {CurrentStepIcon && (
                                <CurrentStepIcon
                                    size={
                                        24
                                    }
                                />
                            )}
                        </div>

                        <div>
                            <span>
                                ETAPA{" "}
                                {
                                    currentStep
                                }{" "}
                                DE{" "}
                                {
                                    steps.length
                                }
                            </span>

                            <h3>
                                {
                                    currentStepData?.title
                                }
                            </h3>
                        </div>

                    </div>

                    {renderStep()}

                    <div className="criar-navigation">

                        <button
                            type="button"
                            className="criar-navigation-secondary"
                            onClick={
                                currentStep ===
                                1
                                    ? handleCancel
                                    : handlePrevious
                            }
                        >
                            <ArrowLeft
                                size={
                                    17
                                }
                            />

                            <span>
                                {currentStep ===
                                1
                                    ? "Cancelar"
                                    : "Voltar"}
                            </span>
                        </button>

                        {currentStep <
                        steps.length ? (
                            <button
                                type="button"
                                className="criar-navigation-primary"
                                onClick={
                                    handleNext
                                }
                            >
                                <span>
                                    Continuar
                                </span>

                                <ArrowRight
                                    size={
                                        17
                                    }
                                />
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="criar-navigation-primary"
                                onClick={
                                    handleFinish
                                }
                            >
                                <Heart
                                    size={
                                        17
                                    }
                                />

                                <span>
                                    Criar personagem
                                </span>
                            </button>
                        )}

                    </div>

                </motion.section>

            </div>
        </PageBase>
    );
}
