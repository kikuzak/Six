/**
 * ラウンドを表す値オブジェクト
 */
export default class Round {
    static readonly MIN_VALUE: number = 0;
    private _value: number;

    constructor(value: number) {
        if (value < Round.MIN_VALUE) {
            throw new Error("ラウンドの初期値が不正です。");
        }
        this._value = value;
    }

    /**
     * ラウンドを取得する
     * @returns ラウンド
     */
    public get value(): number {
        return this._value;
    }

    /** ラウンドを追加する */
    public add(): Round {
        this._value++;
        let addedRound: number = this._value;
        return new Round(addedRound);
    }

    /** ラウンドをリセットする */
    public reset(): Round {
        this._value = 0;
        return new Round(this._value);
    }
}
