import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    ArrowLeft,
    ArrowRight,
    Check,
    Shield,
    Sword,
    Sparkles,
    UserRound,
    Crown,
    ScrollText,
    Heart,
    Dices,
} from "lucide-react";

import "./CriadorDnD.css";

const steps = [
    {
        id: "conceito",
        number: 1,
        title: "Conceito",
        description: "Comece dando identidade ao seu aventureiro.",
        icon: UserRound,
    },
    {
        id: "raca",
        number: 2,
        title: "Raça",
        description: "Escolha o povo ao qual seu personagem pertence.",
        icon: Shield,
    },
    {
        id: "classe",
        number: 3,
        title: "Classe",
        description: "Defina sua vocação e estilo de aventura.",
        icon: Sword,
    },
    {
        id: "atributos",
        number: 4,
        title: "Atributos",
        description: "Defina seus valores de habilidade.",
        icon: Dices,
    },
    {
        id: "antecedente",
        number: 5,
        title: "Antecedente",
        description: "Construa o passado do seu personagem.",
        icon: ScrollText,
    },
    {
        id: "personalidade",
        number: 6,
        title: "Personalidade",
        description: "Dê vida ao aventureiro.",
        icon: Sparkles,
    },
    {
        id: "revisao",
        number: 7,
        title: "Revisão",
        description: "Confira sua ficha antes de criar.",
        icon: Crown,
    },
];

const races = [
    {
        id: "anao",
        name: "Anão",
        description:
            "Um povo resistente e tradicional, conhecido por sua força e determinação.",
    },
    {
        id: "elfo",
        name: "Elfo",
        description:
            "Um povo gracioso e ancestral, associado à agilidade e à magia.",
    },
    {
        id: "halfling",
        name: "Halfling",
        description:
            "Um povo pequeno, ágil e conhecido por sua coragem e sorte.",
    },
    {
        id: "humano",
        name: "Humano",
        description:
            "Versáteis e ambiciosos, humanos podem seguir muitos caminhos.",
    },
    {
        id: "draconato",
        name: "Draconato",
        description:
            "Humanoides de herança dracônica e presença marcante.",
    },
    {
        id: "gnomo",
        name: "Gnomo",
        description:
            "Pequenos e inventivos, com forte ligação com conhecimento e magia.",
    },
    {
        id: "meio-elfo",
        name: "Meio-Elfo",
        description:
            "Entre dois mundos, combinando características de humanos e elfos.",
    },
    {
        id: "meio-orc",
        name: "Meio-Orc",
        description:
            "Fisicamente poderosos e conhecidos por sua determinação.",
    },
    {
        id: "tiefling",
        name: "Tiefling",
        description:
            "Marcados por uma herança infernal e uma presença incomum.",
    },
];

const classes = [
    {
        id: "barbaro",
        name: "Bárbaro",
        description: "Um combatente poderoso que canaliza sua fúria.",
        attribute: "Força",
    },
    {
        id: "bardo",
        name: "Bardo",
        description: "Um aventureiro versátil que utiliza arte e magia.",
        attribute: "Carisma",
    },
    {
        id: "clerigo",
        name: "Clérigo",
        description: "Um devoto capaz de canalizar poder divino.",
        attribute: "Sabedoria",
    },
    {
        id: "druida",
        name: "Druida",
        description: "Um guardião ligado à natureza e às forças naturais.",
        attribute: "Sabedoria",
    },
    {
        id: "guerreiro",
        name: "Guerreiro",
        description: "Um mestre das armas e do combate.",
        attribute: "Força ou Destreza",
    },
    {
        id: "monge",
        name: "Monge",
        description: "Um combatente disciplinado que domina corpo e mente.",
        attribute: "Destreza",
    },
    {
        id: "paladino",
        name: "Paladino",
        description: "Um guerreiro guiado por um juramento.",
        attribute: "Força ou Destreza",
    },
    {
        id: "patrulheiro",
        name: "Patrulheiro",
        description: "Um explorador habilidoso e combatente das fronteiras.",
        attribute: "Destreza",
    },
    {
        id: "ladino",
        name: "Ladino",
        description: "Especialista em furtividade, precisão e astúcia.",
        attribute: "Destreza",
    },
    {
        id: "feiticeiro",
        name: "Feiticeiro",
        description: "Um conjurador cuja magia vem de uma origem inata.",
        attribute: "Carisma",
    },
    {
        id: "bruxo",
        name: "Bruxo",
        description: "Um conjurador que recebe poder através de um pacto.",
        attribute: "Carisma",
    },
    {
        id: "mago",
        name: "Mago",
        description: "Um estudioso que domina a magia através do conhecimento.",
        attribute: "Inteligência",
    },
];

