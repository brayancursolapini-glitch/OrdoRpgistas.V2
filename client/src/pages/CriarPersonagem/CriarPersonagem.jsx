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
    {
        id: "acrobacia",
        name: "Acrobacia",
        ability: "destreza",
    },
    {
        id: "adestrar",
        name: "Adestrar Animais",
        ability: "sabedoria",
    },
    {
        id: "arcanismo",
        name: "Arcanismo",
        ability: "inteligencia",
    },
    {
        id: "atletismo",
        name: "Atletismo",
        ability: "forca",
    },
    {
        id: "atuacao",
        name: "Atuação",
        ability: "carisma",
    },
    {
        id: "enganacao",
        name: "Enganação",
        ability: "carisma",
    },
    {
        id: "furtividade",
        name: "Furtividade",
        ability: "destreza",
    },
    {
        id: "historia",
        name: "História",
        ability: "inteligencia",
    },
    {
        id: "intimidacao",
        name: "Intimidação",
        ability: "carisma",
    },
    {
        id: "intuicao",
        name: "Intuição",
        ability: "sabedoria",
    },
    {
        id: "investigacao",
        name: "Investigação",
        ability: "inteligencia",
    },
    {
        id: "medicina",
        name: "Medicina",
        ability: "sabedoria",
    },
    {
        id: "natureza",
        name: "Natureza",
        ability: "inteligencia",
    },
    {
        id: "percepcao",
        name: "Percepção",
        ability: "sabedoria",
    },
    {
        id: "persuasao",
        name: "Persuasão",
        ability: "carisma",
    },
    {
        id: "prestidigitacao",
        name: "Prestidigitação",
        ability: "destreza",
    },
    {
        id: "religiao",
        name: "Religião",
        ability: "inteligencia",
    },
    {
        id: "sobrevivencia",
        name: "Sobrevivência",
        ability: "sabedoria",
    },
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
        bonus: {
            constituicao: 2,
        },
        speed: 25,
        languages: [
            "Comum",
            "Anão",
        ],
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
                bonus: {
                    sabedoria: 1,
                },
                traits: [
                    "Tenacidade Anã",
                ],
            },
            "Anão da Montanha": {
                bonus: {
                    forca: 2,
                },
                traits: [
                    "Treinamento com Armaduras Anãs",
                ],
            },
        },
    },

    "Elfo": {
        bonus: {
            destreza: 2,
        },
        speed: 30,
        languages: [
            "Comum",
            "Élfico",
        ],
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
                bonus: {
                    inteligencia: 1,
                },
                traits: [
                    "Truque de Mago",
                    "Idioma adicional",
                ],
            },
            "Elfo da Floresta": {
                bonus: {
                    sabedoria: 1,
                },
                speed: 35,
                traits: [
                    "Máscara da Natureza",
                ],
            },
            "Drow": {
                bonus: {
                    carisma: 1,
                },
                traits: [
                    "Magia Drow",
                    "Sensibilidade à Luz Solar",
                ],
            },
        },
    },

    "Halfling": {
        bonus: {
            destreza: 2,
        },
        speed: 25,
        languages: [
            "Comum",
            "Halfling",
        ],
        traits: [
            "Sortudo",
            "Bravura",
            "Agilidade Halfling",
        ],
        info:
            "Halflings são pequenos, ágeis e sortudos, recebendo +2 em Destreza.",
        subraces: {
            "Pés-Leves": {
                bonus: {
                    carisma: 1,
                },
                traits: [
                    "Furtividade Natural",
                ],
            },
            "Robusto": {
                bonus: {
                    constituicao: 1,
                },
                traits: [
                    "Resiliência Robusta",
                ],
            },
        },
    },

    "Humano": {
        bonus: {
            forca: 1,
            destreza: 1,
            constituicao: 1,
            inteligencia: 1,
            sabedoria: 1,
            carisma: 1,
        },
        speed: 30,
        languages: [
            "Comum",
        ],
        traits: [
            "Versatilidade Humana",
        ],
        info:
            "Humanos são versáteis e recebem +1 em todos os seis atributos.",
        subraces: {
            "Humano": {
                bonus: {},
                traits: [],
            },
        },
    },

    "Draconato": {
        bonus: {
            forca: 2,
            carisma: 1,
        },
        speed: 30,
        languages: [
            "Comum",
            "Dracônico",
        ],
        traits: [
            "Ancestral Dracônico",
            "Arma de Sopro",
            "Resistência a Dano",
        ],
        info:
            "Draconatos possuem herança dracônica, força física e uma arma de sopro ligada à sua ancestralidade.",
        subraces: {
            "Draconato": {
                bonus: {},
                traits: [],
            },
        },
    },

    "Gnomo": {
        bonus: {
            inteligencia: 2,
        },
        speed: 25,
        languages: [
            "Comum",
            "Gnômico",
        ],
        traits: [
            "Visão no Escuro",
            "Astúcia Gnômica",
        ],
        info:
            "Gnomos são pequenos e extremamente inteligentes, conhecidos por sua curiosidade e engenhosidade.",
        subraces: {
            "Gnomo da Floresta": {
                bonus: {
                    destreza: 1,
                },
                traits: [
                    "Ilusionista Natural",
                    "Falar com Pequenas Feras",
                ],
            },
            "Gnomo das Rochas": {
                bonus: {
                    constituicao: 1,
                },
                traits: [
                    "Conhecimento de Artífice",
                ],
            },
        },
    },

    "Meio-Elfo": {
        bonus: {
            carisma: 2,
        },
        speed: 30,
        languages: [
            "Comum",
            "Élfico",
        ],
        traits: [
            "Visão no Escuro",
            "Ancestralidade Feérica",
            "Versatilidade em Perícias",
        ],
        info:
            "Meio-elfos combinam características humanas e élficas e possuem grande versatilidade social.",
        subraces: {
            "Meio-Elfo": {
                bonus: {},
                traits: [],
            },
        },
    },

    "Meio-Orc": {
        bonus: {
            forca: 2,
            constituicao: 1,
        },
        speed: 30,
        languages: [
            "Comum",
            "Orc",
        ],
        traits: [
            "Visão no Escuro",
            "Ameaçador",
            "Resistência Incansável",
            "Ataques Selvagens",
        ],
        info:
            "Meio-orcs combinam força e resistência, sendo especialmente eficientes em combate.",
        subraces: {
            "Meio-Orc": {
                bonus: {},
                traits: [],
            },
        },
    },

    "Tiefling": {
        bonus: {
            inteligencia: 1,
            carisma: 2,
        },
        speed: 30,
        languages: [
            "Comum",
            "Infernal",
        ],
        traits: [
            "Visão no Escuro",
            "Resistência Infernal",
            "Legado Infernal",
        ],
        info:
            "Tieflings possuem herança infernal e uma forte ligação com magia.",
        subraces: {
            "Tiefling": {
                bonus: {},
                traits: [],
            },
        },
    },
};

