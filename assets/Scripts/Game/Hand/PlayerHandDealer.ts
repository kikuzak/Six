import Events from "../../Common/Events";
import { MONSTER_KEY } from "../Monster/MonsterKey";
import HandNode from "./HandNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerHandDealer extends cc.Component {

    @property(cc.Prefab) handPrefab: cc.Prefab = null;

    private readonly _cardToUse: MONSTER_KEY[] = [
        MONSTER_KEY.Fairy,
        MONSTER_KEY.Ghost,
        MONSTER_KEY.Medusa,
        MONSTER_KEY.Centaur,
        MONSTER_KEY.Golem,
        MONSTER_KEY.Dragon
    ]

    private _hands: HandNode[] = [];

    get count(): number {
        return this._hands.length;
    }

    public getHand(index: number): HandNode {
        return this._hands[index];
    }

    public async deal(): Promise<void> {
        for (let i = 0; i < this._cardToUse.length; i++) {
            setTimeout((): void => {
                this.add(this._cardToUse[i]);
                this.align();
            },
            100 * i)
        }
    }

    public add(key: MONSTER_KEY): void {
        // 加える位置(左から)を取得
        let indexFromLeft: number = this._hands.length;

        // インスタンスを作成
        let handNode: cc.Node = cc.instantiate(this.handPrefab);
        let hand: HandNode = handNode.getComponent(HandNode);
        hand.setup(key, indexFromLeft, this._hands.length);
        hand.locate(indexFromLeft, this._hands.length);
        this.node.addChild(handNode);
        this._hands.push(hand);
        hand.move();
    }

    /** 手札からカードを1枚除く */
    public remove(key: MONSTER_KEY): void {
        let removeIndex: number = this._hands.findIndex((v) => v.key === key);
        let handToRemove: HandNode = this._hands[removeIndex];
        handToRemove.remove();
        this._hands.splice(removeIndex, 1);
    }

    public removeAll(): void {
        for (let i: number = 0; i < this._hands.length; i++) {
            this._hands[i].remove();
        }
        this._hands = [];
    }

    /** 手札を整列する */
    public align(): void {
        for (let i = 0; i < this._hands.length; i++) {
            this._hands[i].locate(i, this._hands.length);
            this._hands[i].move();
        }
    }
}