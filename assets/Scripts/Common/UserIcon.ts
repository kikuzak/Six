import { MONSTER_KEY } from "../Game/Monster/MonsterKey";
import { USER } from "./SystemConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UserIcon extends cc.Component {

    @property(cc.Sprite) iconSprite: cc.Sprite = null;
    @property(cc.SpriteFrame) iconSpriteFrames: cc.SpriteFrame[] = [];

    public setup(user: USER, key: MONSTER_KEY): void {
        this.iconSprite.spriteFrame = this.iconSpriteFrames[key];
        if (user === USER.Player) this.iconSprite.node.scaleX = -1
    }
}