const CLASSES = {
    Bárbaro: {
        hitDie: 12,
        primary: "forca",
        saves: [
            "forca",
            "constituicao",
        ],
        skills: [
            "atletismo",
            "adestrar",
            "intimidacao",
            "natureza",
            "percepcao",
            "sobrevivencia",
        ],
        traits: [
            "Fúria",
            "Defesa sem Armadura",
        ],
        info:
            "Guerreiro feroz que utiliza sua força e fúria para dominar o campo de batalha.",
    },

    Bardo: {
        hitDie: 8,
        primary: "carisma",
        saves: [
            "destreza",
            "carisma",
        ],
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
        traits: [
            "Inspiração de Bardo",
            "Conjuração",
        ],
        info:
            "Especialista em magia, música e habilidades sociais.",
    },

    Clérigo: {
        hitDie: 8,
        primary: "sabedoria",
        saves: [
            "sabedoria",
            "carisma",
        ],
        skills: [
            "historia",
            "intuicao",
            "medicina",
            "persuasao",
            "religiao",
        ],
        traits: [
            "Conjuração",
            "Domínio Divino",
        ],
        info:
            "Conjurador divino capaz de apoiar aliados e enfrentar inimigos.",
    },

    Druida: {
        hitDie: 8,
        primary: "sabedoria",
        saves: [
            "inteligencia",
            "sabedoria",
        ],
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
        traits: [
            "Druídico",
            "Conjuração",
        ],
        info:
            "Conjurador ligado à natureza e às forças naturais.",
    },

    Feiticeiro: {
        hitDie: 6,
        primary: "carisma",
        saves: [
            "constituicao",
            "carisma",
        ],
        skills: [
            "arcanismo",
            "enganacao",
            "intuicao",
            "intimidacao",
            "persuasao",
            "religiao",
        ],
        traits: [
            "Conjuração",
            "Origem Feiticeira",
        ],
        info:
            "Conjurador cuja magia surge de uma fonte inata de poder.",
    },

    Guerreiro: {
        hitDie: 10,
        primary: "forca",
        saves: [
            "forca",
            "constituicao",
        ],
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
        traits: [
            "Estilo de Luta",
            "Retomar o Fôlego",
        ],
        info:
            "Especialista em combate, armas e armaduras.",
    },

    Ladino: {
        hitDie: 8,
        primary: "destreza",
        saves: [
            "destreza",
            "inteligencia",
        ],
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
        traits: [
            "Ataque Furtivo",
            "Especialização",
        ],
        info:
            "Especialista em furtividade, precisão e exploração.",
    },

    Mago: {
        hitDie: 6,
        primary: "inteligencia",
        saves: [
            "inteligencia",
            "sabedoria",
        ],
        skills: [
            "arcanismo",
            "historia",
            "intuicao",
            "investigacao",
            "medicina",
            "religiao",
        ],
        traits: [
            "Conjuração",
            "Recuperação Arcana",
        ],
        info:
            "Conjurador dedicado ao estudo e domínio da magia.",
    },

    Monge: {
        hitDie: 8,
        primary: "destreza",
        saves: [
            "forca",
            "destreza",
        ],
        skills: [
            "acrobacia",
            "atletismo",
            "historia",
            "intuicao",
            "religiao",
            "furtividade",
        ],
        traits: [
            "Defesa sem Armadura",
            "Artes Marciais",
        ],
        info:
            "Combatente disciplinado que domina corpo e mente.",
    },

    Paladino: {
        hitDie: 10,
        primary: "forca",
        saves: [
            "sabedoria",
            "carisma",
        ],
        skills: [
            "atletismo",
            "intuicao",
            "intimidacao",
            "medicina",
            "persuasao",
            "religiao",
        ],
        traits: [
            "Sentido Divino",
            "Cura pelas Mãos",
        ],
        info:
            "Guerreiro sagrado que combina combate e poder divino.",
    },

    Patrulheiro: {
        hitDie: 10,
        primary: "destreza",
        saves: [
            "forca",
            "destreza",
        ],
        skills: [
            "adestrar",
            "atletismo",
            "furtividade",
            "investigacao",
            "natureza",
            "percepcao",
            "sobrevivencia",
        ],
        traits: [
            "Inimigo Favorito",
            "Explorador Nato",
        ],
        info:
            "Combatente e explorador especializado em sobrevivência.",
    },

    Bruxo: {
        hitDie: 8,
        primary: "carisma",
        saves: [
            "sabedoria",
            "carisma",
        ],
        skills: [
            "arcanismo",
            "enganacao",
            "historia",
            "intimidacao",
            "investigacao",
            "natureza",
            "religiao",
        ],
        traits: [
            "Patrono Sobrenatural",
            "Magia de Pacto",
        ],
        info:
            "Conjurador que recebe poder através de um pacto sobrenatural.",
    },
};

