export const ORB_COLOR_KEY = {
    Empty: 0,
    Red: 1,
    Blue: 2,
    Green: 3,
    Purple: 4,
    White: 5,
    Yellow: 6,
} as const;
export type ORB_COLOR_KEY = typeof ORB_COLOR_KEY[keyof typeof ORB_COLOR_KEY];