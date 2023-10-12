const {ccclass, property} = cc._decorator;

@ccclass
export default class Events extends cc.Component {

    static target: cc.EventTarget = new cc.EventTarget();

    static readonly List = {
        /** 登録完了 */
        CreateAccount: "CreateAccount",
        /** ローディング表示 */
        StartLoading: "StartLoading",
        /** ローディング修了 */
        EndLoading: "EndLoading",
        /** エラー発生 */
        Error: "Error",
        /** エラー確認 */
        ErrorConfirm: "ErrorConfirm",
        /** マッチング完了 */
        CompleteMatching: "CompleteMatching",
        /** メッセージを受信 */
        GetMessage: "GetMessage",
        /** ゲームスタート */
        StartGame: "StartGame",
        /** ラウンドスタート */
        StartRound: "StartRound",
        /** ラウンドエンド */
        EndRound: "EndRound",
        /** ターンスタート */
        StartTurn: "StartTurn",
        /** ターンエンド */
        EndTurn: "EndTurn",
        /** オーブを配る */
        DealOrb: "DealOrb",
        /** 手札を選択 */
        SelectHand: "SelectHand",
        /** 手札を選択解除 */
        DeselectHand: "DeselectHand",
        /** 場のカードを選択した */
        SelectLayout: "SelectLayout",
        /** 場を選択した */
        SelectPlace: "SelectPlace",
        /** 場を選択解除した */
        DeselectPlace: "DeselectPlace",
        /** 出すカードを決定した */
        EnterCard: "EnterCard",
        /** カードをプレイする */
        PlayCard: "PlayCard",
        /** スキルを使用する */
        StartSkillUse: "StartSkillUse",
        /** スキル使用が終了した */
        EndSkillUse: "EndSkillUse",
        /** フェアリーの効果を確定した */
        Fairy: "Fairy",
        /** 優先権のあるスキルの使用が終了した */
        EndPrioritySkill: "EndPrioritySkill",
        /** 得点計算 */
        Judge: "Judge",

        /** フェアリーの指定したカード */
        LogFairy: "LogFairy",
        /** メドゥーサで指定したカード */
        LogMedusa: "LogMedusa",
        /** ゴーレムで指定したカード */
        LogGolem: "LogGolem",
        /** バトルスタート */
        LogBattle: "LogBattle",
        /** レーン集計スタート */
        LogJudge: "LogJudge",

        /** サウンド */
        Sound: "Sound",
    }
}