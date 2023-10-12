import Events from "../../Common/Events";
import { AUDIO_TYPE, USER } from "../../Common/SystemConst";
import { LANE_TYPE } from "../Lane/LaneType";
import LayoutNode from "../Monster/LayoutNode";
import { MONSTER_KEY } from "../Monster/MonsterKey";
import MonsterNumber from "../Monster/MonsterNumber";
import FairyTarget from "../UI/FairyTarget";
import { PLACE_STATE } from "./PlaceState";
import { PLACE_TYPE } from "./PlaceType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MonsterPlaceNode extends cc.Component {
    static readonly DEFAULT_COLOR: cc.Color = cc.color().fromHEX("9D7849");
    static readonly ENABLED_COLOR: cc.Color = cc.color().fromHEX("FFA300");
    static readonly SELECTED_COLOR: cc.Color = cc.color().fromHEX("FF0000");

    @property(cc.Prefab) layoutPrefab: cc.Prefab = null;
    @property({type: cc.Enum(PLACE_TYPE)}) placeType: PLACE_TYPE = PLACE_TYPE.Empty;
    @property({type: cc.Enum(LANE_TYPE)}) laneType: LANE_TYPE = LANE_TYPE.Empty;
    @property(cc.Prefab) fairytargetPrefab: cc.Prefab = null;

    // private _layoutData: MonsterData = MonsterData.EMPTY;
    private _key: MONSTER_KEY;
    private _layoutNode: LayoutNode = null;
    private _state: PLACE_STATE = PLACE_STATE.Fixed;
    private _fairyTarget: FairyTarget = null;

    get layoutNumber(): MonsterNumber {
        return this._layoutNode.number;
    }

    get key(): MONSTER_KEY {
        return this._key;
    }

    get layoutNode(): LayoutNode {
        return this._layoutNode;
    }

    /** カードをセット可能にする */
    public enable(): void {
        this._state = PLACE_STATE.Unselected;
        this.node.color = MonsterPlaceNode.ENABLED_COLOR;
    }

    /** カードをセット不能にする */
    public disable(): void {
        this._state = PLACE_STATE.Fixed;
        this.node.color = MonsterPlaceNode.DEFAULT_COLOR;
    }

    /** プレイスを選択する */
    public select(): void {
        this._state = PLACE_STATE.Selected;
        this.node.color = MonsterPlaceNode.SELECTED_COLOR;
    }

    /** プレイスにカードを出す */
    public async put(key: MONSTER_KEY): Promise<void> {
        if (!this.isEmpty()) console.error("MonsterPlace.putエラー:placeが空ではない");
        // this._layoutData = new MonsterData(key);
        this._key = key;
        let layoutNode: cc.Node = cc.instantiate(this.layoutPrefab);
        this._layoutNode = layoutNode.getComponent(LayoutNode);
        this._layoutNode.setup(key);
        this._layoutNode.node.opacity = 0;
        if (this.placeType === PLACE_TYPE.PlayerAttack || this.placeType === PLACE_TYPE.PlayerSupport) this._layoutNode.setUser(USER.Player);
        else this._layoutNode.setUser(USER.Opponent);
        if (this.placeType === PLACE_TYPE.PlayerSupport || this.placeType === PLACE_TYPE.OpponentSupport) this._layoutNode.faceUp();
        else this._layoutNode.faceDown();
        this.node.addChild(layoutNode);
        await this._layoutNode.put();
    }

    /** プレイスからカードを取り除く */
    public async remove(): Promise<void> {
        // this._layoutData = MonsterData.EMPTY;
        this._key = MONSTER_KEY.Empty;
        await this._layoutNode.remove();
        this._layoutNode = null;
    }

    // /** プレイスのカードをひっくり返す */
    // public async turn(): Promise<void> {
    //     await this._layoutNode.turn();
    // }

    public async open(): Promise<void> {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_CardTurn);
        await this._layoutNode.open();
    }

    /** プレイスにカードが置かれていないか */
    public isEmpty(): boolean {
        if (this._layoutNode === null) return true;
        else return false;
    }

    public showFairyTarget(): void {
        let node: cc.Node = cc.instantiate(this.fairytargetPrefab);
        let fairyTarget: FairyTarget = node.getComponent(FairyTarget);
        this._fairyTarget = fairyTarget;
        this.node.addChild(node);
        fairyTarget.show();
    }

    public hideFairyTarget(): void {
        this._fairyTarget.remomve();
    }

    protected onLoad(): void {
        // ---------- Touch Events ----------
        this.node.on(cc.Node.EventType.TOUCH_START, (): void => {
            if (this._state !== PLACE_STATE.Unselected) return;
            Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_CardSelect);
            this.select();
            Events.target.emit(Events.List.SelectPlace, this.laneType, this.placeType);
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}