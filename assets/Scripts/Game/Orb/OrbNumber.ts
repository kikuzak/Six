export default class OrbNumber {
    static readonly MIN_VALUE: number = 1;
    static readonly MAX_VALUE: number = 8;
    static readonly EMPTY: OrbNumber = new OrbNumber(null);

    private readonly _value: number = null;

    get value(): number {
        return this._value;
    }

    constructor(value: number) {
        if (value === null) return; // emptyの生成
        else if (value < OrbNumber.MIN_VALUE) console.error("OrbNumber初期化エラー:最小値より小さい値");
        else if (value > OrbNumber.MAX_VALUE) console.error("OrbNumber初期化エラー:最大値より大きい値");

        this._value = value;
    }

    /**
     * 引数と同じ値か調べる
     * @param orbNumber - 比較対象のOrbNumber
     * @returns - 同じならtrue
     */
    public equal(orbNumber: OrbNumber): boolean {
        if (this._value === orbNumber.value) return true;
        else return false;
    }

    /**
     * 引数より大きいか調べる
     * @param orbNumber 
     * @returns - 大きければtrue
     */
    public isBiggerThan(orbNumber: OrbNumber): boolean {
        if (this._value > orbNumber.value) return true;
        else return false;
    }
}