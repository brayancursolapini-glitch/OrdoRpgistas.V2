import { useMemo, useState } from "react";

import { searchSpells } from "../../data/dnd5e/spells";
import { motion } from "framer-motion";

import {
    ArrowLeft,
    ArrowRight,
    Backpack,
    BookOpen,
    Check,
    Dices,
    Heart,
    Info,
    Shield,
    Sparkles,
    Sword,
    UserRound,
    X,
} from "lucide-react";

import PageBase from "../PageBase";

import "./CriarPersonagem.css";

const ABILITIES = [
    {
        id: "forca",
        name: "Força",
        short: "FOR",
        description: "Poder físico, atletismo e força corporal.",
    },
    {
        id: "destreza",
        name: "Destreza",
        short: "DES",
        description: "Agilidade, reflexos, equilíbrio e furtividade.",
    },
    {
        id: "constituicao",
        name: "Constituição",
        short: "CON",
        description: "Resistência, saúde e vigor físico.",
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
        description: "Percepção, intuição e conexão com o ambiente.",
    },
    {
        id: "carisma",
        name: "Carisma",
        short: "CAR",
        description: "Presença, liderança, persuasão e personalidade.",
    },
];

const SKILLS = [
    { id: "acrobacia", name: "Acrobacia", ability: "destreza" },
    { id: "adestrar", name: "Adestrar Animais", ability: "sabedoria" },
    { id: "arcanismo", name: "Arcanismo", ability: "inteligencia" },
    { id: "atletismo", name: "Atletismo", ability: "forca" },
    { id: "atuacao", name: "Atuação", ability: "carisma" },
    { id: "enganacao", name: "Enganação", ability: "carisma" },
    { id: "furtividade", name: "Furtividade", ability: "destreza" },
    { id: "historia", name: "História", ability: "inteligencia" },
    { id: "intimidacao", name: "Intimidação", ability: "carisma" },
    { id: "intuicao", name: "Intuição", ability: "sabedoria" },
    { id: "investigacao", name: "Investigação", ability: "inteligencia" },
    { id: "medicina", name: "Medicina", ability: "sabedoria" },
    { id: "natureza", name: "Natureza", ability: "inteligencia" },
    { id: "percepcao", name: "Percepção", ability: "sabedoria" },
    { id: "persuasao", name: "Persuasão", ability: "carisma" },
    { id: "prestidigitacao", name: "Prestidigitação", ability: "destreza" },
    { id: "religiao", name: "Religião", ability: "inteligencia" },
    { id: "sobrevivencia", name: "Sobrevivência", ability: "sabedoria" },
];

const LANGUAGES = [
    "Anão",
    "Comum",
    "Élfico",
    "Gigante",
    "Gnômico",
    "Goblin",
    "Halfling",
    "Orc",
    "Abissal",
    "Celestial",
    "Dracônico",
    "Fala Abissal",
    "Infernal",
    "Primordial",
    "Silvestre",
    "Subcomum",
];

