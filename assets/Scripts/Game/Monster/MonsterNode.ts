import Events from "../../Common/Events";
import { AUDIO_TYPE } from "../../Common/SystemConst";
import { MONSTER_KEY } from "./MonsterKey";
import MonsterNumber from "./MonsterNumber";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MonsterNode extends cc.Component {

    @property(cc.Sprite) faceSprite: cc.Sprite = null;
    @property(cc.Sprite) graySprite: cc.Sprite = null;
    @property(cc.SpriteFrame) faceSpriteFrames: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame) graySpriteFrames: cc.SpriteFrame[] = [];
    @property(cc.Label) text: cc.Label = null;
    @property(cc.JsonAsset) monsterJson: cc.JsonAsset = null;

    private readonly _key: MONSTER_KEY = null;
    private readonly _number: MonsterNumber = null;

    public setup(monsterKey: MONSTER_KEY): void {
        this.faceSprite.spriteFrame = this.faceSpriteFrames[monsterKey - 1];
        this.graySprite.spriteFrame = this.graySpriteFrames[monsterKey - 1];
        this.text.string = this.monsterJson.json.find((v) => v.key === monsterKey).skillText;
    }

    public show(): void {
        this.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
    }

    public showText(): void {
        this.text.node.active = true;
    }

    public hideText(): void {
        this.text.node.active = false;
    }

    public remove(): void {
        this.node.parent.removeChild(this.node);
    }

    /** メドューサの効果で破壊する */
    public async petrify(): Promise<void> {
        return new Promise((resolve) => {
            cc.tween(this.graySprite.node)
            .delay(.6)
            .call((): void => {Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_Medusa);})
            .to(.6, {opacity: 255})
            .delay(1)
            .call((): void => {
                resolve();
                this.graySprite.node.opacity = 0;
            })
            .start();
        });
    }
}
