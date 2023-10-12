import { OrbType } from "./Deck";
import OrbData from "./OrbData";

export default class Discards {
    static readonly MIN_COUNT: number = 0;
    static readonly MAX_COUNT: number = 1000;

    private _orbs: OrbData[];

    constructor() {
        this._orbs = [];
    }

    /**
     * 捨て札にカードを追加する
     * @param addedOrb 追加するオーブ
     */
    public add(addedOrb: OrbData): void {
        if (Discards.MAX_COUNT <= this._orbs.length) {
            console.log("これ以上捨て札にカードを追加できません");
            return;
        }
        this._orbs.push(addedOrb);
    }

    /** 捨て札をシャッフルしてすべて取り出す */
    public removeAll(): OrbData[] {
        this.shuffle();
        let orbs: OrbData[] = this._orbs.splice(0);
        return orbs;
    }

    /** 捨札を送信するためにJSON化する */
    public createJSON(): OrbType[] {
        let res: OrbType[] = [];
        for (let i: number = 0; i < this._orbs.length; i++) {
            let data: OrbType = {
                color: this._orbs[i].color.key as number,
                number: this._orbs[i].number.value
            }
            res.push(data);
        }
        return res;
    }

    /**
     * 捨て札をシャッフルする
     */
    public shuffle(): void {
        for(let i = this._orbs.length - 1; i > 0; i--){
            let r = Math.floor(Math.random() * (i + 1));
            let tmp = this._orbs[i];
            this._orbs[i] = this._orbs[r];
            this._orbs[r] = tmp;
        }
    }
}