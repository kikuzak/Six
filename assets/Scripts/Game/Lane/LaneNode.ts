import Events from "../../Common/Events";
import { AUDIO_TYPE, USER } from "../../Common/SystemConst";
import { OrbType } from "../Orb/Deck";
import MonsterPlaceNode from "../Place/MonsterPlaceNode";
import orbPlaceNode from "../Place/OrbPlaceNode";
import { LANE_STATE } from "./LaneState";
import { LANE_TYPE } from "./LaneType";
import { VICTORY_CONDITION } from "./VictoryCondition";

const {ccclass, property} = cc._decorator;

/** スキルを適用する */
@ccclass
export default class LaneNode extends cc.Component {

    static readonly COLOR_NORMAL: cc.Color = cc.color().fromHEX("#FFFFFF");
    static readonly COLOR_SELECTED: cc.Color = cc.color().fromHEX("#FFAD00");

    @property(MonsterPlaceNode) opponentSupportPlace: MonsterPlaceNode = null;
    @property(MonsterPlaceNode) opponentAttackPlace: MonsterPlaceNode = null;
    @property(orbPlaceNode) orbPlace: orbPlaceNode = null;
    @property(MonsterPlaceNode) playerAttackPlace: MonsterPlaceNode = null;
    @property(MonsterPlaceNode) playerSupportPlace: MonsterPlaceNode = null;
    @property({type: cc.Enum(LANE_TYPE)}) type: LANE_TYPE = LANE_TYPE.Empty;
    @property(cc.Node) iconIgnore: cc.Node = null;
    @property(cc.Node) iconBigger: cc.Node = null;

    private _state: LANE_STATE = LANE_STATE.Inactive;
    private _victoryCondition: VICTORY_CONDITION = VICTORY_CONDITION.Smaller;
    private _ignoreOrbNumber: boolean = false;

    get victoryCondition(): VICTORY_CONDITION {
        return this._victoryCondition;
    }

    public initialize(): void {
        this._victoryCondition = VICTORY_CONDITION.Smaller;
        this._ignoreOrbNumber = false;
        this.iconIgnore.active = false;
        this.iconBigger.active = false;
    }

    public changeCondition(condition: VICTORY_CONDITION): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_Centaur);
        this._victoryCondition = condition;
        if (condition === VICTORY_CONDITION.Bigger) this.iconBigger.active = true;
        else this.iconBigger.active = false;
    }

    public ignoreNumber(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_Ghost);
        this._ignoreOrbNumber = true;
        this.iconIgnore.active = true;
    }

    public numberIsIgnored(): boolean {
        return this._ignoreOrbNumber;
    }

    public select(): void {
        this._state = LANE_STATE.Active;
        this.node.color = LaneNode.COLOR_SELECTED;
    }

    public deselect(): void {
        this._state = LANE_STATE.Inactive;
        this.node.color = LaneNode.COLOR_NORMAL;
    }

    public getTotalNumber(user: USER): number {
        let totalNumber: number = 0;
        if (user === USER.Player) {
            if (!this.playerAttackPlace.isEmpty()) totalNumber += this.playerAttackPlace.layoutNumber.value;
            if (!this.playerSupportPlace.isEmpty()) totalNumber += this.playerSupportPlace.layoutNumber.value;
            return totalNumber;
        } else if (user === USER.Opponent) {
            if (!this.opponentAttackPlace.isEmpty()) totalNumber += this.opponentAttackPlace.layoutNumber.value;
            if (!this.opponentSupportPlace.isEmpty()) totalNumber += this.opponentSupportPlace.layoutNumber.value;
            return totalNumber;
        }
    }

    public orbIsEmpty(): boolean {
        return this.orbPlace.isEmpty();
    }

    public getOrbData(): OrbType {
        return this.orbPlace.createJSON();
    }

    // ---------- Custom Events ----------
    protected onLoad(): void {
        Events.target.on(Events.List.StartRound, (): void => {
            this.initialize();
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}