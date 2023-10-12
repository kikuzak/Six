import Events from "../../Common/Events";
import { AUDIO_TYPE } from "../../Common/SystemConst";
import { MONSTER_KEY } from "../Monster/MonsterKey";
import { HAND_STATE } from "./HandState";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HandNode extends cc.Component {

    static readonly INTERVAL: number = 200;
    static readonly INITIAL_POS_Y: number = -120;
    static readonly SELECTED_POS_Y: number = 20;
    static readonly REMOVE_POS_Y: number = 100;

    @property(cc.Sprite) frontSprite: cc.Sprite = null;
    @property(cc.SpriteFrame) frontSpriteFrames: cc.SpriteFrame[] = [];
    @property(cc.Node) shadowNode: cc.Node = null;

    private _key: MONSTER_KEY;
    private _state: HAND_STATE = HAND_STATE.Fixed;
    private _position: cc.Vec3;

    get key(): MONSTER_KEY {
        return this._key;
    }

    public setup(key: MONSTER_KEY, indexFromLeft: number, handsCount: number): void {
        this._key = key;
        this.frontSprite.spriteFrame = this.frontSpriteFrames[key - 1];
        this.node.setPosition(this._calcX(indexFromLeft, handsCount), HandNode.INITIAL_POS_Y);
        this.locate(indexFromLeft, handsCount);
        this.node.zIndex = indexFromLeft;
    }

    /** 選択した */
    public select(): void {
        this._state = HAND_STATE.Selected;
        this.shadowNode.active = true;
        cc.tween(this.node)
        .to(.1, {position: cc.v3(this.node.x, HandNode.SELECTED_POS_Y)})
        .start();
    }

    /** 選択が外れた */
    public deselect(): void {
        this._state = HAND_STATE.Unselected;
        this.shadowNode.active = false;
        cc.tween(this.node)
        .to(.1, {position: cc.v3(this.node.x, 0)})
        .start();
    }

    /** 選択可能にする */
    public enable(): void {
        this._state = HAND_STATE.Unselected;
    }

    /** 選択不可能にする */
    public disable(): void {
        this._state = HAND_STATE.Fixed;
    }

    /**
     * 移動先の位置を指定する
     * @param indexFromLeft - 左からの手札の位置
     * @param handsCount - 手札全体の枚数
     */
    public locate(indexFromLeft: number, handsCount: number): void {
        let x: number = this._calcX(indexFromLeft, handsCount);
        this._position = new cc.Vec3(x, 0);
    }

    /** x座標を計算する */
    private _calcX(indexFromLeft: number, handsCount): number {
        let x: number = -HandNode.INTERVAL / 2 * (handsCount - 1) + HandNode.INTERVAL * indexFromLeft;
        return x;
    }

    /** positionへ出す */
    public add(): void {
        this.node.setPosition(this.node.x, HandNode.INITIAL_POS_Y);
        cc.tween(this.node)
        .to(.1, {position: this._position})
        .start();
    }

    /** 手札から削除 */
    public remove(): void {
        cc.tween(this.node)
        .to(.1, {position: cc.v3(this.node.x, HandNode.REMOVE_POS_Y), opacity: 0})
        .call(() => {this.node.parent.removeChild(this.node)})
        .start();
    }

    /** positoinへ動かす */
    public move(): void {
        cc.tween(this.node)
        .to(.1, {position: this._position})
        .start();
    }

    protected onLoad(): void {
        // ---------- Touch Events ----------
        this.node.on(cc.Node.EventType.TOUCH_START, (): void => {
            if (this._state === HAND_STATE.Fixed) return;

            if (this._state === HAND_STATE.Selected) {
                Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_CardSelect);
                this.deselect();
                Events.target.emit(Events.List.DeselectHand);
            } else {
                Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_CardSelect);
                this.select();
                Events.target.emit(Events.List.SelectHand, this._key);
            }
        });

        // ---------- Custom Events ----------
        // ターンスタート
        Events.target.on(Events.List.StartTurn, (): void => {
            this.enable();
        }, this.node);
        // 手札が選択された
        Events.target.on(Events.List.SelectHand, (key: MONSTER_KEY): void => {
            if (this._key !== key) this.deselect();
        }, this.node);
        // 場が選択された
        Events.target.on(Events.List.SelectPlace, (): void => {
            this.disable();
        }, this.node);
        // 場が選択解除された
        Events.target.on(Events.List.DeselectPlace, (): void => {
            this.deselect();
            this.enable();
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}