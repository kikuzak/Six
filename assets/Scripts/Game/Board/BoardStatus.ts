import { MONSTER_KEY } from "../Monster/MonsterKey";
import OrbDealer from "../Orb/OrbDealer";
import LaneNode from "../Lane/LaneNode";
import Turn from "./Turn";
import Round from "./Round";
import Events from "../../Common/Events";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoardStatus extends cc.Component {
    @property(OrbDealer) orbDealer: OrbDealer= null;
    @property(LaneNode) lanes: LaneNode[] = [];

    private readonly _cardToUse: MONSTER_KEY[] = [
        MONSTER_KEY.Fairy,
        MONSTER_KEY.Ghost,
        MONSTER_KEY.Medusa,
        MONSTER_KEY.Centaur,
        MONSTER_KEY.Golem,
        MONSTER_KEY.Dragon
    ]

    private _round: Round;
    private _turn: Turn;
    private _playerHand: MONSTER_KEY[] = [];
    private _opponentHand: MONSTER_KEY[] = [];

    private _playerHands: MONSTER_KEY[];
    private _opponentHands: MONSTER_KEY[];

    public createJSON(): any {
        return {
            round: this.gameManager.round,
            turn: this.gameManager.round,
            deck: this.orbDealer.getDeckData(),
            discards: this.orbDealer.getDiscardsData(),
            boardOrbs: [this.lanes[0].getOrbData(), this.lanes[1].getOrbData(), this.lanes[2].getOrbData()],
            playerHands: [],
            playerAttacks: [this.lanes[0].playerAttackPlace.key, this.lanes[1].playerAttackPlace.key, this.lanes[2].playerAttackPlace.key],
            playerSupports: [this.lanes[0].playerSupportPlace.key, this.lanes[1].playerSupportPlace.key, this.lanes[2].playerSupportPlace.key],
            opponentAttacks: [this.lanes[0].opponentAttackPlace.key, this.lanes[1].opponentAttackPlace.key, this.lanes[2].opponentAttackPlace.key],
            opponentSupports: [this.lanes[0].opponentSupportPlace.key, this.lanes[1].opponentSupportPlace.key, this.lanes[2].opponentSupportPlace.key],
        }
    }

    private _resetHand(): void {
        this._playerHand = this._cardToUse;
        this._opponentHand = this._cardToUse;
    }

    protected onLoad(): void {
        Events.target.on(Events.List.StartRound, (addedRound: Round): void => {
            this._round = addedRound;
            this._resetHand();
        });
        Events.target.on(Events.List.StartTurn, (addedTurn: Turn): void => {
            this._turn = addedTurn;
        });
        
    }
}