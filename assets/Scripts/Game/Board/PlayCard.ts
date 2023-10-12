import { LANE_TYPE } from "../Lane/LaneType";
import { MONSTER_KEY } from "../Monster/MonsterKey"
import { PLACE_TYPE } from "../Place/PlaceType";

export default class PlayCard {

    private _key: MONSTER_KEY;
    private _laneType: LANE_TYPE;
    private _placeType: PLACE_TYPE;

    constructor(key: MONSTER_KEY, laneType: LANE_TYPE, placeType: PLACE_TYPE) {
        this._key = key;
        this._laneType = laneType;
        this._placeType = placeType;
    }

    get key(): MONSTER_KEY {
        return this._key;
    }

    get laneType(): LANE_TYPE {
        return this._laneType;
    }

    get placeType(): PLACE_TYPE {
        return this._placeType;
    }

    public isAttackZone(): boolean {
        if (this.placeType === PLACE_TYPE.PlayerAttack|| this.placeType === PLACE_TYPE.OpponentAttack) return true;
        else return false;
    }

    public createJSON(): PlayCardType {
        return {
            key: this._key as number,
            laneType: this._laneType as number,
            placeType: this._placeType as number
        }
    }

    public parseJSON(playCardData: PlayCardType): void {
        this._key = playCardData.key as MONSTER_KEY;
        this._laneType = playCardData.laneType as LANE_TYPE;
        this._placeType = (playCardData.placeType + 2) as PLACE_TYPE;
    }
}

export type PlayCardType = {
    key: number;
    laneType: number;
    placeType: number;
}