const BACKGROUNDS = {
    Acólito: {
        skills: [
            "intuicao",
            "religiao",
        ],
        languages: 2,
        equipment: [
            "Símbolo sagrado",
            "Livro de orações",
            "5 velas",
            "Vestuário comum",
        ],
        info:
            "Personagem ligado a uma instituição religiosa.",
    },

    Criminoso: {
        skills: [
            "enganacao",
            "furtividade",
        ],
        languages: 0,
        equipment: [
            "Pé de cabra",
            "Roupas escuras",
            "15 PO",
        ],
        info:
            "Personagem acostumado ao submundo e às atividades ilegais.",
    },

    Eremita: {
        skills: [
            "medicina",
            "religiao",
        ],
        languages: 1,
        equipment: [
            "Estojo de pergaminhos",
            "Cobertor",
            "Roupas comuns",
            "5 PO",
        ],
        info:
            "Personagem que passou longo período afastado da sociedade.",
    },

    Nobre: {
        skills: [
            "historia",
            "persuasao",
        ],
        languages: 1,
        equipment: [
            "Roupas finas",
            "Anel de sinete",
            "Pergaminho de linhagem",
            "25 PO",
        ],
        info:
            "Personagem de posição social elevada.",
    },

    Sábio: {
        skills: [
            "arcanismo",
            "historia",
        ],
        languages: 2,
        equipment: [
            "Garrafa de tinta",
            "Pena",
            "Pequena faca",
            "Pergaminho",
            "10 PO",
        ],
        info:
            "Estudioso dedicado à pesquisa e ao conhecimento.",
    },

    Soldado: {
        skills: [
            "atletismo",
            "intimidacao",
        ],
        languages: 0,
        equipment: [
            "Insígnia de patente",
            "Troféu de guerra",
            "Jogo de dados",
            "Roupas comuns",
            "10 PO",
        ],
        info:
            "Personagem com experiência militar.",
    },

    Artesão: {
        skills: [
            "intuicao",
            "persuasao",
        ],
        languages: 1,
        equipment: [
            "Ferramentas de artesão",
            "Carta de apresentação",
            "Roupas comuns",
            "15 PO",
        ],
        info:
            "Personagem treinado em uma profissão artesanal.",
    },

    Artista: {
        skills: [
            "acrobacia",
            "atuacao",
        ],
        languages: 1,
        equipment: [
            "Instrumento musical",
            "Favor de admirador",
            "Traje artístico",
            "15 PO",
        ],
        info:
            "Personagem acostumado a apresentações e vida artística.",
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
    return value >= 0 ? `+${value}` : `${value}`;
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

function getInitialCharacter() {
    return {
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

        extraAbilities: [
            "",
            "",
        ],

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
    };
}

function createEmptyCharacter() {
    return getInitialCharacter();
}

function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
}

function getRaceData(character) {
    return RACES[character?.race] || RACES.Humano;
}

function getClassData(character) {
    return CLASSES[character?.class] || CLASSES.Guerreiro;
}

function getBackgroundData(character) {
    return BACKGROUNDS[character?.background] || BACKGROUNDS.Soldado;
}

function calculateAbilityScores(character) {
    const raceData = getRaceData(character);
    const subraceData =
        raceData?.subraces?.[character?.subrace] || {};

    const scores = {
        forca: Number(character?.abilities?.forca) || 0,
        destreza: Number(character?.abilities?.destreza) || 0,
        constituicao: Number(character?.abilities?.constituicao) || 0,
        inteligencia: Number(character?.abilities?.inteligencia) || 0,
        sabedoria: Number(character?.abilities?.sabedoria) || 0,
        carisma: Number(character?.abilities?.carisma) || 0,
    };

    Object.entries(raceData?.bonus || {}).forEach(
        ([ability, bonus]) => {
            scores[ability] += Number(bonus) || 0;
        }
    );

    Object.entries(subraceData?.bonus || {}).forEach(
        ([ability, bonus]) => {
            scores[ability] += Number(bonus) || 0;
        }
    );

    return scores;
}

function getAllRaceTraits(character) {
    const raceData = getRaceData(character);
    const subraceData =
        raceData?.subraces?.[character?.subrace] || {};

    return [
        ...(raceData?.traits || []),
        ...(subraceData?.traits || []),
    ];
}

function getAllLanguages(character) {
    const raceData = getRaceData(character);
    const backgroundData = getBackgroundData(character);

    return [
        ...new Set([
            ...(raceData?.languages || []),
            ...(backgroundData?.languagesList || []),
            ...normalizeArray(character?.extraLanguages),
        ]),
    ];
}

function getSelectedSkills(character) {
    return [
        ...new Set([
            ...(getClassData(character)?.skills || []),
            ...(getBackgroundData(character)?.skills || []),
            ...normalizeArray(character?.classSkills),
            ...normalizeArray(character?.raceSkills),
        ]),
    ];
}

function getSkillBonus(
    skill,
    abilities,
    proficientSkills,
    proficiencyBonus
) {
    const abilityScore = Number(abilities?.[skill?.ability]) || 10;
    const modifier = getAbilityModifier(abilityScore);
    const proficient = proficientSkills.includes(skill.id);

    return {
        modifier,
        proficient,
        bonus:
            modifier +
            (proficient ? Number(proficiencyBonus) || 0 : 0),
    };
}

function getSavingThrowBonus(
    ability,
    abilities,
    savingThrows,
    proficiencyBonus
) {
    const abilityScore = Number(abilities?.[ability?.id]) || 10;
    const modifier = getAbilityModifier(abilityScore);
    const proficient = savingThrows.includes(ability.id);

    return {
        modifier,
        proficient,
        bonus:
            modifier +
            (proficient ? Number(proficiencyBonus) || 0 : 0),
    };
}

function buildCharacter(character) {
    const abilityScores = calculateAbilityScores(character);

    const modifiers = {
        forca: getAbilityModifier(abilityScores.forca),
        destreza: getAbilityModifier(abilityScores.destreza),
        constituicao: getAbilityModifier(abilityScores.constituicao),
        inteligencia: getAbilityModifier(abilityScores.inteligencia),
        sabedoria: getAbilityModifier(abilityScores.sabedoria),
        carisma: getAbilityModifier(abilityScores.carisma),
    };

    const proficiencyBonus = getProficiencyBonus(character.level);

    const selectedClass = getClassData(character);
    const selectedRace = getRaceData(character);
    const selectedBackground = getBackgroundData(character);

    const proficientSkills = getSelectedSkills(character);

    const savingThrows = selectedClass?.saves || [];

    const skills = SKILLS.map((skill) => ({
        ...skill,
        ...getSkillBonus(
            skill,
            abilityScores,
            proficientSkills,
            proficiencyBonus
        ),
    }));

    const saves = ABILITIES.map((ability) => ({
        ...ability,
        ...getSavingThrowBonus(
            ability,
            abilityScores,
            savingThrows,
            proficiencyBonus
        ),
    }));

    const hitDie = Number(selectedClass?.hitDie) || 8;

    const hitPoints =
        hitDie +
        modifiers.constituicao;

    let armorClass =
        10 +
        modifiers.destreza;

    if (character.class === "Monge") {
        armorClass =
            10 +
            modifiers.destreza +
            modifiers.sabedoria;
    }

    if (character.class === "Bárbaro") {
        armorClass =
            10 +
            modifiers.destreza +
            modifiers.constituicao;
    }

    const initiative =
        modifiers.destreza;

    const spellAbility =
        getSpellcastingAbility(character.class);

    const spellAbilityModifier =
        spellAbility
            ? modifiers[spellAbility]
            : null;

    const spellSaveDC =
        spellAbilityModifier !== null
            ? 8 +
              proficiencyBonus +
              spellAbilityModifier
            : null;

    const spellAttack =
        spellAbilityModifier !== null
            ? proficiencyBonus +
              spellAbilityModifier
            : null;

    const traits = [
        ...(selectedClass?.traits || []),
        ...getAllRaceTraits(character),
    ];

    const languages = getAllLanguages(character);

    const equipment = [
        ...(selectedBackground?.equipment || []),
        ...normalizeArray(character.equipment),
    ];

    const spells = normalizeArray(character.spells)
        .map((spellId) => {
            if (typeof spellId === "object") {
                return spellId;
            }

            return searchSpells("").find(
                (spell) => spell.id === spellId
            );
        })
        .filter(Boolean);

    return {
        ...character,

        id:
            character.id ||
            `character-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,

        system: "dnd5e",
        systemName: "D&D 5e",

        raceData: selectedRace,
        classData: selectedClass,
        backgroundData: selectedBackground,

        abilityScores,
        modifiers,

        proficiencyBonus,

        skills,
        saves,

        savingThrows,

        hitDie,

        hitPoints,

        armorClass,

        initiative,

        spellAbility,
        spellAbilityModifier,
        spellSaveDC,
        spellAttack,

        traits,

        languages,

        equipment,

        spells,

        createdAt:
            character.createdAt ||
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),
    };
}

function CharacterStepConcept({
    character,
    setCharacter,
}) {
    function updateField(field, value) {
        setCharacter((current) => ({
            ...current,
            [field]: value,
        }));
    }

    return (
        <div className="creator-step-content">
            <div className="creator-section-heading">
                <div className="creator-section-icon">
                    <UserRound size={22} />
                </div>

                <div>
                    <span>IDENTIDADE</span>
                    <h2>Quem é seu personagem?</h2>
                    <p>
                        Comece criando a identidade básica do
                        seu aventureiro.
                    </p>
                </div>
            </div>

            <div className="creator-form-grid">
                <label className="creator-field creator-field-full">
                    <span>Nome do personagem</span>

                    <input
                        type="text"
                        value={character.name}
                        onChange={(event) =>
                            updateField(
                                "name",
                                event.target.value
                            )
                        }
                        placeholder="Ex.: Aric Valen"
                    />
                </label>

                <label className="creator-field creator-field-full">
                    <span>Conceito</span>

                    <input
                        type="text"
                        value={character.concept}
                        onChange={(event) =>
                            updateField(
                                "concept",
                                event.target.value
                            )
                        }
                        placeholder="Ex.: Guerreiro errante em busca de vingança"
                    />
                </label>

                <label className="creator-field">
                    <span>Alinhamento</span>

                    <select
                        value={character.alignment}
                        onChange={(event) =>
                            updateField(
                                "alignment",
                                event.target.value
                            )
                        }
                    >
                        <option value="Leal e Bom">
                            Leal e Bom
                        </option>

                        <option value="Neutro e Bom">
                            Neutro e Bom
                        </option>

                        <option value="Caótico e Bom">
                            Caótico e Bom
                        </option>

                        <option value="Leal e Neutro">
                            Leal e Neutro
                        </option>

                        <option value="Neutro">
                            Neutro
                        </option>

                        <option value="Caótico e Neutro">
                            Caótico e Neutro
                        </option>

                        <option value="Leal e Mau">
                            Leal e Mau
                        </option>

                        <option value="Neutro e Mau">
                            Neutro e Mau
                        </option>

                        <option value="Caótico e Mau">
                            Caótico e Mau
                        </option>
                    </select>
                </label>

                <label className="creator-field">
                    <span>Nível</span>

                    <select
                        value={character.level}
                        onChange={(event) =>
                            updateField(
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
            </div>

            <div className="creator-info-card">
                <Info size={18} />

                <div>
                    <strong>
                        Pense no conceito antes da ficha.
                    </strong>

                    <p>
                        Seu conceito pode ser uma frase curta
                        que resume a personalidade, objetivo
                        ou papel do personagem na aventura.
                    </p>
                </div>
            </div>
        </div>
    );
}

function CharacterStepRace({
    character,
    setCharacter,
}) {
    const raceData =
        RACES[character.race] ||
        RACES.Humano;

    const subraces =
        Object.keys(raceData.subraces || {});

    function selectRace(race) {
        const nextRace =
            RACES[race] || RACES.Humano;

        const nextSubrace =
            Object.keys(
                nextRace.subraces || {}
            )[0] || "";

        setCharacter((current) => ({
            ...current,
            race,
            subrace: nextSubrace,
        }));
    }

    function selectSubrace(subrace) {
        setCharacter((current) => ({
            ...current,
            subrace,
        }));
    }

    return (
        <div className="creator-step-content">
            <div className="creator-section-heading">
                <div className="creator-section-icon">
                    <Sparkles size={22} />
                </div>

                <div>
                    <span>HERANÇA</span>
                    <h2>Escolha sua raça</h2>
                    <p>
                        A raça define características físicas,
                        culturais e algumas habilidades.
                    </p>
                </div>
            </div>

            <div className="creator-option-grid">
                {Object.entries(RACES).map(
                    ([raceName, race]) => {
                        const active =
                            character.race === raceName;

                        return (
                            <button
                                type="button"
                                key={raceName}
                                className={`creator-option-card ${
                                    active
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    selectRace(
                                        raceName
                                    )
                                }
                            >
                                <div className="creator-option-card-top">
                                    <div className="creator-option-icon">
                                        <Sparkles
                                            size={20}
                                        />
                                    </div>

                                    {active && (
                                        <span className="creator-option-check">
                                            <Check
                                                size={15}
                                            />
                                        </span>
                                    )}
                                </div>

                                <strong>
                                    {raceName}
                                </strong>

                                <span>
                                    {race.info}
                                </span>
                            </button>
                        );
                    }
                )}
            </div>

            {subraces.length > 0 && (
                <div className="creator-subsection">
                    <div className="creator-subsection-heading">
                        <div>
                            <span>VARIANTE</span>
                            <h3>
                                Escolha uma sub-raça
                            </h3>
                        </div>
                    </div>

                    <div className="creator-mini-option-grid">
                        {subraces.map(
                            (subraceName) => {
                                const subrace =
                                    raceData
                                        .subraces?.[
                                        subraceName
                                    ];

                                const active =
                                    character.subrace ===
                                    subraceName;

                                return (
                                    <button
                                        type="button"
                                        key={
                                            subraceName
                                        }
                                        className={`creator-mini-option ${
                                            active
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            selectSubrace(
                                                subraceName
                                            )
                                        }
                                    >
                                        <div>
                                            <strong>
                                                {
                                                    subraceName
                                                }
                                            </strong>

                                            <span>
                                                {Object.entries(
                                                    subrace
                                                        ?.bonus ||
                                                        {}
                                                )
                                                    .map(
                                                        ([
                                                            ability,
                                                            bonus,
                                                        ]) =>
                                                            `+${bonus} ${ability}`
                                                    )
                                                    .join(
                                                        " • "
                                                    )}
                                            </span>
                                        </div>

                                        {active && (
                                            <Check
                                                size={
                                                    17
                                                }
                                            />
                                        )}
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>
            )}

            <div className="creator-info-card">
                <Sparkles size={18} />

                <div>
                    <strong>
                        Características raciais
                    </strong>

                    <p>
                        {raceData.info}
                    </p>

                    <div className="creator-tag-list">
                        {raceData.traits?.map(
                            (trait) => (
                                <span
                                    key={trait}
                                >
                                    {trait}
                                </span>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CharacterStepClass({
    character,
    setCharacter,
}) {
    const classData =
        CLASSES[character.class] ||
        CLASSES.Guerreiro;

    function selectClass(className) {
        setCharacter((current) => ({
            ...current,
            class: className,
            classSkills: [],
        }));
    }

    return (
        <div className="creator-step-content">
            <div className="creator-section-heading">
                <div className="creator-section-icon">
                    <Sword size={22} />
                </div>

                <div>
                    <span>PROFISSÃO</span>
                    <h2>Escolha sua classe</h2>
                    <p>
                        Sua classe determina seu estilo de
                        combate, habilidades e poderes.
                    </p>
                </div>
            </div>

            <div className="creator-option-grid">
                {Object.entries(CLASSES).map(
                    ([className, classInfo]) => {
                        const active =
                            character.class ===
                            className;

                        return (
                            <button
                                type="button"
                                key={className}
                                className={`creator-option-card ${
                                    active
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    selectClass(
                                        className
                                    )
                                }
                            >
                                <div className="creator-option-card-top">
                                    <div className="creator-option-icon">
                                        <Sword
                                            size={20}
                                        />
                                    </div>

                                    {active && (
                                        <span className="creator-option-check">
                                            <Check
                                                size={15}
                                            />
                                        </span>
                                    )}
                                </div>

                                <strong>
                                    {className}
                                </strong>

                                <span>
                                    {classInfo.info}
                                </span>

                                <small>
                                    d
                                    {
                                        classInfo.hitDie
                                    }{" "}
                                    • atributo principal:{" "}
                                    {
                                        ABILITIES.find(
                                            (
                                                ability
                                            ) =>
                                                ability.id ===
                                                classInfo.primary
                                        )?.name
                                    }
                                </small>
                            </button>
                        );
                    }
                )}
            </div>

            <div className="creator-info-card">
                <Sword size={18} />

                <div>
                    <strong>
                        Características da classe
                    </strong>

                    <p>
                        {classData.info}
                    </p>

                    <div className="creator-tag-list">
                        {classData.traits?.map(
                            (trait) => (
                                <span
                                    key={trait}
                                >
                                    {trait}
                                </span>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CharacterStepBackground({
    character,
    setCharacter,
}) {
    const backgroundData =
        BACKGROUNDS[
            character.background
        ] ||
        BACKGROUNDS.Soldado;

    function selectBackground(
        background
    ) {
        setCharacter((current) => ({
            ...current,
            background,
        }));
    }

    return (
        <div className="creator-step-content">
            <div className="creator-section-heading">
                <div className="creator-section-icon">
                    <BookOpen size={22} />
                </div>

                <div>
                    <span>HISTÓRIA</span>
                    <h2>Escolha seu antecedente</h2>
                    <p>
                        O passado do personagem influencia
                        suas perícias e equipamentos.
                    </p>
                </div>
            </div>

            <div className="creator-option-grid">
                {Object.entries(
                    BACKGROUNDS
                ).map(
                    ([
                        backgroundName,
                        background,
                    ]) => {
                        const active =
                            character.background ===
                            backgroundName;

                        return (
                            <button
                                type="button"
                                key={
                                    backgroundName
                                }
                                className={`creator-option-card ${
                                    active
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    selectBackground(
                                        backgroundName
                                    )
                                }
                            >
                                <div className="creator-option-card-top">
                                    <div className="creator-option-icon">
                                        <BookOpen
                                            size={20}
                                        />
                                    </div>

                                    {active && (
                                        <span className="creator-option-check">
                                            <Check
                                                size={15}
                                            />
                                        </span>
                                    )}
                                </div>

                                <strong>
                                    {
                                        backgroundName
                                    }
                                </strong>

                                <span>
                                    {
                                        background.info
                                    }
                                </span>

                                <small>
                                    Perícias:{" "}
                                    {background.skills
                                        .map(
                                            (
                                                skillId
                                            ) =>
                                                SKILLS.find(
                                                    (
                                                        skill
                                                    ) =>
                                                        skill.id ===
                                                        skillId
                                                )?.name
                                        )
                                        .filter(Boolean)
                                        .join(
                                            ", "
                                        )}
                                </small>
                            </button>
                        );
                    }
                )}
            </div>

            <div className="creator-info-card">
                <BookOpen size={18} />

                <div>
                    <strong>
                        Antecedente selecionado:{" "}
                        {character.background}
                    </strong>

                    <p>
                        {backgroundData.info}
                    </p>

                    <div className="creator-tag-list">
                        {backgroundData.skills?.map(
                            (skillId) => {
                                const skill =
                                    SKILLS.find(
                                        (
                                            item
                                        ) =>
                                            item.id ===
                                            skillId
                                    );

                                if (!skill) {
                                    return null;
                                }

                                return (
                                    <span
                                        key={
                                            skill.id
                                        }
                                    >
                                        {
                                            skill.name
                                        }
                                    </span>
                                );
                            }
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CharacterStepSkills({
    character,
    setCharacter,
}) {
    const classData =
        getClassData(character);

    const backgroundData =
        getBackgroundData(character);

    const availableClassSkills =
        classData.skills || [];

    const backgroundSkills =
        backgroundData.skills || [];

    const selectedClassSkills =
        normalizeArray(
            character.classSkills
        );

    const selectedRaceSkills =
        normalizeArray(
            character.raceSkills
        );

    function toggleClassSkill(
        skillId
    ) {
        setCharacter((current) => {
            const selected =
                normalizeArray(
                    current.classSkills
                );

            const exists =
                selected.includes(
                    skillId
                );

            return {
                ...current,
                classSkills: exists
                    ? selected.filter(
                          (id) =>
                              id !==
                              skillId
                      )
                    : [
                          ...selected,
                          skillId,
                      ],
            };
        });
    }

    function toggleLanguage(
        language
    ) {
        setCharacter((current) => {
            const selected =
                normalizeArray(
                    current.extraLanguages
                );

            const exists =
                selected.includes(
                    language
                );

            return {
                ...current,
                extraLanguages: exists
                    ? selected.filter(
                          (item) =>
                              item !==
                              language
                      )
                    : [
                          ...selected,
                          language,
                      ],
            };
        });
    }

    return (
        <div className="creator-step-content">
            <div className="creator-section-heading">
                <div className="creator-section-icon">
                    <Shield size={22} />
                </div>

                <div>
                    <span>PROFICIÊNCIAS</span>
                    <h2>
                        Defina suas habilidades
                    </h2>
                    <p>
                        Escolha as perícias adicionais
                        que seu personagem domina.
                    </p>
                </div>
            </div>

            <div className="creator-selection-block">
                <div className="creator-selection-heading">
                    <div>
                        <span>CLASSE</span>
                        <h3>
                            Perícias de{" "}
                            {character.class}
                        </h3>
                    </div>

                    <small>
                        {selectedClassSkills.length}{" "}
                        selecionadas
                    </small>
                </div>

                <div className="creator-skill-grid">
                    {availableClassSkills.map(
                        (skillId) => {
                            const skill =
                                SKILLS.find(
                                    (item) =>
                                        item.id ===
                                        skillId
                                );

                            if (!skill) {
                                return null;
                            }

                            const active =
                                selectedClassSkills.includes(
                                    skillId
                                );

                            const backgroundHas =
                                backgroundSkills.includes(
                                    skillId
                                );

                            return (
                                <button
                                    type="button"
                                    key={
                                        skillId
                                    }
                                    className={`creator-skill-option ${
                                        active ||
                                        backgroundHas
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        toggleClassSkill(
                                            skillId
                                        )
                                    }
                                    disabled={
                                        backgroundHas
                                    }
                                >
                                    <div>
                                        <strong>
                                            {
                                                skill.name
                                            }
                                        </strong>

                                        <span>
                                            {
                                                ABILITIES.find(
                                                    (
                                                        ability
                                                    ) =>
                                                        ability.id ===
                                                        skill.ability
                                                )
                                                    ?.name
                                            }
                                        </span>
                                    </div>

                                    {active ||
                                    backgroundHas ? (
                                        <Check
                                            size={
                                                16
                                            }
                                        />
                                    ) : null}
                                </button>
                            );
                        }
                    )}
                </div>
            </div>

            <div className="creator-selection-block">
                <div className="creator-selection-heading">
                    <div>
                        <span>ANTECEDENTE</span>
                        <h3>
                            Perícias de{" "}
                            {character.background}
                        </h3>
                    </div>
                </div>

                <div className="creator-skill-grid">
                    {backgroundSkills.map(
                        (skillId) => {
                            const skill =
                                SKILLS.find(
                                    (item) =>
                                        item.id ===
                                        skillId
                                );

                            if (!skill) {
                                return null;
                            }

                            return (
                                <div
                                    key={
                                        skillId
                                    }
                                    className="creator-skill-option active creator-skill-static"
                                >
                                    <div>
                                        <strong>
                                            {
                                                skill.name
                                            }
                                        </strong>

                                        <span>
                                            {
                                                ABILITIES.find(
                                                    (
                                                        ability
                                                    ) =>
                                                        ability.id ===
                                                        skill.ability
                                                )
                                                    ?.name
                                            }
                                        </span>
                                    </div>

                                    <Check
                                        size={16}
                                    />
                                </div>
                            );
                        }
                    )}
                </div>
            </div>

            <div className="creator-selection-block">
                <div className="creator-selection-heading">
                    <div>
                        <span>IDIOMAS</span>
                        <h3>
                            Idiomas adicionais
                        </h3>
                    </div>
                </div>

                <div className="creator-language-grid">
                    {LANGUAGES.map(
                        (language) => {
                            const alreadyKnown =
                                getRaceData(
                                    character
                                )
                                    .languages?.includes(
                                        language
                                    );

                            const active =
                                normalizeArray(
                                    character.extraLanguages
                                ).includes(
                                    language
                                );

                            return (
                                <button
                                    type="button"
                                    key={
                                        language
                                    }
                                    className={`creator-language-option ${
                                        active ||
                                        alreadyKnown
                                            ? "active"
                                            : ""
                                    }`}
                                    disabled={
                                        alreadyKnown
                                    }
                                    onClick={() =>
                                        toggleLanguage(
                                            language
                                        )
                                    }
                                >
                                    <span>
                                        {
                                            language
                                        }
                                    </span>

                                    {(active ||
                                        alreadyKnown) && (
                                        <Check
                                            size={
                                                15
                                            }
                                        />
                                    )}
                                </button>
                            );
                        }
                    )}
                </div>
            </div>

            <div className="creator-info-card">
                <Shield size={18} />

                <div>
                    <strong>
                        Suas proficiências
                    </strong>

                    <p>
                        Perícias vindas da classe e do
                        antecedente são combinadas automaticamente
                        na ficha final.
                    </p>
                </div>
            </div>
        </div>
    );
}

function CharacterStepAbilities({
    character,
    setCharacter,
}) {
    const abilityScores =
        calculateAbilityScores(character);

    function updateAbility(
        abilityId,
        value
    ) {
        const numericValue =
            Number(value);

        setCharacter((current) => ({
            ...current,
            abilities: {
                ...current.abilities,
                [abilityId]:
                    Number.isNaN(
                        numericValue
                    )
                        ? 0
                        : numericValue,
            },
        }));
    }

    function rollAbilities() {
        const values = [
            15,
            14,
            13,
            12,
            10,
            8,
        ];

        const shuffled = [
            ...values,
        ].sort(
            () =>
                Math.random() -
                0.5
        );

        const nextAbilities = {};

        ABILITIES.forEach(
            (ability, index) => {
                nextAbilities[
                    ability.id
                ] = shuffled[index];
            }
        );

        setCharacter((current) => ({
            ...current,
            abilities:
                nextAbilities,
        }));
    }

    return (
        <div className="creator-step-content">
            <div className="creator-section-heading">
                <div className="creator-section-icon">
                    <Dices size={22} />
                </div>

                <div>
                    <span>ATRIBUTOS</span>

                    <h2>
                        Defina suas capacidades
                    </h2>

                    <p>
                        Ajuste os seis atributos principais
                        do personagem.
                    </p>
                </div>

                <button
                    type="button"
                    className="creator-secondary-button"
                    onClick={
                        rollAbilities
                    }
                >
                    <Dices size={17} />
                    Rolar valores
                </button>
            </div>

            <div className="creator-ability-grid">
                {ABILITIES.map(
                    (ability) => {
                        const baseScore =
                            Number(
                                character
                                    .abilities?.[
                                    ability.id
                                ]
                            ) || 0;

                        const finalScore =
                            abilityScores[
                                ability.id
                            ];

                        const modifier =
                            getAbilityModifier(
                                finalScore
                            );

                        return (
                            <div
                                className="creator-ability-card"
                                key={
                                    ability.id
                                }
                            >
                                <div className="creator-ability-header">
                                    <div>
                                        <span>
                                            {
                                                ability.short
                                            }
                                        </span>

                                        <strong>
                                            {
                                                ability.name
                                            }
                                        </strong>
                                    </div>

                                    <div className="creator-ability-modifier">
                                        {formatModifier(
                                            modifier
                                        )}
                                    </div>
                                </div>

                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={
                                        baseScore
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateAbility(
                                            ability.id,
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />

                                <small>
                                    {ability.description}
                                </small>

                                {finalScore !==
                                    baseScore && (
                                    <div className="creator-ability-bonus">
                                        Base:{" "}
                                        {
                                            baseScore
                                        }{" "}
                                        → Final:{" "}
                                        {
                                            finalScore
                                        }
                                    </div>
                                )}
                            </div>
                        );
                    }
                )}
            </div>

            <div className="creator-ability-summary">
                <div>
                    <span>
                        FORÇA
                    </span>

                    <strong>
                        {abilityScores.forca}
                    </strong>

                    <small>
                        {formatModifier(
                            getAbilityModifier(
                                abilityScores.forca
                            )
                        )}
                    </small>
                </div>

                <div>
                    <span>
                        DESTREZA
                    </span>

                    <strong>
                        {
                            abilityScores.destreza
                        }
                    </strong>

                    <small>
                        {formatModifier(
                            getAbilityModifier(
                                abilityScores.destreza
                            )
                        )}
                    </small>
                </div>

                <div>
                    <span>
                        CONSTITUIÇÃO
                    </span>

                    <strong>
                        {
                            abilityScores.constituicao
                        }
                    </strong>

                    <small>
                        {formatModifier(
                            getAbilityModifier(
                                abilityScores.constituicao
                            )
                        )}
                    </small>
                </div>

                <div>
                    <span>
                        INTELIGÊNCIA
                    </span>

                    <strong>
                        {
                            abilityScores.inteligencia
                        }
                    </strong>

                    <small>
                        {formatModifier(
                            getAbilityModifier(
                                abilityScores.inteligencia
                            )
                        )}
                    </small>
                </div>

                <div>
                    <span>
                        SABEDORIA
                    </span>

                    <strong>
                        {
                            abilityScores.sabedoria
                        }
                    </strong>

                    <small>
                        {formatModifier(
                            getAbilityModifier(
                                abilityScores.sabedoria
                            )
                        )}
                    </small>
                </div>

                <div>
                    <span>
                        CARISMA
                    </span>

                    <strong>
                        {
                            abilityScores.carisma
                        }
                    </strong>

                    <small>
                        {formatModifier(
                            getAbilityModifier(
                                abilityScores.carisma
                            )
                        )}
                    </small>
                </div>
            </div>

            <div className="creator-info-card">
                <Dices size={18} />

                <div>
                    <strong>
                        Valores dos atributos
                    </strong>

                    <p>
                        Os valores informados são usados
                        para calcular automaticamente os
                        modificadores, perícias, resistências,
                        pontos de vida e demais estatísticas.
                    </p>
                </div>
            </div>
        </div>
    );
}

function CharacterStepDetails({
    character,
    setCharacter,
}) {
    function updateField(
        field,
        value
    ) {
        setCharacter((current) => ({
            ...current,
            [field]: value,
        }));
    }

    return (
        <div className="creator-step-content">
            <div className="creator-section-heading">
                <div className="creator-section-icon">
                    <UserRound size={22} />
                </div>

                <div>
                    <span>
                        PERSONALIDADE
                    </span>

                    <h2>
                        Dê vida ao personagem
                    </h2>

                    <p>
                        Agora defina os detalhes que tornam
                        seu personagem único.
                    </p>
                </div>
            </div>

            <div className="creator-form-grid">
                <label className="creator-field creator-field-full">
                    <span>
                        Traço de personalidade
                    </span>

                    <textarea
                        value={
                            character.personality
                        }
                        onChange={(event) =>
                            updateField(
                                "personality",
                                event.target
                                    .value
                            )
                        }
                        placeholder="Como seu personagem costuma agir?"
                        rows={4}
                    />
                </label>

                <label className="creator-field creator-field-full">
                    <span>
                        Ideal
                    </span>

                    <textarea
                        value={
                            character.ideal
                        }
                        onChange={(event) =>
                            updateField(
                                "ideal",
                                event.target
                                    .value
                            )
                        }
                        placeholder="No que seu personagem acredita?"
                        rows={4}
                    />
                </label>

                <label className="creator-field">
                    <span>
                        Vínculo
                    </span>

                    <textarea
                        value={
                            character.bond
                        }
                        onChange={(event) =>
                            updateField(
                                "bond",
                                event.target
                                    .value
                            )
                        }
                        placeholder="O que é importante para ele?"
                        rows={4}
                    />
                </label>

                <label className="creator-field">
                    <span>
                        Defeito
                    </span>

                    <textarea
                        value={
                            character.flaw
                        }
                        onChange={(event) =>
                            updateField(
                                "flaw",
                                event.target
                                    .value
                            )
                        }
                        placeholder="Qual é sua maior fraqueza?"
                        rows={4}
                    />
                </label>
            </div>

            <div className="creator-info-card">
                <UserRound size={18} />

                <div>
                    <strong>
                        Personalidade
                    </strong>

                    <p>
                        Esses campos são narrativos e podem
                        ser usados durante a interpretação do
                        personagem e dentro das campanhas.
                    </p>
                </div>
            </div>
        </div>
    );
}

function CharacterStepSheet({
    character,
}) {
    const finalCharacter =
        buildCharacter(
            character
        );

    const abilityScores =
        finalCharacter.abilityScores;

    const modifiers =
        finalCharacter.modifiers;

    const spellList =
        finalCharacter.spells ||
        [];

    return (
        <div className="creator-step-content">
            <div className="creator-section-heading">
                <div className="creator-section-icon">
                    <Heart size={22} />
                </div>

                <div>
                    <span>
                        REVISÃO
                    </span>

                    <h2>
                        Sua ficha está pronta
                    </h2>

                    <p>
                        Revise os principais dados antes de
                        finalizar o personagem.
                    </p>
                </div>
            </div>

            <div className="character-sheet-preview">
                <div className="character-sheet-header">
                    <div className="character-sheet-avatar">
                        <UserRound size={30} />
                    </div>

                    <div>
                        <span>
                            D&D 5E
                        </span>

                        <h2>
                            {finalCharacter.name ||
                                "Personagem sem nome"}
                        </h2>

                        <p>
                            {finalCharacter.race}
                            {finalCharacter.subrace
                                ? ` • ${finalCharacter.subrace}`
                                : ""}{" "}
                            •{" "}
                            {finalCharacter.class}
                        </p>
                    </div>

                    <div className="character-sheet-level">
                        <span>
                            NÍVEL
                        </span>

                        <strong>
                            {
                                finalCharacter.level
                            }
                        </strong>
                    </div>
                </div>

                <div className="character-sheet-stat-grid">
                    <div>
                        <span>
                            PV
                        </span>

                        <strong>
                            {
                                finalCharacter.hitPoints
                            }
                        </strong>
                    </div>

                    <div>
                        <span>
                            CA
                        </span>

                        <strong>
                            {
                                finalCharacter.armorClass
                            }
                        </strong>
                    </div>

                    <div>
                        <span>
                            INICIATIVA
                        </span>

                        <strong>
                            {formatModifier(
                                finalCharacter.initiative
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>
                            PROFICIÊNCIA
                        </span>

                        <strong>
                            {formatModifier(
                                finalCharacter.proficiencyBonus
                            )}
                        </strong>
                    </div>
                </div>

                <div className="character-sheet-section">
                    <div className="character-sheet-section-title">
                        <Dices size={18} />

                        <h3>
                            Atributos
                        </h3>
                    </div>

                    <div className="character-sheet-abilities">
                        {ABILITIES.map(
                            (ability) => (
                                <div
                                    key={
                                        ability.id
                                    }
                                >
                                    <span>
                                        {
                                            ability.short
                                        }
                                    </span>

                                    <strong>
                                        {
                                            abilityScores[
                                                ability.id
                                            ]
                                        }
                                    </strong>

                                    <small>
                                        {formatModifier(
                                            modifiers[
                                                ability.id
                                            ]
                                        )}
                                    </small>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className="character-sheet-columns">
                    <div className="character-sheet-section">
                        <div className="character-sheet-section-title">
                            <Shield
                                size={18}
                            />

                            <h3>
                                Perícias
                            </h3>
                        </div>

                        <div className="character-sheet-list">
                            {finalCharacter.skills
                                .filter(
                                    (
                                        skill
                                    ) =>
                                        skill.proficient
                                )
                                .map(
                                    (
                                        skill
                                    ) => (
                                        <div
                                            key={
                                                skill.id
                                            }
                                        >
                                            <span>
                                                {
                                                    skill.name
                                                }
                                            </span>

                                            <strong>
                                                {formatModifier(
                                                    skill.bonus
                                                )}
                                            </strong>
                                        </div>
                                    )
                                )}
                        </div>
                    </div>

                    <div className="character-sheet-section">
                        <div className="character-sheet-section-title">
                            <Shield
                                size={18}
                            />

                            <h3>
                                Resistências
                            </h3>
                        </div>

                        <div className="character-sheet-list">
                            {finalCharacter.saves.map(
                                (
                                    save
                                ) => (
                                    <div
                                        key={
                                            save.id
                                        }
                                    >
                                        <span>
                                            {
                                                save.name
                                            }
                                        </span>

                                        <strong>
                                            {formatModifier(
                                                save.bonus
                                            )}
                                        </strong>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <div className="character-sheet-columns">
                    <div className="character-sheet-section">
                        <div className="character-sheet-section-title">
                            <Backpack
                                size={18}
                            />

                            <h3>
                                Equipamentos
                            </h3>
                        </div>

                        <div className="character-sheet-tag-list">
                            {finalCharacter.equipment
                                .slice(
                                    0,
                                    12
                                )
                                .map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <span
                                            key={`${item}-${index}`}
                                        >
                                            {
                                                item
                                            }
                                        </span>
                                    )
                                )}
                        </div>
                    </div>

                    <div className="character-sheet-section">
                        <div className="character-sheet-section-title">
                            <BookOpen
                                size={18}
                            />

                            <h3>
                                Idiomas
                            </h3>
                        </div>

                        <div className="character-sheet-tag-list">
                            {finalCharacter.languages
                                .map(
                                    (
                                        language
                                    ) => (
                                        <span
                                            key={
                                                language
                                            }
                                        >
                                            {
                                                language
                                            }
                                        </span>
                                    )
                                )}
                        </div>
                    </div>
                </div>

                <div className="character-sheet-section">
                    <div className="character-sheet-section-title">
                        <Sparkles
                            size={18}
                        />

                        <h3>
                            Características
                        </h3>
                    </div>

                    <div className="character-sheet-traits">
                        {finalCharacter.traits.map(
                            (
                                trait
                            ) => (
                                <div
                                    key={
                                        trait
                                    }
                                >
                                    <strong>
                                        {
                                            trait
                                        }
                                    </strong>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {spellList.length >
                    0 && (
                    <div className="character-sheet-section">
                        <div className="character-sheet-section-title">
                            <Sparkles
                                size={18}
                            />

                            <h3>
                                Magias
                            </h3>
                        </div>

                        <div className="character-sheet-spells">
                            {spellList.map(
                                (
                                    spell
                                ) => (
                                    <div
                                        key={
                                            spell.id
                                        }
                                    >
                                        <strong>
                                            {
                                                spell.name
                                            }
                                        </strong>

                                        <span>
                                            Nível{" "}
                                            {
                                                spell.level
                                            }{" "}
                                            •{" "}
                                            {
                                                spell.school
                                            }
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {finalCharacter.spellAbility && (
                    <div className="character-sheet-spell-stats">
                        <div>
                            <span>
                                ATRIBUTO DE MAGIA
                            </span>

                            <strong>
                                {
                                    ABILITIES.find(
                                        (
                                            ability
                                        ) =>
                                            ability.id ===
                                            finalCharacter.spellAbility
                                    )?.name
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                CD DE MAGIA
                            </span>

                            <strong>
                                {
                                    finalCharacter.spellSaveDC
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                ATAQUE DE MAGIA
                            </span>

                            <strong>
                                {formatModifier(
                                    finalCharacter.spellAttack
                                )}
                            </strong>
                        </div>
                    </div>
                )}

                <div className="character-sheet-roleplay">
                    <div>
                        <span>
                            PERSONALIDADE
                        </span>

                        <p>
                            {finalCharacter.personality ||
                                "Não informado."}
                        </p>
                    </div>

                    <div>
                        <span>
                            IDEAL
                        </span>

                        <p>
                            {finalCharacter.ideal ||
                                "Não informado."}
                        </p>
                    </div>

                    <div>
                        <span>
                            VÍNCULO
                        </span>

                        <p>
                            {finalCharacter.bond ||
                                "Não informado."}
                        </p>
                    </div>

                    <div>
                        <span>
                            DEFEITO
                        </span>

                        <p>
                            {finalCharacter.flaw ||
                                "Não informado."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CharacterSheet({
    character,
    onBack,
}) {
    const finalCharacter =
        buildCharacter(
            character
        );

    return (
        <main className="character-sheet-page">
            <div className="character-sheet-page-background" />

            <div className="character-sheet-page-overlay" />

            <div className="character-sheet-page-content">
                <button
                    type="button"
                    className="character-sheet-back"
                    onClick={onBack}
                >
                    <ArrowLeft size={18} />
                    <span>
                        Voltar para personagens
                    </span>
                </button>

                <div className="character-sheet-page-header">
                    <div>
                        <span>
                            ORDO RPGISTAS
                        </span>

                        <h1>
                            Ficha de personagem
                        </h1>

                        <p>
                            Dungeons & Dragons 5e
                        </p>
                    </div>

                    <div className="character-sheet-page-system">
                        <Sparkles size={18} />

                        <span>
                            D&D 5E
                        </span>
                    </div>
                </div>

                <div className="character-sheet-page-card">
                    <div className="character-sheet-main-header">
                        <div className="character-sheet-main-avatar">
                            <UserRound size={38} />
                        </div>

                        <div className="character-sheet-main-identity">
                            <span>
                                PERSONAGEM
                            </span>

                            <h2>
                                {finalCharacter.name ||
                                    "Personagem sem nome"}
                            </h2>

                            <p>
                                {finalCharacter.race}
                                {finalCharacter.subrace
                                    ? ` • ${finalCharacter.subrace}`
                                    : ""}{" "}
                                •{" "}
                                {
                                    finalCharacter.class
                                }{" "}
                                •{" "}
                                {
                                    finalCharacter.background
                                }
                            </p>
                        </div>

                        <div className="character-sheet-main-level">
                            <span>
                                NÍVEL
                            </span>

                            <strong>
                                {
                                    finalCharacter.level
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="character-sheet-main-stats">
                        <div>
                            <span>
                                PONTOS DE VIDA
                            </span>

                            <strong>
                                {
                                    finalCharacter.hitPoints
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                CLASSE DE ARMADURA
                            </span>

                            <strong>
                                {
                                    finalCharacter.armorClass
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                INICIATIVA
                            </span>

                            <strong>
                                {formatModifier(
                                    finalCharacter.initiative
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>
                                PROFICIÊNCIA
                            </span>

                            <strong>
                                {formatModifier(
                                    finalCharacter.proficiencyBonus
                                )}
                            </strong>
                        </div>
                    </div>

                    <div className="character-sheet-main-section">
                        <div className="character-sheet-main-section-header">
                            <Dices size={19} />

                            <h3>
                                Atributos
                            </h3>
                        </div>

                        <div className="character-sheet-main-abilities">
                            {ABILITIES.map(
                                (
                                    ability
                                ) => (
                                    <div
                                        key={
                                            ability.id
                                        }
                                    >
                                        <span>
                                            {
                                                ability.short
                                            }
                                        </span>

                                        <strong>
                                            {
                                                finalCharacter
                                                    .abilityScores[
                                                    ability.id
                                                ]
                                            }
                                        </strong>

                                        <small>
                                            {formatModifier(
                                                finalCharacter
                                                    .modifiers[
                                                    ability.id
                                                ]
                                            )}
                                        </small>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div className="character-sheet-main-grid">
                        <div className="character-sheet-main-section">
                            <div className="character-sheet-main-section-header">
                                <Shield
                                    size={19}
                                />

                                <h3>
                                    Perícias
                                </h3>
                            </div>

                            <div className="character-sheet-main-list">
                                {finalCharacter.skills.map(
                                    (
                                        skill
                                    ) => (
                                        <div
                                            key={
                                                skill.id
                                            }
                                        >
                                            <span>
                                                {
                                                    skill.name
                                                }
                                            </span>

                                            <strong>
                                                {formatModifier(
                                                    skill.bonus
                                                )}
                                            </strong>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="character-sheet-main-section">
                            <div className="character-sheet-main-section-header">
                                <Shield
                                    size={19}
                                />

                                <h3>
                                    Resistências
                                </h3>
                            </div>

                            <div className="character-sheet-main-list">
                                {finalCharacter.saves.map(
                                    (
                                        save
                                    ) => (
                                        <div
                                            key={
                                                save.id
                                            }
                                        >
                                            <span>
                                                {
                                                    save.name
                                                }
                                            </span>

                                            <strong>
                                                {formatModifier(
                                                    save.bonus
                                                )}
                                            </strong>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="character-sheet-main-grid">
                        <div className="character-sheet-main-section">
                            <div className="character-sheet-main-section-header">
                                <Backpack
                                    size={19}
                                />

                                <h3>
                                    Equipamentos
                                </h3>
                            </div>

                            <div className="character-sheet-main-tags">
                                {finalCharacter.equipment.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <span
                                            key={`${item}-${index}`}
                                        >
                                            {
                                                item
                                            }
                                        </span>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="character-sheet-main-section">
                            <div className="character-sheet-main-section-header">
                                <BookOpen
                                    size={19}
                                />

                                <h3>
                                    Idiomas
                                </h3>
                            </div>

                            <div className="character-sheet-main-tags">
                                {finalCharacter.languages.map(
                                    (
                                        language
                                    ) => (
                                        <span
                                            key={
                                                language
                                            }
                                        >
                                            {
                                                language
                                            }
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="character-sheet-main-section">
                        <div className="character-sheet-main-section-header">
                            <Sparkles
                                size={19}
                            />

                            <h3>
                                Características
                            </h3>
                        </div>

                        <div className="character-sheet-main-traits">
                            {finalCharacter.traits.map(
                                (
                                    trait
                                ) => (
                                    <div
                                        key={
                                            trait
                                        }
                                    >
                                        <strong>
                                            {
                                                trait
                                            }
                                        </strong>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {finalCharacter.spells?.length >
                        0 && (
                        <div className="character-sheet-main-section">
                            <div className="character-sheet-main-section-header">
                                <Sparkles
                                    size={
                                        19
                                    }
                                />

                                <h3>
                                    Magias
                                </h3>
                            </div>

                            <div className="character-sheet-main-spells">
                                {finalCharacter.spells.map(
                                    (
                                        spell
                                    ) => (
                                        <div
                                            key={
                                                spell.id
                                            }
                                        >
                                            <strong>
                                                {
                                                    spell.name
                                                }
                                            </strong>

                                            <span>
                                                Nível{" "}
                                                {
                                                    spell.level
                                                }{" "}
                                                •{" "}
                                                {
                                                    spell.school
                                                }
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    <div className="character-sheet-main-roleplay">
                        <div>
                            <span>
                                PERSONALIDADE
                            </span>

                            <p>
                                {finalCharacter.personality ||
                                    "Não informado."}
                            </p>
                        </div>

                        <div>
                            <span>
                                IDEAL
                            </span>

                            <p>
                                {finalCharacter.ideal ||
                                    "Não informado."}
                            </p>
                        </div>

                        <div>
                            <span>
                                VÍNCULO
                            </span>

                            <p>
                                {finalCharacter.bond ||
                                    "Não informado."}
                            </p>
                        </div>

                        <div>
                            <span>
                                DEFEITO
                            </span>

                            <p>
                                {finalCharacter.flaw ||
                                    "Não informado."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function CriarPersonagem({
    onNavigate,
}) {
    const [character, setCharacter] =
        useState(createEmptyCharacter);

    const [currentStep, setCurrentStep] =
        useState(1);

    const [completedCharacter, setCompletedCharacter] =
        useState(null);

    const [showExitModal, setShowExitModal] =
        useState(false);

    const currentStepData =
        STEP_DATA.find(
            (step) =>
                step.id === currentStep
        ) || STEP_DATA[0];

    const progress =
        (currentStep /
            STEP_DATA.length) *
        100;

    const isFirstStep =
        currentStep === 1;

    const isLastStep =
        currentStep ===
        STEP_DATA.length;

    const canContinue =
        currentStep === 1
            ? character.name.trim().length >
              0
            : true;

    const spellOptions = useMemo(() => {
        return searchSpells("");
    }, []);

    function updateCharacter(
        updates
    ) {
        setCharacter((current) => ({
            ...current,
            ...updates,
        }));
    }

    function goNext() {
        if (!canContinue) {
            return;
        }

        if (isLastStep) {
            finishCharacter();
            return;
        }

        setCurrentStep(
            (current) =>
                Math.min(
                    current + 1,
                    STEP_DATA.length
                )
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function goPrevious() {
        if (isFirstStep) {
            setShowExitModal(true);
            return;
        }

        setCurrentStep(
            (current) =>
                Math.max(
                    current - 1,
                    1
                )
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function goToStep(step) {
        if (
            step < 1 ||
            step >
                STEP_DATA.length
        ) {
            return;
        }

        if (
            step >
                currentStep &&
            !canContinue
        ) {
            return;
        }

        setCurrentStep(step);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function finishCharacter() {
        const finalCharacter =
            buildCharacter(
                character
            );

        const savedCharacters =
            JSON.parse(
                localStorage.getItem(
                    "ordo-rpgistas-personagens"
                ) || "[]"
            );

        const characterIndex =
            savedCharacters.findIndex(
                (savedCharacter) =>
                    savedCharacter.id ===
                    finalCharacter.id
            );

        let nextCharacters;

        if (
            characterIndex >= 0
        ) {
            nextCharacters =
                savedCharacters.map(
                    (
                        savedCharacter,
                        index
                    ) =>
                        index ===
                        characterIndex
                            ? finalCharacter
                            : savedCharacter
                );
        } else {
            nextCharacters = [
                ...savedCharacters,
                finalCharacter,
            ];
        }

        localStorage.setItem(
            "ordo-rpgistas-personagens",
            JSON.stringify(
                nextCharacters
            )
        );

        setCompletedCharacter(
            finalCharacter
        );

        setCurrentStep(
            STEP_DATA.length
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function handleExit() {
        setShowExitModal(false);

        if (onNavigate) {
            onNavigate(
                "personagens"
            );
        }
    }

    if (completedCharacter) {
        return (
            <CharacterSheet
                character={
                    completedCharacter
                }
                onBack={() =>
                    onNavigate?.(
                        "personagens"
                    )
                }
            />
        );
    }

    const StepIcon =
        currentStepData.icon;

    return (
        <PageBase
            title="Criar Personagem"
            subtitle="Construa seu aventureiro passo a passo."
            icon={Dices}
            onNavigate={onNavigate}
        >
            <div className="character-creator">
                <div className="creator-topbar">
                    <button
                        type="button"
                        className="creator-back-button"
                        onClick={
                            goPrevious
                        }
                    >
                        <ArrowLeft
                            size={18}
                        />

                        <span>
                            Voltar
                        </span>
                    </button>

                    <div className="creator-progress-wrapper">
                        <div className="creator-progress-info">
                            <span>
                                ETAPA{" "}
                                {
                                    currentStep
                                }{" "}
                                DE{" "}
                                {
                                    STEP_DATA.length
                                }
                            </span>

                            <strong>
                                {
                                    currentStepData.title
                                }
                            </strong>
                        </div>

                        <div className="creator-progress-bar">
                            <motion.div
                                className="creator-progress-fill"
                                initial={{
                                    width: 0,
                                }}
                                animate={{
                                    width: `${progress}%`,
                                }}
                                transition={{
                                    duration:
                                        0.35,
                                    ease: "easeOut",
                                }}
                            />
                        </div>
                    </div>

                    <div className="creator-step-icon">
                        <StepIcon
                            size={19}
                        />
                    </div>
                </div>

                <div className="creator-step-navigation">
                    {STEP_DATA.map(
                        (step) => {
                            const Icon =
                                step.icon;

                            const active =
                                currentStep ===
                                step.id;

                            const completed =
                                currentStep >
                                step.id;

                            return (
                                <button
                                    type="button"
                                    key={
                                        step.id
                                    }
                                    className={`creator-step-nav-item ${
                                        active
                                            ? "active"
                                            : ""
                                    } ${
                                        completed
                                            ? "completed"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        goToStep(
                                            step.id
                                        )
                                    }
                                >
                                    <span className="creator-step-nav-icon">
                                        {completed ? (
                                            <Check
                                                size={
                                                    15
                                                }
                                            />
                                        ) : (
                                            <Icon
                                                size={
                                                    15
                                                }
                                            />
                                        )}
                                    </span>

                                    <span className="creator-step-nav-label">
                                        {
                                            step.title
                                        }
                                    </span>
                                </button>
                            );
                        }
                    )}
                </div>

                <motion.div
                    key={currentStep}
                    className="creator-main-card"
                    initial={{
                        opacity: 0,
                        x: 20,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration:
                            0.3,
                        ease: "easeOut",
                    }}
                >
                    <div className="creator-card-heading">
                        <div className="creator-card-heading-icon">
                            <StepIcon
                                size={24}
                            />
                        </div>

                        <div>
                            <span>
                                {
                                    currentStepData.title
                                }
                            </span>

                            <h2>
                                {
                                    currentStepData.subtitle
                                }
                            </h2>
                        </div>
                    </div>

                    {currentStep ===
                        1 && (
                        <CharacterStepConcept
                            character={
                                character
                            }
                            setCharacter={
                                setCharacter
                            }
                        />
                    )}

                    {currentStep ===
                        2 && (
                        <CharacterStepRace
                            character={
                                character
                            }
                            setCharacter={
                                setCharacter
                            }
                        />
                    )}

                    {currentStep ===
                        3 && (
                        <CharacterStepClass
                            character={
                                character
                            }
                            setCharacter={
                                setCharacter
                            }
                        />
                    )}

                    {currentStep ===
                        4 && (
                        <CharacterStepBackground
                            character={
                                character
                            }
                            setCharacter={
                                setCharacter
                            }
                        />
                    )}

                    {currentStep ===
                        5 && (
                        <CharacterStepSkills
                            character={
                                character
                            }
                            setCharacter={
                                setCharacter
                            }
                        />
                    )}

                    {currentStep ===
                        6 && (
                        <CharacterStepAbilities
                            character={
                                character
                            }
                            setCharacter={
                                setCharacter
                            }
                        />
                    )}

                    {currentStep ===
                        7 && (
                        <CharacterStepDetails
                            character={
                                character
                            }
                            setCharacter={
                                setCharacter
                            }
                        />
                    )}

                    {currentStep ===
                        8 && (
                        <CharacterStepSheet
                            character={
                                character
                            }
                        />
                    )}

                    {currentStep ===
                        8 && (
                        <div className="creator-spell-selector">
                            <div className="creator-selection-heading">
                                <div>
                                    <span>
                                        MAGIA
                                    </span>

                                    <h3>
                                        Magias disponíveis
                                    </h3>
                                </div>

                                <small>
                                    {
                                        spellOptions.length
                                    }{" "}
                                    opções
                                </small>
                            </div>

                            <div className="creator-spell-grid">
                                {spellOptions
                                    .filter(
                                        (
                                            spell
                                        ) =>
                                            spell.classes.includes(
                                                character.class
                                            )
                                    )
                                    .map(
                                        (
                                            spell
                                        ) => {
                                            const active =
                                                character.spells.includes(
                                                    spell.id
                                                );

                                            return (
                                                <button
                                                    type="button"
                                                    key={
                                                        spell.id
                                                    }
                                                    className={`creator-spell-option ${
                                                        active
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        setCharacter(
                                                            (
                                                                current
                                                            ) => ({
                                                                ...current,
                                                                spells:
                                                                    active
                                                                        ? current.spells.filter(
                                                                              (
                                                                                  id
                                                                              ) =>
                                                                                  id !==
                                                                                  spell.id
                                                                          )
                                                                        : [
                                                                              ...current.spells,
                                                                              spell.id,
                                                                          ],
                                                            })
                                                        )
                                                    }
                                                >
                                                    <div>
                                                        <strong>
                                                            {
                                                                spell.name
                                                            }
                                                        </strong>

                                                        <span>
                                                            Nível{" "}
                                                            {
                                                                spell.level
                                                            }{" "}
                                                            •{" "}
                                                            {
                                                                spell.school
                                                            }
                                                        </span>
                                                    </div>

                                                    {active && (
                                                        <Check
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    )}
                                                </button>
                                            );
                                        }
                                    )}
                            </div>
                        </div>
                    )}
                </motion.div>

                <div className="creator-bottom-navigation">
                    <button
                        type="button"
                        className="creator-navigation-secondary"
                        onClick={
                            goPrevious
                        }
                    >
                        <ArrowLeft
                            size={18}
                        />

                        <span>
                            {isFirstStep
                                ? "Cancelar"
                                : "Anterior"}
                        </span>
                    </button>

                    <div className="creator-navigation-status">
                        <span>
                            {
                                currentStepData.title
                            }
                        </span>

                        <small>
                            {currentStep} /{" "}
                            {
                                STEP_DATA.length
                            }
                        </small>
                    </div>

                    <button
                        type="button"
                        className="creator-navigation-primary"
                        onClick={
                            goNext
                        }
                        disabled={
                            !canContinue
                        }
                    >
                        <span>
                            {isLastStep
                                ? "Finalizar personagem"
                                : "Continuar"}
                        </span>

                        {isLastStep ? (
                            <Check
                                size={18}
                            />
                        ) : (
                            <ArrowRight
                                size={18}
                            />
                        )}
                    </button>
                </div>
            </div>

            {showExitModal && (
                <div className="creator-modal-backdrop">
                    <motion.div
                        className="creator-exit-modal"
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        transition={{
                            duration:
                                0.2,
                        }}
                    >
                        <button
                            type="button"
                            className="creator-modal-close"
                            onClick={() =>
                                setShowExitModal(
                                    false
                                )
                            }
                        >
                            <X
                                size={18}
                            />
                        </button>

                        <div className="creator-modal-icon">
                            <ArrowLeft
                                size={24}
                            />
                        </div>

                        <span>
                            SAIR DO CRIADOR
                        </span>

                        <h2>
                            Deseja voltar?
                        </h2>

                        <p>
                            Seu personagem ainda não foi
                            salvo. Se você sair agora,
                            as alterações desta criação
                            serão perdidas.
                        </p>

                        <div className="creator-modal-actions">
                            <button
                                type="button"
                                className="creator-modal-cancel"
                                onClick={() =>
                                    setShowExitModal(
                                        false
                                    )
                                }
                            >
                                Continuar criando
                            </button>

                            <button
                                type="button"
                                className="creator-modal-confirm"
                                onClick={
                                    handleExit
                                }
                            >
                                Sair
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </PageBase>
    );
}
