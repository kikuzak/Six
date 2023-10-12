/**
 * スコアを表す値オブジェクト
 */
 export default class TotalPoint {

    static readonly MIN_VALUE: number = 0;

    private _value: number;

    get value(): number {
        return this._value;
    }

    constructor(value: number) {
        if (value < TotalPoint.MIN_VALUE) {
            console.error("TotalPoint初期化エラー:不正な値");
        }
        this._value = value;
    }

    public add(value: number): TotalPoint {
        this._value += value;
        return new TotalPoint(this._value);
    }

    /**
     * 比較対象と同値か調べる
     * @param totalPoint - 比較対象のTotalPoint
     */
    public equal(totalPoint: TotalPoint): boolean {
        if (this._value === totalPoint.value) return true;
        else return false;
    }

    /**
     * 比較対象より大きいか調べる
     * @param totalPoint - 比較対象のTotalPoint
     */
    public isBiggerThan(totalPoint: TotalPoint): boolean {
        if (this._value > totalPoint.value) return true;
        else return false;
    }
}
