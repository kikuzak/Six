import Events from "../../Common/Events";
import Profile from "../../Common/Profile";
import { AUDIO_TYPE, USER, USER_ROLE } from "../../Common/SystemConst";
import { OpponentData, PlayerData } from "../../Common/UserData";
import TitleProfile from "../../Title/UserProfileNode";
import Turn from "../Board/Turn";
import { GAME_MODE } from "../Common/GameConst";
import GameSetting from "../Common/GameSetting";
import { MONSTER_KEY } from "../Monster/MonsterKey";
import MonsterNode from "../Monster/MonsterNode";
import OrbData from "../Orb/OrbData";
import ScoreNode from "../Score/ScoreNode";
import SkillTarget from "../Skill/SkillTarget";
import ConfirmCardPlay from "./ConfirmCardPlay";
import Progress, { PROGRESS_STATE } from "./Progress";
import Result from "./Result";
import SkillCutIn from "./SkillCutIn";
import SkillFairy from "./SkillFairy";
import SkillFairyResult from "./SkillFairyResult";
import SkillMedusa from "./SkillMedusa";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {

    @property(Progress) progress: Progress = null;
    @property(ScoreNode) playerScoreNode: ScoreNode = null;
    @property(ScoreNode) opponentScoreNode: ScoreNode = null;
    @property(MonsterNode) monsterDetail: MonsterNode = null;
    @property(ConfirmCardPlay) confirmCardPlay: ConfirmCardPlay = null;
    @property(SkillCutIn) skillCutIn: SkillCutIn = null;
    @property(SkillFairy) skillFairy: SkillFairy = null;
    @property(SkillFairyResult) skillFairyResult: SkillFairyResult = null;
    @property(SkillMedusa) skillMedusa: SkillMedusa = null;
    @property(cc.Node) priorityNode: cc.Node = null;
    @property(TitleProfile) userProfile: TitleProfile = null;
    @property(Result) result: Result = null;

    start() {
        if (GameSetting.gameMode === GAME_MODE.Empty) {
            // シーンテスト
            GameSetting.gameMode = GAME_MODE.Cpu;
            PlayerData.userRole = USER_ROLE.Host;
            PlayerData.profile = new Profile();
            PlayerData.profile.name = "プレイヤー";
            PlayerData.profile.icon = MONSTER_KEY.Fairy;
            OpponentData.profile = new Profile();
            OpponentData.profile.name = "CPU";
            OpponentData.profile.icon = MONSTER_KEY.Golem;
        }
        this.playerScoreNode.setup(PlayerData.profile);
        this.opponentScoreNode.setup(OpponentData.profile);
    }

    public async startGame(): Promise<void> {
        await this.progress.slideIn();
    }

    public async startRound(): Promise<void> {
        await this.progress.change(PROGRESS_STATE.Deal);
    }

    public async startTurn(turn: Turn): Promise<void> {
        if (turn.value === 1) await this.progress.change(PROGRESS_STATE.Turn1);
        else if (turn.value === 2) await this.progress.change(PROGRESS_STATE.Turn2);
        else if (turn.value === 3) await this.progress.change(PROGRESS_STATE.Turn3);
    }

    public async startBattle(): Promise<void> {
        await this.progress.change(PROGRESS_STATE.Battle);
    }

    private _showMonsterDetail(key: MONSTER_KEY): void {
        this.monsterDetail.setup(key);
        this.monsterDetail.showText();
        this.monsterDetail.show();
    }

    private _hideMonsterDetail(): void {
        this.monsterDetail.hide();
    }

    public async showSkillCutIn(skillTarget: SkillTarget): Promise<void> {
        await this.skillCutIn.show(skillTarget);
    }

    public async showSkillFairy(skillTarget: SkillTarget): Promise<void> {
        this.skillFairy.setup(skillTarget);
        this.skillFairy.showTarget();
        if (skillTarget.user === USER.Opponent) return;
        cc.tween(this.skillFairy)
        .delay(1)
        .call((): void => { this.skillFairy.show(); })
        .start();
    }

    public async showSkillFairyResult(placeLayoutKey: MONSTER_KEY, decideMonsterKey: MONSTER_KEY): Promise<void> {
        this.skillFairyResult.setup(placeLayoutKey, decideMonsterKey);
        await this.skillFairyResult.show();
        this.skillFairyResult.hide();
        Events.target.emit(Events.List.LogFairy, placeLayoutKey, decideMonsterKey);
    }

    public async showSkillMedusa(user: USER, key: MONSTER_KEY): Promise<void> {
        await this.skillMedusa.show(user, key);
    }

    public async addScore(user: USER, orbData: OrbData): Promise<void> {
        let scoreNode: ScoreNode;
        if (user === USER.Player) {
            scoreNode = this.playerScoreNode;
            Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_PlayerPoint);
            
        } else if (user === USER.Opponent) {
            scoreNode = this.opponentScoreNode;
            Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_OpponentPoint);
        }
        await scoreNode.earn(orbData);
    }

    public setPriority(user: USER): void {
        let pos: cc.Vec2;
        if (user === USER.Player) pos = new cc.Vec2(444, -210);
        else pos = new cc.Vec2(-444, 300);
        this.priorityNode.setPosition(pos);
        this.priorityNode.active = true;
    }

    public showResult(winner: USER): void {
        this.result.show(winner);
    }

    public pressProfile(e, data: string): void {
        let user: USER;
        if (data === "player") this.userProfile.show();
        else if (GameSetting.gameMode === GAME_MODE.Friend) this.userProfile.showOpponent();
    }

    public hideProfile(): void {
        cc.tween(this.userProfile.node)
        .to(.1, {opacity: 0})
        .call((): void => {this.userProfile.hide()})
        .start();
    }

    protected onLoad(): void {
        // 手札が選択された
        Events.target.on(Events.List.SelectHand, (key: MONSTER_KEY): void => {
            this._showMonsterDetail(key);
        }, this.node);
        // 手札が選択解除された
        Events.target.on(Events.List.DeselectHand, (): void => {
            this._hideMonsterDetail();
        }, this.node);
        // プレイスが選択された
        Events.target.on(Events.List.SelectPlace, (): void => {
            this.confirmCardPlay.show();
        }, this.node);
        // レイアウトが選択された
        Events.target.on(Events.List.SelectLayout, (key: MONSTER_KEY): void => {
            this.monsterDetail.setup(key);
            this.monsterDetail.show();
        }, this.node);
        // カードプレイ
        Events.target.on(Events.List.PlayCard, (): void => {
            this._hideMonsterDetail();
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}