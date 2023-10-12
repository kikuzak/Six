import PlayCard from "../Game/Board/PlayCard";
import { MONSTER_KEY } from "../Game/Monster/MonsterKey";
import MonsterName from "../Game/Monster/MonsterName";

export default class Profile {

    /** 名前 */
    private _name: string;
    /** アイコンのキー */
    private _icon: MONSTER_KEY;

    // ----- データ -----
    /** 通算バトル数 */
    private _match: number;
    /** 通算勝利数 */
    private _win: number;
    /** 通算敗北数 */
    private _defeat: number;
    /** 通算引き分け数 */
    private _draw: number;
    /** 現在の連勝数 */
    private _consectiveWin: number;
    /** 現在の連敗数 */
    private _consectiveDefeat: number;
    /** 最多連勝数 */
    private _mostConsectiveWin: number;
    /** 最多連敗数 */
    private _mostConsectiveDefeat: number;
    /** 最多獲得オーブ枚数 */
    private _mostObtainedOrb: number;
    /** 最多獲得ポイント数 */
    private _mostPoint: number;

    // ----- プレイ傾向 -----
    /** カード使用回数 */
    private _cardUseNum: number[] = [];
    /** 1ターン目使用率1位のカード */
    private _mostUsedCardAtFirstTurn: number;
    /** アタックゾーンに置いた数 */
    private _putAttack: number;
    /** サポートゾーンに置いた数 */
    private _putSupport: number;

    // ----- 実績 -----
    /** 2ラウンドで勝利 */
    private _twoRoundWin: number;
    /** フェアリーでドラゴンを翻弄 */
    private _applyFairyToDragon: number;
    /** メドューサでドラゴンを石化 */
    private _applyMedusaToDragon: number;
    /** 10連勝した数 */
    private _tenConsectiveWin: number;
    /** 10連敗した数 */
    private _tenConsectiveDefeat: number;
    /** 完封勝利（相手が0ptでの勝利） */
    private _shutOut: number;
    /** 合計100勝 */
    private _hundredWin: number;
    /** １ラウンドで３つのオーブを獲得 */
    private _takeAll: number;
    /** １ゲームで20ポイント以上獲得 */
    private _bigScore: number;

    constructor() {
        this._name = "";
        this._icon = MONSTER_KEY.Fairy;
        this._match = 0;
        this._win = 0;
        this._defeat = 0;
        this._draw = 0;
        this._consectiveWin = 0;
        this._consectiveDefeat = 0;
        this._mostConsectiveWin = 0;
        this._mostConsectiveDefeat = 0;
        this._mostObtainedOrb = 0;
        this._mostPoint = 0;

        this._cardUseNum = [0, 0, 0, 0, 0, 0];
        this._mostUsedCardAtFirstTurn = 0;
        this._putAttack = 0;
        this._putSupport = 0;

        this._twoRoundWin = 0;
        this._applyFairyToDragon = 0;
        this._applyMedusaToDragon = 0;
        this._tenConsectiveWin = 0;
        this._tenConsectiveDefeat = 0;
        this._shutOut = 0;
        this._hundredWin = 0;
        this._takeAll = 0;
        this._bigScore = 0;
    }

    public get contentData(): ProfileContent[] {
        return [
            {key: "通算バトル数", value: this._match, unit: "回"},
            {key: "通算勝利数", value: this._win, unit: "回"},
            {key: "通算敗北数", value: this._defeat, unit: "回"},
            {key: "通算引き分け数", value: this._draw, unit: "回"},
            {key: "勝率", value: this._winRate, unit: "%"},
            {key: "現在の連勝数", value: this._consectiveWin, unit: "回"},
            {key: "現在の連敗数", value: this._consectiveDefeat, unit: "回"},
            {key: "最多連勝", value: this._mostConsectiveWin, unit: "回"},
            {key: "最多連敗", value: this._mostConsectiveDefeat, unit: "回"},
            {key: "最多獲得\nオーブ枚数", value: this._mostObtainedOrb, unit: "枚"},
            {key: "最多獲得\nポイント数", value: this._mostPoint, unit: "点"},
        ]
    }

    public get contentTendency(): ProfileContent[] {
        return [
            {key: "フェアリー\n使用回数", value: this._cardUseNum[0], unit: "回"},
            {key: "ゴースト\n使用回数", value: this._cardUseNum[1], unit: "回"},
            {key: "メドゥーサ\n使用回数", value: this._cardUseNum[2], unit: "回"},
            {key: "ケンタウロス\n使用回数", value: this._cardUseNum[3], unit: "回"},
            {key: "ゴーレム\n使用回数", value: this._cardUseNum[4], unit: "回"},
            {key: "ドラゴン\n使用回数", value: this._cardUseNum[5], unit: "回"},
            {key: "最多使用カード", value: this._mostUsedCard},
            {key: "最小使用カード", value: this._leastUsedCard},
            // {key: "１ターン目の使用率\n１位のカード", value: this._leastUsedCard},
            {key: "アタック率", value: this._attackRate, unit: "%"},
            {key: "サポート率", value: this._supportRate, unit: "%"},
        ]
    }

