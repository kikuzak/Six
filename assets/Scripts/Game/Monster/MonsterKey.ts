export const MONSTER_KEY = {
    Empty: 0,
    Fairy: 1,
    Ghost: 2,
    Medusa: 3,
    Centaur: 4,
    Golem: 5,
    Dragon: 6
} as const;

export type MONSTER_KEY = typeof MONSTER_KEY[keyof typeof MONSTER_KEY];