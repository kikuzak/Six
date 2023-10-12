import Events from "../../Common/Events";
import { USER } from "../../Common/SystemConst";
import { MONSTER_KEY } from "../Monster/MonsterKey";
import UIManager from "../UI/UIManager";
import * as Skill from "./IMonsterSkill";
import SkillApply from "./SkillApply";
import SkillTarget from "./SkillTarget";
import { SKILL_TIMING } from "./SkillTiming";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillManager extends cc.Component {
    
    @property(UIManager) uiManager: UIManager = null;
    @property(SkillApply) skillApply: SkillApply = null;

    private _skillRules: Map<MONSTER_KEY, Skill.IMonsterSkillRule> = new Map<MONSTER_KEY, Skill.IMonsterSkillRule>;
    private _skillStack: SkillTarget[] = [];
    private _timing: SKILL_TIMING;
    private _userPriority: USER;
    private _changePriorityFlg: boolean = false;
    
    start() {
        // スキルのルールを登録
        this._skillRules.set(MONSTER_KEY.Fairy, new Skill.FairySkillRule());
        this._skillRules.set(MONSTER_KEY.Ghost, new Skill.GhostSkillRule());
        this._skillRules.set(MONSTER_KEY.Medusa, new Skill.MedusaSkillRule());
        this._skillRules.set(MONSTER_KEY.Centaur, new Skill.CentaurSkillRule());
        this._skillRules.set(MONSTER_KEY.Golem, new Skill.GolemSkillRule());
        this._skillRules.set(MONSTER_KEY.Dragon, new Skill.DragonSkillRule());
    }

    public initialize(): void {
        this._timing = null;
        this._skillStack = [];
    }

    public setPriority(user: number): void {
        this._userPriority = user as USER;
    }

    public setTiming(timing: SKILL_TIMING): void {
        this._timing = timing;
    }

    public add(skillTarget: SkillTarget): void {
        this._skillStack.push(skillTarget);
    }

    private _have(): boolean {
        if (this._skillStack.length > 0) return true;
        else return false;
    }

    /** いらないスキルをスタックから削除する */
    public optimize(): void {
        if (!this._have()) return;

        // タイミングが違うものを削除する
        this._skillStack = this._skillStack.filter((v) => this._skillRules.get(v.key).timing === this._timing);
        // 1つ以下なら完了
        if (this._skillStack.length <= 1) return;
        // 以下、出せるカードが2枚前提
        // 同名カードでなければ小さい順に並べて完了(スキル発動順をあわせるため)
        if (this._skillStack[0].key !== this._skillStack[1].key) {
            this._sortSmallOrder();
            return;
        }
        // 以下、同名カード2つであることが確定
        let currentSkillRule: Skill.IMonsterSkillRule = this._skillRules.get(this._skillStack[0].key);
        // 重複する場合、スキルの優先度を計算する
        if (currentSkillRule.priority) {
            this._sortPrioriy();
            if (this._skillStack[0].key === MONSTER_KEY.Fairy) {
                // フェアリーだけは例外的に、優先権を渡す
                this._changePriorityFlg = true;
            }
        }
        // レーンが同じものがなければ完了
        if (this._skillStack[0].laneType !== this._skillStack[1].laneType) return;

        // 重複しない(同じレーンで1回しか効果が発動しない)場合、1つを削除
        if (!currentSkillRule.overlap) {
            this._skillStack.pop();
        }
    }

    /** スキルの優先度の変更 */
    private _changePriority(): void {
        if (this._userPriority === USER.Player) this._userPriority = USER.Opponent;
        else if (this._userPriority === USER.Opponent) this._userPriority = USER.Player;
    }

    /** スキルをkeyの小さい順に並べる */
    private _sortSmallOrder(): void {
        if ((this._skillStack[1].key as number) < (this._skillStack[0].key as number)) {
            this._skillStack.reverse();
        }
    }

    /** スキルの優先度によりスタックを並べ替える */
    private _sortPrioriy(): void {
        if (this._skillStack[0].user !== this._userPriority) {
            this._skillStack.reverse();
        }
    }

    /** スキルを解決(使用)する */
    public async resolve(): Promise<void> {
        if (this._have()) {
            // スキルがスタックにある場合
            if (this.skillApply.check(this._skillStack[0])) {
                Events.target.emit(Events.List.StartSkillUse, this._skillStack[0]);
                await this.uiManager.showSkillCutIn(this._skillStack[0]);
                await this.skillApply.use(this._skillStack[0]);
            } else {
                this.endSkillUse();
            }

        } else {
            // スキルがスタックにない場合
            if (this._timing === SKILL_TIMING.Cip) Events.target.emit(Events.List.EndTurn);
            if (this._timing === SKILL_TIMING.Judge) Events.target.emit(Events.List.Judge);
        }
    }

    /** スキル使用が終わった */
    public async endSkillUse(): Promise<void> {
        this._skillStack.shift();
        cc.tween(this.node)
        .delay(1)
        .call((): void => { this.resolve(); })
        .start();
    }
    
    protected onLoad(): void {
        Events.target.on(Events.List.EndPrioritySkill, (): void => {
            if (this._changePriorityFlg) {
                this._changePriority();
                this.uiManager.setPriority(this._userPriority);
                this._changePriorityFlg = false;
            }
        }, this.node);
        Events.target.on(Events.List.EndSkillUse, (): void => {
            this.endSkillUse();
        }, this.node);
    }
    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}
