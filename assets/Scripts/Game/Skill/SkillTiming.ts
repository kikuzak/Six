export const SKILL_TIMING = {
    Empty: 0,
    Cip: 1,
    Judge: 2
} as const;

export type SKILL_TIMING = typeof SKILL_TIMING[keyof typeof SKILL_TIMING];