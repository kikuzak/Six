export const USER = {
    Empty: 0,
    Player: 1,
    Opponent: 2
} as const;
export type USER = typeof USER[keyof typeof USER];

export const USER_ROLE = {
    Empty: 0,
    Host: 1,
    Guest: 2
} as const;
export type USER_ROLE = typeof USER_ROLE[keyof typeof USER_ROLE];

export const CHAT_CATEGORY = {
    GameStart: 0,
    Profile: 1,
    Deck: 2,
    PlayCard: 3,
    Fairy: 4,
    Medusa: 5,
    Priority: 6,
    ReDeck: 7,
    Resing: 8
} as const;
export type CHAT_CATEGORY = typeof CHAT_CATEGORY[keyof typeof CHAT_CATEGORY];

export const ERROR_TIMING = {
    BeforeInitialization: 0,
    Title: 1,
    Game: 2
} as const;
export type ERROR_TIMING = typeof ERROR_TIMING[keyof typeof ERROR_TIMING];

export const VERTICAL_ALIGN_MODE = {
    Empty: 0,
    Top: 1,
    center: 2,
    bottom: 3
} as const;
export type VERTICAL_ALIGN_MODE = typeof VERTICAL_ALIGN_MODE[keyof typeof VERTICAL_ALIGN_MODE];

export const HORIZONTAL_ALIGN_MODE = {
    Empty: 0,
    Left: 1,
    Center: 2,
    Right: 3
} as const;
export type HORIZONTAL_ALIGN_MODE = typeof HORIZONTAL_ALIGN_MODE[keyof typeof HORIZONTAL_ALIGN_MODE];

export const AUDIO_TYPE = {
    Empty: 0,
    BGM_Title: 1,
    BGM_Game: 2,
    SE_SystemEnter: 3,
    SE_SystemCancel: 4,
    SE_SystemSelect: 5,
    SE_CardTurn: 6,
    SE_CardPlay: 7,
    SE_CardSelect: 8,
    SE_TapToStart: 9,
    SE_Skill: 10,
    SE_Fairy: 11,
    SE_Medusa: 12,
    SE_Centaur: 13,
    SE_Ghost: 14,
    SE_PlayerPoint: 15,
    SE_OpponentPoint: 16,
    SE_Win: 17,
    SE_Lose: 18,
    Stop: 19
} as const;
export type AUDIO_TYPE = typeof AUDIO_TYPE[keyof typeof AUDIO_TYPE];