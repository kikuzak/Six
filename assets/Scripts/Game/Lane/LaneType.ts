export const LANE_TYPE = {
    Empty: 0,
    Left: 1,
    Center: 2,
    Right: 3
} as const;

export type LANE_TYPE = typeof LANE_TYPE[keyof typeof LANE_TYPE];