const abilities = [
    {
        id: "forca",
        name: "Força",
        short: "FOR",
        description: "Poder físico e capacidade atlética.",
    },
    {
        id: "destreza",
        name: "Destreza",
        short: "DES",
        description: "Agilidade, reflexos e equilíbrio.",
    },
    {
        id: "constituicao",
        name: "Constituição",
        short: "CON",
        description: "Saúde, resistência e vigor.",
    },
    {
        id: "inteligencia",
        name: "Inteligência",
        short: "INT",
        description: "Raciocínio, memória e conhecimento.",
    },
    {
        id: "sabedoria",
        name: "Sabedoria",
        short: "SAB",
        description: "Percepção, intuição e experiência.",
    },
    {
        id: "carisma",
        name: "Carisma",
        short: "CAR",
        description: "Presença, liderança e influência.",
    },
];

const standardArray = [15, 14, 13, 12, 10, 8];

const backgrounds = [
    {
        id: "acólito",
        name: "Acólito",
        description:
            "Uma vida dedicada ao serviço de uma tradição religiosa.",
    },
    {
        id: "criminoso",
        name: "Criminoso",
        description:
            "Um passado ligado ao crime e às atividades clandestinas.",
    },
    {
        id: "heroi-povo",
        name: "Herói do Povo",
        description:
            "Uma vida simples marcada por uma origem humilde e reconhecida.",
    },
    {
        id: "nobre",
        name: "Nobre",
        description:
            "Você nasceu em uma posição privilegiada da sociedade.",
    },
    {
        id: "soldado",
        name: "Soldado",
        description:
            "Você possui experiência em uma organização militar.",
    },
    {
        id: "sabio",
        name: "Sábio",
        description:
            "Sua vida foi dedicada ao estudo e à busca por conhecimento.",
    },
];

