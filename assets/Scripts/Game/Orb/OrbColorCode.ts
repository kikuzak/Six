import { ORB_COLOR_KEY } from "./OrbColorKey";

export default class OrbColorCode {

    static readonly EMPTY: OrbColorCode = new OrbColorCode(ORB_COLOR_KEY.Empty);

    private readonly _value: string;

    get value(): string {
        return this._value;
    }

    constructor(key: ORB_COLOR_KEY) {
        switch (key) {
            case ORB_COLOR_KEY.Red:
                this._value = "FF0000";
                break;
            case ORB_COLOR_KEY.Blue:
                this._value = "2A55FF";
                break;
            case ORB_COLOR_KEY.Green:
                this._value = "0BCC03";
                break;
            case ORB_COLOR_KEY.Purple:
                this._value = "D429FF";
                break;
            case ORB_COLOR_KEY.White:
                this._value = "cccccc";
                break;
            case ORB_COLOR_KEY.Yellow:
                this._value = "E5BE1A";
                break;
            case ORB_COLOR_KEY.Empty:
                this._value = null;
                break;
            default:
                cc.error("OrbColorValue初期化エラー:keyが不正");
                break;
        }
    }
}