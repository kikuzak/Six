import { SKILL_TIMING } from "./SkillTiming";

export interface IMonsterSkillRule {
    /** スキルの発動タイミング */
    timing: SKILL_TIMING,
    /** 重複して発動するかどうか */
    overlap: boolean,
    /** 優先度を使用するかどうか */
    priority: boolean
}

export class FairySkillRule implements IMonsterSkillRule {
    public timing: SKILL_TIMING = SKILL_TIMING.Judge;
    public overlap: boolean = true;
    public priority: boolean = true;
}

export class GhostSkillRule implements IMonsterSkillRule {
    public timing: SKILL_TIMING = SKILL_TIMING.Cip;
    public overlap: boolean = false;
    public priority: boolean = false;
}

export class MedusaSkillRule implements IMonsterSkillRule {
    public timing: SKILL_TIMING = SKILL_TIMING.Cip;
    public overlap: boolean = true;
    public priority: boolean = true;
}

export class CentaurSkillRule implements IMonsterSkillRule {
    public timing: SKILL_TIMING = SKILL_TIMING.Cip;
    public overlap: boolean = false;
    public priority: boolean = false;
}

export class GolemSkillRule implements IMonsterSkillRule {
    public timing: SKILL_TIMING = SKILL_TIMING.Cip;
    public overlap: boolean = false;
    public priority: boolean = true;
}

export class DragonSkillRule implements IMonsterSkillRule {
    public timing: SKILL_TIMING = SKILL_TIMING.Empty;
    public overlap: boolean = true;
    public priority: boolean = false;
}