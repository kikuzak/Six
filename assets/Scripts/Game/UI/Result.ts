import Events from "../../Common/Events";
import { AUDIO_TYPE, USER } from "../../Common/SystemConst";
import { OpponentData, PlayerData } from "../../Common/UserData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Result extends cc.Component {

    @property(cc.Sprite) monsterSprite: cc.Sprite = null;
    @property(cc.SpriteFrame) winSpriteFrame: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame) loseSpriteFrame: cc.SpriteFrame[] = [];
    @property(cc.Sprite) bigTextSprite: cc.Sprite = null;
    @property(cc.Sprite) smallTextSprite: cc.Sprite = null;
    @property(cc.SpriteFrame) bigWinSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) bigLoseSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) bigDrawSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) smallWinSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) smallLoseSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) smallDrawSpriteFrame: cc.SpriteFrame = null;
    @property(cc.Node) returnBtnNode: cc.Node = null;

    public show( winner: USER): void {
        if (winner === USER.Player) {
            // 勝利時
            Events.target.emit(Events.List.Sound, AUDIO_TYPE.Stop);
            Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_Win);
            this.monsterSprite.spriteFrame = this.winSpriteFrame[PlayerData.profile.icon - 1];
            this.bigTextSprite.spriteFrame = this.bigWinSpriteFrame;
            this.smallTextSprite.spriteFrame = this.smallWinSpriteFrame;
        } else if (winner === USER.Opponent) {
            // 敗北時
            Events.target.emit(Events.List.Sound, AUDIO_TYPE.Stop);
            Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_Lose);
            this.monsterSprite.spriteFrame = this.loseSpriteFrame[PlayerData.profile.icon - 1];
            this.bigTextSprite.spriteFrame = this.bigLoseSpriteFrame;
            this.smallTextSprite.spriteFrame = this.smallLoseSpriteFrame;
        } else {
            // 引き分け時
            this.bigTextSprite.spriteFrame = this.bigDrawSpriteFrame;
            this.smallTextSprite.spriteFrame = this.smallDrawSpriteFrame;
        }
        this.node.active = true;
        if (winner === USER.Player || winner === USER.Opponent) {
            cc.tween(this.monsterSprite.node)
            .to(.6, {position: cc.v3(-470, -70)})
            .start();

            cc.tween(this.bigTextSprite.node)
            .delay(.3)
            .to(.6, {scale: 0.6}, {easing: "backOut"})
            .start();

            cc.tween(this.smallTextSprite.node)
            .delay(.5)
            .to(.6, {scale: 0.6}, {easing: "backOut"})
            .start();

            cc.tween(this.returnBtnNode)
            .delay(1)
            .to(.4, {scale: 1}, {easing: "backOut"})
            .start();
        } else {
            this.bigTextSprite.node.setPosition(0, this.bigTextSprite.node.y);
            cc.tween(this.bigTextSprite.node)
            .delay(.3)
            .to(.6, {scale: 0.6}, {easing: "backOut"})
            .start();

            this.smallTextSprite.node.setPosition(0, this.smallTextSprite.node.y);
            cc.tween(this.smallTextSprite.node)
            .delay(.5)
            .to(.6, {scale: 0.6}, {easing: "backOut"})
            .start();

            cc.tween(this.returnBtnNode)
            .delay(1)
            .to(.4, {scale: 1}, {easing: "backOut"})
            .start();
        }
    }
    
    public pressReturnBtn(): void {
        cc.director.loadScene("Title");
    }
}