const RACES = {
    "Anão": {
        bonus: { constituicao: 2 },
        speed: 25,
        languages: ["Comum", "Anão"],
        traits: [
            "Visão no escuro",
            "Resiliência Anã",
            "Treinamento de Combate Anão",
            "Proficiência com ferramentas de artesão",
            "Conhecimento de Pedras",
        ],
        info:
            "Anões são resistentes e recebem +2 em Constituição. Possuem visão no escuro, resistência contra veneno e talentos ligados à vida subterrânea.",
        subraces: {
            "Anão da Colina": {
                bonus: { sabedoria: 1 },
                traits: ["Tenacidade Anã"],
            },
            "Anão da Montanha": {
                bonus: { forca: 2 },
                traits: ["Treinamento com Armaduras Anãs"],
            },
        },
    },

    "Elfo": {
        bonus: { destreza: 2 },
        speed: 30,
        languages: ["Comum", "Élfico"],
        traits: [
            "Visão no escuro",
            "Sentidos Aguçados",
            "Ancestralidade Feérica",
            "Transe",
        ],
        info:
            "Elfos recebem +2 em Destreza. Sua herança feérica oferece resistência contra encantamento e eles não precisam dormir da maneira comum.",
        subraces: {
            "Alto Elfo": {
                bonus: { inteligencia: 1 },
                traits: ["Truque de Mago", "Idioma adicional"],
            },
            "Elfo da Floresta": {
                bonus: { sabedoria: 1 },
                speed: 35,
                traits: ["Máscara da Natureza"],
            },
            Drow: {
                bonus: { carisma: 1 },
                traits: ["Magia Drow", "Sensibilidade à Luz Solar"],
            },
        },
    },

    Halfling: {
        bonus: { destreza: 2 },
        speed: 25,
        languages: ["Comum", "Halfling"],
        traits: [
            "Sortudo",
            "Bravura",
            "Agilidade Halfling",
        ],
        info:
            "Halflings são pequenos, ágeis e sortudos, com facilidade para escapar de situações perigosas.",
        subraces: {
            "Pés Leves": {
                bonus: { carisma: 1 },
                traits: ["Furtividade Natural"],
            },
            "Robusto": {
                bonus: { constituicao: 1 },
                traits: ["Resiliência Robusta"],
            },
        },
    },

    Humano: {
        bonus: {
            forca: 1,
            destreza: 1,
            constituicao: 1,
            inteligencia: 1,
            sabedoria: 1,
            carisma: 1,
        },
        speed: 30,
        languages: ["Comum"],
        traits: ["Versatilidade Humana"],
        info:
            "Humanos são versáteis e se adaptam a diferentes estilos de aventura.",
        subraces: {},
    },

    Draconato: {
        bonus: { forca: 2, carisma: 1 },
        speed: 30,
        languages: ["Comum", "Dracônico"],
        traits: [
            "Ancestralidade Dracônica",
            "Arma de Sopro",
            "Resistência a dano",
        ],
        info:
            "Draconatos carregam uma herança dracônica que influencia suas capacidades e sua resistência.",
        subraces: {},
    },

    Gnomo: {
        bonus: { inteligencia: 2 },
        speed: 25,
        languages: ["Comum", "Gnômico"],
        traits: ["Visão no escuro", "Astúcia Gnômica"],
        info:
            "Gnomos são inventivos e curiosos, conhecidos por sua inteligência e engenhosidade.",
        subraces: {
            "Gnomo da Floresta": {
                bonus: { destreza: 1 },
                traits: ["Ilusionista Natural"],
            },
            "Gnomo das Rochas": {
                bonus: { constituicao: 1 },
                traits: ["Conhecimento de Artífice"],
            },
        },
    },

    "Meio-Elfo": {
        bonus: { carisma: 2 },
        speed: 30,
        languages: ["Comum", "Élfico"],
        traits: [
            "Visão no escuro",
            "Ancestralidade Feérica",
            "Versatilidade em Perícias",
        ],
        info:
            "Meio-elfos combinam características humanas e élficas, com versatilidade social e natural adaptabilidade.",
        subraces: {},
    },

    "Meio-Orc": {
        bonus: { forca: 2, constituicao: 1 },
        speed: 30,
        languages: ["Comum", "Orc"],
        traits: [
            "Visão no escuro",
            "Ameaçador",
            "Resistência Implacável",
            "Ataques Selvagens",
        ],
        info:
            "Meio-orcs são resistentes e intimidadores, capazes de continuar lutando mesmo diante de ferimentos graves.",
        subraces: {},
    },

    Tiefling: {
        bonus: { carisma: 2, inteligencia: 1 },
        speed: 30,
        languages: ["Comum", "Infernal"],
        traits: [
            "Visão no escuro",
            "Resistência Infernal",
            "Legado Infernal",
        ],
        info:
            "Tieflings carregam uma herança infernal que se manifesta em resistência e habilidades sobrenaturais.",
        subraces: {},
    },
};
const CLASSES = {
    Bárbaro: {
        hitDie: 12,
        primary: "forca",
        saves: ["forca", "constituicao"],
        skills: [
            "atletismo",
            "adestrar",
            "intimidacao",
            "natureza",
            "percepcao",
            "sobrevivencia",
        ],
        traits: ["Fúria", "Defesa sem Armadura"],
        info: "Guerreiro feroz que utiliza sua força e fúria para dominar o campo de batalha.",
    },

    Bardo: {
        hitDie: 8,
        primary: "carisma",
        saves: ["destreza", "carisma"],
        skills: [
            "acrobacia",
            "adestrar",
            "atuacao",
            "enganacao",
            "historia",
            "intimidacao",
            "intuicao",
            "investigacao",
            "medicina",
            "natureza",
            "percepcao",
            "persuasao",
            "prestidigitacao",
            "religiao",
            "sobrevivencia",
        ],
        traits: ["Inspiração de Bardo", "Conjuração"],
        info: "Especialista em magia, música e habilidades sociais.",
    },

    Clérigo: {
        hitDie: 8,
        primary: "sabedoria",
        saves: ["sabedoria", "carisma"],
        skills: [
            "historia",
            "intuicao",
            "medicina",
            "persuasao",
            "religiao",
        ],
        traits: ["Conjuração", "Domínio Divino"],
        info: "Conjurador divino capaz de apoiar aliados e enfrentar inimigos.",
    },

    Druida: {
        hitDie: 8,
        primary: "sabedoria",
        saves: ["inteligencia", "sabedoria"],
        skills: [
            "arcanismo",
            "adestrar",
            "intuicao",
            "medicina",
            "natureza",
            "percepcao",
            "religiao",
            "sobrevivencia",
        ],
        traits: ["Druídico", "Conjuração"],
        info: "Conjurador ligado à natureza e às forças naturais.",
    },

    Feiticeiro: {
        hitDie: 6,
        primary: "carisma",
        saves: ["constituicao", "carisma"],
        skills: [
            "arcanismo",
            "enganacao",
            "intuicao",
            "intimidacao",
            "persuasao",
            "religiao",
        ],
        traits: ["Conjuração", "Origem Feiticeira"],
        info: "Conjurador cuja magia surge de uma fonte inata de poder.",
    },

    Guerreiro: {
        hitDie: 10,
        primary: "forca",
        saves: ["forca", "constituicao"],
        skills: [
            "acrobacia",
            "adestrar",
            "atletismo",
            "historia",
            "intimidacao",
            "intuicao",
            "percepcao",
            "sobrevivencia",
        ],
        traits: ["Estilo de Luta", "Retomar o Fôlego"],
        info: "Especialista em combate, armas e armaduras.",
    },

    Ladino: {
        hitDie: 8,
        primary: "destreza",
        saves: ["destreza", "inteligencia"],
        skills: [
            "acrobacia",
            "atletismo",
            "atuacao",
            "enganacao",
            "furtividade",
            "intimidacao",
            "investigacao",
            "percepcao",
            "prestidigitacao",
        ],
        traits: ["Ataque Furtivo", "Especialização"],
        info: "Especialista em furtividade, precisão e exploração.",
    },

    Mago: {
        hitDie: 6,
        primary: "inteligencia",
        saves: ["inteligencia", "sabedoria"],
        skills: [
            "arcanismo",
            "historia",
            "intuicao",
            "investigacao",
            "medicina",
            "religiao",
        ],
        traits: ["Conjuração", "Recuperação Arcana"],
        info: "Conjurador dedicado ao estudo e domínio da magia.",
    },

    Monge: {
        hitDie: 8,
        primary: "destreza",
        saves: ["forca", "destreza"],
        skills: [
            "acrobacia",
            "atletismo",
            "historia",
            "intuicao",
            "religiao",
            "furtividade",
        ],
        traits: ["Defesa sem Armadura", "Artes Marciais"],
        info: "Combatente disciplinado que domina corpo e mente.",
    },

    Paladino: {
        hitDie: 10,
        primary: "forca",
        saves: ["sabedoria", "carisma"],
        skills: [
            "atletismo",
            "intuicao",
            "intimidacao",
            "medicina",
            "persuasao",
            "religiao",
        ],
        traits: ["Sentido Divino", "Cura pelas Mãos"],
        info: "Guerreiro sagrado que combina combate e poder divino.",
    },

    Patrulheiro: {
        hitDie: 10,
        primary: "destreza",
        saves: ["forca", "destreza"],
        skills: [
            "adestrar",
            "atletismo",
            "furtividade",
            "investigacao",
            "natureza",
            "percepcao",
            "sobrevivencia",
        ],
        traits: ["Inimigo Favorito", "Explorador Nato"],
        info: "Combatente e explorador especializado em sobrevivência.",
    },

    Bruxo: {
        hitDie: 8,
        primary: "carisma",
        saves: ["sabedoria", "carisma"],
        skills: [
            "arcanismo",
            "enganacao",
            "historia",
            "intimidacao",
            "investigacao",
            "natureza",
            "religiao",
        ],
        traits: ["Patrono Sobrenatural", "Magia de Pacto"],
        info: "Conjurador que recebe poder através de um pacto sobrenatural.",
    },
};

const BACKGROUNDS = {
    Acólito: {
        skills: ["intuicao", "religiao"],
        languages: 2,
        equipment: [
            "Símbolo sagrado",
            "Livro de orações",
            "5 velas",
            "Vestuário comum",
        ],
        info: "Personagem ligado a uma instituição religiosa.",
    },

    Criminoso: {
        skills: ["enganacao", "furtividade"],
        languages: 0,
        equipment: ["Pé de cabra", "Roupas escuras", "15 PO"],
        info: "Personagem acostumado ao submundo e às atividades ilegais.",
    },

    Eremita: {
        skills: ["medicina", "religiao"],
        languages: 1,
        equipment: [
            "Estojo de pergaminhos",
            "Cobertor",
            "Roupas comuns",
            "5 PO",
        ],
        info: "Personagem que passou longo período afastado da sociedade.",
    },

    Nobre: {
        skills: ["historia", "persuasao"],
        languages: 1,
        equipment: [
            "Roupas finas",
            "Anel de sinete",
            "Pergaminho de linhagem",
            "25 PO",
        ],
        info: "Personagem de posição social elevada.",
    },

    Sábio: {
        skills: ["arcanismo", "historia"],
        languages: 2,
        equipment: [
            "Garrafa de tinta",
            "Pena",
            "Pequena faca",
            "Pergaminho",
            "10 PO",
        ],
        info: "Estudioso dedicado à pesquisa e ao conhecimento.",
    },

    Soldado: {
        skills: ["atletismo", "intimidacao"],
        languages: 0,
        equipment: [
            "Insígnia de patente",
            "Troféu de guerra",
            "Jogo de dados",
            "Roupas comuns",
            "10 PO",
        ],
        info: "Personagem com experiência militar.",
    },

    Artesão: {
        skills: ["intuicao", "persuasao"],
        languages: 1,
        equipment: [
            "Ferramentas de artesão",
            "Carta de apresentação",
            "Roupas comuns",
            "15 PO",
        ],
        info: "Personagem treinado em uma profissão artesanal.",
    },

    Artista: {
        skills: ["acrobacia", "atuacao"],
        languages: 1,
        equipment: [
            "Instrumento musical",
            "Favor de admirador",
            "Traje artístico",
            "15 PO",
        ],
        info: "Personagem acostumado a apresentações e vida artística.",
    },
};

