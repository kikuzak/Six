import { MONSTER_KEY } from "./MonsterKey";

export default class MonsterName {

    private _key: MONSTER_KEY;
    private _value: string;

    get value(): string {
        return this._value;
    }

    constructor(key: MONSTER_KEY) {
        switch(key) {
            case MONSTER_KEY.Fairy: this._value = "フェアリー"; break;
            case MONSTER_KEY.Ghost: this._value = "ゴースト"; break;
            case MONSTER_KEY.Medusa: this._value = "メドゥーサ"; break;
            case MONSTER_KEY.Centaur: this._value = "ケンタウロス"; break;
            case MONSTER_KEY.Golem: this._value = "ゴーレム"; break;
            case MONSTER_KEY.Dragon: this._value = "ドラゴン"; break;
        }
    }
}