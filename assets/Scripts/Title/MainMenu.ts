import { SwitchNode } from "../Common/NodeSwitchBtn";
import { AUDIO_TYPE, ERROR_TIMING, USER_ROLE } from "../Common/SystemConst";
import { OpponentData, PlayerData } from "../Common/UserData";
import { GAME_MODE } from "../Game/Common/GameConst";
import GameSetting from "../Game/Common/GameSetting";
import Profile from "../Common/Profile";
import { MONSTER_KEY } from "../Game/Monster/MonsterKey";
import Events from "../Common/Events";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenu extends SwitchNode {
    @property(cc.Node) settingNode: cc.Node = null;
    @property(cc.Node) cpuBtnNode: cc.Node = null;
    @property(cc.Sprite) monsterSprite: cc.Sprite = null;
    @property(cc.SpriteFrame) monsterSpriteFrames: cc.SpriteFrame[] = [];

    public show(): void {
        this.monsterSprite.spriteFrame = this.monsterSpriteFrames[PlayerData.profile.icon as number - 1];
        if (PlayerData.profile.icon === MONSTER_KEY.Dragon) this.monsterSprite.node.scaleX = -1;
        this.settingNode.active = true;
        Events.target.emit(Events.List.EndLoading);

        this.node.opacity = 0;
        this.node.active = true;
        cc.tween(this.node)
        .to(.1, {opacity: 255})
        .start();
    }

    public hide(): void {
        cc.tween(this.node)
        .to(.1, {opacity: 0})
        .call((): void => {
            this.node.active = false;
        })
        .start();
    }

    public pressCpu(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemEnter);
        Events.target.emit(Events.List.StartLoading);
        GameSetting.gameMode = GAME_MODE.Cpu;
        PlayerData.userRole = USER_ROLE.Host;
        OpponentData.profile = new Profile();
        OpponentData.profile.name = "CPU";
        OpponentData.profile.icon = (Math.floor(Math.random() * 6) + 1) as MONSTER_KEY;
        cc.tween(this.cpuBtnNode)
        .to(.05, {scale: 1.1})
        .to(.05, {scale: 1})
        .start();
        cc.director.loadScene("Game");
    }

    protected onLoad(): void {
        Events.target.on(Events.List.ErrorConfirm, (timing: ERROR_TIMING): void => {
            if (timing === ERROR_TIMING.Title) {
                this.show();
            }
        }, this.node);
    }
    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}