const STEP_DATA = [
    {
        id: 1,
        title: "Conceito",
        subtitle: "Comece definindo quem é seu personagem.",
        icon: UserRound,
    },
    {
        id: 2,
        title: "Raça",
        subtitle: "Escolha a origem e herança do personagem.",
        icon: Sparkles,
    },
    {
        id: 3,
        title: "Classe",
        subtitle: "Defina seu papel e estilo de jogo.",
        icon: Sword,
    },
    {
        id: 4,
        title: "Antecedente",
        subtitle: "Escolha o passado que moldou seu personagem.",
        icon: BookOpen,
    },
    {
        id: 5,
        title: "Proficiências",
        subtitle: "Escolha suas habilidades e conhecimentos.",
        icon: Shield,
    },
    {
        id: 6,
        title: "Atributos",
        subtitle: "Defina as capacidades básicas do personagem.",
        icon: Dices,
    },
    {
        id: 7,
        title: "Detalhes",
        subtitle: "Complete a personalidade e os detalhes narrativos.",
        icon: Info,
    },
    {
        id: 8,
        title: "Ficha",
        subtitle: "Revise e finalize seu personagem.",
        icon: Heart,
    },
];

function getAbilityModifier(score) {
    return Math.floor((Number(score) - 10) / 2);
}

