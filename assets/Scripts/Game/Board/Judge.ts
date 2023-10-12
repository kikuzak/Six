import Events from "../../Common/Events";
import { USER } from "../../Common/SystemConst";
import LaneNode from "../Lane/LaneNode";
import { VICTORY_CONDITION } from "../Lane/VictoryCondition";
import OrbData from "../Orb/OrbData";
import UIManager from "../UI/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Judge extends cc.Component {
    
    @property(UIManager) uiManager: UIManager = null;
    @property(LaneNode) leftLaneNode: LaneNode = null;
    @property(LaneNode) centerLaneNode: LaneNode = null;
    @property(LaneNode) rightLaneNode: LaneNode = null;

    private async _startCalc(): Promise<void> {
        cc.log("----- Left");
        await this._calcLane(this.leftLaneNode);
        cc.log("----- Center");
        await this._calcLane(this.centerLaneNode);
        cc.log("----- Right");
        await this._calcLane(this.rightLaneNode);
        Events.target.emit(Events.List.EndRound);
    }

    private async _calcLane(laneNode: LaneNode): Promise<void> {
        cc.log((laneNode.opponentSupportPlace.isEmpty())? "-" : laneNode.opponentSupportPlace.layoutNumber);
        cc.log((laneNode.opponentAttackPlace.isEmpty())? "-" : laneNode.opponentAttackPlace.layoutNumber);
        cc.log((laneNode.playerAttackPlace.isEmpty())? "-" : laneNode.playerAttackPlace.layoutNumber);
        cc.log((laneNode.playerSupportPlace.isEmpty())? "-" : laneNode.playerSupportPlace.layoutNumber);

        Events.target.emit(Events.List.LogJudge, laneNode);

        if (!this._canStartCalc(laneNode)) {
            cc.log("skip");
            return;
        }
        laneNode.select();
        // カードをオープン
        if (!laneNode.opponentAttackPlace.isEmpty()) await laneNode.opponentAttackPlace.open();
        if (!laneNode.playerAttackPlace.isEmpty()) await laneNode.playerAttackPlace.open();

        if (!laneNode.orbPlace.isEmpty()) {
            let winner: USER = this._getLaneWinner(laneNode);
            if (winner === USER.Empty) {
                laneNode.deselect();
                return;
            }
            let laneWinner: USER = winner;
            let aquiredOrbData: OrbData = laneNode.orbPlace.orbData;
            await laneNode.orbPlace.remove();
            await this.uiManager.addScore(laneWinner, aquiredOrbData);
        }
        return new Promise((resolve): void => {
            cc.tween(this.node)
            .delay(1.6)
            .call((): void => {
                laneNode.deselect();
                resolve();
            })
            .start();
        });
    }

    private _canStartCalc(laneNode: LaneNode): boolean {
        if (laneNode.orbIsEmpty()) return false;
        if (!laneNode.playerAttackPlace.isEmpty() || !laneNode.opponentAttackPlace.isEmpty()) return true;
        else return false;
    }

    private _getLaneWinner(laneNode: LaneNode): USER {
        // 勝敗のしきい値
        let threshold: number = laneNode.orbPlace.orbData.number.value;
        let playerTotalNumber: number = laneNode.getTotalNumber(USER.Player);
        let opponentTotalNumber: number = laneNode.getTotalNumber(USER.Opponent);
        if (laneNode.numberIsIgnored()) threshold = 0;

        if ((!laneNode.playerAttackPlace.isEmpty()) && (!laneNode.opponentAttackPlace.isEmpty())) {
            // 両者ともアタックゾーンにモンスターがある
            if (playerTotalNumber >= threshold && opponentTotalNumber >= threshold) {
                // 両者のナンバーがしきい値以上
                if (playerTotalNumber === opponentTotalNumber) {
                    return USER.Empty;
                } else if (playerTotalNumber < opponentTotalNumber) {
                    // 相手のナンバーが大きい
                    if (laneNode.victoryCondition === VICTORY_CONDITION.Bigger) return USER.Opponent;
                    else return USER.Player;
                } else {
                    // 自分のナンバーが大きい
                    if (laneNode.victoryCondition === VICTORY_CONDITION.Bigger) return USER.Player;
                    else return USER.Opponent;
                }
            } else if (playerTotalNumber >= threshold && opponentTotalNumber < threshold) {
                // プレイヤーのみしきい値以上
                return USER.Player;
            } else if (playerTotalNumber < threshold && opponentTotalNumber >= threshold) {
                // 相手のみしきい値以上
                return USER.Opponent;
            } else {
                // 両者ともしきい値より小さい
                return USER.Empty;
            }
        } else if ((!laneNode.playerAttackPlace.isEmpty()) && laneNode.opponentAttackPlace.isEmpty()) {
            // プレイヤーのみアタックゾーンにモンスターがある
            if (laneNode.getTotalNumber(USER.Player) >= threshold) return USER.Player;
            else return USER.Empty;
        } else if (laneNode.playerAttackPlace.isEmpty() && (!laneNode.opponentAttackPlace.isEmpty())) {
            // 相手のみアタックゾーンにモンスターがある
            if (laneNode.getTotalNumber(USER.Opponent) >= threshold) return USER.Opponent;
            else return USER.Empty;
        } else {
            // 両者ともアタックゾーンにモンスターがない
            return USER.Empty;
        }
    }

    protected onLoad(): void {
        Events.target.on(Events.List.Judge, (): void => {
            this._startCalc();
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}