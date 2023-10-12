import { ORB_COLOR_KEY } from "./OrbColorKey";
import OrbColorValue from "./OrbColorCode";

export default class OrbColor {
    static readonly EMPTY: OrbColor = new OrbColor(ORB_COLOR_KEY.Empty);

    private readonly _key: ORB_COLOR_KEY;
    private readonly _code: OrbColorValue;

    get key(): ORB_COLOR_KEY {
        return this._key;
    }

    get code(): string {
        return this._code.value;
    }

    constructor(key: ORB_COLOR_KEY) {
        this._key = key;
        switch (key) {
            case ORB_COLOR_KEY.Red:
                this._code = new OrbColorValue(key);
                break;
            case ORB_COLOR_KEY.Blue:
                this._code = new OrbColorValue(key);
                break;
            case ORB_COLOR_KEY.Green:
                this._code = new OrbColorValue(key);
                break;
            case ORB_COLOR_KEY.Purple:
                this._code = new OrbColorValue(key);
                break;
            case ORB_COLOR_KEY.White:
                this._code = new OrbColorValue(key);
                break;
            case ORB_COLOR_KEY.Yellow:
                this._code = new OrbColorValue(key);
                break;
            case ORB_COLOR_KEY.Empty:
                this._code = null;
                break;
        }
    }
}