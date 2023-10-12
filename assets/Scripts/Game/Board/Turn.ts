/**
 * ターンを表す値オブジェクト
 */
 export default class  Turn {
    static readonly MIN_VALUE: number = 0;
    private _value: number;

    constructor(value: number) {
        if (value < Turn.MIN_VALUE) {
            throw new Error("ターンの初期値が不正です。");
        }
        this._value = value;
    }

    /**
     * ターンを取得する
     * @returns ターン
     */
    public get value(): number {
        return this._value;
    }

    /** ターンを追加する */
    public add(): Turn {
        this._value++;
        let addedTurn: number = this._value;
        return new Turn(addedTurn);
    }

    /** ターンをリセットする(0にもどす) */
    public reset(): Turn {
        this._value = 0;
        return new Turn(this._value);
    }
}
