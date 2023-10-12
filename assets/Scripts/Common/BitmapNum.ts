import { HORIZONTAL_ALIGN_MODE, VERTICAL_ALIGN_MODE } from "./SystemConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BitmapNum extends cc.Component {

    @property(cc.Sprite) numSprites: cc.Sprite[] = [];
    @property(cc.SpriteFrame) numSpriteFrames: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame) underBarSpriteFrame: cc.SpriteFrame = null;

    public reset(): void {
        for (let i: number = 0; i < this.numSprites.length; i++) {
            this.numSprites[i].spriteFrame = this.underBarSpriteFrame;
        }
    }

    /**
     * 数を表示する
     * @param num - 表示する数(文字列)
     */
    public show(strNum: string): void {
        if (strNum.length > this.numSprites.length) {
            console.error("数字の桁数がオーバーしています。");
            strNum = "";
            for (let i: number = 0; i < this.numSprites.length; i++) {
                strNum += "9";
            }
        }
        for (let i: number = 0; i < this.numSprites.length; i++) {
            if (i < this.numSprites.length - strNum.length) {
                this.numSprites[i].spriteFrame = this.underBarSpriteFrame;
            } else {
                this.numSprites[i].spriteFrame = this.numSpriteFrames[strNum.charAt(i - (this.numSprites.length - strNum.length))];
            }
        }
    }

    public showAsRoomNumber(strNum: string): void {
        if (strNum.length > this.numSprites.length) {
            console.error("数字の桁数がオーバーしています。");
            strNum = "";
            for (let i: number = 0; i < this.numSprites.length; i++) {
                strNum += "9";
            }
        }
        for (let i: number = 0; i < this.numSprites.length; i++) {
            if (i < strNum.length) {
                this.numSprites[i].spriteFrame = this.numSpriteFrames[strNum.charAt(i)];
            } else {
                this.numSprites[i].spriteFrame = this.underBarSpriteFrame;
            }
        }
    }
}