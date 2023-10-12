import Events from "../../Common/Events";
import { AUDIO_TYPE, USER } from "../../Common/SystemConst";
import PlayCard from "../Board/PlayCard";
import { LANE_TYPE } from "../Lane/LaneType";
import { MONSTER_KEY } from "../Monster/MonsterKey";
import SkillTarget from "../Skill/SkillTarget";
import MonsterPlaceNode from "./MonsterPlaceNode";
import { PLACE_TYPE } from "./PlaceType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MonsterPlaceDealer extends cc.Component {

    @property(MonsterPlaceNode) playerAttackPlaces: MonsterPlaceNode[] = [];
    @property(MonsterPlaceNode) playerSupportPlaces: MonsterPlaceNode[] = [];
    @property(MonsterPlaceNode) opponentAttackPlaces: MonsterPlaceNode[] = [];
    @property(MonsterPlaceNode) opponentSupportPlaces: MonsterPlaceNode[] = [];
    
    private _enablePlaces(key: MONSTER_KEY): void {
        // いったんすべて選択不可能にする
        for (let i: number = 0; i < this.playerSupportPlaces.length; i++) {
            this.playerSupportPlaces[i].disable();
            this.playerAttackPlaces[i].disable();
        }

        switch(key) {
            case MONSTER_KEY.Dragon:
                for (let i: number = 0; i < this.playerSupportPlaces.length; i++) {
                    if (!this.playerSupportPlaces[i].isEmpty()) continue;
                    if (this.playerAttackPlaces[i].isEmpty()) this.playerAttackPlaces[i].enable();
                }
                break;

            default:
                for (let i: number = 0; i < this.playerSupportPlaces.length; i++) {
                    // アタックゾーンは空であればすべて置くことができる
                    if (this.playerAttackPlaces[i].isEmpty()) this.playerAttackPlaces[i].enable();

                    if (this.playerSupportPlaces[i].isEmpty()) {
                        // ドラゴンがないサポートゾーンには置くことができる
                        if (!this.playerAttackPlaces[i].isEmpty() && this.playerAttackPlaces[i].key === MONSTER_KEY.Dragon) continue;
                        this.playerSupportPlaces[i].enable();
                    }
                }
                break;
        }
    }

    private _disablePlaces(): void {
        for (let i: number = 0; i < this.playerSupportPlaces.length; i++) {
            this.playerSupportPlaces[i].disable();
            this.playerAttackPlaces[i].disable();
        }
    }

    private _selectPlace(laneType: LANE_TYPE, placeType: PLACE_TYPE): void {
        switch (placeType) {
            case PLACE_TYPE.PlayerAttack:
                this.playerAttackPlaces[laneType - 1].select();
                break;
            case PLACE_TYPE.PlayerSupport:
                this.playerSupportPlaces[laneType - 1].select();
                break;
        }
    }

    /** 場に出ているカードを返す */
    public getLayoutsAsSkillTarget(): SkillTarget[] {
        let res: SkillTarget[] = [];
        for (let i: number = 0; i < this.playerSupportPlaces.length; i++) {
            if (!this.playerSupportPlaces[i].isEmpty()) {
                res.push(new SkillTarget(
                    this.playerSupportPlaces[i].layoutNode.key,
                    this.playerSupportPlaces[i].laneType,
                    USER.Player)
                )
            }
            if (!this.opponentSupportPlaces[i].isEmpty()) {
                res.push(new SkillTarget(
                    this.opponentSupportPlaces[i].layoutNode.key,
                    this.opponentSupportPlaces[i].laneType,
                    USER.Opponent)
                )
            }
        }
        return res;
    }

    public async removeAll(): Promise<void> {
        for (let i: number = 0; i < 3; i++) {
            if (!this.playerAttackPlaces[i].isEmpty()) this.playerAttackPlaces[i].remove();
            if (!this.playerSupportPlaces[i].isEmpty()) this.playerSupportPlaces[i].remove();
            if (!this.opponentAttackPlaces[i].isEmpty()) this.opponentAttackPlaces[i].remove();
            if (!this.opponentSupportPlaces[i].isEmpty()) this.opponentSupportPlaces[i].remove();
        }
    }

    /** カードをプレイする */
    public async play(playerPlayCard: PlayCard, opponentPlayCard: PlayCard): Promise<void> {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_CardPlay);
        let playerPlace: MonsterPlaceNode;
        if (playerPlayCard.placeType === PLACE_TYPE.PlayerAttack) playerPlace = this.playerAttackPlaces[playerPlayCard.laneType - 1];
        else playerPlace = this.playerSupportPlaces[playerPlayCard.laneType - 1];
        playerPlace.put(playerPlayCard.key);

        let opponentPlace: MonsterPlaceNode;
        if (opponentPlayCard.placeType === PLACE_TYPE.OpponentAttack) opponentPlace = this.opponentAttackPlaces[opponentPlayCard.laneType - 1];
        else opponentPlace = this.opponentSupportPlaces[opponentPlayCard.laneType - 1];
        await opponentPlace.put(opponentPlayCard.key);
    }

    protected onLoad(): void {
        // 手札が選択された
        Events.target.on(Events.List.SelectHand, (key: MONSTER_KEY): void => {
            this._enablePlaces(key);
        }, this.node);
        // 手札が選択解除された
        Events.target.on(Events.List.DeselectHand, (): void => {
            this._disablePlaces();
        }, this.node);
        // 場が選択された
        Events.target.on(Events.List.SelectPlace, (laneType: LANE_TYPE, placeType: PLACE_TYPE): void => {
            this._disablePlaces();
            this._selectPlace(laneType, placeType);
        }, this.node);
        // 場が選択解除された
        Events.target.on(Events.List.DeselectPlace, (): void => {
            this._disablePlaces();
        }, this.node);
        // カードプレイ
        Events.target.on(Events.List.PlayCard, (): void => {
            this._disablePlaces();
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}