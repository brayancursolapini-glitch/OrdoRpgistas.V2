import { useMemo, useState } from "react";
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
    { id: "forca", name: "Força", short: "FOR", description: "Poder físico, atletismo e força corporal." },
    { id: "destreza", name: "Destreza", short: "DES", description: "Agilidade, reflexos, equilíbrio e furtividade." },
    { id: "constituicao", name: "Constituição", short: "CON", description: "Resistência, saúde e vigor físico." },
    { id: "inteligencia", name: "Inteligência", short: "INT", description: "Raciocínio, memória e conhecimento." },
    { id: "sabedoria", name: "Sabedoria", short: "SAB", description: "Percepção, intuição e conexão com o ambiente." },
    { id: "carisma", name: "Carisma", short: "CAR", description: "Presença, liderança, persuasão e personalidade." },
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
        },
    },

    "Halfling": {
        bonus: { destreza: 2 },
        speed: 25,
        languages: ["Comum", "Halfling"],
        traits: [
            "Sortudo",
            "Bravura",
            "Agilidade Halfling",
        ],
        info:
            "Halflings recebem +2 em Destreza. Sua principal característica é a sorte excepcional, além de resistência contra medo.",
        subraces: {
            "Pés-Leves": {
                bonus: { carisma: 1 },
                traits: ["Furtividade Natural"],
            },
            "Robusto": {
                bonus: { constituicao: 1 },
                traits: ["Resiliência Robusta"],
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
        languages: ["Comum"],
        traits: [
            "Aumento de +1 em todos os valores de habilidade",
            "Idioma adicional à escolha",
        ],
        info:
            "Humano recebe +1 em TODOS os seis valores de habilidade: Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma. Também possui tamanho Médio e deslocamento de 30 pés.",
    },

    "Draconato": {
        bonus: { forca: 2, carisma: 1 },
        speed: 30,
        languages: ["Comum", "Dracônico"],
        traits: [
            "Ancestralidade Dracônica",
            "Arma de Sopro",
            "Resistência a dano",
        ],
        info:
            "Draconatos recebem +2 em Força e +1 em Carisma. Sua ancestralidade determina o tipo de dano da arma de sopro e sua resistência.",
    },

    "Gnomo": {
        bonus: { inteligencia: 2 },
        speed: 25,
        languages: ["Comum", "Gnômico"],
        traits: [
            "Visão no escuro",
            "Esperteza Gnômica",
        ],
        info:
            "Gnomos recebem +2 em Inteligência. Possuem visão no escuro e vantagem em testes de resistência de Inteligência, Sabedoria e Carisma contra magia.",
        subraces: {
            "Gnomo da Floresta": {
                bonus: { destreza: 1 },
                traits: ["Ilusionista Natural", "Falar com Pequenas Bestas"],
            },
            "Gnomo das Rochas": {
                bonus: { constituicao: 1 },
                traits: ["Conhecimento de Artífice", "Inventor de Brinquedos"],
            },
        },
    },

    "Meio-Elfo": {
        bonus: { carisma: 2 },
        extraAbilityChoices: 2,
        skillChoices: 2,
        speed: 30,
        languages: ["Comum", "Élfico"],
        traits: [
            "Visão no escuro",
            "Ancestralidade Feérica",
            "Versatilidade em Perícias",
            "Idioma adicional",
        ],
        info:
            "Meio-Elfos recebem +2 em Carisma e +1 em dois outros valores de habilidade à escolha. Também recebem proficiência em duas perícias à escolha.",
    },

    "Meio-Orc": {
        bonus: { forca: 2, constituicao: 1 },
        speed: 30,
        languages: ["Comum", "Orc"],
        traits: [
            "Visão no escuro",
            "Intimidador",
            "Resistência Incansável",
            "Ataques Selvagens",
        ],
        info:
            "Meio-Orcs recebem +2 em Força e +1 em Constituição. Possuem Intimidação, resistência extraordinária e aumentam o dano de acertos críticos corpo a corpo.",
    },

    "Tiefling": {
        bonus: { carisma: 2, inteligencia: 1 },
        speed: 30,
        languages: ["Comum", "Infernal"],
        traits: [
            "Visão no escuro",
            "Resistência Infernal",
            "Legado Infernal",
        ],
        info:
            "Tieflings recebem +2 em Carisma e +1 em Inteligência. Possuem resistência a fogo e habilidades mágicas ligadas ao seu legado infernal.",
    },
};

const CLASSES = {
    "Bárbaro": {
        hitDie: 12,
        saves: ["forca", "constituicao"],
        primary: "Força",
        armor: "Armaduras leves, médias e escudos",
        weapons: "Armas simples e marciais",
        tools: "Nenhuma",
        skills: [
            "adestrar",
            "atletismo",
            "intimidacao",
            "natureza",
            "percepcao",
            "sobrevivencia",
        ],
        choose: 2,
        info:
            "O Bárbaro é um combatente resistente. Usa principalmente Força e Constituição, possui d12 como Dado de Vida e pode escolher duas perícias entre sua lista de classe.",
    },

    "Bardo": {
        hitDie: 8,
        saves: ["destreza", "carisma"],
        primary: "Carisma",
        armor: "Armaduras leves",
        weapons:
            "Armas simples, bestas de mão, espadas longas, rapieiras e espadas curtas",
        tools: "Três instrumentos musicais à escolha",
        skills: SKILLS.map((skill) => skill.id),
        choose: 3,
        info:
            "O Bardo é um especialista versátil que utiliza Carisma para sua magia e pode escolher quaisquer três perícias.",
    },

    "Bruxo": {
        hitDie: 8,
        saves: ["sabedoria", "carisma"],
        primary: "Carisma",
        armor: "Armaduras leves",
        weapons: "Armas simples",
        tools: "Nenhuma",
        skills: [
            "arcanismo",
            "enganacao",
            "historia",
            "intimidacao",
            "investigacao",
            "natureza",
            "religiao",
        ],
        choose: 2,
        info:
            "O Bruxo recebe poder através de um pacto com uma entidade sobrenatural. Sua habilidade de conjuração é Carisma.",
    },

    "Clérigo": {
        hitDie: 8,
        saves: ["sabedoria", "carisma"],
        primary: "Sabedoria",
        armor: "Armaduras leves, médias e escudos",
        weapons: "Armas simples",
        tools: "Nenhuma",
        skills: [
            "historia",
            "intuicao",
            "medicina",
            "persuasao",
            "religiao",
        ],
        choose: 2,
        info:
            "O Clérigo é um conjurador divino. Utiliza Sabedoria como habilidade de conjuração e possui proficiência com armaduras leves, médias e escudos.",
    },

    "Druida": {
        hitDie: 8,
        saves: ["inteligencia", "sabedoria"],
        primary: "Sabedoria",
        armor: "Armaduras leves e médias; escudos não metálicos",
        weapons:
            "Clavas, adagas, dardos, azagaias, maças, bordões, cimitarras, foices, fundas e lanças",
        tools: "Kit de herbalismo",
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
        choose: 2,
        info:
            "O Druida manipula a magia da natureza e utiliza Sabedoria. Suas armaduras e escudos possuem a restrição de não serem feitos de metal.",
    },

    "Guerreiro": {
        hitDie: 10,
        saves: ["forca", "constituicao"],
        primary: "Força ou Destreza",
        armor: "Todas as armaduras e escudos",
        weapons: "Armas simples e marciais",
        tools: "Nenhuma",
        skills: [
            "acrobacia",
            "adestrar",
            "atletismo",
            "historia",
            "intuicao",
            "intimidacao",
            "percepcao",
            "sobrevivencia",
        ],
        choose: 2,
        info:
            "O Guerreiro é um especialista em combate. Possui proficiência com todas as armaduras, escudos, armas simples e marciais.",
    },

    "Ladino": {
        hitDie: 8,
        saves: ["destreza", "inteligencia"],
        primary: "Destreza",
        armor: "Armaduras leves",
        weapons:
            "Armas simples, bestas de mão, espadas longas, rapieiras e espadas curtas",
        tools: "Ferramentas de ladrão",
        skills: [
            "acrobacia",
            "atletismo",
            "enganacao",
            "intuicao",
            "intimidacao",
            "investigacao",
            "percepcao",
            "atuacao",
            "persuasao",
            "prestidigitacao",
            "furtividade",
        ],
        choose: 4,
        info:
            "O Ladino é um especialista em perícias, furtividade e ataques precisos. Possui quatro escolhas de perícias e proficiência com ferramentas de ladrão.",
    },

    "Mago": {
        hitDie: 6,
        saves: ["inteligencia", "sabedoria"],
        primary: "Inteligência",
        armor: "Nenhuma",
        weapons:
            "Adagas, dardos, fundas, bordões e bestas leves",
        tools: "Nenhuma",
        skills: [
            "arcanismo",
            "historia",
            "intuicao",
            "investigacao",
            "medicina",
            "religiao",
        ],
        choose: 2,
        info:
            "O Mago é um estudioso da magia. Utiliza Inteligência como habilidade de conjuração e começa com um grimório.",
    },

    "Monge": {
        hitDie: 8,
        saves: ["forca", "destreza"],
        primary: "Destreza e Sabedoria",
        armor: "Nenhuma",
        weapons: "Armas simples e espadas curtas",
        tools: "Uma ferramenta de artesão ou instrumento musical",
        skills: [
            "acrobacia",
            "atletismo",
            "historia",
            "intuicao",
            "religiao",
            "furtividade",
        ],
        choose: 2,
        info:
            "O Monge luta sem depender de armaduras. Destreza e Sabedoria são suas principais habilidades.",
    },

    "Paladino": {
        hitDie: 10,
        saves: ["sabedoria", "carisma"],
        primary: "Força e Carisma",
        armor: "Todas as armaduras e escudos",
        weapons: "Armas simples e marciais",
        tools: "Nenhuma",
        skills: [
            "atletismo",
            "intuicao",
            "intimidacao",
            "medicina",
            "persuasao",
            "religiao",
        ],
        choose: 2,
        info:
            "O Paladino é um guerreiro sagrado. Utiliza Força e Carisma e possui proficiência com todas as armaduras, escudos e armas simples e marciais.",
    },

    "Patrulheiro": {
        hitDie: 10,
        saves: ["forca", "destreza"],
        primary: "Destreza e Sabedoria",
        armor: "Armaduras leves, médias e escudos",
        weapons: "Armas simples e marciais",
        tools: "Nenhuma",
        skills: [
            "adestrar",
            "atletismo",
            "intuicao",
            "investigacao",
            "natureza",
            "percepcao",
            "furtividade",
            "sobrevivencia",
        ],
        choose: 3,
        info:
            "O Patrulheiro combina combate, exploração e magia da natureza. Escolhe três perícias entre sua lista de classe.",
    },

    "Feiticeiro": {
        hitDie: 6,
        saves: ["constituicao", "carisma"],
        primary: "Carisma",
        armor: "Nenhuma",
        weapons:
            "Adagas, dardos, fundas, bordões e bestas leves",
        tools: "Nenhuma",
        skills: [
            "arcanismo",
            "enganacao",
            "intuicao",
            "intimidacao",
            "persuasao",
            "religiao",
        ],
        choose: 2,
        info:
            "O Feiticeiro possui magia inata. Sua habilidade de conjuração é Carisma.",
    },
};

const BACKGROUNDS = {
    "Acólito": {
        skills: ["intuicao", "religiao"],
        tools: "Nenhuma",
        languages: 2,
        feature: "Abrigo dos Fiéis",
        info:
            "Você serviu a um templo. Recebe proficiência em Intuição e Religião, além de dois idiomas à escolha.",
    },

    "Artesão de Guilda": {
        skills: ["intuicao", "persuasao"],
        tools: "Um tipo de ferramenta de artesão",
        languages: 1,
        feature: "Filiação de Guilda",
        info:
            "Você pertenceu a uma guilda profissional. Recebe Intuição, Persuasão, ferramentas de artesão e um idioma.",
    },

    "Artista": {
        skills: ["acrobacia", "atuacao"],
        tools: "Kit de disfarce e um instrumento musical",
        languages: 0,
        feature: "Pela Demanda Popular",
        info:
            "Você viveu como artista ou entertainer. Recebe Acrobacia, Atuação, kit de disfarce e um instrumento musical.",
    },

    "Charlatão": {
        skills: ["enganacao", "prestidigitacao"],
        tools: "Kit de disfarce e kit de falsificação",
        languages: 0,
        feature: "Identidade Falsa",
        info:
            "Você viveu de enganações e golpes. Recebe Enganação, Prestidigitação, kit de disfarce e kit de falsificação.",
    },

    "Criminoso": {
        skills: ["enganacao", "furtividade"],
        tools: "Kit de jogo e ferramentas de ladrão",
        languages: 0,
        feature: "Contato Criminoso",
        info:
            "Você possui experiência no submundo. Recebe Enganação, Furtividade, um kit de jogo e ferramentas de ladrão.",
    },

    "Eremita": {
        skills: ["medicina", "religiao"],
        tools: "Kit de herbalismo",
        languages: 1,
        feature: "Descoberta",
        info:
            "Você passou um longo período isolado. Recebe Medicina, Religião, kit de herbalismo e um idioma.",
    },

    "Herói do Povo": {
        skills: ["adestrar", "sobrevivencia"],
        tools: "Ferramentas de artesão e veículos terrestres",
        languages: 0,
        feature: "Hospitalidade Rústica",
        info:
            "Você veio de uma origem humilde e ganhou fama entre seu povo. Recebe Adestrar Animais e Sobrevivência.",
    },

    "Nobre": {
        skills: ["historia", "persuasao"],
        tools: "Um kit de jogo",
        languages: 1,
        feature: "Posição de Privilégio",
        info:
            "Você pertence a uma família de prestígio. Recebe História, Persuasão, um kit de jogo e um idioma.",
    },

    "Órfão": {
        skills: ["prestidigitacao", "furtividade"],
        tools: "Kit de disfarce e ferramentas de ladrão",
        languages: 0,
        feature: "Segredos da Cidade",
        info:
            "Você sobreviveu nas ruas. Recebe Prestidigitação, Furtividade, kit de disfarce e ferramentas de ladrão.",
    },

    "Sábio": {
        skills: ["arcanismo", "historia"],
        tools: "Nenhuma",
        languages: 2,
        feature: "Pesquisador",
        info:
            "Você dedicou sua vida ao estudo. Recebe Arcanismo, História e dois idiomas.",
    },

    "Soldado": {
        skills: ["atletismo", "intimidacao"],
        tools: "Um kit de jogo e veículos terrestres",
        languages: 0,
        feature: "Patente Militar",
        info:
            "Você possui experiência militar. Recebe Atletismo, Intimidação, um kit de jogo e veículos terrestres.",
    },

    "Forasteiro": {
        skills: ["atletismo", "sobrevivencia"],
        tools: "Um instrumento musical",
        languages: 1,
        feature: "Viajante",
        info:
            "Você cresceu longe das grandes cidades. Recebe Atletismo, Sobrevivência, um instrumento musical e um idioma.",
    },
};

const STEP_DATA = [
    { id: 1, name: "Conceito", icon: Sparkles },
    { id: 2, name: "Raça", icon: UserRound },
    { id: 3, name: "Classe", icon: Sword },
    { id: 4, name: "Antecedente", icon: BookOpen },
    { id: 5, name: "Proficiências", icon: Shield },
    { id: 6, name: "Atributos", icon: Dices },
    { id: 7, name: "Detalhes", icon: Backpack },
    { id: 8, name: "Ficha", icon: Check },
];

function getModifier(score) {
    return Math.floor((score - 10) / 2);
}

function formatModifier(value) {
    return value >= 0 ? `+${value}` : `${value}`;
}

function getProficiencyBonus(level) {
    return Math.ceil(level / 4) + 1;
}

function getAbilityBonus(race, subrace, extraAbilities = []) {
    const bonus = {
        forca: 0,
        destreza: 0,
        constituicao: 0,
        inteligencia: 0,
        sabedoria: 0,
        carisma: 0,
    };

    const selectedRace = RACES[race];

    if (selectedRace?.bonus) {
        Object.entries(selectedRace.bonus).forEach(([key, value]) => {
            bonus[key] += value;
        });
    }

    if (selectedRace?.subraces?.[subrace]?.bonus) {
        Object.entries(selectedRace.subraces[subrace].bonus).forEach(
            ([key, value]) => {
                bonus[key] += value;
            }
        );
    }

    extraAbilities.forEach((ability) => {
        if (ability) {
            bonus[ability] += 1;
        }
    });

    return bonus;
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

    const [infoModal, setInfoModal] = useState(null);
    const [completedCharacter, setCompletedCharacter] = useState(null);

    const selectedRace = RACES[character.race];
    const selectedClass = CLASSES[character.class];
    const selectedBackground = BACKGROUNDS[character.background];

    const abilityBonuses = useMemo(
        () =>
            getAbilityBonus(
                character.race,
                character.subrace,
                character.extraAbilities
            ),
        [
            character.race,
            character.subrace,
            character.extraAbilities,
        ]
    );

    const finalAbilities = useMemo(() => {
        const result = {};

        ABILITIES.forEach((ability) => {
            result[ability.id] =
                character.abilities[ability.id] +
                (abilityBonuses[ability.id] || 0);
        });

        return result;
    }, [character.abilities, abilityBonuses]);

    const modifiers = useMemo(() => {
        const result = {};

        ABILITIES.forEach((ability) => {
            result[ability.id] = getModifier(finalAbilities[ability.id]);
        });

        return result;
    }, [finalAbilities]);

    const proficiencyBonus = getProficiencyBonus(character.level);

    const backgroundSkills = selectedBackground?.skills || [];

    const availableClassSkills = selectedClass
        ? selectedClass.skills.filter(
              (skill) => !backgroundSkills.includes(skill)
          )
        : [];

    const totalSkillProficiencies = [
        ...new Set([
            ...backgroundSkills,
            ...character.classSkills,
            ...character.raceSkills,
        ]),
    ];

    function updateCharacter(field, value) {
        setCharacter((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function updateAbility(ability, value) {
        setCharacter((current) => ({
            ...current,
            abilities: {
                ...current.abilities,
                [ability]: Number(value),
            },
        }));
    }

    function changeRace(race) {
        setCharacter((current) => ({
            ...current,
            race,
            subrace: "",
            extraAbilities:
                race === "Meio-Elfo" ? ["", ""] : ["", ""],
            raceSkills: [],
        }));
    }

    function changeClass(nextClass) {
        setCharacter((current) => ({
            ...current,
            class: nextClass,
            classSkills: [],
        }));
    }

    function changeBackground(background) {
        setCharacter((current) => ({
            ...current,
            background,
            classSkills: [],
        }));
    }

    function toggleClassSkill(skill) {
        setCharacter((current) => {
            const exists = current.classSkills.includes(skill);

            if (exists) {
                return {
                    ...current,
                    classSkills: current.classSkills.filter(
                        (item) => item !== skill
                    ),
                };
            }

            if (current.classSkills.length >= selectedClass.choose) {
                return current;
            }

            return {
                ...current,
                classSkills: [...current.classSkills, skill],
            };
        });
    }

    function toggleRaceSkill(skill) {
        setCharacter((current) => {
            const exists = current.raceSkills.includes(skill);

            if (exists) {
                return {
                    ...current,
                    raceSkills: current.raceSkills.filter(
                        (item) => item !== skill
                    ),
                };
            }

            if (current.raceSkills.length >= selectedRace.skillChoices) {
                return current;
            }

            return {
                ...current,
                raceSkills: [...current.raceSkills, skill],
            };
        });
    }

    function openInfo(title, content, benefits = []) {
        setInfoModal({
            title,
            content,
            benefits,
        });
    }

   function canContinue() {
    // PASSO 1 — Conceito
    if (currentStep === 1) {
        return character.name.trim().length > 0;
    }

    // PASSO 2 — Raça
    if (currentStep === 2) {
        if (character.race === "Meio-Elfo") {
            return (
                character.extraAbilities[0] &&
                character.extraAbilities[1] &&
                character.extraAbilities[0] !==
                    character.extraAbilities[1] &&
                character.raceSkills.length === 2
            );
        }

        return true;
    }

    // PASSO 3 — Classe
    // Aqui precisamos apenas ter uma classe escolhida.
    // As perícias serão escolhidas no PASSO 5.
    if (currentStep === 3) {
        return Boolean(character.class);
    }

    // PASSO 4 — Antecedente
    if (currentStep === 4) {
        return Boolean(character.background);
    }

    // PASSO 5 — Proficiências
    // Aqui sim verificamos as perícias escolhidas pela classe.
    if (currentStep === 5) {
        return (
            character.classSkills.length ===
            selectedClass.choose
        );
    }

    // PASSO 6 — Atributos
    if (currentStep === 6) {
        return true;
    }

    // PASSO 7 — Detalhes
    if (currentStep === 7) {
        return true;
    }

    // PASSO 8 — Ficha
    return true;
}

    function nextStep() {
        if (!canContinue()) return;

        setCurrentStep((step) =>
            Math.min(step + 1, STEP_DATA.length)
        );
    }

    function previousStep() {
        setCurrentStep((step) => Math.max(step - 1, 1));
    }

    function buildCharacter() {
        const saveProficiencies = selectedClass.saves.reduce(
            (result, ability) => {
                result[ability] = true;
                return result;
            },
            {}
        );

        const skills = SKILLS.map((skill) => {
            const proficient = totalSkillProficiencies.includes(skill.id);

            return {
                ...skill,
                proficient,
                bonus:
                    modifiers[skill.ability] +
                    (proficient ? proficiencyBonus : 0),
            };
        });

        const saves = ABILITIES.map((ability) => ({
            ...ability,
            proficient: !!saveProficiencies[ability.id],
            bonus:
                modifiers[ability.id] +
                (saveProficiencies[ability.id]
                    ? proficiencyBonus
                    : 0),
        }));

        const hitPoints =
            selectedClass.hitDie + modifiers.constituicao;

        let armorClass = 10 + modifiers.destreza;

        if (
            character.class === "Monge"
        ) {
            armorClass =
                10 +
                modifiers.destreza +
                modifiers.sabedoria;
        }

        if (
            character.class === "Bárbaro"
        ) {
            armorClass =
                10 +
                modifiers.destreza +
                modifiers.constituicao;
        }

        let spellAbility = null;

        if (
            ["Bardo", "Bruxo", "Feiticeiro"].includes(
                character.class
            )
        ) {
            spellAbility = "carisma";
        }

        if (
            ["Clérigo", "Druida"].includes(
                character.class
            )
        ) {
            spellAbility = "sabedoria";
        }

        if (character.class === "Mago") {
            spellAbility = "inteligencia";
        }

        if (
            character.class === "Paladino" &&
            character.level >= 2
        ) {
            spellAbility = "carisma";
        }

        if (
            character.class === "Patrulheiro" &&
            character.level >= 2
        ) {
            spellAbility = "sabedoria";
        }

        const spellSaveDC = spellAbility
            ? 8 +
              proficiencyBonus +
              modifiers[spellAbility]
            : null;

        const spellAttack = spellAbility
            ? proficiencyBonus + modifiers[spellAbility]
            : null;

        return {
            ...character,
            abilities: finalAbilities,
            modifiers,
            proficiencyBonus,
            skills,
            saves,
            skillProficiencies: totalSkillProficiencies,
            backgroundSkills,
            classSkills: character.classSkills,
            raceSkills: character.raceSkills,
            armor: selectedClass.armor,
            weapons: selectedClass.weapons,
            tools: [
                selectedClass.tools,
                selectedBackground.tools,
            ].filter(
                (item) => item && item !== "Nenhuma"
            ),
            languages: [
                ...selectedRace.languages,
                ...character.extraLanguages,
            ],
            traits: [
                ...selectedRace.traits,
                ...(selectedRace.subraces?.[character.subrace]
                    ?.traits || []),
            ],
            hitDie: `d${selectedClass.hitDie}`,
            hitPoints,
            maxHitPoints: hitPoints,
            armorClass,
            initiative: modifiers.destreza,
            speed:
                selectedRace.subraces?.[character.subrace]?.speed ||
                selectedRace.speed,
            passivePerception:
                10 +
                modifiers.sabedoria +
                (totalSkillProficiencies.includes(
                    "percepcao"
                )
                    ? proficiencyBonus
                    : 0),
            spellAbility,
            spellSaveDC,
            spellAttack,
            createdAt: new Date().toISOString(),
        };
    }

    function finishCharacter() {
        if (!canContinue()) return;

        const finalCharacter = buildCharacter();

        try {
            const stored =
                JSON.parse(
                    localStorage.getItem(
                        "ordo-rpgistas-personagens"
                    )
                ) || [];

            localStorage.setItem(
                "ordo-rpgistas-personagens",
                JSON.stringify([
                    ...stored,
                    finalCharacter,
                ])
            );
        } catch (error) {
            console.error(
                "Não foi possível salvar a ficha:",
                error
            );
        }

        setCompletedCharacter(finalCharacter);
    }

    if (completedCharacter) {
        return (
            <PageBase
                title="Ficha de Personagem"
                subtitle="Sua ficha D&D 5e está pronta para a aventura."
                icon={Check}
                onNavigate={onNavigate}
            >
                <CharacterSheet
                    character={completedCharacter}
                    onBack={() => onNavigate?.("personagens")}
                />
            </PageBase>
        );
    }

    const currentStepData = STEP_DATA[currentStep - 1];
    const StepIcon = currentStepData.icon;

    return (
        <PageBase
            title="Criação de personagem"
            subtitle="Construa seu personagem D&D 5e passo a passo."
            icon={StepIcon}
            onNavigate={onNavigate}
        >
            <div className="criar-personagem-page">

                <div className="criar-top-bar">
                    <button
                        type="button"
                        onClick={() =>
                            onNavigate?.("personagens")
                        }
                    >
                        <ArrowLeft size={17} />
                        Voltar para personagens
                    </button>

                    <div className="criar-system-badge">
                        <Sword size={15} />
                        DUNGEONS & DRAGONS 5e
                    </div>
                </div>

                <section className="criar-progress">

                    <div className="criar-progress-line">
                        <span
                            style={{
                                width: `${
                                    ((currentStep - 1) /
                                        (STEP_DATA.length - 1)) *
                                    100
                                }%`,
                            }}
                        />
                    </div>

                    <div className="criar-progress-steps">
                        {STEP_DATA.map((step) => {
                            const Icon = step.icon;

                            return (
                                <button
                                    key={step.id}
                                    type="button"
                                    className={`
                                        criar-progress-step
                                        ${
                                            currentStep === step.id
                                                ? "active"
                                                : ""
                                        }
                                        ${
                                            currentStep > step.id
                                                ? "completed"
                                                : ""
                                        }
                                    `}
                                    onClick={() => {
                                        if (
                                            step.id < currentStep
                                        ) {
                                            setCurrentStep(
                                                step.id
                                            );
                                        }
                                    }}
                                >
                                    <span>
                                        {currentStep >
                                        step.id ? (
                                            <Check size={15} />
                                        ) : (
                                            <Icon size={15} />
                                        )}
                                    </span>

                                    <small>
                                        {step.name}
                                    </small>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <motion.section
                    className="criar-card"
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.35,
                    }}
                    key={currentStep}
                >
                    <div className="criar-card-heading">
                        <div>
                            <span>
                                ETAPA {currentStep} DE{" "}
                                {STEP_DATA.length}
                            </span>

                            <h2>
                                {currentStepData.name}
                            </h2>
                        </div>

                        <div className="criar-step-icon">
                            <StepIcon size={23} />
                        </div>
                    </div>

                    {currentStep === 1 && (
                        <StepConcept
                            character={character}
                            updateCharacter={updateCharacter}
                            openInfo={openInfo}
                        />
                    )}

                    {currentStep === 2 && (
                        <StepRace
                            character={character}
                            changeRace={changeRace}
                            updateCharacter={updateCharacter}
                            selectedRace={selectedRace}
                            openInfo={openInfo}
                        />
                    )}

                    {currentStep === 3 && (
                        <StepClass
                            character={character}
                            changeClass={changeClass}
                            selectedClass={selectedClass}
                            openInfo={openInfo}
                        />
                    )}

                    {currentStep === 4 && (
                        <StepBackground
                            character={character}
                            changeBackground={changeBackground}
                            openInfo={openInfo}
                        />
                    )}

                    {currentStep === 5 && (
                        <StepProficiencies
                            character={character}
                            selectedClass={selectedClass}
                            selectedBackground={
                                selectedBackground
                            }
                            availableClassSkills={
                                availableClassSkills
                            }
                            toggleClassSkill={
                                toggleClassSkill
                            }
                            toggleRaceSkill={
                                toggleRaceSkill
                            }
                            openInfo={openInfo}
                            backgroundSkills={
                                backgroundSkills
                            }
                            totalSkillProficiencies={
                                totalSkillProficiencies
                            }
                        />
                    )}

                    {currentStep === 6 && (
                        <StepAbilities
                            character={character}
                            updateAbility={updateAbility}
                            finalAbilities={
                                finalAbilities
                            }
                            modifiers={modifiers}
                            abilityBonuses={
                                abilityBonuses
                            }
                            openInfo={openInfo}
                        />
                    )}

                    {currentStep === 7 && (
                        <StepDetails
                            character={character}
                            updateCharacter={
                                updateCharacter
                            }
                        />
                    )}

                    {currentStep === 8 && (
                        <StepReview
                            character={character}
                            selectedRace={
                                selectedRace
                            }
                            selectedClass={
                                selectedClass
                            }
                            selectedBackground={
                                selectedBackground
                            }
                            finalAbilities={
                                finalAbilities
                            }
                            modifiers={modifiers}
                            proficiencyBonus={
                                proficiencyBonus
                            }
                            skillProficiencies={
                                totalSkillProficiencies
                            }
                        />
                    )}

                    <div className="criar-navigation">
                        <button
                            type="button"
                            className="criar-secondary-button"
                            onClick={() => {
                                if (currentStep === 1) {
                                    onNavigate?.(
                                        "personagens"
                                    );
                                } else {
                                    previousStep();
                                }
                            }}
                        >
                            <ArrowLeft size={17} />

                            {currentStep === 1
                                ? "Cancelar"
                                : "Voltar"}
                        </button>

                        {currentStep <
                            STEP_DATA.length ? (
                            <button
                                type="button"
                                className="criar-primary-button"
                                onClick={nextStep}
                                disabled={
                                    !canContinue()
                                }
                            >
                                Continuar
                                <ArrowRight size={17} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="criar-primary-button criar-finish-button"
                                onClick={
                                    finishCharacter
                                }
                            >
                                <Check size={17} />
                                Concluir ficha
                            </button>
                        )}
                    </div>
                </motion.section>
            </div>

            {infoModal && (
                <InfoModal
                    modal={infoModal}
                    onClose={() =>
                        setInfoModal(null)
                    }
                />
            )}
        </PageBase>
    );
}

function StepConcept({
    character,
    updateCharacter,
    openInfo,
}) {
    return (
        <div className="criar-step-content">
            <div className="criar-intro">
                <span>PASSO 1</span>
                <h3>Comece sua aventura</h3>
                <p>
                    Defina o conceito básico do seu
                    personagem antes de preencher a
                    ficha.
                </p>
            </div>

            <div className="criar-form-grid">
                <label>
                    <span>Nome do personagem</span>

                    <input
                        value={character.name}
                        onChange={(event) =>
                            updateCharacter(
                                "name",
                                event.target.value
                            )
                        }
                        placeholder="Ex.: Arthen, Lyra, Kael..."
                    />
                </label>

                <label>
                    <span>Nível</span>

                    <select
                        value={character.level}
                        onChange={(event) =>
                            updateCharacter(
                                "level",
                                Number(
                                    event.target.value
                                )
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

                <label>
                    <span>
                        Tendência
                        <button
                            type="button"
                            className="criar-info-button"
                            onClick={() =>
                                openInfo(
                                    "Tendência",
                                    "A tendência representa a forma como seu personagem costuma enxergar ordem, liberdade, altruísmo e egoísmo.",
                                    [
                                        "Ajuda a definir a personalidade.",
                                        "Não impede você de interpretar o personagem de outra maneira.",
                                    ]
                                )
                            }
                        >
                            <Info size={13} />
                        </button>
                    </span>

                    <select
                        value={
                            character.alignment
                        }
                        onChange={(event) =>
                            updateCharacter(
                                "alignment",
                                event.target.value
                            )
                        }
                    >
                        <option>Leal e Bom</option>
                        <option>Neutro e Bom</option>
                        <option>Caótico e Bom</option>
                        <option>Leal e Neutro</option>
                        <option>Neutro</option>
                        <option>Caótico e Neutro</option>
                        <option>Leal e Mau</option>
                        <option>Neutro e Mau</option>
                        <option>Caótico e Mau</option>
                    </select>
                </label>

                <label className="criar-full-field">
                    <span>Conceito / História</span>

                    <textarea
                        value={
                            character.concept
                        }
                        onChange={(event) =>
                            updateCharacter(
                                "concept",
                                event.target.value
                            )
                        }
                        placeholder="Quem é seu personagem? De onde veio? O que busca?"
                    />
                </label>
            </div>
        </div>
    );
}

function StepRace({
    character,
    changeRace,
    updateCharacter,
    selectedRace,
    openInfo,
}) {
    return (
        <div className="criar-step-content">
            <div className="criar-intro">
                <span>PASSO 2</span>
                <h3>Escolha sua raça</h3>
                <p>
                    Sua raça modifica atributos e
                    concede características próprias.
                </p>
            </div>

            <div className="criar-choice-grid">
                {Object.entries(RACES).map(
                    ([race, data]) => (
                        <div
                            key={race}
                            className={`
                                criar-choice-card
                                ${
                                    character.race ===
                                    race
                                        ? "selected"
                                        : ""
                                }
                            `}
                        >
                            <button
                                type="button"
                                className="criar-choice-main"
                                onClick={() =>
                                    changeRace(
                                        race
                                    )
                                }
                            >
                                <strong>
                                    {race}
                                </strong>

                                <span>
                                    {Object.entries(
                                        data.bonus
                                    )
                                        .map(
                                            ([
                                                ability,
                                                value,
                                            ]) =>
                                                `+${
                                                    value
                                                } ${ability
                                                    .slice(
                                                        0,
                                                        3
                                                    )
                                                    .toUpperCase()}`
                                        )
                                        .join(
                                            " • "
                                        )}
                                </span>
                            </button>

                            <button
                                type="button"
                                className="criar-choice-info"
                                onClick={() =>
                                    openInfo(
                                        race,
                                        data.info,
                                        data.traits
                                    )
                                }
                            >
                                <Info size={15} />
                            </button>
                        </div>
                    )
                )}
            </div>

            {selectedRace?.subraces && (
                <div className="criar-subsection">
                    <div className="criar-section-title">
                        <div>
                            <span>SUB-RAÇA</span>
                            <h4>
                                Escolha sua sub-raça
                            </h4>
                        </div>

                        <Info
                            size={17}
                            className="criar-muted-icon"
                        />
                    </div>

                    <div className="criar-choice-grid small">
                        {Object.entries(
                            selectedRace.subraces
                        ).map(
                            ([subrace, data]) => (
                                <div
                                    key={subrace}
                                    className={`
                                        criar-choice-card
                                        ${
                                            character.subrace ===
                                            subrace
                                                ? "selected"
                                                : ""
                                        }
                                    `}
                                >
                                    <button
                                        type="button"
                                        className="criar-choice-main"
                                        onClick={() =>
                                            updateCharacter(
                                                "subrace",
                                                subrace
                                            )
                                        }
                                    >
                                        <strong>
                                            {subrace}
                                        </strong>

                                        <span>
                                            {Object.entries(
                                                data.bonus
                                            )
                                                .map(
                                                    ([
                                                        ability,
                                                        value,
                                                    ]) =>
                                                        `+${
                                                            value
                                                        } ${ability
                                                            .slice(
                                                                0,
                                                                3
                                                            )
                                                            .toUpperCase()}`
                                                )
                                                .join(
                                                    " • "
                                                )}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        className="criar-choice-info"
                                        onClick={() =>
                                            openInfo(
                                                subrace,
                                                "Sub-raça escolhida.",
                                                data.traits
                                            )
                                        }
                                    >
                                        <Info
                                            size={
                                                15
                                            }
                                        />
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {character.race ===
                "Meio-Elfo" && (
                <div className="criar-special-choice">
                    <div>
                        <span>
                            +1 EM DOIS ATRIBUTOS
                        </span>
                        <p>
                            Escolha dois valores de
                            habilidade diferentes.
                        </p>
                    </div>

                    <div className="criar-double-select">
                        <select
                            value={
                                character
                                    .extraAbilities[0]
                            }
                            onChange={(event) => {
                                const value =
                                    event.target
                                        .value;

                                updateCharacter(
                                    "extraAbilities",
                                    [
                                        value,
                                        character
                                            .extraAbilities[1],
                                    ]
                                );
                            }}
                        >
                            <option value="">
                                Primeiro atributo
                            </option>

                            {ABILITIES.map(
                                (ability) => (
                                    <option
                                        key={
                                            ability.id
                                        }
                                        value={
                                            ability.id
                                        }
                                    >
                                        {ability.name}
                                    </option>
                                )
                            )}
                        </select>

                        <select
                            value={
                                character
                                    .extraAbilities[1]
                            }
                            onChange={(event) => {
                                const value =
                                    event.target
                                        .value;

                                updateCharacter(
                                    "extraAbilities",
                                    [
                                        character
                                            .extraAbilities[0],
                                        value,
                                    ]
                                );
                            }}
                        >
                            <option value="">
                                Segundo atributo
                            </option>

                            {ABILITIES.map(
                                (ability) => (
                                    <option
                                        key={
                                            ability.id
                                        }
                                        value={
                                            ability.id
                                        }
                                    >
                                        {ability.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}

function StepClass({
    character,
    changeClass,
    selectedClass,
    openInfo,
}) {
    return (
        <div className="criar-step-content">
            <div className="criar-intro">
                <span>PASSO 3</span>
                <h3>Escolha sua classe</h3>
                <p>
                    Sua classe define seu papel,
                    habilidades, salvaguardas e
                    proficiências.
                </p>
            </div>

            <div className="criar-choice-grid">
                {Object.entries(CLASSES).map(
                    ([className, data]) => (
                        <div
                            key={className}
                            className={`
                                criar-choice-card
                                ${
                                    character.class ===
                                    className
                                        ? "selected"
                                        : ""
                                }
                            `}
                        >
                            <button
                                type="button"
                                className="criar-choice-main"
                                onClick={() =>
                                    changeClass(
                                        className
                                    )
                                }
                            >
                                <strong>
                                    {className}
                                </strong>

                                <span>
                                    d{data.hitDie} •{" "}
                                    {data.primary}
                                </span>
                            </button>

                            <button
                                type="button"
                                className="criar-choice-info"
                                onClick={() =>
                                    openInfo(
                                        className,
                                        data.info,
                                        [
                                            `Dado de Vida: d${data.hitDie}`,
                                            `Testes de resistência: ${data.saves
                                                .map(
                                                    (save) =>
                                                        ABILITIES.find(
                                                            (
                                                                ability
                                                            ) =>
                                                                ability.id ===
                                                                save
                                                        )
                                                            ?.name
                                                    )
                                                .join(
                                                    ", "
                                                )}`,
                                            `Armaduras: ${data.armor}`,
                                            `Armas: ${data.weapons}`,
                                            `Ferramentas: ${data.tools}`,
                                        ]
                                    )
                                }
                            >
                                <Info size={15} />
                            </button>
                        </div>
                    )
                )}
            </div>

            <div className="criar-data-preview">
                <div>
                    <span>PROFICIÊNCIAS DA CLASSE</span>
                    <strong>
                        {selectedClass.armor}
                    </strong>
                    <p>
                        {selectedClass.weapons}
                    </p>
                </div>

                <div>
                    <span>TESTES DE RESISTÊNCIA</span>
                    <strong>
                        {selectedClass.saves
                            .map(
                                (save) =>
                                    ABILITIES.find(
                                        (ability) =>
                                            ability.id ===
                                            save
                                    )?.name
                            )
                            .join(" • ")}
                    </strong>
                </div>
            </div>
        </div>
    );
}

function StepBackground({
    character,
    changeBackground,
    openInfo,
}) {
    return (
        <div className="criar-step-content">
            <div className="criar-intro">
                <span>PASSO 4</span>
                <h3>Escolha seu antecedente</h3>
                <p>
                    Seu passado concede perícias,
                    ferramentas, idiomas e uma
                    característica especial.
                </p>
            </div>

            <div className="criar-choice-grid">
                {Object.entries(BACKGROUNDS).map(
                    ([background, data]) => (
                        <div
                            key={background}
                            className={`
                                criar-choice-card
                                ${
                                    character.background ===
                                    background
                                        ? "selected"
                                        : ""
                                }
                            `}
                        >
                            <button
                                type="button"
                                className="criar-choice-main"
                                onClick={() =>
                                    changeBackground(
                                        background
                                    )
                                }
                            >
                                <strong>
                                    {background}
                                </strong>

                                <span>
                                    {data.skills
                                        .map(
                                            (
                                                skill
                                            ) =>
                                                SKILLS.find(
                                                    (
                                                        item
                                                    ) =>
                                                        item.id ===
                                                        skill
                                                )
                                                    ?.name
                                        )
                                        .join(
                                            " • "
                                        )}
                                </span>
                            </button>

                            <button
                                type="button"
                                className="criar-choice-info"
                                onClick={() =>
                                    openInfo(
                                        background,
                                        data.info,
                                        [
                                            `Perícias: ${data.skills
                                                .map(
                                                    (
                                                        skill
                                                    ) =>
                                                        SKILLS.find(
                                                            (
                                                                item
                                                            ) =>
                                                                item.id ===
                                                                skill
                                                        )
                                                            ?.name
                                                )
                                                .join(
                                                    ", "
                                                )}`,
                                            `Ferramentas: ${data.tools}`,
                                            data.languages
                                                ? `${data.languages} idioma(s) à escolha`
                                                : "Sem idioma adicional",
                                            `Característica: ${data.feature}`,
                                        ]
                                    )
                                }
                            >
                                <Info size={15} />
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

function StepProficiencies({
    character,
    selectedClass,
    selectedBackground,
    availableClassSkills,
    toggleClassSkill,
    toggleRaceSkill,
    openInfo,
    backgroundSkills,
    totalSkillProficiencies,
}) {
    return (
        <div className="criar-step-content">
            <div className="criar-intro">
                <span>PASSO 5</span>
                <h3>Proficiências</h3>
                <p>
                    Escolha as perícias permitidas pela
                    sua classe. As do antecedente são
                    adicionadas automaticamente.
                </p>
            </div>

            <div className="criar-proficiency-summary">
                <div>
                    <strong>
                        {character.class}
                    </strong>

                    <span>
                        Escolha{" "}
                        {selectedClass.choose} perícia(s)
                    </span>

                    <small>
                        Selecionadas:{" "}
                        {
                            character.classSkills
                                .length
                        }
                        /
                        {selectedClass.choose}
                    </small>
                </div>

                <Info
                    size={19}
                    className="criar-muted-icon"
                />
            </div>

            <div className="criar-skills-grid">
                {availableClassSkills.map(
                    (skillId) => {
                        const skill =
                            SKILLS.find(
                                (item) =>
                                    item.id ===
                                    skillId
                            );

                        if (!skill) return null;

                        const selected =
                            character.classSkills.includes(
                                skillId
                            );

                        return (
                            <button
                                key={skillId}
                                type="button"
                                className={`
                                    criar-skill-option
                                    ${
                                        selected
                                            ? "selected"
                                            : ""
                                    }
                                `}
                                onClick={() =>
                                    toggleClassSkill(
                                        skillId
                                    )
                                }
                            >
                                <span>
                                    {selected ? (
                                        <Check
                                            size={
                                                15
                                            }
                                        />
                                    ) : null}
                                </span>

                                <div>
                                    <strong>
                                        {
                                            skill.name
                                        }
                                    </strong>

                                    <small>
                                        {
                                            ABILITIES.find(
                                                (
                                                    ability
                                                ) =>
                                                    ability.id ===
                                                    skill.ability
                                            )?.name
                                        }
                                    </small>
                                </div>
                            </button>
                        );
                    }
                )}
            </div>

            {backgroundSkills.length > 0 && (
                <div className="criar-automatic-proficiencies">
                    <div>
                        <span>
                            ANTECEDENTE
                        </span>

                        <strong>
                            {
                                selectedBackground
                                    .name
                            }
                        </strong>
                    </div>

                    <div className="criar-tag-list">
                        {backgroundSkills.map(
                            (skillId) => (
                                <span
                                    key={skillId}
                                >
                                    <Check
                                        size={
                                            13
                                        }
                                    />

                                    {
                                        SKILLS.find(
                                            (
                                                skill
                                            ) =>
                                                skill.id ===
                                                skillId
                                        )?.name
                                    }
                                </span>
                            )
                        )}
                    </div>
                </div>
            )}

            {character.race ===
                "Meio-Elfo" && (
                <div className="criar-race-skills">
                    <div className="criar-proficiency-summary">
                        <div>
                            <strong>
                                Versatilidade em
                                Perícias
                            </strong>

                            <span>
                                Escolha duas
                                perícias à
                                escolha.
                            </span>

                            <small>
                                Selecionadas:{" "}
                                {
                                    character
                                        .raceSkills
                                        .length
                                }
                                /2
                            </small>
                        </div>
                    </div>

                    <div className="criar-skills-grid">
                        {SKILLS.map(
                            (skill) => {
                                const selected =
                                    character.raceSkills.includes(
                                        skill.id
                                    );

                                return (
                                    <button
                                        key={
                                            skill.id
                                        }
                                        type="button"
                                        className={`
                                            criar-skill-option
                                            ${
                                                selected
                                                    ? "selected"
                                                    : ""
                                            }
                                        `}
                                        onClick={() =>
                                            toggleRaceSkill(
                                                skill.id
                                            )
                                        }
                                    >
                                        <span>
                                            {selected ? (
                                                <Check
                                                    size={
                                                        15
                                                    }
                                                />
                                            ) : null}
                                        </span>

                                        <div>
                                            <strong>
                                                {
                                                    skill.name
                                                }
                                            </strong>

                                            <small>
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
                                            </small>
                                        </div>
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>
            )}

            <div className="criar-total-proficiencies">
                <span>
                    TOTAL DE PERÍCIAS COM
                    PROFICIÊNCIA
                </span>

                <strong>
                    {
                        totalSkillProficiencies.length
                    }
                </strong>
            </div>
        </div>
    );
}

function StepAbilities({
    character,
    updateAbility,
    finalAbilities,
    modifiers,
    abilityBonuses,
    openInfo,
}) {
    return (
        <div className="criar-step-content">
            <div className="criar-intro">
                <span>PASSO 6</span>
                <h3>Valores de habilidade</h3>
                <p>
                    Distribua seus valores e veja os
                    modificadores calculados
                    automaticamente.
                </p>
            </div>

            <div className="criar-info-banner">
                <Dices size={20} />

                <div>
                    <strong>
                        D&D 5e — Modificadores
                    </strong>

                    <p>
                        O modificador é calculado a
                        partir do valor da habilidade.
                        Valores como 10 e 11 dão +0,
                        12 e 13 dão +1, 14 e 15 dão
                        +2, e assim por diante.
                    </p>
                </div>
            </div>

            <div className="criar-ability-grid">
                {ABILITIES.map((ability) => {
                    const racialBonus =
                        abilityBonuses[
                            ability.id
                        ] || 0;

                    return (
                        <div
                            key={ability.id}
                            className="criar-ability-card"
                        >
                            <div className="criar-ability-top">
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

                                <button
                                    type="button"
                                    className="criar-info-button"
                                    onClick={() =>
                                        openInfo(
                                            ability.name,
                                            ability.description,
                                            [
                                                `Valor final: ${finalAbilities[ability.id]}`,
                                                `Modificador: ${formatModifier(
                                                    modifiers[
                                                        ability
                                                            .id
                                                    ]
                                                )}`,
                                                racialBonus
                                                    ? `Bônus racial: +${racialBonus}`
                                                    : "Sem bônus racial",
                                            ]
                                        )
                                    }
                                >
                                    <Info
                                        size={
                                            14
                                        }
                                    />
                                </button>
                            </div>

                            <div className="criar-ability-value">
                                <strong>
                                    {
                                        finalAbilities[
                                            ability.id
                                        ]
                                    }
                                </strong>

                                <span>
                                    {formatModifier(
                                        modifiers[
                                            ability.id
                                        ]
                                    )}
                                </span>
                            </div>

                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={
                                    character
                                        .abilities[
                                        ability.id
                                    ]
                                }
                                onChange={(event) =>
                                    updateAbility(
                                        ability.id,
                                        event.target
                                            .value
                                    )
                                }
                            />

                            <div className="criar-ability-bottom">
                                <span>
                                    Base{" "}
                                    {
                                        character
                                            .abilities[
                                            ability.id
                                        ]
                                    }
                                </span>

                                {racialBonus !==
                                    0 && (
                                    <span>
                                        Raça +
                                        {
                                            racialBonus
                                        }
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function StepDetails({
    character,
    updateCharacter,
}) {
    return (
        <div className="criar-step-content">
            <div className="criar-intro">
                <span>PASSO 7</span>
                <h3>Detalhes do personagem</h3>
                <p>
                    Agora dê personalidade e história
                    ao seu aventureiro.
                </p>
            </div>

            <div className="criar-form-grid">
                <label>
                    <span>
                        Traço de personalidade
                    </span>

                    <textarea
                        value={
                            character.personality
                        }
                        onChange={(event) =>
                            updateCharacter(
                                "personality",
                                event.target.value
                            )
                        }
                        placeholder="Como seu personagem age?"
                    />
                </label>

                <label>
                    <span>Ideal</span>

                    <textarea
                        value={character.ideal}
                        onChange={(event) =>
                            updateCharacter(
                                "ideal",
                                event.target.value
                            )
                        }
                        placeholder="No que ele acredita?"
                    />
                </label>

                <label>
                    <span>Vínculo</span>

                    <textarea
                        value={character.bond}
                        onChange={(event) =>
                            updateCharacter(
                                "bond",
                                event.target.value
                            )
                        }
                        placeholder="Com quem ou o que ele possui ligação?"
                    />
                </label>

                <label>
                    <span>Defeito</span>

                    <textarea
                        value={character.flaw}
                        onChange={(event) =>
                            updateCharacter(
                                "flaw",
                                event.target.value
                            )
                        }
                        placeholder="Qual é sua maior fraqueza?"
                    />
                </label>
            </div>
        </div>
    );
}

function StepReview({
    character,
    selectedRace,
    selectedClass,
    selectedBackground,
    finalAbilities,
    modifiers,
    proficiencyBonus,
    skillProficiencies,
}) {
    return (
        <div className="criar-step-content">
            <div className="criar-intro">
                <span>PASSO 8</span>
                <h3>Revise sua ficha</h3>
                <p>
                    Confira as escolhas antes de
                    finalizar.
                </p>
            </div>

            <div className="criar-review-header">
                <div className="criar-review-avatar">
                    <UserRound size={32} />
                </div>

                <div>
                    <span>
                        D&D 5e • Nível{" "}
                        {character.level}
                    </span>

                    <h3>
                        {character.name ||
                            "Personagem sem nome"}
                    </h3>

                    <p>
                        {character.race}
                        {character.subrace
                            ? ` • ${character.subrace}`
                            : ""}{" "}
                        • {character.class}
                    </p>
                </div>
            </div>

            <div className="criar-review-grid">
                <div>
                    <span>ANTECEDENTE</span>
                    <strong>
                        {character.background}
                    </strong>
                </div>

                <div>
                    <span>BÔNUS DE PROFICIÊNCIA</span>
                    <strong>
                        +{proficiencyBonus}
                    </strong>
                </div>

                <div>
                    <span>PERÍCIAS</span>
                    <strong>
                        {skillProficiencies.length}
                    </strong>
                </div>

                <div>
                    <span>DADO DE VIDA</span>
                    <strong>
                        d{selectedClass.hitDie}
                    </strong>
                </div>
            </div>

            <div className="criar-review-abilities">
                {ABILITIES.map((ability) => (
                    <div key={ability.id}>
                        <span>
                            {ability.short}
                        </span>

                        <strong>
                            {
                                finalAbilities[
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
                ))}
            </div>

            <div className="criar-review-note">
                <Check size={18} />

                <p>
                    Ao concluir, a ficha será
                    calculada, salva no navegador e
                    apresentada como uma ficha
                    completa.
                </p>
            </div>
        </div>
    );
}

function InfoModal({ modal, onClose }) {
    return (
        <div
            className="criar-modal-backdrop"
            onMouseDown={onClose}
        >
            <div
                className="criar-info-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <button
                    type="button"
                    className="criar-modal-close"
                    onClick={onClose}
                >
                    <X size={18} />
                </button>

                <div className="criar-modal-icon">
                    <Info size={24} />
                </div>

                <span>INFORMAÇÕES</span>

                <h3>{modal.title}</h3>

                <p>{modal.content}</p>

                {modal.benefits?.length > 0 && (
                    <div className="criar-modal-benefits">
                        <strong>
                            Benefícios / características
                        </strong>

                        {modal.benefits.map(
                            (benefit) => (
                                <div
                                    key={
                                        benefit
                                    }
                                >
                                    <Check
                                        size={
                                            14
                                        }
                                    />

                                    <span>
                                        {
                                            benefit
                                        }
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                )}

                <button
                    type="button"
                    className="criar-primary-button"
                    onClick={onClose}
                >
                    Entendi
                </button>
            </div>
        </div>
    );
}

function CharacterSheet({
    character,
    onBack,
}) {
    return (
        <div className="character-sheet">

            <div className="character-sheet-top">
                <div>
                    <span>
                        DUNGEONS & DRAGONS • 5e
                    </span>

                    <h2>
                        {character.name}
                    </h2>

                    <p>
                        Nível {character.level} •{" "}
                        {character.race}
                        {character.subrace
                            ? ` • ${character.subrace}`
                            : ""}{" "}
                        • {character.class}
                    </p>
                </div>

                <div className="character-sheet-level">
                    <small>NÍVEL</small>
                    <strong>
                        {character.level}
                    </strong>
                </div>
            </div>

            <section className="sheet-main-stats">

                <div className="sheet-ability-list">
                    <h3>Habilidades</h3>

                    {ABILITIES.map(
                        (ability) => (
                            <div
                                key={
                                    ability.id
                                }
                                className="sheet-ability"
                            >
                                <span>
                                    {
                                        ability.name
                                    }
                                </span>

                                <strong>
                                    {
                                        character
                                            .abilities[
                                            ability
                                                .id
                                        ]
                                    }
                                </strong>

                                <b>
                                    {formatModifier(
                                        character
                                            .modifiers[
                                            ability
                                                .id
                                        ]
                                    )}
                                </b>
                            </div>
                        )
                    )}
                </div>

                <div className="sheet-combat">

                    <div className="sheet-stat-box">
                        <span>
                            CLASSE DE ARMADURA
                        </span>

                        <strong>
                            {
                                character.armorClass
                            }
                        </strong>
                    </div>

                    <div className="sheet-stat-box">
                        <span>
                            INICIATIVA
                        </span>

                        <strong>
                            {formatModifier(
                                character.initiative
                            )}
                        </strong>
                    </div>

                    <div className="sheet-stat-box">
                        <span>
                            DESLOCAMENTO
                        </span>

                        <strong>
                            {
                                character.speed
                            } ft
                        </strong>
                    </div>

                    <div className="sheet-stat-box hp">
                        <Heart size={18} />

                        <span>
                            PONTOS DE VIDA
                        </span>

                        <strong>
                            {
                                character
                                    .maxHitPoints
                            }
                        </strong>

                        <small>
                            d{
                                character.hitDie.replace(
                                    "d",
                                    ""
                                )
                            }
                        </small>
                    </div>

                    <div className="sheet-stat-box">
                        <span>
                            PROFICIÊNCIA
                        </span>

                        <strong>
                            +
                            {
                                character.proficiencyBonus
                            }
                        </strong>
                    </div>

                    <div className="sheet-stat-box">
                        <span>
                            PERCEPÇÃO PASSIVA
                        </span>

                        <strong>
                            {
                                character.passivePerception
                            }
                        </strong>
                    </div>
                </div>
            </section>

            <section className="sheet-section">
                <div className="sheet-section-title">
                    <Shield size={19} />
                    <div>
                        <span>
                            TESTES DE RESISTÊNCIA
                        </span>
                        <h3>
                            Salvaguardas
                        </h3>
                    </div>
                </div>

                <div className="sheet-save-grid">
                    {character.saves.map(
                        (save) => (
                            <div
                                key={
                                    save.id
                                }
                                className={
                                    save.proficient
                                        ? "proficient"
                                        : ""
                                }
                            >
                                <span>
                                    {save.proficient
                                        ? "●"
                                        : "○"}
                                </span>

                                <strong>
                                    {formatModifier(
                                        save.bonus
                                    )}
                                </strong>

                                <small>
                                    {
                                        save.name
                                    }
                                </small>
                            </div>
                        )
                    )}
                </div>
            </section>

            <section className="sheet-section">
                <div className="sheet-section-title">
                    <Sparkles size={19} />

                    <div>
                        <span>
                            PERÍCIAS
                        </span>

                        <h3>
                            Todas as perícias
                        </h3>
                    </div>
                </div>

                <div className="sheet-skill-grid">
                    {character.skills.map(
                        (skill) => (
                            <div
                                key={
                                    skill.id
                                }
                                className={
                                    skill.proficient
                                        ? "proficient"
                                        : ""
                                }
                            >
                                <span>
                                    {skill.proficient
                                        ? "●"
                                        : "○"}
                                </span>

                                <strong>
                                    {formatModifier(
                                        skill.bonus
                                    )}
                                </strong>

                                <div>
                                    <b>
                                        {
                                            skill.name
                                        }
                                    </b>

                                    <small>
                                        {
                                            ABILITIES.find(
                                                (
                                                    ability
                                                ) =>
                                                    ability.id ===
                                                    skill.ability
                                            )?.short
                                        }
                                    </small>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </section>

            <section className="sheet-columns">

                <div className="sheet-section">
                    <div className="sheet-section-title">
                        <Sword size={19} />

                        <div>
                            <span>
                                PROFICIÊNCIAS
                            </span>

                            <h3>
                                Equipamentos
                            </h3>
                        </div>
                    </div>

                    <div className="sheet-detail-list">
                        <div>
                            <span>
                                Armaduras
                            </span>

                            <strong>
                                {
                                    character.armor
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Armas
                            </span>

                            <strong>
                                {
                                    character.weapons
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Ferramentas
                            </span>

                            <strong>
                                {character.tools
                                    .length
                                    ? character.tools.join(
                                          " • "
                                      )
                                    : "Nenhuma"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Idiomas
                            </span>

                            <strong>
                                {character.languages.join(
                                    " • "
                                )}
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="sheet-section">
                    <div className="sheet-section-title">
                        <BookOpen size={19} />

                        <div>
                            <span>
                                ANTECEDENTE
                            </span>

                            <h3>
                                {
                                    character.background
                                }
                            </h3>
                        </div>
                    </div>

                    <div className="sheet-detail-list">
                        <div>
                            <span>
                                Perícias
                            </span>

                            <strong>
                                {character.backgroundSkills
                                    .map(
                                        (
                                            skill
                                        ) =>
                                            SKILLS.find(
                                                (
                                                    item
                                                ) =>
                                                    item.id ===
                                                    skill
                                            )?.name
                                    )
                                    .join(
                                        " • "
                                    )}
                            </strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className="sheet-section">
                <div className="sheet-section-title">
                    <Sparkles size={19} />

                    <div>
                        <span>
                            CARACTERÍSTICAS RACIAIS
                        </span>

                        <h3>
                            {character.race}
                        </h3>
                    </div>
                </div>

                <div className="sheet-traits">
                    {character.traits.map(
                        (trait) => (
                            <span key={trait}>
                                <Check
                                    size={13}
                                />
                                {trait}
                            </span>
                        )
                    )}
                </div>
            </section>

            {character.spellAbility && (
                <section className="sheet-section">
                    <div className="sheet-section-title">
                        <Sparkles size={19} />

                        <div>
                            <span>
                                MAGIA
                            </span>

                            <h3>
                                Conjuração
                            </h3>
                        </div>
                    </div>

                    <div className="sheet-magic-grid">
                        <div>
                            <span>
                                HABILIDADE
                            </span>

                            <strong>
                                {
                                    ABILITIES.find(
                                        (
                                            ability
                                        ) =>
                                            ability.id ===
                                            character.spellAbility
                                    )?.name
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                CD DAS MAGIAS
                            </span>

                            <strong>
                                {
                                    character.spellSaveDC
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                ATAQUE MÁGICO
                            </span>

                            <strong>
                                +
                                {
                                    character.spellAttack
                                }
                            </strong>
                        </div>
                    </div>
                </section>
            )}

            <section className="sheet-section sheet-personality">
                <div className="sheet-section-title">
                    <UserRound size={19} />

                    <div>
                        <span>
                            PERSONALIDADE
                        </span>

                        <h3>
                            Quem é seu
                            personagem?
                        </h3>
                    </div>
                </div>

                <div className="sheet-personality-grid">
                    <div>
                        <span>
                            CONCEITO
                        </span>

                        <p>
                            {
                                character.concept ||
                                "Não informado."
                            }
                        </p>
                    </div>

                    <div>
                        <span>
                            TRAÇO
                        </span>

                        <p>
                            {
                                character.personality ||
                                "Não informado."
                            }
                        </p>
                    </div>

                    <div>
                        <span>
                            IDEAL
                        </span>

                        <p>
                            {
                                character.ideal ||
                                "Não informado."
                            }
                        </p>
                    </div>

                    <div>
                        <span>
                            VÍNCULO
                        </span>

                        <p>
                            {
                                character.bond ||
                                "Não informado."
                            }
                        </p>
                    </div>

                    <div>
                        <span>
                            DEFEITO
                        </span>

                        <p>
                            {
                                character.flaw ||
                                "Não informado."
                            }
                        </p>
                    </div>
                </div>
            </section>

            <div className="sheet-footer-actions">
                <button
                    type="button"
                    className="criar-secondary-button"
                    onClick={onBack}
                >
                    <ArrowLeft size={17} />
                    Voltar para personagens
                </button>

                <div className="sheet-complete-badge">
                    <Check size={16} />
                    Ficha concluída
                </div>
            </div>
        </div>
    );
}
