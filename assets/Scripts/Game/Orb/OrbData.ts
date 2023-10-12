import { MONSTER_KEY } from "../Monster/MonsterKey";
import OrbColor from "./OrbColor";
import OrbColorCode from "./OrbColorCode";
import { ORB_COLOR_KEY } from "./OrbColorKey";
import OrbNumber from "./OrbNumber";

export default class OrbData {

    static readonly EMPTY: OrbData = new OrbData(null, null);
    static getCodeFromMonsterKey(monsterKey: MONSTER_KEY): string {
        switch (monsterKey) {
            case MONSTER_KEY.Empty: return null;
            case MONSTER_KEY.Fairy: return new OrbColorCode(ORB_COLOR_KEY.Green).value;;
            case MONSTER_KEY.Ghost: return new OrbColorCode(ORB_COLOR_KEY.White).value;
            case MONSTER_KEY.Medusa: return new OrbColorCode(ORB_COLOR_KEY.Purple).value;
            case MONSTER_KEY.Centaur: return new OrbColorCode(ORB_COLOR_KEY.Red).value;
            case MONSTER_KEY.Golem: return new OrbColorCode(ORB_COLOR_KEY.Blue).value;
            case MONSTER_KEY.Dragon: return new OrbColorCode(ORB_COLOR_KEY.Yellow).value;
            default: console.error("IDの値が不正です");break;
        }
    }

    private _number: OrbNumber = null;
    private _color: OrbColor = null;

    get number(): OrbNumber {
        return this._number;
    }

    get color(): OrbColor {
        return this._color;
    }

    constructor(number: number, colorKey: ORB_COLOR_KEY) {
        if (number === null) return;

        if (number % 2 === 1) {
            switch (colorKey) {
                case ORB_COLOR_KEY.Purple:
                    console.error("OrbData初期化エラー:紫は偶数が入ります");
                    return;
                case ORB_COLOR_KEY.White:
                    console.error("OrbData初期化エラー:白は偶数が入ります");
                    return;
                case ORB_COLOR_KEY.Yellow:
                    console.error("OrbData初期化エラー:黄は偶数が入ります");
                    return;
            }
        } else if (number % 2 === 0) {
            switch (colorKey) {
                case ORB_COLOR_KEY.Red:
                    console.error("OrbData初期化エラー:赤は奇数が入ります");
                    return;
                case ORB_COLOR_KEY.Blue:
                    console.error("OrbData初期化エラー:青は奇数が入ります");
                    return;
                case ORB_COLOR_KEY.Green:
                    console.error("OrbData初期化エラー:緑は奇数が入ります");
                    return;
            }
        } else {
            throw new Error("OrbData初期化エラー:不正な値");
        }

        this._number = new OrbNumber(number);
        this._color = new OrbColor(colorKey);
    }
}