import Events from "../../Common/Events";
import { AUDIO_TYPE } from "../../Common/SystemConst";
import { MONSTER_KEY } from "../Monster/MonsterKey";
import MonsterNode from "../Monster/MonsterNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillFairyResult extends cc.Component {

    @property(MonsterNode) monster: MonsterNode = null;
    @property(cc.Node) successNode: cc.Node = null;
    @property(cc.Node) successTextNodes: cc.Node[] = [];
    @property(cc.Node) failNode: cc.Node = null;
    @property(cc.Node) failTextNodes: cc.Node[] = [];

    /**
     * セットアップ
     * @param targetPlaceMonsterKey - プレイスのレイアウトのkey
     * @param decideMonsterKey - フェアリーによって指定されたkey
     */
    public setup(targetPlaceMonsterKey: MONSTER_KEY, decideMonsterKey: MONSTER_KEY): void {
        this.monster.setup(decideMonsterKey);
        if (targetPlaceMonsterKey === decideMonsterKey) {
            // 成功
            cc.log("Fairy Success!");
            this.successNode.active = true;
            this.failNode.active = false;
        } else {
            // 失敗
            cc.log("Fairy Failed.");
            this.successNode.active = false;
            this.failNode.active = true;
        }
    }

    public async show(): Promise<void> {
        return new Promise((resolve): void => {
            this.node.active = true;
            if (this.successNode.active) {
                Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_Fairy);
                for (let i: number = 0; i < this.successTextNodes.length; i++) {
                    cc.tween(this.successTextNodes[i])
                    .delay(.5 * i)
                    .by(.2, {position: cc.v3(0, 50, 0), opacity: 255}, {easing: "sineIn"})
                    .by(.2, {position: cc.v3(0, -50, 0)}, {easing: "sineOut"})
                    .delay(2)
                    .call((): void => { resolve(); })
                    .start();
                }
            } else {
                Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_Fairy);
                for (let i: number = 0; i < this.failTextNodes.length; i++) {
                    cc.tween(this.failTextNodes[i])
                    .delay(.5 * i)
                    .by(.2, {position: cc.v3(0, -200, 0), opacity: 255}, {easing: "backOut"})
                    .delay(2)
                    .call((): void => { resolve(); })
                    .start();
                }
            }
        });
    }

    public hide(): void {
        this.node.active = false;
        for (let i: number = 0; i < this.successTextNodes.length; i++) {
            this.successTextNodes[i].opacity = 0;
        }
        for (let i: number = 0; i < this.failTextNodes.length; i++) {
            this.failTextNodes[i].opacity = 0;
            this.failTextNodes[i].y = 200;
        }
    }
}
