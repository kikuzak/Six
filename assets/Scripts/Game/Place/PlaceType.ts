export const PLACE_TYPE = {
    Empty: 0,
    PlayerAttack: 1,
    PlayerSupport: 2,
    OpponentAttack: 3,
    OpponentSupport: 4,
} as const;

export type PLACE_TYPE = typeof PLACE_TYPE[keyof typeof PLACE_TYPE];