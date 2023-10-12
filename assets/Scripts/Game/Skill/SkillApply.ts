import Events from "../../Common/Events";
import Message from "gs2/chat/model/Message";
import { GAME_MODE } from "../Common/GameConst";
import GameSetting from "../Common/GameSetting";
import Cpu from "../Cpu/CPU";
import HandNode from "../Hand/HandNode";
import PlayerHandDealer from "../Hand/PlayerHandDealer";
import LaneNode from "../Lane/LaneNode";
import { VICTORY_CONDITION } from "../Lane/VictoryCondition";
import { MONSTER_KEY } from "../Monster/MonsterKey";
import OrbData from "../Orb/OrbData";
import OrbDealer from "../Orb/OrbDealer";
import MonsterPlaceNode from "../Place/MonsterPlaceNode";
import UIManager from "../UI/UIManager";
import SkillTarget from "./SkillTarget";
import { CHAT_CATEGORY, USER } from "../../Common/SystemConst";
import MyGs2 from "../../Common/Gs2/MyGs2";
import { PlayerData } from "../../Common/UserData";

const {ccclass, property} = cc._decorator;

/** スキルを適用する */
@ccclass
export default class SkillApply extends cc.Component {

    @property(UIManager) uiManager: UIManager = null;
    @property(OrbDealer) orbDealer: OrbDealer = null;
    @property(PlayerHandDealer) playerHandDealer: PlayerHandDealer = null;
    @property(LaneNode) lanes: LaneNode[] = [];
    @property(Cpu) cpu: Cpu = null;

    /** 現在処理されているskillTarget */
    private _skillTarget: SkillTarget = null;
    private _targetLane: LaneNode = null;

    /** 指定されたスキルが使用条件を満たすかチェックする */
    public check(skillTarget: SkillTarget): boolean {
        let targetLane: LaneNode = this.lanes.find((v) => v.type === skillTarget.laneType);
        switch (skillTarget.key) {
            case MONSTER_KEY.Fairy:
                let targetPlace: MonsterPlaceNode;
                if (skillTarget.user === USER.Player) targetPlace = targetLane.opponentAttackPlace;
                else if (skillTarget.user === USER.Opponent) targetPlace = targetLane.playerAttackPlace;

                if (targetPlace.isEmpty()) return false;
                else return true;
            // case MONSTER_KEY.Medusa:
                // if (this.gameManager.turn.value === 3) return false;
                // else return true;
                // break;
            default:
                return true;
        }
    }

    public async use(skillTarget: SkillTarget): Promise<void> {
        cc.log("----- Skill");
        cc.log(skillTarget);
        this._targetLane = this.lanes.find((v) => v.type === skillTarget.laneType);
        this._skillTarget = skillTarget;
        switch (skillTarget.key) {
            case MONSTER_KEY.Fairy:
                await this._useFairy(skillTarget);
                break;
            case MONSTER_KEY.Ghost:
                await this._useGhost(skillTarget);
                break;
            case MONSTER_KEY.Medusa:
                await this._useMedusa(skillTarget);
                break;
            case MONSTER_KEY.Centaur:
                await this._useCentaur(skillTarget);
                break;
            case MONSTER_KEY.Golem:
                await this._useGolem(skillTarget);
                break;
        }
    }

    private async _useFairy(skillTarget: SkillTarget): Promise<void> {
        this._targetLane.select();
        this.uiManager.showSkillFairy(skillTarget);
        if (GameSetting.gameMode === GAME_MODE.Cpu && skillTarget.user === USER.Opponent) this.cpu.useFairy();
    }

    /**
     * フェアリーの適用
     * @param key - 指定したカードのkey
     */
    private async _applyFairy(key: MONSTER_KEY): Promise<void> {
        let targetPlaceNode: MonsterPlaceNode;
        if (this._skillTarget.user === USER.Player) targetPlaceNode = this._targetLane.opponentAttackPlace;
        else if (this._skillTarget.user === USER.Opponent) targetPlaceNode = this._targetLane.playerAttackPlace;
        targetPlaceNode.hideFairyTarget();
        Events.target.emit(Events.List.LogFairy, targetPlaceNode.layoutNode.key, key);
        await targetPlaceNode.open();
        await this.uiManager.showSkillFairyResult(targetPlaceNode.layoutNode.key, key);
        if (targetPlaceNode.layoutNode.key === key) {
            let targetOrbData: OrbData = this._targetLane.orbPlace.orbData;
            await this._targetLane.orbPlace.remove();
            await this.uiManager.addScore(this._skillTarget.user, targetOrbData);
        }
        this._targetLane.deselect();

        if (this._skillTarget.user === USER.Player && key === MONSTER_KEY.Dragon) {
            PlayerData.profile.addApplyFairyToDragon();
        }

        Events.target.emit(Events.List.EndPrioritySkill);
        Events.target.emit(Events.List.EndSkillUse);
    }

    private async _useGhost(skillTarget: SkillTarget): Promise<void> {
        cc.tween(this.node)
        .delay(.5)
        .call(():void => { this._targetLane.ignoreNumber(); })
        .delay(.5)
        .call((): void => { Events.target.emit(Events.List.EndSkillUse); })
        .start()
        
    }

    private async _useMedusa(skillTarget: SkillTarget): Promise<void> {
        let key: MONSTER_KEY;
        if (skillTarget.user === USER.Opponent) {
            // 自分の手札が破壊される
            let index: number = Math.floor(Math.random() * this.playerHandDealer.count);
            let handNode: HandNode = this.playerHandDealer.getHand(index);
            key = handNode.key;
            if (GameSetting.gameMode === GAME_MODE.Friend) MyGs2.postUseMedusa(key);
            await this.playerHandDealer.remove(handNode.key);
            await this.playerHandDealer.align();
            this._applyMedusa(skillTarget.user, key);
        } else {
            // 相手の手札が破壊される
            if (GameSetting.gameMode === GAME_MODE.Cpu) {
                key = this.cpu.remove();
                this._applyMedusa(skillTarget.user, key);
            }
        }
    }

    private async _applyMedusa(user: USER, key: MONSTER_KEY): Promise<void> {
        Events.target.emit(Events.List.LogMedusa, user, key);
        await this.uiManager.showSkillMedusa(user, key);
        Events.target.emit(Events.List.EndSkillUse);

        if (user === USER.Player && key === MONSTER_KEY.Dragon) {
            PlayerData.profile.addApplyMedusaToDragon();
        }
    }

    private async _useCentaur(skillTarget: SkillTarget): Promise<void> {
        cc.tween(this.node)
        .delay(.5)
        .call(():void => { this._targetLane.changeCondition(VICTORY_CONDITION.Bigger); })
        .delay(.5)
        .call((): void => { Events.target.emit(Events.List.EndSkillUse); })
        .start()
    }

    private async _useGolem(skillTarget: SkillTarget): Promise<void> {
        await this.orbDealer.remove(skillTarget.laneType);
        await this.orbDealer.put(skillTarget.laneType);
        Events.target.emit(Events.List.EndSkillUse);
    }

    protected onLoad(): void {
        Events.target.on(Events.List.GetMessage, (message: Message): void => {
            if (message.getCategory() === CHAT_CATEGORY.Fairy) {
                this._applyFairy(Number(message.getMetadata()) as MONSTER_KEY);
            } else if (message.getCategory() === CHAT_CATEGORY.Medusa) {
                this._applyMedusa(USER.Player, Number(message.getMetadata()) as MONSTER_KEY);
            }
        }, this.node);

        Events.target.on(Events.List.Fairy, (key: MONSTER_KEY): void => {
            this._applyFairy(key);
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}