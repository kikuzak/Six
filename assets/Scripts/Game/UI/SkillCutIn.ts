import Events from "../../Common/Events";
import { AUDIO_TYPE, USER } from "../../Common/SystemConst";
import SkillTarget from "../Skill/SkillTarget";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillCutIn extends cc.Component {

    @property(cc.Sprite) messageSprite: cc.Sprite = null;
    @property(cc.SpriteFrame) messageSpriteFrames: cc.SpriteFrame[] = [];

    public async show(skillTarget: SkillTarget): Promise<void> {
        this.messageSprite.spriteFrame = this.messageSpriteFrames[skillTarget.key - 1];
        if (skillTarget.user === USER.Player) this.messageSprite.node.setPosition(0, -240);
        else if (skillTarget.user === USER.Opponent) this.messageSprite.node.setPosition(0, 240);

        return new Promise((resolve) => {
            Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_Skill);
            this.node.active = true;
            cc.tween(this.messageSprite.node)
            .to(.2, {scaleY: 1})
            .delay(1)
            .to(.2, {scaleY: 0})
            .delay(.4)
            .call(() => {
                this.node.active = false;
                resolve();
            })
            .start();
        });
    }
}
