export const GAME_MODE = {
    Empty: 0,
    Cpu: 1,
    Friend: 2
} as const;

export type GAME_MODE = typeof GAME_MODE[keyof typeof GAME_MODE];