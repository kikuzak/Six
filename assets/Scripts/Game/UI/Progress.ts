import Events from "../../Common/Events";
import { AUDIO_TYPE } from "../../Common/SystemConst";

export const PROGRESS_STATE = {
    Empty: 0,
    Turn1: 1,
    Turn2: 2,
    Turn3: 3,
    Deal: 4,
    Battle: 5
} as const;

export type PROGRESS_STATE = typeof PROGRESS_STATE[keyof typeof PROGRESS_STATE];

const {ccclass, property} = cc._decorator;
@ccclass
export default class Progress extends cc.Component {

    @property(cc.Sprite) faceSprite: cc.Sprite = null;
    @property(cc.SpriteFrame) faceSpriteFrames: cc.SpriteFrame[] = [];

    public async slideIn(): Promise<void> {
        return new Promise((resolve): void => {
            cc.tween(this.node)
            .to(1, {position: cc.v3(718, 188, 0)}, {easing: "cubicOut"})
            .call((): void => {resolve()})
            .start();
        })
    }

    public async change(state: PROGRESS_STATE): Promise<void> {
        return new Promise((resolve): void => {
            Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_CardTurn);
            cc.tween(this.node)
            .to(.2, {scaleX: 0})
            .call((): void => {
                this.faceSprite.spriteFrame = this.faceSpriteFrames[state];
            })
            .to(.2, {scaleX: 1})
            .delay(.5)
            .call((): void=> {
                resolve();
            })
            .start();
        })
    }
}