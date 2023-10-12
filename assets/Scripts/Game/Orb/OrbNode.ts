import Events from "../../Common/Events";
import { AUDIO_TYPE } from "../../Common/SystemConst";
import OrbColor from "./OrbColor";
import { ORB_COLOR_KEY } from "./OrbColorKey";
import OrbData from "./OrbData";
import OrbNumber from "./OrbNumber";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OrbNode extends cc.Component {

    static readonly PLAY_DIST: number = 20;

    @property(cc.Node) frontNode: cc.Node = null;
    @property(cc.Node) backNode: cc.Node = null;
    @property(cc.Node) shadowNode: cc.Node = null;
    @property(cc.Node) numberNode: cc.Node = null;
    @property(cc.Sprite) frontSprite: cc.Sprite = null;
    @property(cc.Sprite) numberSprite: cc.Sprite = null;
    @property(cc.SpriteFrame) redSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) blueSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) greenSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) purpleSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) whiteSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) yellowSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) numberSpriteFrames: cc.SpriteFrame[] = [];

    private _number: OrbNumber;
    private _color: OrbColor;

    private _isFaceUp: boolean;

    get color(): OrbColor {
        return this._color;
    }

    get number(): OrbNumber {
        return this._number;
    }

    public setup(orbData: OrbData): void {
        this._number = orbData.number;
        this._color = orbData.color;
        this._isFaceUp = false;
        this.faceDown();

        switch (this._color.key) {
            case ORB_COLOR_KEY.Red: this.frontSprite.spriteFrame = this.redSpriteFrame; break;
            case ORB_COLOR_KEY.Blue: this.frontSprite.spriteFrame = this.blueSpriteFrame; break;
            case ORB_COLOR_KEY.Green: this.frontSprite.spriteFrame = this.greenSpriteFrame; break;
            case ORB_COLOR_KEY.Purple: this.frontSprite.spriteFrame = this.purpleSpriteFrame; break;
            case ORB_COLOR_KEY.White: this.frontSprite.spriteFrame = this.whiteSpriteFrame; break;
            case ORB_COLOR_KEY.Yellow: this.frontSprite.spriteFrame = this.yellowSpriteFrame; break;
        }
        this.numberSprite.spriteFrame = this.numberSpriteFrames[orbData.number.value];
        this.shadowNode.color = cc.color().fromHEX(this._color.code);
    }

    public isEmpty(): boolean {
        if (this._number === OrbNumber.EMPTY) return true;
        else return false;
    }

    public showNumber(): void {
        this.numberNode.active = true;
    }

    public hideNumber(): void {
        this.numberNode.active = false;
    }

    public faceUp(): void {
        this.frontNode.active = true;
        this.backNode.active = false;
        this._isFaceUp = true;
        this.showNumber();
    }

    public faceDown(): void {
        this.frontNode.active = false;
        this.backNode.active = true;
        this._isFaceUp = false;
        this.hideNumber();
    }

    public async turn(): Promise<void> {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_CardTurn);
        return new Promise((resolve): void => {
            cc.tween(this.node)
            .to(.1, {scaleX: 0})
            .call((): void => {
                if (this._isFaceUp) this.faceDown();
                else this.faceUp();
            })
            .to(.1, {scaleX: 1})
            .delay(.2)
            .call((): void => {resolve()})
            .start();
        });
    }

    public async put(): Promise<void> {
        this.node.setPosition(0, OrbNode.PLAY_DIST);
        // 手で置いているズレを表現する
        let randomX: number = Math.random() * 6 - 5;
        let randomAngle: number = Math.random() * 6 - 5;
        this.node.angle = randomAngle;
        return new Promise((resolve): void => {
            cc.tween(this.node)
            .to(.2, {position: cc.v3(randomX, 0), opacity: 255})
            .call((): void => {resolve()})
            .start();
        });
    }

    public async remove(): Promise<void> {
        return new Promise((resolve): void => {
            cc.tween(this.node)
            .by(.2, {position: cc.v3(0, OrbNode.PLAY_DIST, 0), opacity: -255})
            .delay(.2)
            .call((): void => {
                this.node.parent.removeChild(this.node);
                resolve();
            })
            .start();
        });
    }

    public async putInScore(): Promise<void> {
        this.node.opacity = 0;
        this.node.scale = 0.7;
        this.faceUp();
        this.shadowNode.color = cc.color().fromHEX(this.color.code);
        this.shadowNode.active = true;
        this.node.setPosition(0, OrbNode.PLAY_DIST);
        this.numberNode.active = false;
        return new Promise((resolve): void => {
            cc.tween(this.node)
            .to(.2, {position: cc.v3(0, 0, 0), opacity: 255})
            .call((): void => { resolve(); })
            .start();
        });
    }

    public async putInTotalScore(): Promise<void> {
        this.node.opacity = 0;
        this.node.scale = 1.4;
        this.faceUp();
        this.shadowNode.color = cc.color().fromHEX(this.color.code);
        this.shadowNode.active = true;
        this.node.setPosition(0, OrbNode.PLAY_DIST);
        return new Promise((resolve): void => {
            cc.tween(this.node)
            .to(.2, {position: cc.v3(0, 0, 0), opacity: 255})
            .delay(.2)
            .to(.2, {opacity: 0})
            .call((): void => {
                this.node.parent.removeChild(this.node)
                resolve();
            })
            .start();
        });
    }
}