export default function CriadorDnD({ onBack, onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);

    const [character, setCharacter] = useState({
        name: "",
        concept: "",
        race: "",
        class: "",
        background: "",
        level: 1,

        abilities: {
            forca: null,
            destreza: null,
            constituicao: null,
            inteligencia: null,
            sabedoria: null,
            carisma: null,
        },

        personality: "",
        ideal: "",
        bond: "",
        flaw: "",
    });

    const currentStepData = steps[currentStep];

    const progress = useMemo(() => {
        return ((currentStep + 1) / steps.length) * 100;
    }, [currentStep]);

    function updateCharacter(field, value) {
        setCharacter((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function updateAbility(abilityId, value) {
        setCharacter((current) => ({
            ...current,
            abilities: {
                ...current.abilities,
                [abilityId]: Number(value),
            },
        }));
    }

    function canContinue() {
        if (currentStepData.id === "conceito") {
            return character.name.trim().length >= 2;
        }

        if (currentStepData.id === "raca") {
            return Boolean(character.race);
        }

        if (currentStepData.id === "classe") {
            return Boolean(character.class);
        }

        if (currentStepData.id === "atributos") {
            return Object.values(character.abilities).every(
                (value) => value !== null
            );
        }

        if (currentStepData.id === "antecedente") {
            return Boolean(character.background);
        }

        return true;
    }

    function handleNext() {
        if (!canContinue()) return;

        if (currentStep < steps.length - 1) {
            setCurrentStep((current) => current + 1);
        }
    }

    function handlePrevious() {
        if (currentStep === 0) {
            onBack?.();
            return;
        }

        setCurrentStep((current) => current - 1);
    }

    function handleFinish() {
        if (!canContinue()) return;

        const newCharacter = {
            id: Date.now(),
            name: character.name,
            system: "D&D 5e",
            systemId: "dnd",
            race:
                races.find((race) => race.id === character.race)?.name ||
                "",
            class:
                classes.find((item) => item.id === character.class)?.name ||
                "",
            level: character.level,
            status: "Ativo",
            background:
                backgrounds.find(
                    (background) =>
                        background.id === character.background
                )?.name || "",
            ...character,
        };

        onComplete?.(newCharacter);
    }

    return (
        <main className="criador-dnd">

            {/* =========================================================
                CABEÇALHO
            ========================================================== */}

            <header className="criador-dnd-header">

                <button
                    type="button"
                    className="criador-dnd-back"
                    onClick={handlePrevious}
                >
                    <ArrowLeft size={18} />

                    <span>
                        {currentStep === 0
                            ? "Voltar para personagens"
                            : "Voltar"}
                    </span>
                </button>


                <div className="criador-dnd-brand">

                    <span>
                        ORDO RPGISTAS
                    </span>

                    <strong>
                        CRIADOR D&D 5e
                    </strong>

                </div>


                <div className="criador-dnd-system">
                    <Sword size={15} />
                    D&D 5e
                </div>

            </header>


            {/* =========================================================
                PROGRESSO
            ========================================================== */}

            <section className="criador-dnd-progress">

                <div className="criador-dnd-progress-top">

                    <div>

                        <span>
                            ETAPA {currentStep + 1} DE {steps.length}
                        </span>

                        <h1>
                            {currentStepData.title}
                        </h1>

                    </div>

                    <strong>
                        {Math.round(progress)}%
                    </strong>

                </div>


                <div className="criador-dnd-progress-bar">
                    <motion.div
                        animate={{
                            width: `${progress}%`,
                        }}
                        transition={{
                            duration: 0.35,
                        }}
                    />
                </div>

            </section>


            {/* =========================================================
                ETAPAS
            ========================================================== */}

            <nav className="criador-dnd-steps">

                {steps.map((step, index) => {

                    const Icon = step.icon;

                    const isActive =
                        index === currentStep;

                    const isCompleted =
                        index < currentStep;

                    return (
                        <button
                            key={step.id}
                            type="button"
                            className={`
                                criador-dnd-step
                                ${isActive ? "active" : ""}
                                ${isCompleted ? "completed" : ""}
                            `}
                            onClick={() => {
                                if (index <= currentStep) {
                                    setCurrentStep(index);
                                }
                            }}
                        >

                            <div className="criador-dnd-step-icon">

                                {isCompleted ? (
                                    <Check size={15} />
                                ) : (
                                    <Icon size={15} />
                                )}

                            </div>

                            <div>

                                <small>
                                    {step.number}
                                </small>

                                <span>
                                    {step.title}
                                </span>

                            </div>

                        </button>
                    );
                })}

            </nav>


            {/* =========================================================
                CONTEÚDO
            ========================================================== */}

            <section className="criador-dnd-content">

                <AnimatePresence mode="wait">

                    <motion.div
                        key={currentStepData.id}
                        className="criador-dnd-stage"
                        initial={{
                            opacity: 0,
                            x: 20,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        exit={{
                            opacity: 0,
                            x: -20,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                    >

                        {currentStepData.id === "conceito" && (
                            <ConceptStep
                                character={character}
                                updateCharacter={updateCharacter}
                            />
                        )}


                        {currentStepData.id === "raca" && (
                            <RaceStep
                                character={character}
                                updateCharacter={updateCharacter}
                            />
                        )}


                        {currentStepData.id === "classe" && (
                            <ClassStep
                                character={character}
                                updateCharacter={updateCharacter}
                            />
                        )}


                        {currentStepData.id === "atributos" && (
                            <AbilitiesStep
                                character={character}
                                updateAbility={updateAbility}
                            />
                        )}


                        {currentStepData.id === "antecedente" && (
                            <BackgroundStep
                                character={character}
                                updateCharacter={updateCharacter}
                            />
                        )}


                        {currentStepData.id === "personalidade" && (
                            <PersonalityStep
                                character={character}
                                updateCharacter={updateCharacter}
                            />
                        )}


                        {currentStepData.id === "revisao" && (
                            <ReviewStep
                                character={character}
                                races={races}
                                classes={classes}
                                backgrounds={backgrounds}
                            />
                        )}

                    </motion.div>

                </AnimatePresence>

            </section>


            {/* =========================================================
                NAVEGAÇÃO
            ========================================================== */}

            <footer className="criador-dnd-footer">

                <button
                    type="button"
                    className="criador-dnd-footer-back"
                    onClick={handlePrevious}
                >
                    <ArrowLeft size={17} />
                    Voltar
                </button>


                {currentStep === steps.length - 1 ? (

                    <button
                        type="button"
                        className="criador-dnd-finish"
                        disabled={!canContinue()}
                        onClick={handleFinish}
                    >
                        <Check size={18} />
                        Criar personagem
                    </button>

                ) : (

                    <button
                        type="button"
                        className="criador-dnd-next"
                        disabled={!canContinue()}
                        onClick={handleNext}
                    >
                        Continuar
                        <ArrowRight size={18} />
                    </button>

                )}

            </footer>

        </main>
    );
}


/* ================================================================
   ETAPA 1 — CONCEITO
================================================================ */

function ConceptStep({
    character,
    updateCharacter,
}) {
    return (
        <div className="criador-step-page">

            <div className="criador-step-heading">

                <div className="criador-step-symbol">
                    <UserRound size={25} />
                </div>

                <div>

                    <span>
                        PRIMEIRO PASSO
                    </span>

                    <h2>
                        Quem é seu aventureiro?
                    </h2>

                    <p>
                        Comece criando a identidade básica do
                        personagem.
                    </p>

                </div>

            </div>


            <div className="criador-form-grid">

                <label className="criador-field criador-field-full">

                    <span>
                        Nome do personagem
                    </span>

                    <input
                        type="text"
                        value={character.name}
                        onChange={(event) =>
                            updateCharacter(
                                "name",
                                event.target.value
                            )
                        }
                        placeholder="Ex.: Arion, Lyra, Thorin..."
                        maxLength={40}
                    />

                </label>


                <label className="criador-field criador-field-full">

                    <span>
                        Conceito do personagem
                    </span>

                    <textarea
                        value={character.concept}
                        onChange={(event) =>
                            updateCharacter(
                                "concept",
                                event.target.value
                            )
                        }
                        placeholder="Descreva brevemente quem é seu personagem..."
                        rows={5}
                        maxLength={500}
                    />

                </label>

            </div>


            <div className="criador-info-box">

                <Sparkles size={18} />

                <div>

                    <strong>
                        Seu personagem começa com uma ideia.
                    </strong>

                    <p>
                        O conceito pode mudar enquanto você
                        avança pelas próximas etapas da criação.
                    </p>

                </div>

            </div>

        </div>
    );
}


/* ================================================================
   ETAPA 2 — RAÇA
================================================================ */

function RaceStep({
    character,
    updateCharacter,
}) {
    return (
        <div className="criador-step-page">

            <div className="criador-step-heading">

                <div className="criador-step-symbol">
                    <Shield size={25} />
                </div>

                <div>

                    <span>
                        ESCOLHA SUA RAÇA
                    </span>

                    <h2>
                        Qual é o povo do personagem?
                    </h2>

                    <p>
                        A raça influencia diferentes aspectos
                        da construção do personagem.
                    </p>

                </div>

            </div>


            <div className="criador-option-grid">

                {races.map((race) => (

                    <button
                        key={race.id}
                        type="button"
                        className={`
                            criador-option-card
                            ${character.race === race.id
                                ? "selected"
                                : ""}
                        `}
                        onClick={() =>
                            updateCharacter(
                                "race",
                                race.id
                            )
                        }
                    >

                        <div className="criador-option-icon">
                            <Shield size={21} />
                        </div>

                        <div>

                            <h3>
                                {race.name}
                            </h3>

                            <p>
                                {race.description}
                            </p>

                        </div>

                        <div className="criador-option-check">

                            {character.race === race.id && (
                                <Check size={15} />
                            )}

                        </div>

                    </button>

                ))}

            </div>

        </div>
    );
}


/* ================================================================
   ETAPA 3 — CLASSE
================================================================ */

function ClassStep({
    character,
    updateCharacter,
}) {
    return (
        <div className="criador-step-page">

            <div className="criador-step-heading">

                <div className="criador-step-symbol">
                    <Sword size={25} />
                </div>

                <div>

                    <span>
                        ESCOLHA SUA CLASSE
                    </span>

                    <h2>
                        Como você enfrenta o mundo?
                    </h2>

                    <p>
                        A classe define sua vocação, aptidões
                        e muitas das suas capacidades.
                    </p>

                </div>

            </div>


            <div className="criador-option-grid">

                {classes.map((item) => (

                    <button
                        key={item.id}
                        type="button"
                        className={`
                            criador-option-card
                            ${character.class === item.id
                                ? "selected"
                                : ""}
                        `}
                        onClick={() =>
                            updateCharacter(
                                "class",
                                item.id
                            )
                        }
                    >

                        <div className="criador-option-icon">
                            <Sword size={21} />
                        </div>

                        <div>

                            <h3>
                                {item.name}
                            </h3>

                            <p>
                                {item.description}
                            </p>

                            <small>
                                Atributo-chave: {item.attribute}
                            </small>

                        </div>

                        <div className="criador-option-check">

                            {character.class === item.id && (
                                <Check size={15} />
                            )}

                        </div>

                    </button>

                ))}

            </div>

        </div>
    );
}


/* ================================================================
   ETAPA 4 — ATRIBUTOS
================================================================ */

function AbilitiesStep({
    character,
    updateAbility,
}) {
    const usedValues = Object.values(
        character.abilities
    ).filter(Boolean);

    return (
        <div className="criador-step-page">

            <div className="criador-step-heading">

                <div className="criador-step-symbol">
                    <Dices size={25} />
                </div>

                <div>

                    <span>
                        VALORES DE HABILIDADE
                    </span>

                    <h2>
                        Distribua seus atributos
                    </h2>

                    <p>
                        Começaremos pelo conjunto padrão de
                        valores: 15, 14, 13, 12, 10 e 8.
                    </p>

                </div>

            </div>


            <div className="criador-ability-pool">

                <span>
                    VALORES DISPONÍVEIS
                </span>

                <div>

                    {standardArray.map((value) => {

                        const usedCount =
                            usedValues.filter(
                                (item) => item === value
                            ).length;

                        const available =
                            standardArray.filter(
                                (item) => item === value
                            ).length;

                        return (
                            <span
                                key={value}
                                className={
                                    usedCount >= available
                                        ? "used"
                                        : ""
                                }
                            >
                                {value}
                            </span>
                        );
                    })}

                </div>

            </div>


            <div className="criador-abilities-grid">

                {abilities.map((ability) => {

                    const currentValue =
                        character.abilities[
                            ability.id
                        ];

                    return (
                        <div
                            key={ability.id}
                            className={`
                                criador-ability-card
                                ${currentValue
                                    ? "selected"
                                    : ""}
                            `}
                        >

                            <div className="criador-ability-top">

                                <div>

                                    <span>
                                        {ability.short}
                                    </span>

                                    <h3>
                                        {ability.name}
                                    </h3>

                                </div>

                                <div className="criador-ability-value">

                                    {currentValue || "—"}

                                </div>

                            </div>


                            <p>
                                {ability.description}
                            </p>


                            <select
                                value={
                                    currentValue || ""
                                }
                                onChange={(event) =>
                                    updateAbility(
                                        ability.id,
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Escolher valor
                                </option>

                                {standardArray.map(
                                    (value, index) => {

                                        const occurrences =
                                            Object.values(
                                                character.abilities
                                            ).filter(
                                                (item) =>
                                                    item === value
                                            ).length;

                                        const maxOccurrences =
                                            standardArray.filter(
                                                (item) =>
                                                    item === value
                                            ).length;

                                        const isCurrent =
                                            currentValue === value;

                                        const disabled =
                                            occurrences >=
                                                maxOccurrences &&
                                            !isCurrent;

                                        return (
                                            <option
                                                key={`${value}-${index}`}
                                                value={value}
                                                disabled={disabled}
                                            >
                                                {value}
                                            </option>
                                        );
                                    }
                                )}

                            </select>

                        </div>
                    );
                })}

            </div>


            <div className="criador-info-box">

                <Dices size={18} />

                <div>

                    <strong>
                        Método padrão
                    </strong>

                    <p>
                        Os seis valores são distribuídos entre
                        Força, Destreza, Constituição,
                        Inteligência, Sabedoria e Carisma.
                    </p>

                </div>

            </div>

        </div>
    );
}


/* ================================================================
   ETAPA 5 — ANTECEDENTE
================================================================ */

function BackgroundStep({
    character,
    updateCharacter,
}) {
    return (
        <div className="criador-step-page">

            <div className="criador-step-heading">

                <div className="criador-step-symbol">
                    <ScrollText size={25} />
                </div>

                <div>

                    <span>
                        ANTECEDENTE
                    </span>

                    <h2>
                        De onde seu personagem veio?
                    </h2>

                    <p>
                        O passado ajuda a construir a identidade
                        e as proficiências do aventureiro.
                    </p>

                </div>

            </div>


            <div className="criador-option-grid">

                {backgrounds.map((background) => (

                    <button
                        key={background.id}
                        type="button"
                        className={`
                            criador-option-card
                            ${character.background ===
                                background.id
                                ? "selected"
                                : ""}
                        `}
                        onClick={() =>
                            updateCharacter(
                                "background",
                                background.id
                            )
                        }
                    >

                        <div className="criador-option-icon">
                            <ScrollText size={21} />
                        </div>

                        <div>

                            <h3>
                                {background.name}
                            </h3>

                            <p>
                                {background.description}
                            </p>

                        </div>

                        <div className="criador-option-check">

                            {character.background ===
                                background.id && (
                                <Check size={15} />
                            )}

                        </div>

                    </button>

                ))}

            </div>

        </div>
    );
}


/* ================================================================
   ETAPA 6 — PERSONALIDADE
================================================================ */

function PersonalityStep({
    character,
    updateCharacter,
}) {
    return (
        <div className="criador-step-page">

            <div className="criador-step-heading">

                <div className="criador-step-symbol">
                    <Sparkles size={25} />
                </div>

                <div>

                    <span>
                        INTERPRETAÇÃO
                    </span>

                    <h2>
                        Dê vida ao personagem
                    </h2>

                    <p>
                        Defina os elementos que ajudam a interpretar
                        seu aventureiro durante a campanha.
                    </p>

                </div>

            </div>


            <div className="criador-form-grid">

                <label className="criador-field criador-field-full">

                    <span>
                        Traços de personalidade
                    </span>

                    <textarea
                        value={character.personality}
                        onChange={(event) =>
                            updateCharacter(
                                "personality",
                                event.target.value
                            )
                        }
                        placeholder="Como seu personagem costuma agir?"
                        rows={4}
                    />

                </label>


                <label className="criador-field">

                    <span>
                        Ideal
                    </span>

                    <textarea
                        value={character.ideal}
                        onChange={(event) =>
                            updateCharacter(
                                "ideal",
                                event.target.value
                            )
                        }
                        placeholder="O que ele valoriza?"
                        rows={4}
                    />

                </label>


                <label className="criador-field">

                    <span>
                        Vínculo
                    </span>

                    <textarea
                        value={character.bond}
                        onChange={(event) =>
                            updateCharacter(
                                "bond",
                                event.target.value
                            )
                        }
                        placeholder="O que é importante para ele?"
                        rows={4}
                    />

                </label>


                <label className="criador-field criador-field-full">

                    <span>
                        Defeito
                    </span>

                    <textarea
                        value={character.flaw}
                        onChange={(event) =>
                            updateCharacter(
                                "flaw",
                                event.target.value
                            )
                        }
                        placeholder="Qual é uma fraqueza ou característica difícil?"
                        rows={4}
                    />

                </label>

            </div>

        </div>
    );
}


/* ================================================================
   ETAPA 7 — REVISÃO
================================================================ */

function ReviewStep({
    character,
    races,
    classes,
    backgrounds,
}) {
    const race = races.find(
        (item) => item.id === character.race
    );

    const characterClass = classes.find(
        (item) => item.id === character.class
    );

    const background = backgrounds.find(
        (item) => item.id === character.background
    );

    return (
        <div className="criador-step-page">

            <div className="criador-step-heading">

                <div className="criador-step-symbol">
                    <Crown size={25} />
                </div>

                <div>

                    <span>
                        QUASE LÁ
                    </span>

                    <h2>
                        Revise seu personagem
                    </h2>

                    <p>
                        Confira as escolhas antes de criar sua ficha.
                    </p>

                </div>

            </div>


            <div className="criador-review-hero">

                <div className="criador-review-avatar">
                    <UserRound size={34} />
                </div>

                <div>

                    <span>
                        D&D 5e • NÍVEL {character.level}
                    </span>

                    <h3>
                        {character.name || "Sem nome"}
                    </h3>

                    <p>
                        {race?.name || "Raça não escolhida"}
                        {" • "}
                        {characterClass?.name ||
                            "Classe não escolhida"}
                    </p>

                </div>

            </div>


            <div className="criador-review-grid">

                <ReviewCard
                    title="Raça"
                    value={race?.name}
                    icon={Shield}
                />

                <ReviewCard
                    title="Classe"
                    value={characterClass?.name}
                    icon={Sword}
                />

                <ReviewCard
                    title="Antecedente"
                    value={background?.name}
                    icon={ScrollText}
                />

                <ReviewCard
                    title="Nível"
                    value={character.level}
                    icon={Crown}
                />

            </div>


            <div className="criador-review-abilities">

                <div className="criador-review-section-title">

                    <Heart size={17} />

                    <span>
                        VALORES DE HABILIDADE
                    </span>

                </div>


                <div className="criador-review-ability-list">

                    {abilities.map((ability) => (

                        <div key={ability.id}>

                            <span>
                                {ability.short}
                            </span>

                            <strong>
                                {character.abilities[
                                    ability.id
                                ] || "—"}
                            </strong>

                        </div>

                    ))}

                </div>

            </div>


            {character.concept && (

                <div className="criador-review-concept">

                    <span>
                        CONCEITO
                    </span>

                    <p>
                        {character.concept}
                    </p>

                </div>

            )}

        </div>
    );
}


function ReviewCard({
    title,
    value,
    icon: Icon,
}) {
    return (
        <div className="criador-review-card">

            <div className="criador-review-card-icon">
                <Icon size={18} />
            </div>

            <div>

                <span>
                    {title}
                </span>

                <strong>
                    {value || "Não escolhido"}
                </strong>

            </div>

        </div>
    );
}
