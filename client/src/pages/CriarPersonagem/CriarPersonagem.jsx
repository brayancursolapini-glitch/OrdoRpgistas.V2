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
} from "lucide-react";

import PageBase from "../PageBase";

import "./CriarPersonagem.css";

export default function CriarPersonagem({ onNavigate }) {
    const [currentStep, setCurrentStep] = useState(1);

    const [character, setCharacter] = useState({
        name: "",
        race: "",
        class: "",
        background: "",
        level: 1,

        strength: 8,
        dexterity: 8,
        constitution: 8,
        intelligence: 8,
        wisdom: 8,
        charisma: 8,

        alignment: "",
        experience: 0,
        hitPoints: 0,
        armorClass: 10,
        speed: 0,

        personality: "",
        ideals: "",
        bonds: "",
        flaws: "",

        equipment: [],
        spells: [],
    });

    const steps = [
        {
            id: 1,
            title: "Conceito",
            description: "Comece dando vida ao seu personagem.",
            icon: UserRound,
        },
        {
            id: 2,
            title: "Raça",
            description: "Escolha a raça do aventureiro.",
            icon: Shield,
        },
        {
            id: 3,
            title: "Classe",
            description: "Defina aquilo que seu personagem faz.",
            icon: Sword,
        },
        {
            id: 4,
            title: "Antecedente",
            description: "Descubra de onde seu personagem veio.",
            icon: ScrollText,
        },
        {
            id: 5,
            title: "Atributos",
            description: "Defina as capacidades do personagem.",
            icon: Dices,
        },
        {
            id: 6,
            title: "Detalhes",
            description: "Complete a identidade da ficha.",
            icon: Sparkles,
        },
        {
            id: 7,
            title: "Finalizar",
            description: "Revise seu personagem.",
            icon: Backpack,
        },
    ];

    const currentStepData = steps.find(
        (step) => step.id === currentStep
    );

    function updateCharacter(field, value) {
        setCharacter((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function handleNext() {
        if (currentStep < steps.length) {
            setCurrentStep((current) => current + 1);
        }
    }

    function handlePrevious() {
        if (currentStep > 1) {
            setCurrentStep((current) => current - 1);
        }
    }

    function handleCancel() {
        onNavigate?.("personagens");
    }

    function renderStep() {
        switch (currentStep) {
            case 1:
                return (
                    <section className="criar-personagem-step">
                        <div className="criar-step-heading">
                            <span>PASSO 1</span>
                            <h2>Comece pelo conceito</h2>
                            <p>
                                Antes de definir todos os detalhes,
                                imagine quem é o seu aventureiro.
                            </p>
                        </div>

                        <div className="criar-form-grid">
                            <label className="criar-field criar-field-full">
                                <span>Nome do personagem</span>

                                <input
                                    type="text"
                                    value={character.name}
                                    onChange={(event) =>
                                        updateCharacter(
                                            "name",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Ex.: Thorin Machado de Ferro"
                                />
                            </label>

                            <label className="criar-field">
                                <span>Nível</span>

                                <select
                                    value={character.level}
                                    onChange={(event) =>
                                        updateCharacter(
                                            "level",
                                            Number(event.target.value)
                                        )
                                    }
                                >
                                    {Array.from(
                                        { length: 20 },
                                        (_, index) => index + 1
                                    ).map((level) => (
                                        <option
                                            key={level}
                                            value={level}
                                        >
                                            Nível {level}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="criar-field">
                                <span>Alinhamento</span>

                                <select
                                    value={character.alignment}
                                    onChange={(event) =>
                                        updateCharacter(
                                            "alignment",
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Selecionar
                                    </option>
                                    <option value="leal-bom">
                                        Leal e Bom
                                    </option>
                                    <option value="neutro-bom">
                                        Neutro e Bom
                                    </option>
                                    <option value="caotico-bom">
                                        Caótico e Bom
                                    </option>
                                    <option value="leal-neutro">
                                        Leal e Neutro
                                    </option>
                                    <option value="neutro">
                                        Neutro
                                    </option>
                                    <option value="caotico-neutro">
                                        Caótico e Neutro
                                    </option>
                                    <option value="leal-mau">
                                        Leal e Mau
                                    </option>
                                    <option value="neutro-mau">
                                        Neutro e Mau
                                    </option>
                                    <option value="caotico-mau">
                                        Caótico e Mau
                                    </option>
                                </select>
                            </label>

                            <label className="criar-field criar-field-full">
                                <span>História / conceito</span>

                                <textarea
                                    value={character.personality}
                                    onChange={(event) =>
                                        updateCharacter(
                                            "personality",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Conte brevemente quem é seu personagem..."
                                    rows={5}
                                />
                            </label>
                        </div>
                    </section>
                );

            case 2:
                return (
                    <section className="criar-personagem-step">
                        <div className="criar-step-heading">
                            <span>PASSO 2</span>
                            <h2>Escolha sua raça</h2>
                            <p>
                                A raça contribui para a identidade,
                                características e capacidades naturais
                                do personagem.
                            </p>
                        </div>

                        <div className="criar-choice-grid">
                            {[
                                "Anão",
                                "Elfo",
                                "Halfling",
                                "Humano",
                                "Draconato",
                                "Gnomo",
                                "Meio-Elfo",
                                "Meio-Orc",
                                "Tiefling",
                            ].map((race) => (
                                <button
                                    key={race}
                                    type="button"
                                    className={`criar-choice-card ${
                                        character.race === race
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
                                    <Shield size={24} />

                                    <strong>{race}</strong>

                                    <span>
                                        Escolher raça
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                );

            case 3:
                return (
                    <section className="criar-personagem-step">
                        <div className="criar-step-heading">
                            <span>PASSO 3</span>
                            <h2>Escolha sua classe</h2>
                            <p>
                                A classe representa a vocação principal
                                do seu personagem e define diversas
                                características especiais.
                            </p>
                        </div>

                        <div className="criar-choice-grid">
                            {[
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
                            ].map((className) => (
                                <button
                                    key={className}
                                    type="button"
                                    className={`criar-choice-card ${
                                        character.class === className
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
                                    <Sword size={24} />

                                    <strong>
                                        {className}
                                    </strong>

                                    <span>
                                        Escolher classe
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                );

            case 4:
                return (
                    <section className="criar-personagem-step">
                        <div className="criar-step-heading">
                            <span>PASSO 4</span>
                            <h2>Escolha seu antecedente</h2>
                            <p>
                                O passado do personagem ajuda a definir
                                suas proficiências, equipamentos e
                                características pessoais.
                            </p>
                        </div>

                        <div className="criar-choice-grid">
                            {[
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
                            ].map((background) => (
                                <button
                                    key={background}
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
                                    <ScrollText size={24} />

                                    <strong>
                                        {background}
                                    </strong>

                                    <span>
                                        Escolher antecedente
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                );

            case 5:
                return (
                    <section className="criar-personagem-step">
                        <div className="criar-step-heading">
                            <span>PASSO 5</span>
                            <h2>Defina seus atributos</h2>
                            <p>
                                Distribua os valores das seis habilidades
                                principais do personagem.
                            </p>
                        </div>

                        <div className="criar-attributes-grid">
                            {[
                                ["strength", "Força"],
                                ["dexterity", "Destreza"],
                                ["constitution", "Constituição"],
                                ["intelligence", "Inteligência"],
                                ["wisdom", "Sabedoria"],
                                ["charisma", "Carisma"],
                            ].map(([key, label]) => (
                                <div
                                    className="criar-attribute-card"
                                    key={key}
                                >
                                    <span>{label}</span>

                                    <strong>
                                        {character[key]}
                                    </strong>

                                    <input
                                        type="range"
                                        min="1"
                                        max="20"
                                        value={character[key]}
                                        onChange={(event) =>
                                            updateCharacter(
                                                key,
                                                Number(
                                                    event.target.value
                                                )
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 6:
                return (
                    <section className="criar-personagem-step">
                        <div className="criar-step-heading">
                            <span>PASSO 6</span>
                            <h2>Detalhes do personagem</h2>
                            <p>
                                Agora podemos completar a personalidade
                                e os elementos narrativos da ficha.
                            </p>
                        </div>

                        <div className="criar-form-grid">
                            <label className="criar-field">
                                <span>Traço de personalidade</span>

                                <input
                                    type="text"
                                    value={character.personality}
                                    onChange={(event) =>
                                        updateCharacter(
                                            "personality",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Como ele se comporta?"
                                />
                            </label>

                            <label className="criar-field">
                                <span>Ideal</span>

                                <input
                                    type="text"
                                    value={character.ideals}
                                    onChange={(event) =>
                                        updateCharacter(
                                            "ideals",
                                            event.target.value
                                        )
                                    }
                                    placeholder="No que ele acredita?"
                                />
                            </label>

                            <label className="criar-field">
                                <span>Vínculo</span>

                                <input
                                    type="text"
                                    value={character.bonds}
                                    onChange={(event) =>
                                        updateCharacter(
                                            "bonds",
                                            event.target.value
                                        )
                                    }
                                    placeholder="O que é importante para ele?"
                                />
                            </label>

                            <label className="criar-field">
                                <span>Defeito</span>

                                <input
                                    type="text"
                                    value={character.flaws}
                                    onChange={(event) =>
                                        updateCharacter(
                                            "flaws",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Qual é sua fraqueza?"
                                />
                            </label>
                        </div>
                    </section>
                );

            case 7:
                return (
                    <section className="criar-personagem-step">
                        <div className="criar-step-heading">
                            <span>PASSO 7</span>
                            <h2>Revise sua ficha</h2>
                            <p>
                                Confira as principais informações antes
                                de finalizar seu personagem.
                            </p>
                        </div>

                        <div className="criar-review">
                            <div className="criar-review-header">
                                <div className="criar-review-avatar">
                                    <UserRound size={38} />
                                </div>

                                <div>
                                    <span>
                                        PERSONAGEM D&D 5E
                                    </span>

                                    <h3>
                                        {character.name ||
                                            "Personagem sem nome"}
                                    </h3>

                                    <p>
                                        {character.race ||
                                            "Raça não selecionada"}

                                        {" • "}

                                        {character.class ||
                                            "Classe não selecionada"}
                                    </p>
                                </div>
                            </div>

                            <div className="criar-review-grid">
                                <div>
                                    <span>ANTECEDENTE</span>
                                    <strong>
                                        {character.background ||
                                            "Não selecionado"}
                                    </strong>
                                </div>

                                <div>
                                    <span>NÍVEL</span>
                                    <strong>
                                        {character.level}
                                    </strong>
                                </div>

                                <div>
                                    <span>ALINHAMENTO</span>
                                    <strong>
                                        {character.alignment ||
                                            "Não selecionado"}
                                    </strong>
                                </div>

                                <div>
                                    <span>VIDA</span>
                                    <strong>
                                        {character.hitPoints ||
                                            "A calcular"}
                                    </strong>
                                </div>
                            </div>

                            <div className="criar-review-attributes">
                                {[
                                    ["FOR", character.strength],
                                    ["DES", character.dexterity],
                                    ["CON", character.constitution],
                                    ["INT", character.intelligence],
                                    ["SAB", character.wisdom],
                                    ["CAR", character.charisma],
                                ].map(([label, value]) => (
                                    <div key={label}>
                                        <span>{label}</span>
                                        <strong>{value}</strong>
                                    </div>
                                ))}
                            </div>

                            <div className="criar-review-note">
                                <Heart size={17} />

                                <span>
                                    A ficha ainda receberá cálculos,
                                    proficiências, equipamentos,
                                    características de classe,
                                    habilidades e demais regras.
                                </span>
                            </div>
                        </div>
                    </section>
                );

            default:
                return null;
        }
    }

    return (
        <PageBase
            title="Criar Personagem"
            subtitle="Construa seu aventureiro para Dungeons & Dragons."
            icon={Sword}
            onNavigate={onNavigate}
        >
            <div className="criar-personagem-page">

                {/* =====================================================
                    TOPO
                ====================================================== */}

                <section className="criar-personagem-top">

                    <button
                        type="button"
                        className="criar-cancel-button"
                        onClick={handleCancel}
                    >
                        <ArrowLeft size={17} />
                        Voltar para personagens
                    </button>

                    <div className="criar-system-badge">
                        <Sword size={16} />
                        <span>D&D 5E</span>
                    </div>

                </section>

                {/* =====================================================
                    PROGRESSO
                ====================================================== */}

                <section className="criar-progress">

                    <div className="criar-progress-line">
                        <div
                            className="criar-progress-fill"
                            style={{
                                width: `${
                                    ((currentStep - 1) /
                                        (steps.length - 1)) *
                                    100
                                }%`,
                            }}
                        />
                    </div>

                    <div className="criar-steps">

                        {steps.map((step) => {
                            const StepIcon = step.icon;

                            const active =
                                step.id === currentStep;

                            const completed =
                                step.id < currentStep;

                            return (
                                <button
                                    type="button"
                                    key={step.id}
                                    className={`criar-step-indicator ${
                                        active
                                            ? "active"
                                            : ""
                                    } ${
                                        completed
                                            ? "completed"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        if (
                                            step.id <=
                                            currentStep
                                        ) {
                                            setCurrentStep(
                                                step.id
                                            );
                                        }
                                    }}
                                >
                                    <div className="criar-step-icon">
                                        <StepIcon size={17} />
                                    </div>

                                    <span>
                                        {step.title}
                                    </span>
                                </button>
                            );
                        })}

                    </div>

                </section>

                {/* =====================================================
                    ÁREA PRINCIPAL
                ====================================================== */}

                <motion.section
                    className="criar-personagem-card"
                    key={currentStep}
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.3,
                    }}
                >

                    <div className="criar-personagem-card-header">

                        <div className="criar-personagem-card-icon">
                            {currentStepData && (
                                <currentStepData.icon size={24} />
                            )}
                        </div>

                        <div>
                            <span>
                                {currentStepData?.description}
                            </span>

                            <h2>
                                {currentStepData?.title}
                            </h2>
                        </div>

                    </div>

                    {renderStep()}

                </motion.section>

                {/* =====================================================
                    NAVEGAÇÃO
                ====================================================== */}

                <section className="criar-personagem-navigation">

                    <button
                        type="button"
                        className="criar-navigation-back"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                    >
                        <ArrowLeft size={17} />
                        Voltar
                    </button>

                    <div className="criar-navigation-info">
                        <span>
                            ETAPA {currentStep} DE{" "}
                            {steps.length}
                        </span>

                        <strong>
                            {currentStepData?.title}
                        </strong>
                    </div>

                    <button
                        type="button"
                        className="criar-navigation-next"
                        onClick={handleNext}
                        disabled={
                            currentStep === steps.length
                        }
                    >
                        Continuar
                        <ArrowRight size={17} />
                    </button>

                </section>

            </div>
        </PageBase>
    );
}
