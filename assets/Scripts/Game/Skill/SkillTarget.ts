import { USER } from "../../Common/SystemConst";
import { LANE_TYPE } from "../Lane/LaneType";
import { MONSTER_KEY } from "../Monster/MonsterKey";

/**
 * スキルの対象を表すクラス
 */
export default class SkillTarget {
    static readonly EMPTY: SkillTarget = new SkillTarget(MONSTER_KEY.Empty, LANE_TYPE.Empty, USER.Empty);

    /** スキルを発動するモンスター */
    private readonly _key: MONSTER_KEY;
    /** スキル対象のレーン */
    private readonly _laneType: LANE_TYPE;
    /** スキルを使用するユーザー */
    private readonly _user: USER;

    get key(): MONSTER_KEY {
        return this._key;
    }

    get laneType(): LANE_TYPE {
        return this._laneType;
    }

    /** スキルを使用するユーザー */
    get user(): USER {
        return this._user;
    }

    constructor(key: MONSTER_KEY, laneType: LANE_TYPE, user: USER) {
        this._key = key;
        this._laneType = laneType;
        this._user = user;
    }
}