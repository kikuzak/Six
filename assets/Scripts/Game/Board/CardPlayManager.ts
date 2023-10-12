import Events from "../../Common/Events";
import MyGs2 from "../../Common/Gs2/MyGs2";
import Message from "gs2/chat/model/Message";
import { GAME_MODE } from "../Common/GameConst";
import GameSetting from "../Common/GameSetting";
import PlayerHandDealer from "../Hand/PlayerHandDealer";
import { LANE_TYPE } from "../Lane/LaneType";
import { MONSTER_KEY } from "../Monster/MonsterKey";
import { PLACE_TYPE } from "../Place/PlaceType";
import PlayCard from "./PlayCard";
import { AUDIO_TYPE, CHAT_CATEGORY } from "../../Common/SystemConst";
import { PlayerData } from "../../Common/UserData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardPlayManager extends cc.Component {

    @property(PlayerHandDealer) playerHandDealer: PlayerHandDealer = null;

    private _selectedCardKey: MONSTER_KEY = null;
    private _selectedLaneType: LANE_TYPE = null;
    private _selectedPlaceType: PLACE_TYPE = null;

    private _playerPlayCard: PlayCard = null;
    private _opponentPlayCard: PlayCard = null;

    private _initialize(): void {
        this._playerPlayCard = null;
        this._opponentPlayCard = null;
        this._selectedCardKey = null;
        this._selectedLaneType = null;
        this._selectedPlaceType = null;
    }

    /** 自分の選択が解除された */
    private _deselect(): void {
        this._playerPlayCard = null;
        this._selectedCardKey = null;
        this._selectedLaneType = null;
        this._selectedPlaceType = null;
    }

    /** プレイヤーのプレイカードを作成 */
    private _createPlayerPlayCard(): void {
        if (this._selectedCardKey === null || this._selectedLaneType === null || this._selectedPlaceType === null) {
            console.error("カードプレイエラー:不正な値");
        }
        this._playerPlayCard = new PlayCard(this._selectedCardKey, this._selectedLaneType, this._selectedPlaceType);
        if (GameSetting.gameMode !== GAME_MODE.Cpu) PlayerData.profile.addCardUse(this._playerPlayCard);
        if (GameSetting.gameMode === GAME_MODE.Friend) MyGs2.postPlayCard(this._playerPlayCard.createJSON());
        if (this._check()) this._play();
    }

    /** 相手のプレイカードを受け取る */
    public receiveOpponentPlayCard(playCard: PlayCard): void {
        this._opponentPlayCard = playCard;
        if (this._check()) this._play();
    }

    /** 両者のプレイカードが揃っているかチェックする */
    private _check(): boolean {
        if (this._playerPlayCard !== null && this._opponentPlayCard !== null) return true;
        else return false;
    }

    /** カードをプレイする */
    private async _play(): Promise<void> {
        await this.playerHandDealer.remove(this._playerPlayCard.key);
        this.playerHandDealer.align();
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_CardPlay);
        Events.target.emit(Events.List.PlayCard, this._playerPlayCard, this._opponentPlayCard);
    }

    protected onLoad(): void {
        // 手札が選択された
        Events.target.on(Events.List.SelectHand, (key: MONSTER_KEY): void => {
            this._selectedCardKey = key;
        });
        // 手札が選択解除された
        Events.target.on(Events.List.DeselectHand, (): void => {
            this._selectedCardKey = null;
        });
        // プレイスが選択された
        Events.target.on(Events.List.SelectPlace, (laneType: LANE_TYPE, placeType: PLACE_TYPE): void => {
            this._selectedLaneType = laneType;
            this._selectedPlaceType = placeType;
        });
        // プレイスが選択解除された
        Events.target.on(Events.List.DeselectPlace, (): void => {
            this._deselect();
        });
        // 出すカードが決定した
        Events.target.on(Events.List.EnterCard, (): void => {
            cc.log("Player decided Card.");
            this._createPlayerPlayCard();
        });
        // 相手の出すカードを受け取った
        Events.target.on(Events.List.GetMessage, (message: Message): void => {
            if (message.getCategory() !== CHAT_CATEGORY.PlayCard) return;
            let playCard: PlayCard = new PlayCard(MONSTER_KEY.Empty, LANE_TYPE.Empty, PLACE_TYPE.Empty);
            playCard.parseJSON(JSON.parse(message.getMetadata()));
            this.receiveOpponentPlayCard(playCard);
        }, this.node);
        // ターン終了
        Events.target.on(Events.List.EndTurn, (): void => {
            this._initialize();
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}