    public get contentAchievement(): ProfileContent[] {
        return [
            {key: "２ラウンドで勝利", value: this._twoRoundWin, unit: "回"},
            {key: "フェアリーで\nドラゴンを翻弄", value: this._applyFairyToDragon, unit: "回"},
            {key: "メドューサで\nドラゴンを石化", value: this._applyMedusaToDragon, unit: "回"},
            {key: "10連勝", value: this._tenConsectiveWin, unit: "回"},
            {key: "10連敗", value: this._tenConsectiveDefeat, unit: "回"},
            {key: "完封勝利\n（相手が0ptでの勝利）", value: this._shutOut, unit: "回"},
            {key: "合計100勝", value: this._hundredWin, unit: "回"},
            {key: "１ラウンドで３つの\nオーブを獲得", value: this._takeAll, unit: "回"},
            {key: "1ゲームで20ポイント\n以上を獲得", value: this._bigScore, unit: "回"},
        ]
    }

    /** 勝率(小数点以下切り捨て) */
    private get _winRate(): number {
        if (this._match === 0) return 0;
        else return Math.floor(this._win / this._match * 100);
    }

    /** 最多使用カード */
    private get _mostUsedCard(): MONSTER_KEY {
        let value: number = -1;
        let index: number = 0;
        for (let i: number = 0; i < this._cardUseNum.length; i++) {
            if (this._cardUseNum[i] > value) {
                value = this._cardUseNum[i];
                index = i + 1;
            }
        }
        return index as MONSTER_KEY;
    }

    /** 最小使用カード */
    private get _leastUsedCard(): MONSTER_KEY {
        let value: number = Number.MAX_SAFE_INTEGER;
        let index: number = 0;
        for (let i: number = 0; i < this._cardUseNum.length; i++) {
            if (this._cardUseNum[i] < value) {
                value = this._cardUseNum[i];
                index = i + 1;
            }
        }
        return index as MONSTER_KEY;
    }

    /** アタック率 */
    private get _attackRate(): number {
        if (this._match === 0) return 0;
        else return Math.floor(this._putAttack / (this._putAttack + this._putSupport) * 100);
    }

    /** サポート率 */
    private get _supportRate(): number {
        if (this._match === 0) return 0;
        else return Math.floor(this._putSupport / (this._putAttack + this._putSupport) * 100);
    }

    // ---------- 外部から操作するもの ---------

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get icon(): MONSTER_KEY {
        return this._icon;
    }

    public set icon(value: MONSTER_KEY) {
        this._icon = value;
    }

    /** 勝利時の処理 */
    public addWin(): void {
        // マッチ数と勝利数
        this._match++;
        this._win++;
        // 連勝・連敗(実績含む)
        this._consectiveWin++;
        if (this._consectiveWin % 10 === 0) this._tenConsectiveWin++;
        if (this._consectiveDefeat > 0) this._consectiveDefeat = 0;
        if (this._consectiveWin > this._mostConsectiveWin) this._mostConsectiveWin = this._consectiveWin;
        if (this._win % 100 === 0) this._hundredWin++;
    }

    /** 敗北時の処理 */
    public addDefeat(): void {
        this._match++;
        this._defeat++;
        // 連勝・連敗(実績含む)
        this._consectiveDefeat++;
        if (this._consectiveDefeat % 10 === 0) this._tenConsectiveDefeat++;
        if (this._consectiveWin > 0) this._consectiveWin = 0;
        if (this._consectiveDefeat > this._mostConsectiveDefeat) this._mostConsectiveDefeat = this._consectiveDefeat;
    }

    /** 引き分け時の処理 */
    public addDraw(): void {
        this._match++;
        this._draw++
        this._consectiveWin = 0;
        this._consectiveDefeat = 0;
    }

    /** 最多獲得ポイント数を更新 */
    public updateMostPoint(totalPoint: number): void {
        if (totalPoint > this._mostPoint) this._mostPoint = totalPoint;
        cc.log(`Data: Most Point update ${this._mostPoint}`);
    }

    /** 最多獲得オーブ枚数を更新 */
    public updateMostObtainedOrb(obtainedOrbNum: number): void {
        if (obtainedOrbNum > this._mostObtainedOrb) this._mostObtainedOrb = obtainedOrbNum;
        cc.log(`Data: Most Obrained Orb update ${this._mostObtainedOrb}`);
    }

    /** 2ラウンドで勝利を追加 */
    public addTwoRoundWin(): void {
        this._twoRoundWin++;
        cc.log(`Archivement: Two Round Win ${this._twoRoundWin}`);
    }

    /** １ラウンドで３つのオーブを獲得を追加 */
    public addTakeAll(): void {
        this._takeAll++;
        cc.log(`Archivement: Take All ${this._takeAll}`);
    }

