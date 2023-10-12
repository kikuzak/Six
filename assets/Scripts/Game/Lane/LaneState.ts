export const LANE_STATE = {
    Empty: 0,
    Active: 1,
    Inactive: 2
} as const;

export type LANE_STATE = typeof LANE_STATE[keyof typeof LANE_STATE];