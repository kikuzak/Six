import { Message } from "gs2/chat/model";
import Events from "../../Common/Events";
import MyGs2 from "../../Common/Gs2/MyGs2";
import { CHAT_CATEGORY, USER_ROLE } from "../../Common/SystemConst";
import { PlayerData } from "../../Common/UserData";
import { GAME_MODE } from "../Common/GameConst";
import GameSetting from "../Common/GameSetting";
import { LANE_TYPE } from "../Lane/LaneType";
import orbPlaceNode from "../Place/OrbPlaceNode";
import Deck, { OrbType } from "./Deck";
import Discards from "./Discards";
import OrbData from "./OrbData";
import OrbNode from "./OrbNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OrbDealer extends cc.Component {

    @property(orbPlaceNode) leftOrbPlace: orbPlaceNode = null;
    @property(orbPlaceNode) centerOrbPlace: orbPlaceNode = null;
    @property(orbPlaceNode) rightOrbPlace: orbPlaceNode = null;
    @property(cc.Node) deckNode: cc.Node = null;
    @property(cc.Prefab) orbPrefab: cc.Prefab = null;

    private _deck: Deck;
    private _discards: Discards;
    private _stackingLane: LANE_TYPE;
    private _stackingResolve: ()=>void;

    public setup(): void {
        this._deck = new Deck();
        this._discards = new Discards();
    }

    public async deal(): Promise<void> {
        cc.log("---------- ORB DEAL");
        await this.put(LANE_TYPE.Left);
        await this.put(LANE_TYPE.Center);
        await this.put(LANE_TYPE.Right);
        // this.put(LANE_TYPE.Left);
        // this.put(LANE_TYPE.Center);
        // this.put(LANE_TYPE.Right);
    }

    /**　1つのオーブをプレイスに置く */
    public async put(type: LANE_TYPE): Promise<void> {
        // オーブを引く
        let drawedOrb: OrbData = this._deck.draw();
        cc.log(drawedOrb);
        if (drawedOrb === null) {
            this._stackingLane = type;
            // 山札がなくなった場合、デッキを新たに作成し、reputする
            if (PlayerData.userRole === USER_ROLE.Host) {
                this._deck = new Deck();
                if (GameSetting.gameMode === GAME_MODE.Friend) MyGs2.repostDeck(this.getDeckData());
                await this.put(this._stackingLane);
                this._stackingLane = null;
            } else {
                return new Promise((resolve): void => {
                    this._stackingResolve = resolve;
                });
            }
            return;
        }

        Events.target.emit(Events.List.DealOrb, type, drawedOrb);
        // デッキ位置へ置く
        let orbNode: cc.Node = cc.instantiate(this.orbPrefab);
        let con: OrbNode = orbNode.getComponent(OrbNode);
        con.setup(drawedOrb);
        con.faceDown();
        this.deckNode.addChild(orbNode);
        await con.turn();
        await con.remove();

        // オーブ位置へ置く
        if (type === LANE_TYPE.Left) {
            await this.leftOrbPlace.put(drawedOrb);
        } else if (type === LANE_TYPE.Center) {
            await this.centerOrbPlace.put(drawedOrb);
        } else if (type === LANE_TYPE.Right) {
            await this.rightOrbPlace.put(drawedOrb);
        }

        this._stackingLane = null;
    }
    
    /** 1つのオーブを取り除く */
    public async remove(type: LANE_TYPE): Promise<void> {
        let removedOrbData: OrbData;
        switch (type) {
            case LANE_TYPE.Left:
                removedOrbData = await this.leftOrbPlace.remove();
                break;
            case LANE_TYPE.Center:
                removedOrbData = await this.centerOrbPlace.remove();
                break;
            case LANE_TYPE.Right:
                removedOrbData = await this.rightOrbPlace.remove();
                break;
        }
        this._discards.add(removedOrbData);
    }

    public async removeAll(): Promise<void> {
        if (!this.leftOrbPlace.isEmpty()) this.remove(LANE_TYPE.Left);
        if (!this.centerOrbPlace.isEmpty()) this.remove(LANE_TYPE.Center);
        if (!this.rightOrbPlace.isEmpty()) this.remove(LANE_TYPE.Right);
    }

    public getDeckData(): OrbType[] {
        return this._deck.createJSON();
    }

    public setDeckData(deckData: string): void {
        this._deck.parseJSON(JSON.parse(deckData));
    }

    public getDiscardsData(): OrbType[] {
        return this._discards.createJSON();
    }

    public async reput(): Promise<void> {
        await this.put(this._stackingLane);
        this._stackingResolve();
        this._stackingLane = null;
        this._stackingResolve = null;
    }

    protected onLoad(): void {
        // メッセージを受け取る
        Events.target.on(Events.List.GetMessage, (message: Message): void => {
            if (message.getCategory() === CHAT_CATEGORY.ReDeck as number) {
                this.setDeckData(message.getMetadata());
                this.reput();
            }
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}