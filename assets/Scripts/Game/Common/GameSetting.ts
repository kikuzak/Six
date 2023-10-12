import { GAME_MODE } from "./GameConst";

export default class GameSetting {
    static gameMode: GAME_MODE = GAME_MODE.Empty;
    static returnFlg: boolean = false;
    static bgmVolume: number = 0.5;
    static seVolume: number = 0.5;
}