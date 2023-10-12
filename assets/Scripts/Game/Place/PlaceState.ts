export const PLACE_STATE = {
    Fixed: 0,
    Unselected: 1,
    Selected: 2
} as const;

export type PLACE_STATE = typeof PLACE_STATE[keyof typeof PLACE_STATE];