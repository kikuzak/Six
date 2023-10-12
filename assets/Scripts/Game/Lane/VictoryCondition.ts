export const VICTORY_CONDITION = {
    Bigger: 0,
    Smaller: 1
} as const;

export type VICTORY_CONDITION = typeof VICTORY_CONDITION[keyof typeof VICTORY_CONDITION];