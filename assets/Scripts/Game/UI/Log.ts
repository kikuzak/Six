import Events from "../../Common/Events";
import { AUDIO_TYPE, USER } from "../../Common/SystemConst";
import { OpponentData, PlayerData } from "../../Common/UserData";
import PlayCard from "../Board/PlayCard";
import Round from "../Board/Round";
import Turn from "../Board/Turn";
import LaneNode from "../Lane/LaneNode";
import { LANE_TYPE } from "../Lane/LaneType";
import { MONSTER_KEY } from "../Monster/MonsterKey";
import MonsterName from "../Monster/MonsterName";
import OrbData from "../Orb/OrbData";
import SkillTarget from "../Skill/SkillTarget";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Log extends cc.Component {

    @property(cc.Node) btnBackNode: cc.Node = null;
    @property(cc.ScrollView) scrollView: cc.ScrollView = null;
    @property(cc.Node) contentNode: cc.Node = null;
    @property(cc.Node) scrollContentNode: cc.Node = null;
    @property(cc.RichText) contentRichText: cc.RichText = null;

    public show(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemSelect);
    }

    // テキスト追加類

    /**  */
    private _add(text: string): void {
        this.contentRichText.string += text;
        this._updateHeight();
    }

    private _addHeadline(text: string): void {
        this.contentRichText.string += `<br/><b><color=#c60000>${text}</color></b>`;
        this._updateHeight();
    }

    private _addHeadline2(text: string): void {
        this.contentRichText.string += `<br/><b><color=#000000><size=34>${text}</size></color></b>`;
        this._updateHeight();
    }

    private _addText(text: string): void {
        this.contentRichText.string += `<br/><color=#000000><size=32>${text}</size></color>`;
        this._updateHeight();
    }

    private _addOrb(laneType: LANE_TYPE, orb: OrbData): void {
        this.contentRichText.string += `<color=#${orb.color.code}>${orb.number.value} </color>`;
        this._updateHeight();
    }

    private _updateHeight(): void {
        this.scrollContentNode.height = this.contentRichText.node.height;
        // this.scrollView.scrollToBottom();
    };

    private _getText(text: string): string {
        return  `<color=#000000><size=32>${text}</size></color>`;
    }

    private _getOrbText(orb: OrbData): string {
        return `<color=#${orb.color.code}>${orb.number.value}</color>`;
    }

    private _getPlayerText(user: USER): string {
        if (user === USER.Player) return `${PlayerData.profile.name} : `;
        else return `${OpponentData.profile.name} : `;
    }

    private _addPlayCard(user: USER, playCard: PlayCard): void {
        let text: string = "";
        text += this._getPlayerText(user);
        if (playCard.laneType === LANE_TYPE.Left) text += "左レーン";
        else if (playCard.laneType === LANE_TYPE.Center) text += "中央レーン";
        else text += "右レーン";
        if (playCard.isAttackZone()) {
            text += "アタックゾーンにカードを出した。";
        }
        else  {
            text += "サポートゾーンに";
            text += new MonsterName(playCard.key).value + "を出した。";
        }
        this._addText(text);
    };

    private _addSkill(skillTarget: SkillTarget): void {
        let text: string = "";
        text += this._getPlayerText(skillTarget.user);
        text += new MonsterName(skillTarget.key).value + "の効果を発動";
        this._addText(text);
    }

    private _addFairy(placeLayoutKey: MONSTER_KEY, decideMonsterKey: MONSTER_KEY): void {
        let text: string = "";
        text += `${new MonsterName(decideMonsterKey).value}を指定し`;
        if (placeLayoutKey === decideMonsterKey) text += "成功";
        else text += "失敗";
        this._addText(text);
    }

    private _addMedusa(key: MONSTER_KEY): void {
        this._addText(new MonsterName(key).value + "を破壊");
    }

    private _addJudge(laneNode: LaneNode): void {
        let lane: string;
        if (laneNode.type === LANE_TYPE.Left) lane = "左レーン";
        else if (laneNode.type === LANE_TYPE.Center) lane = "中央レーン";
        else lane = "右レーン";
        this._addHeadline2(lane);
        this._addText(`オーブ : ${(laneNode.orbIsEmpty()) ? "-" : this._getOrbText(laneNode.orbPlace.orbData)}`);
        let opponent: string = "";
        opponent += `${OpponentData.profile.name} : `;
        opponent += `アタック ${(laneNode.opponentAttackPlace.isEmpty()) ? "-" : laneNode.opponentAttackPlace.layoutNumber.value}, `;
        opponent += `サポート ${(laneNode.opponentSupportPlace.isEmpty())? "-" : laneNode.opponentSupportPlace.layoutNumber.value}`;
        this._addText(opponent);
        let player: string = "";
        player += `${PlayerData.profile.name} : `;
        player += `アタック ${(laneNode.playerAttackPlace.isEmpty()) ? "-" : laneNode.playerAttackPlace.layoutNumber.value}, `;
        player += `サポート ${(laneNode.playerSupportPlace.isEmpty()) ? "-" : laneNode.playerSupportPlace.layoutNumber.value}`;
        this._addText(player);
    }

    public pressBack(): void {
        this.contentNode.active = false;
    }

    public pressIconLog(): void {
        this.contentNode.active = true;
        this.show();
    }

    protected onLoad(): void {
        Events.target.on(Events.List.StartRound, (round: Round): void => {
            this._addHeadline(`ラウンド${round.value} : `);
        }, this.node);
        Events.target.on(Events.List.StartTurn, (turn: Turn): void => {
            this._addHeadline2(`ターン${turn.value}`);
        }, this.node);
        Events.target.on(Events.List.DealOrb, (type: LANE_TYPE, orb: OrbData): void => {
            this._addOrb(type, orb);
        }, this.node);
        Events.target.on(Events.List.PlayCard, (playerPlayCard: PlayCard, opponentPlayCard: PlayCard): void => {
            this._addPlayCard(USER.Player, playerPlayCard);
            this._addPlayCard(USER.Opponent, opponentPlayCard);
        }, this.node);
        Events.target.on(Events.List.StartSkillUse, (skillTarget: SkillTarget): void => {
            this._addSkill(skillTarget);
        }, this.node);
        Events.target.on(Events.List.LogFairy, (placeLayoutKey: MONSTER_KEY, decideMonsterKey: MONSTER_KEY): void => {
            this._addFairy(placeLayoutKey, decideMonsterKey);
        }, this.node);
        Events.target.on(Events.List.LogMedusa, (user: USER, key: MONSTER_KEY): void => {
            this._addMedusa(key);
        }, this.node);
        Events.target.on(Events.List.LogBattle, (): void => {
            this._addHeadline("Battle");
        }, this.node);
        Events.target.on(Events.List.LogJudge, (laneNode: LaneNode): void => {
            this._addJudge(laneNode);
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}
