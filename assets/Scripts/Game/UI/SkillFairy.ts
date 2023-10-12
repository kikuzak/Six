import Events from "../../Common/Events";
import MyGs2 from "../../Common/Gs2/MyGs2";
import { AUDIO_TYPE, USER } from "../../Common/SystemConst";
import { GAME_MODE } from "../Common/GameConst";
import GameSetting from "../Common/GameSetting";
import LayoutNode from "../Monster/LayoutNode";
import { MONSTER_KEY } from "../Monster/MonsterKey";
import MonsterPlaceNode from "../Place/MonsterPlaceNode";
import SkillTarget from "../Skill/SkillTarget";


const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillFairy extends cc.Component {

    @property(MonsterPlaceNode) playerMonsterPlaceNodes: MonsterPlaceNode[] = [];
    @property(MonsterPlaceNode) opponentMonsterPlaceNodes: MonsterPlaceNode[] = [];
    @property(LayoutNode) layoutNode: LayoutNode = null;
    @property(cc.Node) btnBoard: cc.Node = null;
    @property(cc.Node) hideArea: cc.Node = null;

    private readonly cardToUse: MONSTER_KEY[] = [
        MONSTER_KEY.Fairy,
        MONSTER_KEY.Ghost,
        MONSTER_KEY.Medusa,
        MONSTER_KEY.Centaur,
        MONSTER_KEY.Golem,
        MONSTER_KEY.Dragon
    ]

    private _targetPlaceNode: MonsterPlaceNode;
    private _currentIndex: number = 0;

    start() {
        this.btnBoard.on(cc.Node.EventType.TOUCH_START, (): void => {
            this.hideArea.active = false;
        });
        this.btnBoard.on(cc.Node.EventType.TOUCH_END, (): void => {
            this.hideArea.active = true;
        });
        this.btnBoard.on(cc.Node.EventType.TOUCH_CANCEL, (): void => {
            this.hideArea.active = true;
        });
    }

    public setup(skillTarget: SkillTarget): void {
        let targetPlaceNode: MonsterPlaceNode;
        if (skillTarget.user === USER.Player) targetPlaceNode = this.opponentMonsterPlaceNodes[skillTarget.laneType - 1];
        else if (skillTarget.user === USER.Opponent) targetPlaceNode = this.playerMonsterPlaceNodes[skillTarget.laneType - 1];
        else console.error("ユーザーが指定されていません");
        this._targetPlaceNode = targetPlaceNode;
    }

    public show(): void {
        this._currentIndex = 0;
        this.layoutNode.setup(this.cardToUse[this._currentIndex]);
        this.node.active = true;
        this.btnBoard.active = true;
        this.hideArea.active = true;
    }

    public hide(): void {
        this.btnBoard.active = false;
        this.hideArea.active = false;
    }

    public showTarget(): void {
        this._targetPlaceNode.showFairyTarget();
    }

    public hideTarget(): void {
        this._targetPlaceNode.hideFairyTarget();
    }

    public onPressNextArrow(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemSelect);
        this._currentIndex++;
        if (this._currentIndex >= this.cardToUse.length) this._currentIndex = 0;
        this.layoutNode.setup(this.cardToUse[this._currentIndex]);
    }

    public onPressPrevArrow(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemSelect);
        this._currentIndex--;
        if (this._currentIndex < 0) this._currentIndex = this.cardToUse.length - 1;
        this.layoutNode.setup(this.cardToUse[this._currentIndex]);
    }

    public onPressBtn(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemEnter);
        this.hide();
        Events.target.emit(Events.List.Fairy, this.cardToUse[this._currentIndex]);
        if (GameSetting.gameMode === GAME_MODE.Friend) MyGs2.postUseFairy(this.cardToUse[this._currentIndex] as number);
    }
}
