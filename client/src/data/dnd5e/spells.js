/*
|--------------------------------------------------------------------------
| ORDO RPGISTAS
| Catálogo inicial de magias D&D 5e
|--------------------------------------------------------------------------
|
| Este arquivo será a base da biblioteca de magias.
|
| IMPORTANTE:
| As descrições completas das magias serão adicionadas posteriormente
| utilizando uma fonte/licença apropriada. Aqui mantemos a estrutura
| necessária para a ficha pesquisar, filtrar e exibir magias.
|
*/

export const DND_SPELLS = [
    {
        id: "acid-arrow",
        name: "Flecha Ácida",
        level: 2,
        school: "Evocação",
        classes: ["Mago"],
    },

    {
        id: "burning-hands",
        name: "Mãos Flamejantes",
        level: 1,
        school: "Evocação",
        classes: ["Mago", "Feiticeiro"],
    },

    {
        id: "charm-person",
        name: "Enfeitiçar Pessoa",
        level: 1,
        school: "Encantamento",
        classes: ["Bardo", "Druida", "Feiticeiro", "Mago", "Bruxo"],
    },

    {
        id: "detect-magic",
        name: "Detectar Magia",
        level: 1,
        school: "Adivinhação",
        classes: [
            "Bardo",
            "Clérigo",
            "Druida",
            "Feiticeiro",
            "Mago",
            "Paladino",
            "Patrulheiro",
            "Bruxo",
        ],
    },

    {
        id: "fireball",
        name: "Bola de Fogo",
        level: 3,
        school: "Evocação",
        classes: ["Feiticeiro", "Mago"],
    },

    {
        id: "mage-armor",
        name: "Armadura Arcana",
        level: 1,
        school: "Abjuração",
        classes: ["Mago", "Feiticeiro"],
    },

    {
        id: "magic-missile",
        name: "Mísseis Mágicos",
        level: 1,
        school: "Evocação",
        classes: ["Mago", "Feiticeiro"],
    },

    {
        id: "shield",
        name: "Escudo",
        level: 1,
        school: "Abjuração",
        classes: ["Mago", "Feiticeiro"],
    },

    {
        id: "sleep",
        name: "Sono",
        level: 1,
        school: "Encantamento",
        classes: ["Bardo", "Feiticeiro", "Mago"],
    },

    {
        id: "thunderwave",
        name: "Onda Trovejante",
        level: 1,
        school: "Evocação",
        classes: ["Bardo", "Druida", "Feiticeiro", "Mago"],
    },
];

/*
|--------------------------------------------------------------------------
| Funções de consulta
|--------------------------------------------------------------------------
*/

export function getSpellById(id) {
    return (
        DND_SPELLS.find(
            (spell) => spell.id === id
        ) || null
    );
}

export function getSpellsByClass(className) {
    return DND_SPELLS.filter(
        (spell) =>
            spell.classes.includes(className)
    );
}

export function searchSpells(search = "") {
    const normalizedSearch =
        search.trim().toLowerCase();

    if (!normalizedSearch) {
        return DND_SPELLS;
    }

    return DND_SPELLS.filter(
        (spell) =>
            spell.name
                .toLowerCase()
                .includes(normalizedSearch) ||
            spell.school
                .toLowerCase()
                .includes(normalizedSearch)
    );
}
