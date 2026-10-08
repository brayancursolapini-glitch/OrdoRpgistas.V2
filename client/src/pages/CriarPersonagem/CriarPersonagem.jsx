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
    {
        id: "prestidigitacao",
        name: "Prestidigitação",
        ability: "destreza",
    },
    { id: "religiao", name: "Religião", ability: "inteligencia" },
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
    Anão: {
        bonus: {
            constituicao: 2,
        },
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
                bonus: {
                    sabedoria: 1,
                },
                traits: ["Tenacidade Anã"],
            },
            "Anão da Montanha": {
                bonus: {
                    forca: 2,
                },
                traits: ["Treinamento com Armaduras Anãs"],
            },
        },
    },

    Elfo: {
        bonus: {
            destreza: 2,
        },
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
        },
    },

    Halfling: {
        bonus: {
            destreza: 2,
        },
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
                bonus: {
                    carisma: 1,
                },
                traits: [
                    "Furtividade Natural",
                ],
            },
            Robusto: {
                bonus: {
                    constituicao: 1,
                },
                traits: [
                    "Resiliência Robusta",
                ],
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
        traits: [
            "Aumento de +1 em todos os valores de habilidade",
            "Idioma adicional à escolha",
        ],
        info:
            "Humano recebe +1 em TODOS os seis valores de habilidade: Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma. Também possui tamanho Médio e deslocamento de 30 pés.",
    },

    Draconato: {
        bonus: {
            forca: 2,
            carisma: 1,
        },
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

    Gnomo: {
        bonus: {
            inteligencia: 2,
        },
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
                bonus: {
                    destreza: 1,
                },
                traits: [
                    "Ilusionista Natural",
                    "Falar com Pequenas Bestas",
                ],
            },
            "Gnomo das Rochas": {
                bonus: {
                    constituicao: 1,
                },
                traits: [
                    "Conhecimento de Artífice",
                    "Inventor de Brinquedos",
                ],
            },
        },
    },

    "Meio-Elfo": {
        bonus: {
            carisma: 2,
        },
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
        bonus: {
            forca: 2,
            constituicao: 1,
        },
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

    Tiefling: {
        bonus: {
            carisma: 2,
            inteligencia: 1,
        },
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
    Bárbaro: {
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

    Bardo: {
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

    Bruxo: {
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

    Clérigo: {
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

    Druida: {
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

    Guerreiro: {
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

    Ladino: {
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

    Mago: {
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

    Monge: {
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

    Paladino: {
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

    Patrulheiro: {
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

    Feiticeiro: {
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
    Acólito: {
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

    Artista: {
        skills: ["acrobacia", "atuacao"],
        tools: "Kit de disfarce e um instrumento musical",
        languages: 0,
        feature: "Pela Demanda Popular",
        info:
            "Você viveu como artista ou entertainer. Recebe Acrobacia, Atuação, kit de disfarce e um instrumento musical.",
    },

    Charlatão: {
        skills: ["enganacao", "prestidigitacao"],
        tools: "Kit de disfarce e kit de falsificação",
        languages: 0,
        feature: "Identidade Falsa",
        info:
            "Você viveu de enganações e golpes. Recebe Enganação, Prestidigitação, kit de disfarce e kit de falsificação.",
    },

    Criminoso: {
        skills: ["enganacao", "furtividade"],
        tools: "Kit de jogo e ferramentas de ladrão",
        languages: 0,
        feature: "Contato Criminoso",
        info:
            "Você possui experiência no submundo. Recebe Enganação, Furtividade, um kit de jogo e ferramentas de ladrão.",
    },

    Eremita: {
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

    Nobre: {
        skills: ["historia", "persuasao"],
        tools: "Um kit de jogo",
        languages: 1,
        feature: "Posição de Privilégio",
        info:
            "Você pertence a uma família de prestígio. Recebe História, Persuasão, um kit de jogo e um idioma.",
    },

    Órfão: {
        skills: ["prestidigitacao", "furtividade"],
        tools: "Kit de disfarce e ferramentas de ladrão",
        languages: 0,
        feature: "Segredos da Cidade",
        info:
            "Você sobreviveu nas ruas. Recebe Prestidigitação, Furtividade, kit de disfarce e ferramentas de ladrão.",
    },

    Sábio: {
        skills: ["arcanismo", "historia"],
        tools: "Nenhuma",
        languages: 2,
        feature: "Pesquisador",
        info:
            "Você dedicou sua vida ao estudo. Recebe Arcanismo, História e dois idiomas.",
    },

    Soldado: {
        skills: ["atletismo", "intimidacao"],
        tools: "Um kit de jogo e veículos terrestres",
        languages: 0,
        feature: "Patente Militar",
        info:
            "Você possui experiência militar. Recebe Atletismo, Intimidação, um kit de jogo e veículos terrestres.",
    },

    Forasteiro: {
        skills: ["atletismo", "sobrevivencia"],
        tools: "Um instrumento musical",
        languages: 1,
        feature: "Viajante",
        info:
            "Você cresceu longe das grandes cidades. Recebe Atletismo, Sobrevivência, um instrumento musical e um idioma.",
    },
};

const STEP_DATA = [
    {
        id: 1,
        name: "Conceito",
        icon: Sparkles,
    },
    {
        id: 2,
        name: "Raça",
        icon: UserRound,
    },
    {
        id: 3,
        name: "Classe",
        icon: Sword,
    },
    {
        id: 4,
        name: "Antecedente",
        icon: BookOpen,
    },
    {
        id: 5,
        name: "Proficiências",
        icon: Shield,
    },
    {
        id: 6,
        name: "Atributos",
        icon: Dices,
    },
    {
        id: 7,
        name: "Detalhes",
        icon: Backpack,
    },
    {
        id: 8,
        name: "Ficha",
        icon: Check,
    },
];

function getModifier(score) {
    return Math.floor((score - 10) / 2);
}

function formatModifier(value) {
    return value >= 0 ? `+${value}` : `${value}`;
}

function getProficiencyBonus(level) {
    if (level >= 17) return 6;
    if (level >= 13) return 5;
    if (level >= 9) return 4;
    if (level >= 5) return 3;

    return 2;
}

function getAbilityBonus(
    race,
    subrace,
    extraAbilities = []
) {
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
        Object.entries(selectedRace.bonus).forEach(
            ([key, value]) => {
                bonus[key] += value;
            }
        );
    }

    if (
        selectedRace?.subraces?.[subrace]?.bonus
    ) {
        Object.entries(
            selectedRace.subraces[subrace].bonus
        ).forEach(([key, value]) => {
            bonus[key] += value;
        });
    }

    extraAbilities.forEach((ability) => {
        if (ability) {
            bonus[ability] += 1;
        }
    });

    return bonus;
}

export default function CriarPersonagem({
    onNavigate,
}) {
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

    const [infoModal, setInfoModal] =
        useState(null);

    const [completedCharacter, setCompletedCharacter] =
        useState(null);

    const selectedRace =
        RACES[character.race];

    const selectedClass =
        CLASSES[character.class];

    const selectedBackground =
        BACKGROUNDS[character.background];

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
                character.abilities[
                    ability.id
                ] +
                (abilityBonuses[
                    ability.id
                ] || 0);
        });

        return result;
    }, [
        character.abilities,
        abilityBonuses,
    ]);

    const modifiers = useMemo(() => {
        const result = {};

        ABILITIES.forEach((ability) => {
            result[ability.id] =
                getModifier(
                    finalAbilities[
                        ability.id
                    ]
                );
        });

        return result;
    }, [finalAbilities]);

    const proficiencyBonus =
        getProficiencyBonus(
            character.level
        );

    const backgroundSkills =
        selectedBackground?.skills || [];

    const availableClassSkills =
        selectedClass
            ? selectedClass.skills.filter(
                  (skill) =>
                      !backgroundSkills.includes(
                          skill
                      )
              )
            : [];

    const totalSkillProficiencies = [
        ...new Set([
            ...backgroundSkills,
            ...character.classSkills,
            ...character.raceSkills,
        ]),
    ];

    function updateCharacter(
        field,
        value
    ) {
        setCharacter((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function updateAbility(
        ability,
        value
    ) {
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
                race === "Meio-Elfo"
                    ? ["", ""]
                    : ["", ""],
            raceSkills: [],
        }));
    }

    function changeClass(
        nextClass
    ) {
        setCharacter((current) => ({
            ...current,
            class: nextClass,
            classSkills: [],
        }));
    }

    function changeBackground(
        background
    ) {
        setCharacter((current) => ({
            ...current,
            background,
            classSkills: [],
        }));
    }

    function toggleClassSkill(
        skill
    ) {
        setCharacter((current) => {
            const exists =
                current.classSkills.includes(
                    skill
                );

            if (exists) {
                return {
                    ...current,
                    classSkills:
                        current.classSkills.filter(
                            (item) =>
                                item !== skill
                        ),
                };
            }

            if (
                current.classSkills.length >=
                selectedClass.choose
            ) {
                return current;
            }

            return {
                ...current,
                classSkills: [
                    ...current.classSkills,
                    skill,
                ],
            };
        });
    }

    function toggleRaceSkill(
        skill
    ) {
        setCharacter((current) => {
            const exists =
                current.raceSkills.includes(
                    skill
                );

            if (exists) {
                return {
                    ...current,
                    raceSkills:
                        current.raceSkills.filter(
                            (item) =>
                                item !== skill
                        ),
                };
            }

            if (
                current.raceSkills.length >=
                selectedRace.skillChoices
            ) {
                return current;
            }

            return {
                ...current,
                raceSkills: [
                    ...current.raceSkills,
                    skill,
                ],
            };
        });
    }

    function openInfo(
        title,
        content,
        benefits = []
    ) {
        setInfoModal({
            title,
            content,
            benefits,
        });
    }
        function toggleLanguage(language) {
        setCharacter((current) => {
            const exists =
                current.extraLanguages.includes(language);

            if (exists) {
                return {
                    ...current,
                    extraLanguages:
                        current.extraLanguages.filter(
                            (item) => item !== language
                        ),
                };
            }

            const maxLanguages =
                selectedBackground?.languages || 0;

            if (
                current.extraLanguages.length >=
                maxLanguages
            ) {
                return current;
            }

            return {
                ...current,
                extraLanguages: [
                    ...current.extraLanguages,
                    language,
                ],
            };
        });
    }

    function toggleSpell(spellId) {
        setCharacter((current) => {
            const exists =
                current.spells.includes(spellId);

            if (exists) {
                return {
                    ...current,
                    spells: current.spells.filter(
                        (spell) => spell !== spellId
                    ),
                };
            }

            return {
                ...current,
                spells: [
                    ...current.spells,
                    spellId,
                ],
            };
        });
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

        const shuffled = [...values].sort(
            () => Math.random() - 0.5
        );

        const nextAbilities = {};

        ABILITIES.forEach(
            (ability, index) => {
                nextAbilities[ability.id] =
                    shuffled[index];
            }
        );

        setCharacter((current) => ({
            ...current,
            abilities: nextAbilities,
        }));
    }

    function resetAbilities() {
        setCharacter((current) => ({
            ...current,
            abilities: {
                forca: 15,
                destreza: 14,
                constituicao: 13,
                inteligencia: 12,
                sabedoria: 10,
                carisma: 8,
            },
        }));
    }

    function validateStep(step) {
        if (step === 1) {
            if (
                !character.name.trim()
            ) {
                alert(
                    "Digite um nome para o personagem."
                );

                return false;
            }

            return true;
        }

        if (step === 2) {
            if (!character.race) {
                alert(
                    "Escolha uma raça para continuar."
                );

                return false;
            }

            const race =
                RACES[character.race];

            if (
                race?.subraces &&
                !character.subrace
            ) {
                alert(
                    "Escolha uma sub-raça para continuar."
                );

                return false;
            }

            return true;
        }

        if (step === 3) {
            if (!character.class) {
                alert(
                    "Escolha uma classe para continuar."
                );

                return false;
            }

            return true;
        }

        if (step === 4) {
            if (!character.background) {
                alert(
                    "Escolha um antecedente para continuar."
                );

                return false;
            }

            return true;
        }

        if (step === 5) {
            const required =
                selectedClass?.choose || 0;

            if (
                character.classSkills.length <
                required
            ) {
                alert(
                    `Escolha ${required} perícia(s) da classe.`
                );

                return false;
            }

            if (
                selectedBackground?.languages > 0 &&
                character.extraLanguages.length <
                    selectedBackground.languages
            ) {
                alert(
                    `Escolha ${selectedBackground.languages} idioma(s) adicional(is).`
                );

                return false;
            }

            return true;
        }

        if (step === 6) {
            const invalid =
                ABILITIES.some(
                    (ability) =>
                        Number(
                            character.abilities[
                                ability.id
                            ]
                        ) < 1
                );

            if (invalid) {
                alert(
                    "Todos os atributos precisam ter valores válidos."
                );

                return false;
            }

            return true;
        }

        if (step === 7) {
            return true;
        }

        return true;
    }

    function goNext() {
        if (!validateStep(currentStep)) {
            return;
        }

        if (
            currentStep <
            STEP_DATA.length
        ) {
            setCurrentStep(
                (current) => current + 1
            );

            return;
        }

        finishCharacter();
    }

    function goBack() {
        if (currentStep > 1) {
            setCurrentStep(
                (current) => current - 1
            );

            return;
        }

        onNavigate?.("personagens");
    }

    function buildCharacter() {
        const selectedRaceData =
            RACES[character.race];

        const selectedSubraceData =
            selectedRaceData?.subraces?.[
                character.subrace
            ];

        const raceTraits = [
            ...(selectedRaceData?.traits || []),
            ...(selectedSubraceData?.traits || []),
        ];

        const languages = [
            ...(selectedRaceData?.languages || []),
            ...character.extraLanguages,
        ].filter(
            (language, index, array) =>
                array.indexOf(language) ===
                index
        );

        const saves = ABILITIES.map(
            (ability) => ({
                id: ability.id,
                name: ability.name,
                proficient:
                    selectedClass?.saves?.includes(
                        ability.id
                    ) || false,
                bonus:
                    modifiers[ability.id] +
                    (selectedClass?.saves?.includes(
                        ability.id
                    )
                        ? proficiencyBonus
                        : 0),
            })
        );

        const skills = SKILLS.map(
            (skill) => {
                const proficient =
                    totalSkillProficiencies.includes(
                        skill.id
                    );

                return {
                    ...skill,
                    proficient,
                    bonus:
                        modifiers[
                            skill.ability
                        ] +
                        (proficient
                            ? proficiencyBonus
                            : 0),
                };
            }
        );

        const hitPoints =
            selectedClass.hitDie +
            modifiers.constituicao;

        const armorClass =
            10 + modifiers.destreza;

        const initiative =
            modifiers.destreza;

        const passivePerception =
            10 +
            modifiers.sabedoria +
            (totalSkillProficiencies.includes(
                "percepcao"
            )
                ? proficiencyBonus
                : 0);

        const spellcastingClasses = [
            "Bardo",
            "Bruxo",
            "Clérigo",
            "Druida",
            "Feiticeiro",
            "Mago",
            "Paladino",
            "Patrulheiro",
        ];

        let spellAbility = null;

        if (
            spellcastingClasses.includes(
                character.class
            )
        ) {
            if (
                [
                    "Bardo",
                    "Bruxo",
                    "Feiticeiro",
                    "Paladino",
                ].includes(
                    character.class
                )
            ) {
                spellAbility =
                    "carisma";
            }

            if (
                [
                    "Clérigo",
                    "Druida",
                    "Patrulheiro",
                ].includes(
                    character.class
                )
            ) {
                spellAbility =
                    "sabedoria";
            }

            if (
                character.class === "Mago"
            ) {
                spellAbility =
                    "inteligencia";
            }
        }

        const spellAbilityModifier =
            spellAbility
                ? modifiers[
                      spellAbility
                  ]
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

        const now =
            new Date().toISOString();

        return {
            id: `dnd5e-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 9)}`,

            system: "dnd5e",
            systemName: "D&D 5e",

            name:
                character.name.trim(),

            race: character.race,
            subrace:
                character.subrace,

            class: character.class,
            background:
                character.background,

            level: Number(
                character.level
            ),

            experience: Number(
                character.experience || 0
            ),

            alignment:
                character.alignment,

            concept:
                character.concept,

            abilities: {
                ...finalAbilities,
            },

            abilityModifiers: {
                ...modifiers,
            },

            proficiencyBonus,

            savingThrows: saves,

            skills,

            classSkills: [
                ...character.classSkills,
            ],

            backgroundSkills: [
                ...backgroundSkills,
            ],

            raceSkills: [
                ...character.raceSkills,
            ],

            hitPoints,
            maxHitPoints: hitPoints,

            armorClass,
            initiative,
            passivePerception,

            spellcasting: {
                ability:
                    spellAbility,
                abilityModifier:
                    spellAbilityModifier,
                saveDC: spellSaveDC,
                attackBonus:
                    spellAttack,
            },

            spells: [
                ...character.spells,
            ],

            languages,

            equipment: [
                ...character.equipment,
            ],

            traits: raceTraits,

            personality:
                character.personality,

            ideal:
                character.ideal,

            bond:
                character.bond,

            flaw:
                character.flaw,

            speed:
                selectedSubraceData?.speed ||
                selectedRaceData?.speed ||
                30,

            hitDie:
                selectedClass.hitDie,

            classInfo:
                selectedClass.info,

            raceInfo:
                selectedRaceData.info,

            backgroundInfo:
                selectedBackground.info,

            createdAt: now,
            updatedAt: now,
        };
    }

    function finishCharacter() {
        if (!validateStep(8)) {
            return;
        }

        const finalCharacter =
            buildCharacter();

        try {
            const storageKey =
                "ordo-rpgistas-personagens";

            const saved =
                localStorage.getItem(
                    storageKey
                );

            let characters = [];

            if (saved) {
                try {
                    const parsed =
                        JSON.parse(saved);

                    if (
                        Array.isArray(
                            parsed
                        )
                    ) {
                        characters =
                            parsed;
                    }
                } catch {
                    characters = [];
                }
            }

            const existingIndex =
                characters.findIndex(
                    (item) =>
                        item?.id ===
                        finalCharacter.id
                );

            if (
                existingIndex >= 0
            ) {
                characters[
                    existingIndex
                ] = finalCharacter;
            } else {
                characters.push(
                    finalCharacter
                );
            }

            localStorage.setItem(
                storageKey,
                JSON.stringify(
                    characters
                )
            );

            window.dispatchEvent(
                new Event("ordo-characters-updated")
            );

            setCompletedCharacter(
                finalCharacter
            );
        } catch (error) {
            console.error(
                "Erro ao salvar personagem:",
                error
            );

            alert(
                "Não foi possível salvar o personagem. Verifique o armazenamento do navegador."
            );

            return;
        }
    }

    const currentStepData =
        STEP_DATA.find(
            (step) =>
                step.id === currentStep
        );

    const progress =
        (currentStep /
            STEP_DATA.length) *
        100;

    return (
        <PageBase
            title="Criar Personagem"
            subtitle="Monte seu personagem de D&D passo a passo."
            icon={Dices}
            onNavigate={onNavigate}
        >
            <div className="criar-personagem-page">
                <div className="criar-top-bar">
                    <button
                        type="button"
                        className="criar-back-button"
                        onClick={goBack}
                    >
                        <ArrowLeft
                            size={16}
                        />

                        <span>
                            Voltar
                        </span>
                    </button>

                    <span className="criar-step-counter">
                        ETAPA{" "}
                        {currentStep}{" "}
                        DE{" "}
                        {STEP_DATA.length}
                    </span>
                </div>

                <div className="criar-progress">
                    <div
                        className="criar-progress-bar"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>

                <div className="criar-step-navigation">
                    {STEP_DATA.map(
                        (step) => {
                            const StepIcon =
                                step.icon;

                            const active =
                                currentStep ===
                                step.id;

                            const completed =
                                currentStep >
                                step.id;

                            return (
                                <button
                                    key={
                                        step.id
                                    }
                                    type="button"
                                    className={`criar-step-item ${
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
                                            step.id <
                                            currentStep
                                        ) {
                                            setCurrentStep(
                                                step.id
                                            );
                                        }
                                    }}
                                >
                                    <span className="criar-step-number">
                                        {completed ? (
                                            <Check
                                                size={
                                                    13
                                                }
                                            />
                                        ) : (
                                            step.id
                                        )}
                                    </span>

                                    <span>
                                        {
                                            step.name
                                        }
                                    </span>
                                </button>
                            );
                        }
                    )}
                </div>

                <motion.div
                    className="criar-content"
                    key={currentStep}
                    initial={{
                        opacity: 0,
                        x: 15,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration: 0.25,
                    }}
                >
                    {currentStep ===
                        1 && (
                        <ConceptStep
                            character={
                                character
                            }
                            updateCharacter={
                                updateCharacter
                            }
                        />
                    )}

                    {currentStep ===
                        2 && (
                        <RaceStep
                            character={
                                character
                            }
                            selectedRace={
                                selectedRace
                            }
                            changeRace={
                                changeRace
                            }
                            updateCharacter={
                                updateCharacter
                            }
                            openInfo={
                                openInfo
                            }
                        />
                    )}

                    {currentStep ===
                        3 && (
                        <ClassStep
                            character={
                                character
                            }
                            selectedClass={
                                selectedClass
                            }
                            changeClass={
                                changeClass
                            }
                            openInfo={
                                openInfo
                            }
                        />
                    )}

                    {currentStep ===
                        4 && (
                        <BackgroundStep
                            character={
                                character
                            }
                            selectedBackground={
                                selectedBackground
                            }
                            changeBackground={
                                changeBackground
                            }
                            openInfo={
                                openInfo
                            }
                        />
                    )}

                    {currentStep ===
                        5 && (
                        <ProficiencyStep
                            character={
                                character
                            }
                            selectedClass={
                                selectedClass
                            }
                            availableClassSkills={
                                availableClassSkills
                            }
                            backgroundSkills={
                                backgroundSkills
                            }
                            totalSkillProficiencies={
                                totalSkillProficiencies
                            }
                            toggleClassSkill={
                                toggleClassSkill
                            }
                            toggleRaceSkill={
                                toggleRaceSkill
                            }
                            toggleLanguage={
                                toggleLanguage
                            }
                            selectedBackground={
                                selectedBackground
                            }
                            extraLanguages={
                                character.extraLanguages
                            }
                        />
                    )}

                    {currentStep ===
                        6 && (
                        <AbilitiesStep
                            character={
                                character
                            }
                            finalAbilities={
                                finalAbilities
                            }
                            modifiers={
                                modifiers
                            }
                            updateAbility={
                                updateAbility
                            }
                            rollAbilities={
                                rollAbilities
                            }
                            resetAbilities={
                                resetAbilities
                            }
                        />
                    )}

                    {currentStep ===
                        7 && (
                        <DetailsStep
                            character={
                                character
                            }
                            updateCharacter={
                                updateCharacter
                            }
                        />
                    )}

                    {currentStep ===
                        8 && (
                        <CharacterPreviewStep
                            character={
                                character
                            }
                            finalAbilities={
                                finalAbilities
                            }
                            modifiers={
                                modifiers
                            }
                            proficiencyBonus={
                                proficiencyBonus
                            }
                            selectedRace={
                                selectedRace
                            }
                            selectedClass={
                                selectedClass
                            }
                            selectedBackground={
                                selectedBackground
                            }
                            totalSkillProficiencies={
                                totalSkillProficiencies
                            }
                            completedCharacter={
                                completedCharacter
                            }
                        />
                    )}
                </motion.div>

                <div className="criar-bottom-actions">
                    <button
                        type="button"
                        className="criar-action-button"
                        onClick={
                            goBack
                        }
                    >
                        <ArrowLeft
                            size={16}
                        />

                        <span>
                            {currentStep ===
                            1
                                ? "Cancelar"
                                : "Anterior"}
                        </span>
                    </button>

                    <button
                        type="button"
                        className="criar-action-button primary"
                        onClick={
                            goNext
                        }
                    >
                        <span>
                            {currentStep ===
                            STEP_DATA.length
                                ? "Salvar personagem"
                                : "Continuar"}
                        </span>

                        {currentStep ===
                        STEP_DATA.length ? (
                            <Check
                                size={16}
                            />
                        ) : (
                            <ArrowRight
                                size={16}
                            />
                        )}
                    </button>
                </div>
            </div>

            {infoModal && (
                <InfoModal
                    infoModal={
                        infoModal
                    }
                    onClose={() =>
                        setInfoModal(
                            null
                        )
                    }
                />
            )}
        </PageBase>
    );
}
function ConceptStep({
    character,
    updateCharacter,
}) {
    return (
        <div className="criar-step-card">
            <div className="criar-step-header">
                <div>
                    <span>PASSO 1</span>
                    <h2>Conceito do personagem</h2>
                    <p>
                        Comece definindo a identidade básica do seu personagem.
                    </p>
                </div>
            </div>

            <div className="criar-field-grid">
                <label className="criar-field criar-field-full">
                    <span>Nome do personagem</span>

                    <input
                        type="text"
                        value={character.name}
                        onChange={(event) =>
                            updateCharacter("name", event.target.value)
                        }
                        placeholder="Digite o nome do personagem"
                        maxLength={60}
                    />
                </label>

                <label className="criar-field criar-field-full">
                    <span>Conceito</span>

                    <textarea
                        value={character.concept}
                        onChange={(event) =>
                            updateCharacter("concept", event.target.value)
                        }
                        placeholder="Descreva brevemente quem é seu personagem..."
                        rows={5}
                        maxLength={500}
                    />

                    <small>
                        {character.concept.length}/500
                    </small>
                </label>
            </div>
        </div>
    );
}


function RaceStep({
    character,
    updateCharacter,
    selectedRace,
    toggleRaceSkill,
}) {
    return (
        <div className="criar-step-card">
            <div className="criar-step-header">
                <div>
                    <span>PASSO 2</span>
                    <h2>Raça</h2>
                    <p>
                        Escolha a raça que define parte da origem e das
                        características do personagem.
                    </p>
                </div>
            </div>

            <div className="criar-option-grid">
                {RACES.map((race) => {
                    const selected = character.race === race.id;

                    return (
                        <button
                            key={race.id}
                            type="button"
                            className={`criar-option-card ${
                                selected ? "active" : ""
                            }`}
                            onClick={() => {
                                updateCharacter("race", race.id);
                                updateCharacter(
                                    "subrace",
                                    race.subraces?.[0]?.id || ""
                                );
                                updateCharacter(
                                    "raceSkills",
                                    []
                                );
                            }}
                        >
                            <div className="criar-option-icon">
                                {race.icon}
                            </div>

                            <div className="criar-option-content">
                                <strong>{race.name}</strong>

                                <span>
                                    {race.description}
                                </span>
                            </div>

                            <div className="criar-option-check">
                                {selected ? "✓" : ""}
                            </div>
                        </button>
                    );
                })}
            </div>

            {selectedRace?.subraces?.length > 0 && (
                <section className="criar-section">
                    <div className="criar-section-title">
                        <div>
                            <span>VARIAÇÃO</span>
                            <h3>Sub-raça</h3>
                        </div>
                    </div>

                    <div className="criar-option-grid">
                        {selectedRace.subraces.map((subrace) => {
                            const selected =
                                character.subrace === subrace.id;

                            return (
                                <button
                                    key={subrace.id}
                                    type="button"
                                    className={`criar-option-card ${
                                        selected ? "active" : ""
                                    }`}
                                    onClick={() =>
                                        updateCharacter(
                                            "subrace",
                                            subrace.id
                                        )
                                    }
                                >
                                    <div className="criar-option-content">
                                        <strong>{subrace.name}</strong>

                                        <span>
                                            {subrace.description}
                                        </span>
                                    </div>

                                    <div className="criar-option-check">
                                        {selected ? "✓" : ""}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>
            )}

            {selectedRace?.skillOptions?.length > 0 && (
                <section className="criar-section">
                    <div className="criar-section-title">
                        <div>
                            <span>CARACTERÍSTICAS</span>
                            <h3>Escolhas da raça</h3>
                        </div>
                    </div>

                    <div className="criar-check-grid">
                        {selectedRace.skillOptions.map((skillId) => {
                            const skill = SKILLS.find(
                                (item) => item.id === skillId
                            );

                            if (!skill) return null;

                            const checked =
                                character.raceSkills.includes(skill.id);

                            return (
                                <button
                                    key={skill.id}
                                    type="button"
                                    className={`criar-check-item ${
                                        checked ? "active" : ""
                                    }`}
                                    onClick={() =>
                                        toggleRaceSkill(skill.id)
                                    }
                                >
                                    <span className="criar-check-box">
                                        {checked ? "✓" : ""}
                                    </span>

                                    <span>
                                        <strong>{skill.name}</strong>
                                        <small>
                                            {skill.ability}
                                        </small>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}


function ClassStep({
    character,
    updateCharacter,
    selectedClass,
}) {
    return (
        <div className="criar-step-card">
            <div className="criar-step-header">
                <div>
                    <span>PASSO 3</span>
                    <h2>Classe</h2>
                    <p>
                        Escolha a classe que define o principal estilo de
                        jogo e as capacidades do personagem.
                    </p>
                </div>
            </div>

            <div className="criar-option-grid">
                {CLASSES.map((item) => {
                    const selected = character.class === item.id;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={`criar-option-card ${
                                selected ? "active" : ""
                            }`}
                            onClick={() => {
                                updateCharacter("class", item.id);
                                updateCharacter(
                                    "classSkills",
                                    []
                                );
                                updateCharacter(
                                    "spells",
                                    []
                                );
                            }}
                        >
                            <div className="criar-option-icon">
                                {item.icon}
                            </div>

                            <div className="criar-option-content">
                                <strong>{item.name}</strong>

                                <span>
                                    {item.description}
                                </span>

                                <small>
                                    Dado de vida: d{item.hitDie}
                                </small>
                            </div>

                            <div className="criar-option-check">
                                {selected ? "✓" : ""}
                            </div>
                        </button>
                    );
                })}
            </div>

            {selectedClass && (
                <section className="criar-section">
                    <div className="criar-section-title">
                        <div>
                            <span>CLASSE SELECIONADA</span>
                            <h3>{selectedClass.name}</h3>
                        </div>
                    </div>

                    <div className="criar-info-grid">
                        <div className="criar-info-box">
                            <span>DADO DE VIDA</span>
                            <strong>
                                d{selectedClass.hitDie}
                            </strong>
                        </div>

                        <div className="criar-info-box">
                            <span>ATRIBUTO PRINCIPAL</span>
                            <strong>
                                {selectedClass.primaryAbility ||
                                    "Variável"}
                            </strong>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}


function BackgroundStep({
    character,
    updateCharacter,
    selectedBackground,
}) {
    return (
        <div className="criar-step-card">
            <div className="criar-step-header">
                <div>
                    <span>PASSO 4</span>
                    <h2>Antecedente</h2>
                    <p>
                        O passado do personagem ajuda a definir sua
                        experiência antes da aventura começar.
                    </p>
                </div>
            </div>

            <div className="criar-option-grid">
                {BACKGROUNDS.map((background) => {
                    const selected =
                        character.background === background.id;

                    return (
                        <button
                            key={background.id}
                            type="button"
                            className={`criar-option-card ${
                                selected ? "active" : ""
                            }`}
                            onClick={() => {
                                updateCharacter(
                                    "background",
                                    background.id
                                );

                                updateCharacter(
                                    "extraLanguages",
                                    []
                                );
                            }}
                        >
                            <div className="criar-option-content">
                                <strong>
                                    {background.name}
                                </strong>

                                <span>
                                    {background.description}
                                </span>
                            </div>

                            <div className="criar-option-check">
                                {selected ? "✓" : ""}
                            </div>
                        </button>
                    );
                })}
            </div>

            {selectedBackground && (
                <section className="criar-section">
                    <div className="criar-section-title">
                        <div>
                            <span>DETALHES</span>
                            <h3>
                                {selectedBackground.name}
                            </h3>
                        </div>
                    </div>

                    <div className="criar-info-grid">
                        <div className="criar-info-box">
                            <span>PERÍCIAS</span>

                            <strong>
                                {selectedBackground.skills
                                    ?.map((skillId) => {
                                        const skill = SKILLS.find(
                                            (item) =>
                                                item.id ===
                                                skillId
                                        );

                                        return skill?.name;
                                    })
                                    .filter(Boolean)
                                    .join(", ") ||
                                    "Nenhuma definida"}
                            </strong>
                        </div>

                        <div className="criar-info-box">
                            <span>IDIOMAS</span>

                            <strong>
                                {selectedBackground.languages ||
                                    0}
                            </strong>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}


function ProficiencyStep({
    character,
    toggleClassSkill,
    selectedClass,
}) {
    const availableSkills =
        selectedClass?.skillOptions ||
        selectedClass?.skills ||
        [];

    return (
        <div className="criar-step-card">
            <div className="criar-step-header">
                <div>
                    <span>PASSO 5</span>
                    <h2>Proficiências</h2>
                    <p>
                        Selecione as perícias concedidas pela classe.
                    </p>
                </div>
            </div>

            <section className="criar-section">
                <div className="criar-section-title">
                    <div>
                        <span>PERÍCIAS</span>
                        <h3>
                            Proficiências de classe
                        </h3>
                    </div>

                    <span className="criar-section-counter">
                        {character.classSkills.length}
                    </span>
                </div>

                <div className="criar-check-grid">
                    {availableSkills.map((skillId) => {
                        const skill =
                            typeof skillId === "object"
                                ? skillId
                                : SKILLS.find(
                                      (item) =>
                                          item.id === skillId
                                  );

                        if (!skill) return null;

                        const checked =
                            character.classSkills.includes(
                                skill.id
                            );

                        return (
                            <button
                                key={skill.id}
                                type="button"
                                className={`criar-check-item ${
                                    checked ? "active" : ""
                                }`}
                                onClick={() =>
                                    toggleClassSkill(skill.id)
                                }
                            >
                                <span className="criar-check-box">
                                    {checked ? "✓" : ""}
                                </span>

                                <span>
                                    <strong>
                                        {skill.name}
                                    </strong>

                                    <small>
                                        {skill.ability}
                                    </small>
                                </span>
                            </button>
                        );
                    })}

                    {availableSkills.length === 0 && (
                        <div className="criar-empty-message">
                            <strong>
                                Nenhuma perícia configurada.
                            </strong>

                            <span>
                                As opções de perícia desta classe
                                poderão ser configuradas posteriormente.
                            </span>
                        </div>
                    )}
                </div>
            </section>

            <section className="criar-section">
                <div className="criar-section-title">
                    <div>
                        <span>IDIOMAS</span>
                        <h3>Idiomas adicionais</h3>
                    </div>
                </div>

                <div className="criar-check-grid">
                    {LANGUAGES.map((language) => {
                        const checked =
                            character.extraLanguages.includes(
                                language.id
                            );

                        return (
                            <button
                                key={language.id}
                                type="button"
                                className={`criar-check-item ${
                                    checked ? "active" : ""
                                }`}
                                onClick={() =>
                                    toggleLanguage(language.id)
                                }
                            >
                                <span className="criar-check-box">
                                    {checked ? "✓" : ""}
                                </span>

                                <span>
                                    <strong>
                                        {language.name}
                                    </strong>

                                    <small>
                                        {language.description}
                                    </small>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
function AbilitiesStep({
    character,
    updateAbility,
    rollAbilities,
    resetAbilities,
}) {
    return (
        <div className="criar-step-card">
            <div className="criar-step-header">
                <div>
                    <span>PASSO 6</span>
                    <h2>Atributos</h2>
                    <p>
                        Distribua os valores de atributo do seu personagem.
                    </p>
                </div>

                <div className="criar-step-actions">
                    <button
                        type="button"
                        className="criar-secondary-button"
                        onClick={rollAbilities}
                    >
                        Rolar valores
                    </button>

                    <button
                        type="button"
                        className="criar-secondary-button"
                        onClick={resetAbilities}
                    >
                        Restaurar
                    </button>
                </div>
            </div>

            <div className="criar-abilities-grid">
                {ABILITIES.map((ability) => {
                    const value =
                        Number(
                            character.abilities?.[ability.id]
                        ) || 0;

                    const modifier = getAbilityBonus(value);

                    return (
                        <div
                            key={ability.id}
                            className="criar-ability-card"
                        >
                            <div className="criar-ability-header">
                                <div>
                                    <span>
                                        {ability.short}
                                    </span>

                                    <strong>
                                        {ability.name}
                                    </strong>
                                </div>
                            </div>

                            <div className="criar-ability-value">
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={value}
                                    onChange={(event) =>
                                        updateAbility(
                                            ability.id,
                                            event.target.value
                                        )
                                    }
                                />

                                <div className="criar-ability-modifier">
                                    {formatModifier(modifier)}
                                </div>
                            </div>

                            {ability.description && (
                                <p>
                                    {ability.description}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="criar-section">
                <div className="criar-section-title">
                    <div>
                        <span>ATRIBUTOS EXTRAS</span>
                        <h3>Valores personalizados</h3>
                    </div>
                </div>

                <div className="criar-field-grid">
                    {character.extraAbilities.map(
                        (value, index) => (
                            <label
                                key={index}
                                className="criar-field"
                            >
                                <span>
                                    Atributo extra {index + 1}
                                </span>

                                <input
                                    type="text"
                                    value={value}
                                    onChange={(event) => {
                                        const next =
                                            [
                                                ...character.extraAbilities,
                                            ];

                                        next[index] =
                                            event.target.value;

                                        updateCharacter(
                                            "extraAbilities",
                                            next
                                        );
                                    }}
                                    placeholder="Opcional"
                                />
                            </label>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}


function DetailsStep({
    character,
    updateCharacter,
}) {
    return (
        <div className="criar-step-card">
            <div className="criar-step-header">
                <div>
                    <span>PASSO 7</span>
                    <h2>Detalhes</h2>
                    <p>
                        Complete a personalidade e a história do seu
                        personagem.
                    </p>
                </div>
            </div>

            <div className="criar-field-grid">
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

                <label className="criar-field">
                    <span>Experiência</span>

                    <input
                        type="number"
                        min="0"
                        value={character.experience}
                        onChange={(event) =>
                            updateCharacter(
                                "experience",
                                Math.max(
                                    0,
                                    Number(event.target.value) || 0
                                )
                            )
                        }
                    />
                </label>

                <label className="criar-field criar-field-full">
                    <span>Personalidade</span>

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
                        maxLength={500}
                    />
                </label>

                <label className="criar-field">
                    <span>Ideal</span>

                    <textarea
                        value={character.ideal}
                        onChange={(event) =>
                            updateCharacter(
                                "ideal",
                                event.target.value
                            )
                        }
                        placeholder="O que guia seu personagem?"
                        rows={4}
                        maxLength={300}
                    />
                </label>

                <label className="criar-field">
                    <span>Vínculo</span>

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
                        maxLength={300}
                    />
                </label>

                <label className="criar-field">
                    <span>Defeito</span>

                    <textarea
                        value={character.flaw}
                        onChange={(event) =>
                            updateCharacter(
                                "flaw",
                                event.target.value
                            )
                        }
                        placeholder="Qual é sua principal fraqueza?"
                        rows={4}
                        maxLength={300}
                    />
                </label>
            </div>
        </div>
    );
}


function CharacterPreviewStep({
    character,
    selectedRace,
    selectedClass,
    selectedBackground,
    derived,
}) {
    const raceName =
        selectedRace?.name ||
        character.race ||
        "Não definida";

    const className =
        selectedClass?.name ||
        character.class ||
        "Não definida";

    const backgroundName =
        selectedBackground?.name ||
        character.background ||
        "Não definido";

    return (
        <div className="criar-step-card">
            <div className="criar-step-header">
                <div>
                    <span>PASSO 8</span>
                    <h2>Ficha do personagem</h2>
                    <p>
                        Confira os principais dados antes de salvar sua
                        ficha.
                    </p>
                </div>
            </div>

            <div className="criar-character-preview">
                <div className="criar-character-preview-header">
                    <div>
                        <span>ORDO RPGISTAS</span>

                        <h2>
                            {character.name ||
                                "Personagem sem nome"}
                        </h2>

                        <p>
                            {raceName} • {className}
                        </p>
                    </div>

                    <div className="criar-character-level">
                        <small>NÍVEL</small>
                        <strong>
                            {character.level}
                        </strong>
                    </div>
                </div>

                <div className="criar-info-grid">
                    <div className="criar-info-box">
                        <span>RAÇA</span>
                        <strong>{raceName}</strong>
                    </div>

                    <div className="criar-info-box">
                        <span>CLASSE</span>
                        <strong>{className}</strong>
                    </div>

                    <div className="criar-info-box">
                        <span>ANTECEDENTE</span>
                        <strong>
                            {backgroundName}
                        </strong>
                    </div>

                    <div className="criar-info-box">
                        <span>ALINHAMENTO</span>
                        <strong>
                            {character.alignment}
                        </strong>
                    </div>
                </div>

                <section className="criar-section">
                    <div className="criar-section-title">
                        <div>
                            <span>ATRIBUTOS</span>
                            <h3>
                                Modificadores
                            </h3>
                        </div>
                    </div>

                    <div className="criar-preview-abilities">
                        {ABILITIES.map((ability) => {
                            const value =
                                Number(
                                    character.abilities?.[
                                        ability.id
                                    ]
                                ) || 0;

                            const modifier =
                                getAbilityBonus(value);

                            return (
                                <div
                                    key={ability.id}
                                    className="criar-preview-ability"
                                >
                                    <span>
                                        {ability.short}
                                    </span>

                                    <strong>
                                        {value}
                                    </strong>

                                    <small>
                                        {formatModifier(
                                            modifier
                                        )}
                                    </small>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="criar-section">
                    <div className="criar-section-title">
                        <div>
                            <span>COMBATE</span>
                            <h3>
                                Estatísticas derivadas
                            </h3>
                        </div>
                    </div>

                    <div className="criar-info-grid">
                        <div className="criar-info-box">
                            <span>PONTOS DE VIDA</span>
                            <strong>
                                {derived.hitPoints}
                            </strong>
                        </div>

                        <div className="criar-info-box">
                            <span>CLASSE DE ARMADURA</span>
                            <strong>
                                {derived.armorClass}
                            </strong>
                        </div>

                        <div className="criar-info-box">
                            <span>INICIATIVA</span>
                            <strong>
                                {formatModifier(
                                    derived.initiative
                                )}
                            </strong>
                        </div>

                        <div className="criar-info-box">
                            <span>BÔNUS DE PROFICIÊNCIA</span>
                            <strong>
                                {formatModifier(
                                    derived.proficiencyBonus
                                )}
                            </strong>
                        </div>
                    </div>
                </section>

                {derived.spellSaveDC !== null && (
                    <section className="criar-section">
                        <div className="criar-section-title">
                            <div>
                                <span>MAGIA</span>
                                <h3>
                                    Estatísticas mágicas
                                </h3>
                            </div>
                        </div>

                        <div className="criar-info-grid">
                            <div className="criar-info-box">
                                <span>
                                    HABILIDADE DE CONJURAÇÃO
                                </span>

                                <strong>
                                    {derived.spellAbility ||
                                        "—"}
                                </strong>
                            </div>

                            <div className="criar-info-box">
                                <span>
                                    CD DE RESISTÊNCIA
                                </span>

                                <strong>
                                    {derived.spellSaveDC}
                                </strong>
                            </div>

                            <div className="criar-info-box">
                                <span>
                                    ATAQUE MÁGICO
                                </span>

                                <strong>
                                    {formatModifier(
                                        derived.spellAttack
                                    )}
                                </strong>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}


function InfoModal({
    open,
    title,
    message,
    onClose,
}) {
    if (!open) return null;

    return (
        <div
            className="criar-modal-backdrop"
            role="presentation"
            onClick={onClose}
        >
            <div
                className="criar-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="criar-modal-title"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="criar-modal-header">
                    <div>
                        <span>ORDO RPGISTAS</span>

                        <h2 id="criar-modal-title">
                            {title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="criar-modal-close"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="criar-modal-body">
                    <p>{message}</p>
                </div>

                <div className="criar-modal-footer">
                    <button
                        type="button"
                        className="criar-primary-button"
                        onClick={onClose}
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}


function CharacterSheet({
    character,
    onBack,
}) {
    const abilities =
        character?.abilities || {};

    const modifiers =
        character?.modifiers || {};

    return (
        <main className="criar-character-sheet-page">
            <div className="criar-character-sheet-background" />

            <div className="criar-character-sheet-content">
                <header className="criar-character-sheet-header">
                    <div>
                        <span>ORDO RPGISTAS</span>

                        <h1>
                            {character.name ||
                                "Personagem"}
                        </h1>

                        <p>
                            {character.race} •{" "}
                            {character.class} • Nível{" "}
                            {character.level}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="criar-secondary-button"
                        onClick={onBack}
                    >
                        Voltar para personagens
                    </button>
                </header>

                <section className="criar-character-sheet-card">
                    <div className="criar-info-grid">
                        <div className="criar-info-box">
                            <span>RAÇA</span>
                            <strong>
                                {character.race}
                            </strong>
                        </div>

                        <div className="criar-info-box">
                            <span>CLASSE</span>
                            <strong>
                                {character.class}
                            </strong>
                        </div>

                        <div className="criar-info-box">
                            <span>ANTECEDENTE</span>
                            <strong>
                                {character.background}
                            </strong>
                        </div>

                        <div className="criar-info-box">
                            <span>NÍVEL</span>
                            <strong>
                                {character.level}
                            </strong>
                        </div>
                    </div>

                    <section className="criar-section">
                        <div className="criar-section-title">
                            <div>
                                <span>ATRIBUTOS</span>
                                <h3>
                                    Valores e modificadores
                                </h3>
                            </div>
                        </div>

                        <div className="criar-preview-abilities">
                            {ABILITIES.map(
                                (ability) => (
                                    <div
                                        key={
                                            ability.id
                                        }
                                        className="criar-preview-ability"
                                    >
                                        <span>
                                            {
                                                ability.short
                                            }
                                        </span>

                                        <strong>
                                            {
                                                abilities[
                                                    ability.id
                                                ]
                                            }
                                        </strong>

                                        <small>
                                            {formatModifier(
                                                modifiers[
                                                    ability.id
                                                ] || 0
                                            )}
                                        </small>
                                    </div>
                                )
                            )}
                        </div>
                    </section>

                    <section className="criar-section">
                        <div className="criar-section-title">
                            <div>
                                <span>COMBATE</span>
                                <h3>
                                    Estatísticas
                                </h3>
                            </div>
                        </div>

                        <div className="criar-info-grid">
                            <div className="criar-info-box">
                                <span>
                                    PONTOS DE VIDA
                                </span>

                                <strong>
                                    {character.hitPoints ??
                                        "—"}
                                </strong>
                            </div>

                            <div className="criar-info-box">
                                <span>
                                    CLASSE DE ARMADURA
                                </span>

                                <strong>
                                    {character.armorClass ??
                                        "—"}
                                </strong>
                            </div>

                            <div className="criar-info-box">
                                <span>
                                    INICIATIVA
                                </span>

                                <strong>
                                    {formatModifier(
                                        character.initiative ||
                                            0
                                    )}
                                </strong>
                            </div>

                            <div className="criar-info-box">
                                <span>
                                    PROFICIÊNCIA
                                </span>

                                <strong>
                                    {formatModifier(
                                        character.proficiencyBonus ||
                                            0
                                    )}
                                </strong>
                            </div>
                        </div>
                    </section>

                    <section className="criar-section">
                        <div className="criar-section-title">
                            <div>
                                <span>PERSONALIDADE</span>
                                <h3>
                                    Detalhes
                                </h3>
                            </div>
                        </div>

                        <div className="criar-character-text-grid">
                            <div>
                                <span>
                                    CONCEITO
                                </span>

                                <p>
                                    {character.concept ||
                                        "Não informado."}
                                </p>
                            </div>

                            <div>
                                <span>
                                    PERSONALIDADE
                                </span>

                                <p>
                                    {character.personality ||
                                        "Não informado."}
                                </p>
                            </div>

                            <div>
                                <span>IDEAL</span>

                                <p>
                                    {character.ideal ||
                                        "Não informado."}
                                </p>
                            </div>

                            <div>
                                <span>VÍNCULO</span>

                                <p>
                                    {character.bond ||
                                        "Não informado."}
                                </p>
                            </div>

                            <div>
                                <span>DEFEITO</span>

                                <p>
                                    {character.flaw ||
                                        "Não informado."}
                                </p>
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        </main>
    );
}


export {
    ConceptStep,
    RaceStep,
    ClassStep,
    BackgroundStep,
    ProficiencyStep,
    AbilitiesStep,
    DetailsStep,
    CharacterPreviewStep,
    InfoModal,
    CharacterSheet,
};
