import { USER } from "../../Common/SystemConst";
import { MONSTER_KEY } from "../Monster/MonsterKey";
import MonsterNode from "../Monster/MonsterNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillMedusa extends cc.Component {

    @property(MonsterNode) monsterNode: MonsterNode = null;
    @property(cc.Sprite) messageSprite: cc.Sprite = null;
    @property(cc.SpriteFrame) messagePlayerSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) messageOpponentSpriteFrame: cc.SpriteFrame = null;

    public async show(user: USER, key: MONSTER_KEY): Promise<void> {
        this.node.active = true;
        if (user === USER.Player) this.messageSprite.spriteFrame = this.messageOpponentSpriteFrame;
        else if (user === USER.Opponent) this.messageSprite.spriteFrame = this.messagePlayerSpriteFrame;
        else console.error("ユーザーが指定されていません");

        this.monsterNode.setup(key);
        await this.monsterNode.petrify();
        this.node.active = false;
    }
}