    /** １ゲームで20ポイント以上獲得を追加 */
    public addBigScore(): void {
        this._bigScore++;
        cc.log(`Archivement: Big Score ${this._bigScore}`);
    }

    /** 使用したカードを追加 */
    public addCardUse(playCard: PlayCard): void {
        this._cardUseNum[playCard.key as number - 1]++;
        cc.log(`Tendency: ${new MonsterName(playCard.key).value} ${this._cardUseNum[playCard.key - 1]}`);
        if (playCard.isAttackZone()) {
            this._putAttack++
            cc.log(`Tendency: Attack ${this._putAttack}`);
        } else {
            this._putSupport++;
            cc.log(`Tendency: support ${this._putSupport}`);
        }
    }

    /** フェアリーでドラゴンを翻弄 */
    public addApplyFairyToDragon(): void {
        this._applyFairyToDragon++;
        cc.log(`Archivement: Apply Fairy to Dragon ${this._applyFairyToDragon}`);
    }

    /** メドューサでドラゴンを石化 */
    public addApplyMedusaToDragon(): void {
        this._applyMedusaToDragon++;
        cc.log(`Archivement: Apply Medusa to Dragon ${this._applyMedusaToDragon}`);
    }

    public createJSON(): any {
        let data = {
            name: this._name,
            icon: this._icon,
            match: this._match,
            win: this._win,
            defeat: this._defeat,
            draw: this._draw,
            consectiveWin: this._consectiveWin,
            consectiveDefeat: this._consectiveDefeat,
            mostConsectiveWin: this._mostConsectiveWin,
            mostConsectiveDefeat: this._mostConsectiveDefeat,
            mostObtainedOrb: this._mostObtainedOrb,
            mostPoint: this._mostPoint,

            cardUseNum: this._cardUseNum,
            // mostUsedCardAtFirstTurn: this._mostUsedCardAtFirstTurn,
            putAttack: this._putAttack,
            putSupport: this._putSupport,

            twoRoundWin: this._twoRoundWin,
            applyFairyToDragon: this._applyFairyToDragon,
            applyMedusaToDragon: this._applyMedusaToDragon,
            tenConsectiveWin: this._tenConsectiveWin,
            tenConsectiveDefeat: this._tenConsectiveDefeat,
            shutOut: this._shutOut,
            hundredWin: this._hundredWin,
            takeAll: this._takeAll,
            bigScore: this._bigScore
        }

        return data;
    }

    /** 
     * localStorageかRemotoから取得したデータを解析する
     * 常にこのClassが正しいとする
     * @param profileData - オブジェクト(文字列ではない)
     * */
    public parseJSON(profileData: any): void {
        if (profileData.name) this._name = profileData.name;
        else console.error("プレイヤーの名前が設定されていません。")
        if (profileData.icon) this._icon = profileData.icon;
        if (profileData.match) this._match = profileData.match;
        if (profileData.win) this._win = profileData.win;
        if (profileData.defeat) this._defeat = profileData.defeat;
        if (profileData.draw) this._draw = profileData.draw;
        if (profileData.consectiveWin) this._consectiveWin = profileData.consectiveWin;
        if (profileData.consectiveDefeat) this._consectiveDefeat = profileData.consectiveDefeat;
        if (profileData.mostConsectiveWin) this._mostConsectiveWin = profileData.mostConsectiveWin;
        if (profileData.mostConsectiveDefeat) this._mostConsectiveDefeat = profileData.mostConsectiveDefeat;
        if (profileData.mostObtainedOrb) this._mostObtainedOrb = profileData.mostObtainedOrb;
        if (profileData.mostPoint) this._mostPoint = profileData.mostPoint;

        if (profileData.cardUseNum) this._cardUseNum = profileData.cardUseNum;
        // if (profileData.mostUsedCardAtFirstTurn) this._mostUsedCardAtFirstTurn = profileData.mostUsedCardAtFirstTurn;
        if (profileData.putAttack) this._putAttack = profileData.putAttack;
        if (profileData.putSupport) this._putSupport = profileData.putSupport;

        if (profileData.twoRoundWin) this._twoRoundWin = profileData.twoRoundWin;
        if (profileData.applyFairyToDragon) this._applyFairyToDragon = profileData.applyFairyToDragon;
        if (profileData.applyMedusaToDragon) this._applyMedusaToDragon = profileData.applyMedusaToDragon;
        if (profileData.tenConsectiveWin) this._tenConsectiveWin = profileData.tenConsectiveWin;
        if (profileData.tenConsectiveDefeat) this._tenConsectiveDefeat = profileData.tenConsectiveDefeat;
        if (profileData.shutOut) this._shutOut = profileData.shutOut;
        if (profileData.hundredWin) this._hundredWin = profileData.hundredWin;
        if (profileData.takeAll) this._takeAll = profileData.takeAll;
        if (profileData.bigScore) this._bigScore = profileData.bigScore;
    }
}

export type ProfileContent = {
    key: string;
    value: number;
    unit?: string;
}