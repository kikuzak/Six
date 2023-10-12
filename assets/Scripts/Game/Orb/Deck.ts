import OrbColor from "./OrbColor";
import { ORB_COLOR_KEY } from "./OrbColorKey";
import OrbData from "./OrbData";
import OrbNumber from "./OrbNumber";

export default class Deck {
    static readonly MIN_COUNT: number = 0;
    static readonly MAX_COUT: number = 24;

    private _orbs: OrbData[];

    get orbs(): OrbData[] {
        return this._orbs;
    }

    set orbs(orbs: OrbData[]) {
        this._orbs = orbs;
    }

    constructor() {
        this._orbs = new Array();

        for (let i: number = 1; i <= OrbNumber.MAX_VALUE; i++) {
            if (i % 2 === 1) {
                let redOrb: OrbData = new OrbData(i, ORB_COLOR_KEY.Red);
                let blueOrb: OrbData = new OrbData(i, ORB_COLOR_KEY.Blue);
                let greenOrb: OrbData = new OrbData(i, ORB_COLOR_KEY.Green);
                this._orbs.push(redOrb, blueOrb, greenOrb);
            } else if (i % 2 == 0) {
                let purpleOrb: OrbData = new OrbData(i, ORB_COLOR_KEY.Purple);
                let whiteOrb: OrbData = new OrbData(i, ORB_COLOR_KEY.White);
                let yellowOrb: OrbData = new OrbData(i, ORB_COLOR_KEY.Yellow);
                this._orbs.push(purpleOrb, whiteOrb, yellowOrb);
            } else {
                throw new Error("Deck初期化エラー:ナンバーが不正です");
            }
        }

        if (Deck.MAX_COUT < this._orbs.length) {
            throw new Error("Deck初期化エラー:デッキの枚数が多すぎます");
        }
        if (this._orbs.length < Deck.MIN_COUNT) {
            throw new Error("Deck初期化エラー:デッキの枚数が0枚未満です");
        }
        this.shuffle();
    }

    /**
     * 山札からカードを1枚引く
     * @returns - 山札の一番上(配列の先頭)のOrbData
     */
    public draw(): OrbData {
        if (this._orbs.length <= 0) {
            return null;
        } else {
            let drawnOrbData: OrbData = this._orbs.shift();
            return drawnOrbData;
        }
    }

    /**
     * 山札をシャッフルする
     */
    public shuffle(): void {
        for(let i = this._orbs.length - 1; i > 0; i--){
            let r = Math.floor(Math.random() * (i + 1));
            let tmp = this._orbs[i];
            this._orbs[i] = this._orbs[r];
            this._orbs[r] = tmp;
        }
    }

    /** 山札を送信するためにJSON化する */
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

    /** GS2から取得したデータを解析する */
    public parseJSON(deckData: OrbType[]): void {
        let res: OrbData[] = [];
        for (let i: number = 0; i < deckData.length; i++) {
            let item: OrbData = new OrbData(deckData[i].number, deckData[i].color as ORB_COLOR_KEY);
            res.push(item);
        }
        this._orbs = res;
    }
}

export type OrbType = {
    color: number;
    number: number;
}