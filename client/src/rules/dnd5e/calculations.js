/*
|--------------------------------------------------------------------------
| ORDO RPGISTAS
| D&D 5e — Cálculos
|--------------------------------------------------------------------------
*/

export function getAbilityModifier(score) {
    const value = Number(score) || 0;

    return Math.floor(
        (value - 10) / 2
    );
}

export function formatModifier(value) {
    const modifier = Number(value) || 0;

    return modifier >= 0
        ? `+${modifier}`
        : `${modifier}`;
}

export function getProficiencyBonus(level) {
    const characterLevel = Math.max(
        1,
        Number(level) || 1
    );

    if (characterLevel >= 17) return 6;
    if (characterLevel >= 13) return 5;
    if (characterLevel >= 9) return 4;
    if (characterLevel >= 5) return 3;

    return 2;
}

export function getSkillBonus({
    abilityScore,
    proficient = false,
    proficiencyBonus = 2,
}) {
    const modifier =
        getAbilityModifier(abilityScore);

    return (
        modifier +
        (proficient
            ? proficiencyBonus
            : 0)
    );
}

export function getSavingThrowBonus({
    abilityScore,
    proficient = false,
    proficiencyBonus = 2,
}) {
    return getSkillBonus({
        abilityScore,
        proficient,
        proficiencyBonus,
    });
}

export function getPassiveScore(
    abilityModifier,
    proficient = false,
    proficiencyBonus = 2
) {
    return (
        10 +
        Number(abilityModifier || 0) +
        (proficient
            ? proficiencyBonus
            : 0)
    );
}

export function getSpellSaveDC({
    spellAbilityModifier,
    proficiencyBonus,
}) {
    if (
        spellAbilityModifier === null ||
        spellAbilityModifier === undefined
    ) {
        return null;
    }

    return (
        8 +
        Number(proficiencyBonus || 0) +
        Number(spellAbilityModifier || 0)
    );
}

export function getSpellAttackBonus({
    spellAbilityModifier,
    proficiencyBonus,
}) {
    if (
        spellAbilityModifier === null ||
        spellAbilityModifier === undefined
    ) {
        return null;
    }

    return (
        Number(proficiencyBonus || 0) +
        Number(spellAbilityModifier || 0)
    );
}

/*
|--------------------------------------------------------------------------
| Pontos de vida
|--------------------------------------------------------------------------
|
| Esta função já prepara a arquitetura para o cálculo correto por nível.
| O tratamento completo de níveis, classe e Constituição será colocado
| junto com levelRules.js.
|
*/

export function getLevelOneHitPoints({
    hitDie,
    constitutionModifier,
}) {
    return (
        Number(hitDie || 0) +
        Number(constitutionModifier || 0)
    );
}

export function getInitiative(
    dexterityModifier
) {
    return Number(
        dexterityModifier || 0
    );
}

export function getBaseArmorClass(
    dexterityModifier
) {
    return (
        10 +
        Number(dexterityModifier || 0)
    );
}
