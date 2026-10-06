/*
|--------------------------------------------------------------------------
| ORDO RPGISTAS
| D&D 5e — Regras do personagem
|--------------------------------------------------------------------------
*/

import {
    getAbilityModifier,
    getProficiencyBonus,
    getSkillBonus,
    getSavingThrowBonus,
    getSpellSaveDC,
    getSpellAttackBonus,
    getBaseArmorClass,
    getInitiative,
} from "./calculations";

import {
    getCharacterLevel,
} from "./levelRules";

/*
|--------------------------------------------------------------------------
| Habilidades de conjuração
|--------------------------------------------------------------------------
*/

export const SPELLCASTING_ABILITIES = {
    Bardo: "carisma",
    Bruxo: "carisma",
    Feiticeiro: "carisma",

    Clérigo: "sabedoria",
    Druida: "sabedoria",

    Mago: "inteligencia",

    Paladino: "carisma",
    Patrulheiro: "sabedoria",
};

/*
|--------------------------------------------------------------------------
| Obtém a habilidade de conjuração
|--------------------------------------------------------------------------
*/

export function getSpellcastingAbility(
    character
) {
    if (!character) {
        return null;
    }

    const level =
        getCharacterLevel(
            character.level
        );

    if (
        character.class === "Paladino" &&
        level < 2
    ) {
        return null;
    }

    if (
        character.class === "Patrulheiro" &&
        level < 2
    ) {
        return null;
    }

    return (
        SPELLCASTING_ABILITIES[
            character.class
        ] || null
    );
}

/*
|--------------------------------------------------------------------------
| Bônus das habilidades
|--------------------------------------------------------------------------
*/

export function calculateAbilityModifiers(
    abilities = {}
) {
    const modifiers = {};

    Object.entries(
        abilities
    ).forEach(
        ([ability, value]) => {
            modifiers[ability] =
                getAbilityModifier(value);
        }
    );

    return modifiers;
}

/*
|--------------------------------------------------------------------------
| Perícias
|--------------------------------------------------------------------------
*/

export function calculateSkills({
    skills = [],
    abilities = {},
    proficientSkills = [],
    proficiencyBonus = 2,
}) {
    return skills.map(
        (skill) => {
            const abilityScore =
                abilities[
                    skill.ability
                ] ?? 10;

            const proficient =
                proficientSkills.includes(
                    skill.id
                );

            return {
                ...skill,

                proficient,

                bonus:
                    getSkillBonus({
                        abilityScore,
                        proficient,
                        proficiencyBonus,
                    }),
            };
        }
    );
}

/*
|--------------------------------------------------------------------------
| Testes de resistência
|--------------------------------------------------------------------------
*/

export function calculateSavingThrows({
    abilities = [],
    abilityScores = {},
    savingThrowAbilities = [],
    proficiencyBonus = 2,
}) {
    return abilities.map(
        (ability) => {
            const proficient =
                savingThrowAbilities.includes(
                    ability.id
                );

            return {
                ...ability,

                proficient,

                bonus:
                    getSavingThrowBonus({
                        abilityScore:
                            abilityScores[
                                ability.id
                            ] ?? 10,

                        proficient,

                        proficiencyBonus,
                    }),
            };
        }
    );
}

/*
|--------------------------------------------------------------------------
| Combate básico
|--------------------------------------------------------------------------
*/

export function calculateCombatStats({
    dexterityModifier = 0,
    constitutionModifier = 0,
    wisdomModifier = 0,
    className = "",
}) {
    let armorClass =
        getBaseArmorClass(
            dexterityModifier
        );

    /*
    | Monge
    */

    if (
        className === "Monge"
    ) {
        armorClass =
            10 +
            dexterityModifier +
            wisdomModifier;
    }

    /*
    | Bárbaro
    */

    if (
        className === "Bárbaro"
    ) {
        armorClass =
            10 +
            dexterityModifier +
            constitutionModifier;
    }

    return {
        armorClass,

        initiative:
            getInitiative(
                dexterityModifier
            ),
    };
}

/*
|--------------------------------------------------------------------------
| Magia
|--------------------------------------------------------------------------
*/

export function calculateSpellStats(
    character,
    modifiers,
    proficiencyBonus
) {
    const spellAbility =
        getSpellcastingAbility(
            character
        );

    if (!spellAbility) {
        return {
            spellAbility: null,
            spellSaveDC: null,
            spellAttack: null,
        };
    }

    const spellAbilityModifier =
        modifiers[
            spellAbility
        ] ?? 0;

    return {
        spellAbility,

        spellSaveDC:
            getSpellSaveDC({
                spellAbilityModifier,
                proficiencyBonus,
            }),

        spellAttack:
            getSpellAttackBonus({
                spellAbilityModifier,
                proficiencyBonus,
            }),
    };
}

/*
|--------------------------------------------------------------------------
| Resumo calculado
|--------------------------------------------------------------------------
|
| Essa função será usada futuramente tanto na criação quanto na edição
| da ficha.
|--------------------------------------------------------------------------
*/

export function calculateCharacterDerivedData(
    character,
    {
        abilities = {},
        skills = [],
        savingThrows = [],
        proficientSkills = [],
        savingThrowAbilities = [],
        hitDie = 6,
    } = {}
) {
    const level =
        getCharacterLevel(
            character?.level
        );

    const modifiers =
        calculateAbilityModifiers(
            abilities
        );

    const proficiencyBonus =
        getProficiencyBonus(
            level
        );

    const calculatedSkills =
        calculateSkills({
            skills,
            abilities,
            proficientSkills,
            proficiencyBonus,
        });

    const calculatedSavingThrows =
        calculateSavingThrows({
            abilities: savingThrows,
            abilityScores: abilities,
            savingThrowAbilities,
            proficiencyBonus,
        });

    const combat =
        calculateCombatStats({
            dexterityModifier:
                modifiers.destreza || 0,

            constitutionModifier:
                modifiers.constituicao || 0,

            wisdomModifier:
                modifiers.sabedoria || 0,

            className:
                character?.class || "",
        });

    const spellStats =
        calculateSpellStats(
            character,
            modifiers,
            proficiencyBonus
        );

    return {
        level,

        proficiencyBonus,

        modifiers,

        skills:
            calculatedSkills,

        saves:
            calculatedSavingThrows,

        ...combat,

        ...spellStats,

        hitDie,
    };
}
