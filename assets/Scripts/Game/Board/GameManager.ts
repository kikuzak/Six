import Events from "../../Common/Events";
import MyGs2 from "../../Common/Gs2/MyGs2";
import Message from "gs2/chat/model/Message";
import { AUDIO_TYPE, CHAT_CATEGORY, ERROR_TIMING, USER, USER_ROLE } from "../../Common/SystemConst";
import { PlayerData } from "../../Common/UserData";
import PlayerHandDealer from "../Hand/PlayerHandDealer";
import OrbDealer from "../Orb/OrbDealer";
import MonsterPlaceDealer from "../Place/MonsterPlaceDealer";
import ScoreNode from "../Score/ScoreNode";
import SkillManager from "../Skill/SkillManager";
import SkillTarget from "../Skill/SkillTarget";
import { SKILL_TIMING } from "../Skill/SkillTiming";
import UIManager from "../UI/UIManager";
import Judge from "./Judge";
import PlayCard from "./PlayCard";
import Round from "./Round";
import Turn from "./Turn";
import GameSetting from "../Common/GameSetting";
import { GAME_MODE } from "../Common/GameConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(UIManager) uiManager: UIManager = null;
    @property(OrbDealer) orbDealer: OrbDealer = null;
    @property(PlayerHandDealer) handDealer: PlayerHandDealer = null;
    @property(MonsterPlaceDealer) monsterPlaceDealer: MonsterPlaceDealer = null;
    @property(SkillManager) skillManager: SkillManager = null;
    @property(ScoreNode) playerScore: ScoreNode = null;
    @property(ScoreNode) opponentScore: ScoreNode = null;
    @property(Judge) judge: Judge = null;

    private _round: Round;
    private _turn: Turn;

    get round(): Round {
        return this._round;
    };

    get turn(): Turn {
        return this._turn;
    }

    public async start(): Promise<void> {
        GameSetting.returnFlg = true;
        this._round = new Round(0);
        this._turn = new Turn(0);
        this.orbDealer.setup();
        // ゲスト側が優先権を決定
        // ホスト側がデッキを作成しスタート
        if (GameSetting.gameMode === GAME_MODE.Friend) {
            if (PlayerData.userRole === USER_ROLE.Guest) {
                let priority = Math.floor(Math.random() * 2) + 1;
                this.skillManager.setPriority(priority);
                this.uiManager.setPriority(priority as USER);
                await MyGs2.postPriority(priority);
            }
        } else {
            let priority = Math.floor(Math.random() * 2) + 1;
            this.skillManager.setPriority(priority);
            this.uiManager.setPriority(priority as USER);
            this._startGame();
        }
    }

    /** ゲーム開始 */
    public async _startGame() {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.BGM_Game);
        cc.log("---------- Game Start ----------");
        Events.target.emit(Events.List.StartGame);
        await this.uiManager.startGame();
        this._startRound();
    }

    /** ラウンドの開始 */
    private async _startRound(): Promise<void> {
        this.skillManager.initialize();
        this.handDealer.removeAll();
        this.orbDealer.removeAll();
        this.monsterPlaceDealer.removeAll();
        this._turn.reset();
        
        let addedRound: Round = this._round.add();
        cc.log(`---------- Round${addedRound.value} Start ----------`);
        await this.uiManager.startRound();
        Events.target.emit(Events.List.StartRound, addedRound);
        this.handDealer.deal();
        await this.orbDealer.deal();
        this._startTurn();
    }

    /** すべてのラウンドの終了 */
    private async _endRound(): Promise<void> {
        let winner: USER = this._winner();
        if (GameSetting.gameMode !== GAME_MODE.Cpu) {
            if (winner === USER.Player) {
                cc.log("You Win!");
                PlayerData.profile.addWin();
                if (this._round.value <= 2) PlayerData.profile.addTwoRoundWin();
            } else if (winner === USER.Opponent) {
                cc.log("You Lose...");
                PlayerData.profile.addDefeat();
            } else {
                cc.log("draw.");
                PlayerData.profile.addDraw();
            }
            PlayerData.profile.updateMostPoint(this.playerScore.totalPoint.value);
            PlayerData.profile.updateMostObtainedOrb(this.playerScore.acquiredTotalOrbNum);
            if (this.playerScore.totalPoint.value >= 20) PlayerData.profile.addBigScore();

            cc.sys.localStorage.setItem("profile", JSON.stringify(PlayerData.profile.createJSON()));
            MyGs2.updateProfile(PlayerData.profile);
        }
        this.uiManager.showResult(winner);
    }

    /** すべてのラウンドが終わった(勝敗判定に移るか) */
    private _isRoundOver(): boolean {
        if (this.playerScore.acquiredOrbColorNum >= 4 || this.opponentScore.acquiredOrbColorNum >= 4) return true;
        else return false;
    }


    /** ターンの開始 */
    private async _startTurn(): Promise<void> {
        let addedTurn: Turn = this._turn.add();
        cc.log(`---------- Turn${addedTurn.value} Start`);
        await this.uiManager.startTurn(addedTurn);
        Events.target.emit(Events.List.StartTurn, addedTurn);
    }

    /** 3ターンが終了した */
    private async _endAllTurn(): Promise<void> {
        cc.log("---------- Judge ");
        Events.target.emit(Events.List.LogBattle);
        await this.uiManager.startBattle();
        // スキルをセットする
        let skillTragets: SkillTarget[] = this.monsterPlaceDealer.getLayoutsAsSkillTarget();
        for (let i: number = 0; i < skillTragets.length; i++) {
            this.skillManager.add(skillTragets[i]);
        }
        this.skillManager.setTiming(SKILL_TIMING.Judge);
        this.skillManager.optimize();
        await this.skillManager.resolve();
    }

    /** 3ターンが経過したか */
    private _isAllTurnOver(): boolean {
        if (this._turn.value >= 3) return true;
        else return false;
    }

    /** カードをプレイ */
    private async _play(playerPlayCard: PlayCard, opponentPlayCard: PlayCard): Promise<void> {
        cc.log("----- CardPlay");
        cc.log(playerPlayCard, opponentPlayCard);
        await this.monsterPlaceDealer.play(playerPlayCard, opponentPlayCard);
        this.skillManager.setTiming(SKILL_TIMING.Cip);
        if (!playerPlayCard.isAttackZone()) this.skillManager.add(new SkillTarget(playerPlayCard.key, playerPlayCard.laneType, USER.Player));
        if (!opponentPlayCard.isAttackZone()) this.skillManager.add(new SkillTarget(opponentPlayCard.key, opponentPlayCard.laneType, USER.Opponent));
        this.skillManager.optimize();
        await this.skillManager.resolve();
    }

    /** 勝敗判定 */
    private _winner(): USER {
        if (this.playerScore.acquiredOrbColorNum > this.opponentScore.acquiredOrbColorNum) {
            return USER.Player;
        } else if (this.opponentScore.acquiredOrbColorNum > this.playerScore.acquiredOrbColorNum) {
            return USER.Opponent;
        } else {
            // 集めた種類が同じ
            if (this.playerScore.totalPoint > this.opponentScore.totalPoint) {
                return USER.Player;
            } else if (this.opponentScore.acquiredOrbColorNum > this.playerScore.acquiredOrbColorNum) {
                return USER.Opponent;
            } else {
                // トータルポイントも同じ
                if (this.playerScore.acquiredTotalOrbNum > this.opponentScore.acquiredTotalOrbNum) {
                    return USER.Player;
                } else if (this.opponentScore.acquiredTotalOrbNum > this.playerScore.acquiredTotalOrbNum) {
                    return USER.Opponent;
                } else {
                    return USER.Empty;
                }
            }
        }
    }

    protected onLoad(): void {
        Events.target.clear();

        // メッセージを受け取る
        Events.target.on(Events.List.GetMessage, (message: Message): void => {
            if (message.getCategory() === CHAT_CATEGORY.Deck as number) {
                this.orbDealer.setDeckData(message.getMetadata());
                this._startGame();
            } else if (message.getCategory() === CHAT_CATEGORY.Priority as number) {
                this.skillManager.setPriority(Number(message.getMetadata()));
                this.uiManager.setPriority(Number(message.getMetadata()) as USER);
                MyGs2.postDeck(this.orbDealer.getDeckData());
                this._startGame();
            } else if (message.getCategory() === CHAT_CATEGORY.Resing as number) {
                this.uiManager.showResult(USER.Player);
                Events.target.emit(Events.List.Error, ERROR_TIMING.Title, "相手が投了しました。");
            }
        }, this.node);
        // ターン終了
        Events.target.on(Events.List.EndTurn, (): void => {
            if (!this._isAllTurnOver()) this._startTurn();
            else this._endAllTurn();
        });
        // カードプレイ
        Events.target.on(Events.List.PlayCard, (playerPlayCard: PlayCard, opponentPlayCard: PlayCard): void => {
            this._play(playerPlayCard, opponentPlayCard);
        }, this.node);
        // ラウンド終了
        Events.target.on(Events.List.EndRound, (): void => {
            if (GameSetting.gameMode !== GAME_MODE.Cpu && this.playerScore.acquiredOrbNumAtRound === 3) PlayerData.profile.addTakeAll();
            if (this._isRoundOver()) {
                this._endRound();
            } else {
                setTimeout((): void => {
                    this._startRound();
                }, 1000);
            }
        }, this.node);
    }
    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}