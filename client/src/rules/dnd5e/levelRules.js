/*
|--------------------------------------------------------------------------
| ORDO RPGISTAS
| D&D 5e — Progressão de nível
|--------------------------------------------------------------------------
*/

import {
    getProficiencyBonus,
} from "./calculations";

/*
|--------------------------------------------------------------------------
| Nível oficial
|--------------------------------------------------------------------------
*/

export const OFFICIAL_MAX_LEVEL = 20;

/*
|--------------------------------------------------------------------------
| Limite do modo épico do Ordo
|--------------------------------------------------------------------------
|
| Por enquanto deixamos uma margem grande para que o sistema possa
| futuramente trabalhar com níveis personalizados.
|
| Isso NÃO significa que esses níveis sejam progressão oficial de D&D.
|
*/

export const EPIC_MAX_LEVEL = 100;

export function clampOfficialLevel(level) {
    return Math.min(
        OFFICIAL_MAX_LEVEL,
        Math.max(
            1,
            Number(level) || 1
        )
    );
}

export function clampEpicLevel(level) {
    return Math.min(
        EPIC_MAX_LEVEL,
        Math.max(
            1,
            Number(level) || 1
        )
    );
}

export function getCharacterLevel(level) {
    return Math.max(
        1,
        Number(level) || 1
    );
}

export function getLevelProficiencyBonus(
    level
) {
    return getProficiencyBonus(level);
}

export function canLevelUp(
    level,
    maximumLevel = OFFICIAL_MAX_LEVEL
) {
    return (
        Number(level) <
        Number(maximumLevel)
    );
}

export function getNextLevel(level) {
    return Math.min(
        Number(level || 1) + 1,
        EPIC_MAX_LEVEL
    );
}

export function getPreviousLevel(level) {
    return Math.max(
        Number(level || 1) - 1,
        1
    );
}

/*
|--------------------------------------------------------------------------
| Progressão de nível
|--------------------------------------------------------------------------
|
| A estrutura abaixo será ampliada com:
|
| - Dados de vida
| - Características de classe
| - Espaços de magia
| - Truques
| - Poderes
| - Recursos
| - Subclasses
| - Melhorias de atributo
| - Talentos
| - Progressão épica
|
*/

export function getLevelData(level) {
    const currentLevel =
        getCharacterLevel(level);

    return {
        level: currentLevel,

        proficiencyBonus:
            getProficiencyBonus(
                currentLevel
            ),

        official:
            currentLevel <=
            OFFICIAL_MAX_LEVEL,

        epic:
            currentLevel >
            OFFICIAL_MAX_LEVEL,
    };
}