function formatModifier(value) {
    const modifier = Number(value) || 0;
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

function getProficiencyBonus(level) {
    const currentLevel = Math.max(1, Number(level) || 1);

    if (currentLevel >= 17) return 6;
    if (currentLevel >= 13) return 5;
    if (currentLevel >= 9) return 4;
    if (currentLevel >= 5) return 3;

    return 2;
}

function getSpellcastingAbility(className) {
    const abilities = {
        Bardo: "carisma",
        Bruxo: "carisma",
        Feiticeiro: "carisma",
        Clérigo: "sabedoria",
        Druida: "sabedoria",
        Mago: "inteligencia",
        Paladino: "carisma",
        Patrulheiro: "sabedoria",
    };

    return abilities[className] || null;
}

function normalizeArray(value) {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined || value === "") return [];
    return [value];
}
export default function CriarPersonagem({ onNavigate }) {
    const [currentStep, setCurrentStep] = useState(1);

    const [character, setCharacter] = useState({
        name: "",
        race: "Humano",
        subrace: "",
        class: "Guerreiro",
        background: "Soldado",
        level: 1,
        abilities: {
            forca: 15,
            destreza: 14,
            constituicao: 13,
            inteligencia: 12,
            sabedoria: 10,
            carisma: 8,
        },
        extraAbilities: ["", ""],
        classSkills: [],
        raceSkills: [],
        alignment: "Neutro",
        experience: 0,
        personality: "",
        ideal: "",
        bond: "",
        flaw: "",
        concept: "",
        extraLanguages: [],
        equipment: [],
        spells: [],
    });

    const [completedCharacter, setCompletedCharacter] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [infoModal, setInfoModal] = useState(null);
    const [spellSearch, setSpellSearch] = useState("");

    const selectedRace = RACES[character.race] || RACES.Humano;
    const selectedClass = CLASSES[character.class] || CLASSES.Guerreiro;
    const selectedBackground =
        BACKGROUNDS[character.background] || BACKGROUNDS.Soldado;

    const proficiencyBonus = getProficiencyBonus(character.level);

    const constitutionModifier = getAbilityModifier(
        character.abilities.constituicao
    );

    const hitPoints = Math.max(
        1,
        Number(selectedClass.hitDie || 10) +
            constitutionModifier +
            (Number(character.level) - 1) *
                (Math.max(1, Math.floor(Number(selectedClass.hitDie || 10) / 2) + 1) +
                    constitutionModifier)
    );

    const armorClass = 10 + getAbilityModifier(character.abilities.destreza);

    const spellcastingAbility = getSpellcastingAbility(character.class);

    const spellcastingModifier = spellcastingAbility
        ? getAbilityModifier(character.abilities[spellcastingAbility])
        : 0;

    const spellSaveDC = 8 + proficiencyBonus + spellcastingModifier;
    const spellAttackBonus = proficiencyBonus + spellcastingModifier;

    const availableRaceSkills = normalizeArray(selectedRace.skills);
    const availableClassSkills = normalizeArray(selectedClass.skills);
    const availableBackgroundSkills = normalizeArray(selectedBackground.skills);

    const allAvailableSkills = useMemo(() => {
        return SKILLS.filter((skill) => {
            return (
                availableClassSkills.includes(skill.id) ||
                availableBackgroundSkills.includes(skill.id) ||
                availableRaceSkills.includes(skill.id)
            );
        });
    }, [
        character.class,
        character.background,
        character.race,
    ]);

    const availableSpells = useMemo(() => {
        if (typeof searchSpells !== "function") return [];

        try {
            const results = searchSpells(spellSearch);
            return Array.isArray(results) ? results : [];
        } catch {
            return [];
        }
    }, [spellSearch]);

    function updateCharacter(field, value) {
        setCharacter((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrorMessage("");
    }

    function updateAbility(abilityId, value) {
        const parsedValue = Number(value);

        setCharacter((previous) => ({
            ...previous,
            abilities: {
                ...previous.abilities,
                [abilityId]: Number.isFinite(parsedValue)
                    ? Math.min(20, Math.max(3, parsedValue))
                    : 10,
            },
        }));

        setErrorMessage("");
    }

    function updateExtraAbility(index, value) {
        setCharacter((previous) => {
            const updated = [...normalizeArray(previous.extraAbilities)];

            while (updated.length < 2) {
                updated.push("");
            }

            updated[index] = value;

            return {
                ...previous,
                extraAbilities: updated,
            };
        });
    }

    function toggleArrayValue(field, value) {
        setCharacter((previous) => {
            const currentValues = normalizeArray(previous[field]);
            const exists = currentValues.includes(value);

            return {
                ...previous,
                [field]: exists
                    ? currentValues.filter((item) => item !== value)
                    : [...currentValues, value],
            };
        });

        setErrorMessage("");
    }

    function toggleClassSkill(skillId) {
        toggleArrayValue("classSkills", skillId);
    }

    function toggleRaceSkill(skillId) {
        toggleArrayValue("raceSkills", skillId);
    }

    function toggleLanguage(language) {
        toggleArrayValue("extraLanguages", language);
    }

    function toggleEquipment(item) {
        toggleArrayValue("equipment", item);
    }

    function toggleSpell(spell) {
        const spellName =
            typeof spell === "string"
                ? spell
                : spell?.name || spell?.nome || spell?.index;

        if (!spellName) return;

        setCharacter((previous) => {
            const currentSpells = normalizeArray(previous.spells);
            const exists = currentSpells.some((item) => {
                const name =
                    typeof item === "string"
                        ? item
                        : item?.name || item?.nome || item?.index;

                return name === spellName;
            });

            return {
                ...previous,
                spells: exists
                    ? currentSpells.filter((item) => {
                          const name =
                              typeof item === "string"
                                  ? item
                                  : item?.name || item?.nome || item?.index;

                          return name !== spellName;
                      })
                    : [...currentSpells, spell],
            };
        });
    }

    function changeRace(raceName) {
        const race = RACES[raceName];

        setCharacter((previous) => ({
            ...previous,
            race: raceName,
            subrace: "",
            raceSkills: [],
            extraLanguages: [],
        }));

        setErrorMessage("");

        if (!race) {
            setInfoModal(null);
        }
    }

    function changeClass(className) {
        setCharacter((previous) => ({
            ...previous,
            class: className,
            classSkills: [],
            spells: [],
        }));

        setErrorMessage("");
    }

    function changeBackground(backgroundName) {
        setCharacter((previous) => ({
            ...previous,
            background: backgroundName,
        }));

        setErrorMessage("");
    }

    function goToStep(step) {
        const nextStep = Math.min(STEP_DATA.length, Math.max(1, step));

        setCurrentStep(nextStep);
        setErrorMessage("");
    }

    function validateCurrentStep() {
        switch (currentStep) {
            case 1:
                if (!character.concept.trim()) {
                    setErrorMessage(
                        "Descreva o conceito do seu personagem antes de continuar."
                    );
                    return false;
                }
                return true;

            case 2:
                if (!character.race || !RACES[character.race]) {
                    setErrorMessage("Selecione uma raça para continuar.");
                    return false;
                }
                return true;

            case 3:
                if (!character.class || !CLASSES[character.class]) {
                    setErrorMessage("Selecione uma classe para continuar.");
                    return false;
                }
                return true;

            case 4:
                if (
                    !character.background ||
                    !BACKGROUNDS[character.background]
                ) {
                    setErrorMessage("Selecione um antecedente para continuar.");
                    return false;
                }
                return true;

            case 5:
                return true;

            case 6: {
                const scores = Object.values(character.abilities);

                if (
                    scores.some(
                        (score) =>
                            !Number.isFinite(Number(score)) ||
                            Number(score) < 3 ||
                            Number(score) > 20
                    )
                ) {
                    setErrorMessage(
                        "Os atributos devem estar entre 3 e 20."
                    );
                    return false;
                }

                return true;
            }

            case 7:
                if (!character.name.trim()) {
                    setErrorMessage("Digite o nome do personagem.");
                    return false;
                }
                return true;

            default:
                return true;
        }
    }

    function handleNext() {
        if (!validateCurrentStep()) return;

        if (currentStep < STEP_DATA.length) {
            goToStep(currentStep + 1);
        } else {
            finishCharacter();
        }
    }

    function handlePrevious() {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        } else if (typeof onNavigate === "function") {
            onNavigate("personagens");
        }
    }

    function openInfo(title, description) {
        setInfoModal({
            title,
            description,
        });
    }

    function closeInfo() {
        setInfoModal(null);
    }

    // A próxima parte continuará com a montagem da ficha,
    // o salvamento e a renderização das etapas do criador.
    function buildCharacter() {
        const race = RACES[character.race] || RACES.Humano;
        const characterClass =
            CLASSES[character.class] || CLASSES.Guerreiro;
        const background =
            BACKGROUNDS[character.background] || BACKGROUNDS.Soldado;

        const subrace =
            race.subraces && character.subrace
                ? race.subraces[character.subrace]
                : null;

        const abilities = { ...character.abilities };

        if (subrace?.bonus && typeof subrace.bonus === "object") {
            Object.entries(subrace.bonus).forEach(([ability, bonus]) => {
                if (Object.prototype.hasOwnProperty.call(abilities, ability)) {
                    abilities[ability] = Math.min(
                        20,
                        Number(abilities[ability]) + Number(bonus || 0)
                    );
                }
            });
        }

        const savingThrows = normalizeArray(characterClass.saves);

        const skills = SKILLS.map((skill) => {
            const modifier = getAbilityModifier(
                abilities[skill.ability] ?? 10
            );

            const proficient =
                normalizeArray(character.classSkills).includes(skill.id) ||
                normalizeArray(character.raceSkills).includes(skill.id) ||
                normalizeArray(background.skills).includes(skill.id);

            return {
                ...skill,
                proficient,
                modifier: modifier + (proficient ? proficiencyBonus : 0),
            };
        });

        const savingThrowValues = ABILITIES.map((ability) => {
            const modifier = getAbilityModifier(abilities[ability.id] ?? 10);
            const proficient = savingThrows.includes(ability.id);

            return {
                ...ability,
                proficient,
                modifier: modifier + (proficient ? proficiencyBonus : 0),
            };
        });

        const raceLanguages = normalizeArray(race.languages);
        const languages = [
            ...new Set([
                ...raceLanguages,
                ...normalizeArray(character.extraLanguages),
            ]),
        ];

        const traits = [
            ...normalizeArray(race.traits),
            ...normalizeArray(subrace?.traits),
            ...normalizeArray(characterClass.traits),
        ];

        const spellAbility = getSpellcastingAbility(character.class);
        const spellModifier = spellAbility
            ? getAbilityModifier(abilities[spellAbility] ?? 10)
            : 0;

        const constitutionMod = getAbilityModifier(
            abilities.constituicao ?? 10
        );

        const hitDie = Number(characterClass.hitDie) || 10;
        const level = Math.max(1, Number(character.level) || 1);

        const hp =
            hitDie +
            constitutionMod +
            (level - 1) *
                (Math.floor(hitDie / 2) + 1 + constitutionMod);

        return {
            ...character,
            abilities,
            level,
            proficiencyBonus,
            hitPoints: Math.max(1, hp),
            armorClass:
                10 + getAbilityModifier(abilities.destreza ?? 10),
            initiative: getAbilityModifier(abilities.destreza ?? 10),
            speed: Number(race.speed) || 9,
            hitDie,
            skills,
            savingThrows: savingThrowValues,
            languages,
            traits,
            spellcastingAbility: spellAbility,
            spellSaveDC: spellAbility
                ? 8 + proficiencyBonus + spellModifier
                : null,
            spellAttackBonus: spellAbility
                ? proficiencyBonus + spellModifier
                : null,
            raceInfo: race.info || "",
            classInfo: characterClass.info || "",
            backgroundInfo: background.info || "",
            subraceInfo: subrace || null,
            createdAt: new Date().toISOString(),
        };
    }

    function finishCharacter() {
        if (!character.name.trim()) {
            setErrorMessage("Digite o nome do personagem antes de finalizar.");
            goToStep(7);
            return;
        }

        try {
            const finalCharacter = buildCharacter();
            const storageKey = "ordo-rpgistas-personagens";

            let savedCharacters = [];

            try {
                const storedData = localStorage.getItem(storageKey);
                const parsedData = storedData ? JSON.parse(storedData) : [];

                savedCharacters = Array.isArray(parsedData)
                    ? parsedData
                    : [];
            } catch {
                savedCharacters = [];
            }

            const characterWithId = {
                ...finalCharacter,
                id: `personagem-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 9)}`,
            };

            localStorage.setItem(
                storageKey,
                JSON.stringify([...savedCharacters, characterWithId])
            );

            setCompletedCharacter(characterWithId);
            setErrorMessage("");
        } catch (error) {
            console.error(
                "[CRIAR PERSONAGEM] Erro ao finalizar:",
                error
            );

            setErrorMessage(
                "Não foi possível salvar o personagem. Verifique os dados e tente novamente."
            );
        }
    }

    function restartCreator() {
        setCharacter({
            name: "",
            race: "Humano",
            subrace: "",
            class: "Guerreiro",
            background: "Soldado",
            level: 1,
            abilities: {
                forca: 15,
                destreza: 14,
                constituicao: 13,
                inteligencia: 12,
                sabedoria: 10,
                carisma: 8,
            },
            extraAbilities: ["", ""],
            classSkills: [],
            raceSkills: [],
            alignment: "Neutro",
            experience: 0,
            personality: "",
            ideal: "",
            bond: "",
            flaw: "",
            concept: "",
            extraLanguages: [],
            equipment: [],
            spells: [],
        });

        setCurrentStep(1);
        setCompletedCharacter(null);
        setErrorMessage("");
        setInfoModal(null);
        setSpellSearch("");
    }

    function renderCurrentStep() {
        const commonProps = {
            character,
            updateCharacter,
            updateAbility,
            updateExtraAbility,
            toggleClassSkill,
            toggleRaceSkill,
            toggleLanguage,
            toggleEquipment,
            toggleSpell,
            openInfo,
            selectedRace,
            selectedClass,
            selectedBackground,
            proficiencyBonus,
            availableClassSkills,
            availableRaceSkills,
            availableBackgroundSkills,
            allAvailableSkills,
            availableSpells,
            spellSearch,
            setSpellSearch,
            hitPoints,
            armorClass,
            spellcastingAbility,
            spellSaveDC,
            spellAttackBonus,
        };

        switch (currentStep) {
            case 1:
                return <ConceptStep {...commonProps} />;

            case 2:
                return <RaceStep {...commonProps} />;

            case 3:
                return <ClassStep {...commonProps} />;

            case 4:
                return <BackgroundStep {...commonProps} />;

            case 5:
                return <ProficiencyStep {...commonProps} />;

            case 6:
                return <AbilitiesStep {...commonProps} />;

            case 7:
                return <DetailsStep {...commonProps} />;

            case 8:
                return <CharacterPreviewStep {...commonProps} />;

            default:
                return <ConceptStep {...commonProps} />;
        }
    }

    if (completedCharacter) {
        return (
            <PageBase>
                <CharacterSheet
                    character={completedCharacter}
                    onBack={() => {
                        if (typeof onNavigate === "function") {
                            onNavigate("personagens");
                        }
                    }}
                    onCreateAnother={restartCreator}
                />
            </PageBase>
        );
    }

    return (
        <PageBase>
            <main className="criar-personagem">
                <header className="criador-header">
                    <button
                        type="button"
                        className="criador-voltar"
                        onClick={handlePrevious}
                    >
                        <ArrowLeft size={18} />
                        <span>Voltar</span>
                    </button>

                    <div className="criador-titulo">
                        <span className="criador-eyebrow">
                            ORDO RPGISTAS
                        </span>
                        <h1>Criar personagem</h1>
                        <p>
                            Construa seu herói e prepare-se para a aventura.
                        </p>
                    </div>
                </header>

                <nav className="criador-progresso" aria-label="Etapas da criação">
                    {STEP_DATA.map((step) => {
                        const active = currentStep === step.id;
                        const completed = currentStep > step.id;
                        const StepIcon = step.icon;

                        return (
                            <button
                                key={step.id}
                                type="button"
                                className={[
                                    "criador-etapa",
                                    active ? "ativa" : "",
                                    completed ? "concluida" : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                                onClick={() => {
                                    if (step.id < currentStep) {
                                        goToStep(step.id);
                                    }
                                }}
                                disabled={step.id > currentStep}
                                aria-current={active ? "step" : undefined}
                            >
                                <span className="criador-etapa-icone">
                                    {completed ? (
                                        <Check size={17} />
                                    ) : StepIcon ? (
                                        <StepIcon size={17} />
                                    ) : (
                                        step.id
                                    )}
                                </span>

                                <span className="criador-etapa-texto">
                                    <strong>{step.title}</strong>
                                    <small>Etapa {step.id}</small>
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <section className="criador-conteudo">
                    <div className="criador-etapa-cabecalho">
                        <span>ETAPA {currentStep} DE {STEP_DATA.length}</span>
                        <h2>
                            {STEP_DATA.find(
                                (step) => step.id === currentStep
                            )?.title || "Criar personagem"}
                        </h2>
                    </div>

                    {errorMessage && (
                        <div className="criador-erro" role="alert">
                            <Info size={18} />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <motion.div
                        key={currentStep}
                        className="criador-etapa-corpo"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderCurrentStep()}
                    </motion.div>

                    <footer className="criador-navegacao">
                        <button
                            type="button"
                            className="criador-botao secundario"
                            onClick={handlePrevious}
                        >
                            <ArrowLeft size={18} />
                            Anterior
                        </button>

                        <span className="criador-contador">
                            {currentStep} / {STEP_DATA.length}
                        </span>

                        <button
                            type="button"
                            className="criador-botao principal"
                            onClick={handleNext}
                        >
                            {currentStep === STEP_DATA.length
                                ? "Criar personagem"
                                : "Continuar"}
                            {currentStep === STEP_DATA.length ? (
                                <Sparkles size={18} />
                            ) : (
                                <ArrowRight size={18} />
                            )}
                        </button>
                    </footer>
                </section>

                {infoModal && (
                    <InfoModal
                        title={infoModal.title}
                        description={infoModal.description}
                        onClose={closeInfo}
                    />
                )}
            </main>
        </PageBase>
    );
}
function ConceptStep({ character, updateCharacter }) {
    return (
        <div className="criador-grid">
            <section className="criador-card">
                <div className="criador-card-titulo">
                    <Sparkles size={20} />
                    <h3>Conceito do personagem</h3>
                </div>

                <p>
                    Conte um pouco sobre quem é seu personagem e qual será
                    seu papel na aventura.
                </p>

                <label htmlFor="conceito-personagem">
                    História e conceito
                </label>

                <textarea
                    id="conceito-personagem"
                    className="criador-textarea"
                    rows={7}
                    value={character.concept}
                    onChange={(event) =>
                        updateCharacter("concept", event.target.value)
                    }
                    placeholder="Ex.: Um guerreiro que busca descobrir o destino de sua família..."
                />

                <label htmlFor="nivel-personagem">Nível inicial</label>

                <select
                    id="nivel-personagem"
                    className="criador-select"
                    value={character.level}
                    onChange={(event) =>
                        updateCharacter("level", Number(event.target.value))
                    }
                >
                    {Array.from({ length: 20 }, (_, index) => index + 1).map(
                        (level) => (
                            <option key={level} value={level}>
                                Nível {level}
                            </option>
                        )
                    )}
                </select>
            </section>

            <section className="criador-card">
                <div className="criador-card-titulo">
                    <UserRound size={20} />
                    <h3>Identidade</h3>
                </div>

                <label htmlFor="nome-personagem">Nome do personagem</label>

                <input
                    id="nome-personagem"
                    className="criador-input"
                    value={character.name}
                    onChange={(event) =>
                        updateCharacter("name", event.target.value)
                    }
                    placeholder="Digite o nome do herói"
                />

                <label htmlFor="tendencia-personagem">Alinhamento</label>

                <select
                    id="tendencia-personagem"
                    className="criador-select"
                    value={character.alignment}
                    onChange={(event) =>
                        updateCharacter("alignment", event.target.value)
                    }
                >
                    {[
                        "Leal e Bom",
                        "Neutro e Bom",
                        "Caótico e Bom",
                        "Leal e Neutro",
                        "Neutro",
                        "Caótico e Neutro",
                        "Leal e Mau",
                        "Neutro e Mau",
                        "Caótico e Mau",
                    ].map((alignment) => (
                        <option key={alignment} value={alignment}>
                            {alignment}
                        </option>
                    ))}
                </select>
            </section>
        </div>
    );
}

function RaceStep({
    character,
    selectedRace,
    updateCharacter,
    openInfo,
}) {
    const raceEntries = Object.entries(RACES || {});

    const subraceEntries = Object.entries(selectedRace?.subraces || {});

    return (
        <div className="criador-secao">
            <p className="criador-descricao">
                Escolha a raça que define a origem, as características e as
                habilidades naturais do seu personagem.
            </p>

            <div className="criador-opcoes">
                {raceEntries.map(([raceName, race]) => (
                    <article
                        key={raceName}
                        className={[
                            "criador-opcao",
                            character.race === raceName ? "selecionada" : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    >
                        <button
                            type="button"
                            className="criador-opcao-selecionar"
                            onClick={() => {
                                updateCharacter("race", raceName);
                                updateCharacter("subrace", "");
                                updateCharacter("raceSkills", []);
                            }}
                        >
                            <span className="criador-opcao-marcador">
                                {character.race === raceName ? (
                                    <Check size={17} />
                                ) : (
                                    <UserRound size={19} />
                                )}
                            </span>

                            <span className="criador-opcao-conteudo">
                                <strong>{raceName}</strong>
                                <small>
                                    Deslocamento: {race.speed ?? 9} m
                                </small>
                            </span>
                        </button>

                        <button
                            type="button"
                            className="criador-info-botao"
                            aria-label={`Mais informações sobre ${raceName}`}
                            onClick={() =>
                                openInfo(
                                    raceName,
                                    race.info ||
                                        "Não há informações adicionais cadastradas."
                                )
                            }
                        >
                            <Info size={17} />
                        </button>
                    </article>
                ))}
            </div>

            {subraceEntries.length > 0 && (
                <section className="criador-card">
                    <h3>Sub-raça</h3>
                    <p>Escolha uma opção, caso esteja disponível.</p>

                    <div className="criador-opcoes">
                        {subraceEntries.map(([subraceName, subrace]) => (
                            <button
                                key={subraceName}
                                type="button"
                                className={[
                                    "criador-opcao",
                                    character.subrace === subraceName
                                        ? "selecionada"
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                                onClick={() =>
                                    updateCharacter("subrace", subraceName)
                                }
                            >
                                <span className="criador-opcao-marcador">
                                    {character.subrace === subraceName ? (
                                        <Check size={17} />
                                    ) : (
                                        <Shield size={18} />
                                    )}
                                </span>

                                <span className="criador-opcao-conteudo">
                                    <strong>{subraceName}</strong>
                                    <small>
                                        {normalizeArray(subrace.traits).join(
                                            ", "
                                        ) || "Características da sub-raça"}
                                    </small>
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            <section className="criador-card">
                <h3>Características raciais</h3>

                <p>
                    {selectedRace?.info ||
                        "Consulte as características disponíveis para esta raça."}
                </p>

                <ul className="criador-lista">
                    {normalizeArray(selectedRace?.traits).map(
                        (trait, index) => (
                            <li key={`${String(trait)}-${index}`}>
                                {typeof trait === "string"
                                    ? trait
                                    : trait?.name || "Característica racial"}
                            </li>
                        )
                    )}
                </ul>

                <h4>Idiomas</h4>

                <div className="criador-tags">
                    {normalizeArray(selectedRace?.languages).map(
                        (language, index) => (
                            <span
                                key={`${String(language)}-${index}`}
                                className="criador-tag"
                            >
                                {language}
                            </span>
                        )
                    )}
                </div>
            </section>
        </div>
    );
}

function ClassStep({
    character,
    selectedClass,
    updateCharacter,
    openInfo,
}) {
    const classEntries = Object.entries(CLASSES || {});

    return (
        <div className="criador-secao">
            <p className="criador-descricao">
                A classe define o estilo de combate, as habilidades e as
                especialidades do seu personagem.
            </p>

            <div className="criador-opcoes">
                {classEntries.map(([className, characterClass]) => (
                    <article
                        key={className}
                        className={[
                            "criador-opcao",
                            character.class === className ? "selecionada" : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    >
                        <button
                            type="button"
                            className="criador-opcao-selecionar"
                            onClick={() => {
                                updateCharacter("class", className);
                                updateCharacter("classSkills", []);
                                updateCharacter("spells", []);
                            }}
                        >
                            <span className="criador-opcao-marcador">
                                {character.class === className ? (
                                    <Check size={17} />
                                ) : (
                                    <Sword size={19} />
                                )}
                            </span>

                            <span className="criador-opcao-conteudo">
                                <strong>{className}</strong>
                                <small>
                                    Dado de vida: d{characterClass.hitDie || 10}
                                </small>
                                <small>
                                    Atributo principal:{" "}
                                    {characterClass.primary || "Variável"}
                                </small>
                            </span>
                        </button>

                        <button
                            type="button"
                            className="criador-info-botao"
                            aria-label={`Mais informações sobre ${className}`}
                            onClick={() =>
                                openInfo(
                                    className,
                                    characterClass.info ||
                                        "Não há informações adicionais cadastradas."
                                )
                            }
                        >
                            <Info size={17} />
                        </button>
                    </article>
                ))}
            </div>

            <section className="criador-card">
                <div className="criador-card-titulo">
                    <Shield size={20} />
                    <h3>Resumo da classe</h3>
                </div>

                <p>
                    {selectedClass?.info ||
                        "Características gerais da classe selecionada."}
                </p>

                <p>
                    <strong>Dado de vida:</strong>{" "}
                    d{selectedClass?.hitDie || 10}
                </p>

                <p>
                    <strong>Atributos principais:</strong>{" "}
                    {selectedClass?.primary || "Não especificados"}
                </p>

                <h4>Características</h4>

                <ul className="criador-lista">
                    {normalizeArray(selectedClass?.traits).map(
                        (trait, index) => (
                            <li key={`${String(trait)}-${index}`}>
                                {typeof trait === "string"
                                    ? trait
                                    : trait?.name || "Característica de classe"}
                            </li>
                        )
                    )}
                </ul>
            </section>
        </div>
    );
}

function BackgroundStep({
    character,
    selectedBackground,
    updateCharacter,
    openInfo,
}) {
    const backgroundEntries = Object.entries(BACKGROUNDS || {});

    return (
        <div className="criador-secao">
            <p className="criador-descricao">
                O antecedente representa a vida que seu personagem levava
                antes de começar a aventura.
            </p>

            <div className="criador-opcoes">
                {backgroundEntries.map(([backgroundName, background]) => (
                    <article
                        key={backgroundName}
                        className={[
                            "criador-opcao",
                            character.background === backgroundName
                                ? "selecionada"
                                : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    >
                        <button
                            type="button"
                            className="criador-opcao-selecionar"
                            onClick={() =>
                                updateCharacter("background", backgroundName)
                            }
                        >
                            <span className="criador-opcao-marcador">
                                {character.background === backgroundName ? (
                                    <Check size={17} />
                                ) : (
                                    <Backpack size={19} />
                                )}
                            </span>

                            <span className="criador-opcao-conteudo">
                                <strong>{backgroundName}</strong>
                                <small>
                                    {normalizeArray(background.skills).length}{" "}
                                    perícias associadas
                                </small>
                            </span>
                        </button>

                        <button
                            type="button"
                            className="criador-info-botao"
                            aria-label={`Mais informações sobre ${backgroundName}`}
                            onClick={() =>
                                openInfo(
                                    backgroundName,
                                    background.info ||
                                        "Não há informações adicionais cadastradas."
                                )
                            }
                        >
                            <Info size={17} />
                        </button>
                    </article>
                ))}
            </div>

            <section className="criador-card">
                <div className="criador-card-titulo">
                    <BookOpen size={20} />
                    <h3>Detalhes do antecedente</h3>
                </div>

                <p>
                    {selectedBackground?.info ||
                        "Informações do antecedente selecionado."}
                </p>

                <h4>Perícias relacionadas</h4>

                <div className="criador-tags">
                    {normalizeArray(selectedBackground?.skills).map(
                        (skillId) => {
                            const skill = SKILLS.find(
                                (item) => item.id === skillId
                            );

                            return (
                                <span key={skillId} className="criador-tag">
                                    {skill?.name || skillId}
                                </span>
                            );
                        }
                    )}
                </div>

                <h4>Equipamentos sugeridos</h4>

                <ul className="criador-lista">
                    {normalizeArray(selectedBackground?.equipment).map(
                        (item, index) => (
                            <li key={`${String(item)}-${index}`}>{item}</li>
                        )
                    )}
                </ul>

                <p>
                    <strong>Idiomas adicionais:</strong>{" "}
                    {Number(selectedBackground?.languages) || 0}
                </p>
            </section>
        </div>
    );
}
function ProficiencyStep({
    character,
    toggleClassSkill,
    toggleRaceSkill,
    toggleLanguage,
    toggleEquipment,
    availableClassSkills,
    availableRaceSkills,
    availableBackgroundSkills,
}) {
    const selectedBackground =
        BACKGROUNDS[character.background] || BACKGROUNDS.Soldado;

    const backgroundSkills = normalizeArray(selectedBackground.skills);
    const classSkills = normalizeArray(availableClassSkills);
    const raceSkills = normalizeArray(availableRaceSkills);

    return (
        <div className="criador-secao">
            <section className="criador-card">
                <div className="criador-card-titulo">
                    <Check size={20} />
                    <h3>Perícias da classe</h3>
                </div>

                <p>
                    Selecione as perícias que deseja destacar para seu
                    personagem.
                </p>

                <div className="criador-lista-opcoes">
                    {classSkills.map((skillId) => {
                        const skill = SKILLS.find(
                            (item) => item.id === skillId
                        );

                        if (!skill) return null;

                        const checked = normalizeArray(
                            character.classSkills
                        ).includes(skillId);

                        return (
                            <label
                                key={skillId}
                                className="criador-checkbox"
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleClassSkill(skillId)}
                                />
                                <span>{skill.name}</span>
                            </label>
                        );
                    })}
                </div>
            </section>

            <section className="criador-card">
                <div className="criador-card-titulo">
                    <Shield size={20} />
                    <h3>Perícias raciais</h3>
                </div>

                {raceSkills.length === 0 ? (
                    <p>
                        Não há perícias raciais adicionais cadastradas para
                        esta raça.
                    </p>
                ) : (
                    <div className="criador-lista-opcoes">
                        {raceSkills.map((skillId) => {
                            const skill = SKILLS.find(
                                (item) => item.id === skillId
                            );

                            if (!skill) return null;

                            return (
                                <label
                                    key={skillId}
                                    className="criador-checkbox"
                                >
                                    <input
                                        type="checkbox"
                                        checked={normalizeArray(
                                            character.raceSkills
                                        ).includes(skillId)}
                                        onChange={() =>
                                            toggleRaceSkill(skillId)
                                        }
                                    />
                                    <span>{skill.name}</span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </section>

            <section className="criador-card">
                <div className="criador-card-titulo">
                    <BookOpen size={20} />
                    <h3>Perícias do antecedente</h3>
                </div>

                <div className="criador-tags">
                    {backgroundSkills.map((skillId) => {
                        const skill = SKILLS.find(
                            (item) => item.id === skillId
                        );

                        return (
                            <span key={skillId} className="criador-tag">
                                {skill?.name || skillId}
                            </span>
                        );
                    })}
                </div>

                <p>
                    Essas perícias são apresentadas como parte do antecedente
                    selecionado.
                </p>
            </section>

            <section className="criador-card">
                <div className="criador-card-titulo">
                    <BookOpen size={20} />
                    <h3>Idiomas adicionais</h3>
                </div>

                <p>Selecione os idiomas que seu personagem conhece.</p>

                <div className="criador-lista-opcoes">
                    {LANGUAGES.map((language) => (
                        <label
                            key={language}
                            className="criador-checkbox"
                        >
                            <input
                                type="checkbox"
                                checked={normalizeArray(
                                    character.extraLanguages
                                ).includes(language)}
                                onChange={() => toggleLanguage(language)}
                            />
                            <span>{language}</span>
                        </label>
                    ))}
                </div>
            </section>

            <section className="criador-card">
                <div className="criador-card-titulo">
                    <Backpack size={20} />
                    <h3>Equipamentos extras</h3>
                </div>

                <p>Adicione itens para lembrar o que seu personagem carrega.</p>

                <div className="criador-lista-opcoes">
                    {[
                        "Mochila",
                        "Corda",
                        "Tocha",
                        "Rações de viagem",
                        "Kit de aventureiro",
                        "Poção de cura",
                        "Mapa",
                        "Ferramentas",
                    ].map((item) => (
                        <label key={item} className="criador-checkbox">
                            <input
                                type="checkbox"
                                checked={normalizeArray(
                                    character.equipment
                                ).includes(item)}
                                onChange={() => toggleEquipment(item)}
                            />
                            <span>{item}</span>
                        </label>
                    ))}
                </div>
            </section>
        </div>
    );
}

function AbilitiesStep({ character, updateAbility }) {
    return (
        <div className="criador-secao">
            <p className="criador-descricao">
                Ajuste os seis atributos principais. Os modificadores são
                calculados automaticamente.
            </p>

            <div className="criador-atributos">
                {ABILITIES.map((ability) => {
                    const score = Number(
                        character.abilities[ability.id] ?? 10
                    );

                    return (
                        <article
                            key={ability.id}
                            className="criador-atributo"
                        >
                            <div className="criador-atributo-cabecalho">
                                <strong>{ability.name}</strong>
                                <span>{ability.short}</span>
                            </div>

                            <p>{ability.description}</p>

                            <input
                                type="number"
                                min="3"
                                max="20"
                                className="criador-input"
                                value={score}
                                onChange={(event) =>
                                    updateAbility(
                                        ability.id,
                                        event.target.value
                                    )
                                }
                                aria-label={`Valor de ${ability.name}`}
                            />

                            <div className="criador-modificador">
                                <span>Modificador</span>
                                <strong>
                                    {formatModifier(
                                        getAbilityModifier(score)
                                    )}
                                </strong>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

function DetailsStep({ character, updateCharacter }) {
    const fields = [
        {
            id: "personality",
            label: "Traços de personalidade",
            placeholder: "Como seu personagem costuma agir?",
        },
        {
            id: "ideal",
            label: "Ideal",
            placeholder: "O que guia as decisões do personagem?",
        },
        {
            id: "bond",
            label: "Vínculo",
            placeholder: "Quem ou o que é importante para ele?",
        },
        {
            id: "flaw",
            label: "Defeito",
            placeholder: "Qual é sua fraqueza ou dificuldade?",
        },
    ];

    return (
        <div className="criador-secao">
            <section className="criador-card">
                <div className="criador-card-titulo">
                    <UserRound size={20} />
                    <h3>Personalidade e história</h3>
                </div>

                {fields.map((field) => (
                    <div className="criador-campo" key={field.id}>
                        <label htmlFor={`detalhe-${field.id}`}>
                            {field.label}
                        </label>

                        <textarea
                            id={`detalhe-${field.id}`}
                            className="criador-textarea"
                            rows={3}
                            value={character[field.id] || ""}
                            onChange={(event) =>
                                updateCharacter(
                                    field.id,
                                    event.target.value
                                )
                            }
                            placeholder={field.placeholder}
                        />
                    </div>
                ))}
            </section>

            <section className="criador-card">
                <div className="criador-card-titulo">
                    <Dices size={20} />
                    <h3>Experiência</h3>
                </div>

                <label htmlFor="experiencia-personagem">
                    Pontos de experiência (XP)
                </label>

                <input
                    id="experiencia-personagem"
                    type="number"
                    min="0"
                    className="criador-input"
                    value={character.experience}
                    onChange={(event) =>
                        updateCharacter(
                            "experience",
                            Math.max(0, Number(event.target.value) || 0)
                        )
                    }
                />
            </section>
        </div>
    );
}

function CharacterPreviewStep({
    character,
    selectedRace,
    selectedClass,
    selectedBackground,
    proficiencyBonus,
    hitPoints,
    armorClass,
    spellcastingAbility,
    spellSaveDC,
    spellAttackBonus,
}) {
    return (
        <div className="criador-secao">
            <section className="criador-ficha">
                <div className="criador-ficha-cabecalho">
                    <div>
                        <span className="criador-eyebrow">
                            FICHA DE AVENTUREIRO
                        </span>
                        <h2>{character.name || "Personagem sem nome"}</h2>
                        <p>
                            {character.race} {character.class}
                        </p>
                    </div>

                    <div className="criador-nivel">
                        <span>NÍVEL</span>
                        <strong>{character.level}</strong>
                    </div>
                </div>

                <div className="criador-resumo-grid">
                    <div>
                        <span>Antecedente</span>
                        <strong>{character.background}</strong>
                    </div>

                    <div>
                        <span>Alinhamento</span>
                        <strong>{character.alignment}</strong>
                    </div>

                    <div>
                        <span>Pontos de vida</span>
                        <strong>{hitPoints}</strong>
                    </div>

                    <div>
                        <span>Classe de armadura</span>
                        <strong>{armorClass}</strong>
                    </div>

                    <div>
                        <span>Bônus de proficiência</span>
                        <strong>{formatModifier(proficiencyBonus)}</strong>
                    </div>

                    <div>
                        <span>Deslocamento</span>
                        <strong>{selectedRace?.speed ?? 9} m</strong>
                    </div>
                </div>

                <h3>Atributos</h3>

                <div className="criador-atributos-ficha">
                    {ABILITIES.map((ability) => {
                        const score = Number(
                            character.abilities[ability.id] ?? 10
                        );

                        return (
                            <div key={ability.id}>
                                <span>{ability.short}</span>
                                <strong>{score}</strong>
                                <small>
                                    {formatModifier(
                                        getAbilityModifier(score)
                                    )}
                                </small>
                            </div>
                        );
                    })}
                </div>

                <h3>Informações da classe</h3>
                <p>{selectedClass?.info || "Sem descrição cadastrada."}</p>

                <h3>Informações da raça</h3>
                <p>{selectedRace?.info || "Sem descrição cadastrada."}</p>

                <h3>Antecedente</h3>
                <p>
                    {selectedBackground?.info ||
                        "Sem descrição cadastrada."}
                </p>

                {spellcastingAbility && (
                    <section className="criador-magia-resumo">
                        <h3>Magia</h3>
                        <p>
                            <strong>Atributo:</strong>{" "}
                            {spellcastingAbility}
                        </p>
                        <p>
                            <strong>CD para resistir:</strong>{" "}
                            {spellSaveDC}
                        </p>
                        <p>
                            <strong>Bônus de ataque mágico:</strong>{" "}
                            {formatModifier(spellAttackBonus)}
                        </p>
                    </section>
                )}

                <h3>Conceito</h3>
                <p>
                    {character.concept || "Nenhum conceito informado."}
                </p>

                <h3>Personalidade</h3>
                <p>
                    {character.personality ||
                        "Nenhum traço de personalidade informado."}
                </p>

                <h3>Ideal</h3>
                <p>{character.ideal || "Nenhum ideal informado."}</p>

                <h3>Vínculo</h3>
                <p>{character.bond || "Nenhum vínculo informado."}</p>

                <h3>Defeito</h3>
                <p>{character.flaw || "Nenhum defeito informado."}</p>

                <h3>Equipamentos</h3>

                {normalizeArray(character.equipment).length > 0 ? (
                    <ul className="criador-lista">
                        {normalizeArray(character.equipment).map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhum equipamento extra selecionado.</p>
                )}

                <h3>Magias selecionadas</h3>

                {normalizeArray(character.spells).length > 0 ? (
                    <ul className="criador-lista">
                        {normalizeArray(character.spells).map(
                            (spell, index) => (
                                <li key={index}>
                                    {typeof spell === "string"
                                        ? spell
                                        : spell?.name ||
                                          spell?.nome ||
                                          spell?.index ||
                                          "Magia selecionada"}
                                </li>
                            )
                        )}
                    </ul>
                ) : (
                    <p>Nenhuma magia selecionada.</p>
                )}
            </section>
        </div>
    );
}

function InfoModal({ title, description, onClose }) {
    return (
        <div
            className="criador-modal-fundo"
            role="presentation"
            onClick={onClose}
        >
            <section
                className="criador-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="criador-modal-titulo"
                onClick={(event) => event.stopPropagation()}
            >
                <header className="criador-modal-cabecalho">
                    <h2 id="criador-modal-titulo">{title}</h2>

                    <button
                        type="button"
                        className="criador-info-botao"
                        aria-label="Fechar informações"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="criador-modal-conteudo">
                    {description}
                </div>

                <button
                    type="button"
                    className="criador-botao principal"
                    onClick={onClose}
                >
                    Entendi
                </button>
            </section>
        </div>
    );
}

function CharacterSheet({ character, onBack, onCreateAnother }) {
    const abilities = character.abilities || {};

    return (
        <main className="criar-personagem">
            <section className="criador-ficha">
                <div className="criador-ficha-cabecalho">
                    <div>
                        <span className="criador-eyebrow">
                            PERSONAGEM CRIADO
                        </span>
                        <h1>{character.name}</h1>
                        <p>
                            {character.race} {character.class} — Nível{" "}
                            {character.level}
                        </p>
                    </div>

                    <div className="criador-nivel">
                        <Sparkles size={24} />
                    </div>
                </div>

                <div className="criador-resumo-grid">
                    <div>
                        <span>Pontos de vida</span>
                        <strong>{character.hitPoints}</strong>
                    </div>

                    <div>
                        <span>Classe de armadura</span>
                        <strong>{character.armorClass}</strong>
                    </div>

                    <div>
                        <span>Iniciativa</span>
                        <strong>
                            {formatModifier(character.initiative)}
                        </strong>
                    </div>

                    <div>
                        <span>Proficiência</span>
                        <strong>
                            {formatModifier(character.proficiencyBonus)}
                        </strong>
                    </div>
                </div>

                <h3>Atributos</h3>

                <div className="criador-atributos-ficha">
                    {ABILITIES.map((ability) => (
                        <div key={ability.id}>
                            <span>{ability.short}</span>
                            <strong>{abilities[ability.id] ?? 10}</strong>
                            <small>
                                {formatModifier(
                                    getAbilityModifier(
                                        abilities[ability.id] ?? 10
                                    )
                                )}
                            </small>
                        </div>
                    ))}
                </div>

                <h3>Perícias</h3>

                <div className="criador-tags">
                    {normalizeArray(character.skills)
                        .filter((skill) => skill.proficient)
                        .map((skill) => (
                            <span key={skill.id} className="criador-tag">
                                {skill.name}
                                {" "}
                                ({formatModifier(skill.modifier)})
                            </span>
                        ))}
                </div>

                <h3>Idiomas</h3>

                <div className="criador-tags">
                    {normalizeArray(character.languages).map(
                        (language, index) => (
                            <span
                                key={`${String(language)}-${index}`}
                                className="criador-tag"
                            >
                                {language}
                            </span>
                        )
                    )}
                </div>

                <h3>Características</h3>

                <ul className="criador-lista">
                    {normalizeArray(character.traits).map(
                        (trait, index) => (
                            <li key={`${String(trait)}-${index}`}>
                                {typeof trait === "string"
                                    ? trait
                                    : trait?.name ||
                                      "Característica do personagem"}
                            </li>
                        )
                    )}
                </ul>

                <h3>História</h3>
                <p>{character.concept || "Nenhuma história informada."}</p>

                <div className="criador-ficha-acoes">
                    <button
                        type="button"
                        className="criador-botao secundario"
                        onClick={onBack}
                    >
                        <ArrowLeft size={18} />
                        Meus personagens
                    </button>

                    <button
                        type="button"
                        className="criador-botao principal"
                        onClick={onCreateAnother}
                    >
                        <Sparkles size={18} />
                        Criar outro personagem
                    </button>
                </div>
            </section>
        </main>
    );
}
