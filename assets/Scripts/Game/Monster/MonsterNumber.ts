export default class MonsterNumber {
    static readonly EMPTY: MonsterNumber = new MonsterNumber(null);
    static readonly MIN_VALUE: number = 1;
    static readonly MAX_VALUE: number = 99;

    private readonly _value: number;

    public get value(): number {
        return this._value;
    }

    constructor(value: number) {
        if (value === null) return; // EMPTYの生成
        else if (value < MonsterNumber.MIN_VALUE) console.error("MonsterNumber初期化エラー:最小値より小さい値");
        else if (value > MonsterNumber.MAX_VALUE) console.error("MonsterNumber初期化エラー:最大値より大きい値");

        this._value = value;
    }

    /**
     * 引数と同じ値か調べる
     * @param monterNumber
     * @returns - 同じならtrue
     */
    public equal(monsterNumber: MonsterNumber): boolean {
        if (this._value === monsterNumber.value) return true;
        else return false;
    }

    /**
     * 引数より大きいか調べる
     * @param orbNumber 
     * @returns - 大きければtrue
     */
    public isBiggerThan(monsterNumber: MonsterNumber): boolean {
        if (this._value > monsterNumber.value) return true;
        else return false;
    }
}