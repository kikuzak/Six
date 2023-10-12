import Events from "../../Common/Events";
import { USER } from "../../Common/SystemConst";
import CardPlayManager from "../Board/CardPlayManager";
import PlayCard from "../Board/PlayCard";
import { GAME_MODE } from "../Common/GameConst";
import GameSetting from "../Common/GameSetting";
import { MONSTER_KEY } from "../Monster/MonsterKey";
import MonsterPlaceNode from "../Place/MonsterPlaceNode";
import { PLACE_TYPE } from "../Place/PlaceType";

const {ccclass, property} = cc._decorator;

/**
 * とりあえず全部仮実装
 */
@ccclass
export default class Cpu extends cc.Component {

    @property(CardPlayManager) cardPlayManager: CardPlayManager = null;
    @property(MonsterPlaceNode) attackPlaces: MonsterPlaceNode[] = [];
    @property(MonsterPlaceNode) supportPlaces: MonsterPlaceNode[] = [];

    private readonly cardToUse: MONSTER_KEY[] = [
        MONSTER_KEY.Fairy,
        MONSTER_KEY.Ghost,
        MONSTER_KEY.Medusa,
        MONSTER_KEY.Centaur,
        MONSTER_KEY.Golem,
        MONSTER_KEY.Dragon
    ];
    private _hands: MONSTER_KEY[] = [];

    start() {
        this.deal();
    }

    public add(key: MONSTER_KEY): void {
        this._hands.push(key);
    }

    public deal(): void {
        this._hands = [];
        for (let i = 0; i < this.cardToUse.length; i++) {
            this._hands.push(this.cardToUse[i]);
        }
    }

    public remove(): MONSTER_KEY {
        let index: number = Math.floor(Math.random() * this._hands.length);
        let key: MONSTER_KEY = this._hands.splice(index, 1)[0];
        return key;
    }

    private _playCard(): void {
        // ランダムで出す場所を決める
        let laneIndex: number = Math.floor(Math.random() * 3);
        let placeIndex: number = Math.floor(Math.random() * 2);
        let place: MonsterPlaceNode;
        if (placeIndex === 0) place = this.attackPlaces[laneIndex];
        else place = this.supportPlaces[laneIndex];
        if (!place.isEmpty()) {
            // 出す場所が空いていなかったらそもそも出せない
            this._playCard();
            return;
        }

        // ランダムで出すカードを決める
        let handIndex: number = Math.floor(Math.random() * this._hands.length);
        let key: MONSTER_KEY = this._hands[handIndex];
        
        if (key === MONSTER_KEY.Dragon) {
            // 出すカードがドラゴンのとき
            if (place.placeType === PLACE_TYPE.OpponentSupport) {
                // サポートゾーンには出せない
                this._playCard();
                return;
            } else {
                if (!this.supportPlaces[laneIndex].isEmpty()) {
                    // サポートゾーンが空いていなければ出せない
                    this._playCard();
                    return;
                }
            }
        } else {
            // ドラゴン以外のとき
            if (place.placeType === PLACE_TYPE.OpponentSupport) {
                if (!this.attackPlaces[laneIndex].isEmpty() && this.attackPlaces[laneIndex].key === MONSTER_KEY.Dragon) {
                    // アタックゾーンにドラゴンがいたら出せない
                    this._playCard;
                    return;
                } 
            }
        }
        let playCard: PlayCard = new PlayCard(key, place.laneType, place.placeType);
        this.cardPlayManager.receiveOpponentPlayCard(playCard);
        cc.log("CPU decided Card.");
        this._hands.splice(handIndex, 1);
    }

    public useFairy(): void {
        cc.tween(this.node)
        .delay(3)
        .call((): void => {
            let randomNum: number = Math.floor(Math.random() * 6);
            let targetKey: MONSTER_KEY = this.cardToUse[randomNum];
            Events.target.emit(Events.List.Fairy, targetKey);
        })
        .start();
    }

    protected onLoad(): void {
        // ---------- Custom Events ----------
        Events.target.on(Events.List.StartRound, (): void => {
            if (GameSetting.gameMode !== GAME_MODE.Cpu) return;
            this._hands = [];
            this.deal();
        }, this.node);
        Events.target.on(Events.List.StartTurn, (): void => {
            if (GameSetting.gameMode !== GAME_MODE.Cpu) return;
            this._playCard();
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}
