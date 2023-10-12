export const HAND_STATE = {
    /** タッチできない */
    Fixed: 0,
    /** 未選択 */
    Unselected: 1,
    /** 手札のみ選択状態 */
    Selected: 2,
    /** 手札が選択された状態で、プレイスも選択された */
    Confirmed: 3
} as const;
export type HAND_STATE = typeof HAND_STATE[keyof typeof HAND_STATE];