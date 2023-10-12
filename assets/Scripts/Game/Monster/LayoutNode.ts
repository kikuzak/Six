import Events from "../../Common/Events";
import { AUDIO_TYPE, USER } from "../../Common/SystemConst";
import { MONSTER_KEY } from "./MonsterKey";
import MonsterNumber from "./MonsterNumber";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LayoutNode extends cc.Component {

    static readonly PLAY_DIST: number = 20;

    @property(cc.Node) frontNode: cc.Node = null;
    @property(cc.Node) backNode: cc.Node = null;
    @property(cc.Sprite) frontSprite: cc.Sprite = null;
    @property(cc.SpriteFrame) frontSpriteFrames: cc.SpriteFrame[] = [];
    @property(cc.JsonAsset) monsterJson: cc.JsonAsset = null;

    private _key: MONSTER_KEY;
    private _number: MonsterNumber;
    private _owner: USER = USER.Empty;
    private _isFaceUp: boolean;

    get isFaceUp(): boolean {
        return this._isFaceUp;
    }

    get key(): MONSTER_KEY {
        return this._key;
    }

    get number(): MonsterNumber {
        return this._number;
    }

    public setup(monsterKey: MONSTER_KEY): void {
        this._key = monsterKey;
        this._number = new MonsterNumber(this.monsterJson.json.find((v) => v.key === this._key).number);
        this.frontSprite.spriteFrame = this.frontSpriteFrames[monsterKey - 1];
    }

    public setUser(user: USER): void {
        this._owner = user;
    }

    public faceUp(): void {
        this.frontNode.active = true;
        this.backNode.active = false;
        this._isFaceUp = true;
    }

    public faceDown(): void {
        this.frontNode.active = false;
        this.backNode.active = true;
        this._isFaceUp = false;
    }

    public async turn(): Promise<void> {
        return new Promise((resolve): void => {
            Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_CardTurn);
            cc.tween(this.node)
            .to(.1, {scaleX: 0})
            .call((): void => {
                if (this._isFaceUp) {
                    this._isFaceUp = false;
                    this.faceDown();
                } else {
                    this._isFaceUp = true;
                    this.faceUp();
                }
            })
            .to(.1, {scaleX: 1})
            .delay(1)
            .call((): void=> {resolve()})
            .start();
        });
    }

    public async open(): Promise<void> {
        return new Promise((resolve): void => {
            if (this._isFaceUp) {
                resolve();
            } else {
                cc.tween(this.node)
                .to(.1, {scaleX: 0})
                .call((): void => { this.faceUp(); })
                .to(.1, {scaleX: 1})
                .delay(1)
                .call((): void=> {resolve()})
                .start();
            }
        });
    }

    public async put(): Promise<void> {
        return new Promise((resolve): void => {
            if (this._owner === USER.Player) this.node.setPosition(0, LayoutNode.PLAY_DIST);
            else this.node.setPosition(0, - LayoutNode.PLAY_DIST);
            // 手で置いているズレを表現する
            let randomX: number = Math.random() * 6 - 5;
            let randomAngle: number = Math.random() * 6 - 5;
            this.node.angle = randomAngle;
            cc.tween(this.node)
            .to(.2, {position: cc.v3(randomX, 0, 0), opacity: 255})
            .delay(1)
            .call((): void => {resolve()})
            .start();
        });
    }

    public async remove(): Promise<void> {
        return new Promise((resolve): void => {
            cc.tween(this.node)
            .by(.2, {opacity: 0})
            .call((): void => {
                this.node.parent.removeChild(this.node)
                resolve();
            })
            .start();
        });
    }

    public onPressLayout(): void {
        if (this._owner === USER.Player) Events.target.emit(Events.List.SelectLayout, this._key);
    }
}