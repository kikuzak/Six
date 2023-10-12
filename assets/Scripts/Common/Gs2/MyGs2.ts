import { BasicGs2Credential, Gs2RestSession, Gs2WebSocketSession } from "gs2/core/model";
import Gs2Core from "gs2/core";
import * as Gs2Account from "gs2/account";
import * as Gs2Auth from "gs2/auth";
import * as Gs2Friend from "gs2/friend";
import * as Gs2Matchmaking from "gs2/matchmaking";
import * as Gs2Gateway from "gs2/gateway";
import * as Gs2Chat from "gs2/chat";

import { CHAT_CATEGORY, ERROR_TIMING, USER } from "../SystemConst";
import Events from "../Events";
import { PlayerData } from "../UserData";
import Account from "../Account";
import Profile from "../Profile";
import { OrbType } from "../../Game/Orb/Deck";
import { PlayCardType } from "../../Game/Board/PlayCard";

export default class MyGs2 {

    private static _credential: BasicGs2Credential;
    private static readonly keyId: string = "grn:gs2:ap-northeast-1:G96s7Qdn-Six:key:account-encryption-key-namespace:key:account-encryption-key";
    private static readonly nameSpace: string = "game-0001";
    private static _session: Gs2RestSession;

    private static _account: Account = null;
    private static _body: string;
    private static _signature: string;
    private static _token: string;
    private static _gatheringName: string;

    private static _trialNum: number = 0;
    private static readonly maxTtrialNum: number = 5;
    private static _matchmakingContextToken: string = null;
    private static _lastMessageCreatedAt: number = null;

    /** 初期化 */
    static async initialize(): Promise<void> {
        this._credential = new Gs2Core.BasicGs2Credential(
            "GKIUyYSC0IPu1b_6AtZuYpZKTmRwg1miiNuyoRh3FT7I2YjXGqLEW3CF2GkxOmOjL7f",
            "AwSNlHQYEIHDPJGODTQnxLPmnKwyfYSV"
        )
        this._session = new Gs2Core.Gs2RestSession(
            this._credential,
            Gs2Core.Region.AP_NORTHEAST_1
        );
        await this._session.connect();
        cc.log("Gs2 Initialized.");
    }

    /** アカウントの作成 */
    public static async createAccount(): Promise<Account> {
        let client: Gs2Account.Gs2AccountRestClient = new Gs2Account.Gs2AccountRestClient(this._session);
        try {
            MyGs2._trialNum++;
            let res: Gs2Account.result.CreateAccountResult = await client.createAccount(
                new Gs2Account.request.CreateAccountRequest()
                .withNamespaceName(MyGs2.nameSpace)
            );
            let item: Gs2Account.model.Account = res.getItem();
            this._account = new Account();
            this._account.accountId = item.getAccountId();
            this._account.userId = item.getUserId();
            this._account.password = item.getPassword();
            this._account.timeOffset = item.getTimeOffset();
            this._account.createdAt = item.getCreatedAt();
            console.log("Account is Created.");
            MyGs2._trialNum = 0;
            return this._account;
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.createAccount();
            } else {
                MyGs2._trialNum = 0;
                Events.target.emit(Events.List.Error, ERROR_TIMING.BeforeInitialization, "アカウント作成エラー");
                cc.log(e[0]);
            }
        }
    }

    /** ローカルにアカウントを受け取る */
    public static registerAccount(account: Account):void {
        this._account = account;
    }

    /** アカウントを認証する */
    static async authenticate(): Promise<void> {
        let client: Gs2Account.Gs2AccountRestClient = new Gs2Account.Gs2AccountRestClient(this._session);
        try {
            MyGs2._trialNum++;
            let res: Gs2Account.result.AuthenticationResult = await client.authentication(
                new Gs2Account.request.AuthenticationRequest()
                .withNamespaceName(MyGs2.nameSpace)
                .withUserId(this._account.userId)
                .withKeyId(MyGs2.keyId)
                .withPassword(this._account.password)
            );
            MyGs2._body = res.getBody();
            MyGs2._signature = res.getSignature();
            console.log("Account is Authorized.");
            MyGs2._trialNum = 0;
            return;
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.authenticate();
            } else {
                MyGs2._trialNum = 0;
                Events.target.emit(Events.List.Error, ERROR_TIMING.BeforeInitialization, "アカウント認証エラー");
                cc.log(e[0]);
            }
        }
    }

    /** ログインする */
    static async login(): Promise<void> {
        let client: Gs2Auth.Gs2AuthRestClient = new Gs2Auth.Gs2AuthRestClient(this._session);
        try {
            MyGs2._trialNum++;
            let res: Gs2Auth.result.LoginBySignatureResult = await client.loginBySignature(
                new Gs2Auth.request.LoginBySignatureRequest()
                .withKeyId(MyGs2.keyId)
                .withBody(this._body)
                .withSignature(this._signature)
            );
            this._token = res.getToken();
            console.log("Login Success!");
            MyGs2._trialNum = 0;
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.login();
            } else {
                MyGs2._trialNum = 0;
                Events.target.emit(Events.List.Error, ERROR_TIMING.BeforeInitialization, "ログインエラー");
                cc.log(e[0]);
            }
        }
    }

    /** 自分のプロフィールを保存する */
    static async updateProfile(profile: Profile): Promise<Gs2Friend.model.Profile> {
        let client: Gs2Friend.Gs2FriendRestClient = new Gs2Friend.Gs2FriendRestClient(this._session);
        try {
            MyGs2._trialNum++;
            let res: Gs2Friend.result.UpdateProfileResult = await client.updateProfile(
                new Gs2Friend.request.UpdateProfileRequest()
                .withNamespaceName(this.nameSpace)
                .withAccessToken(this._token)
                .withPublicProfile(JSON.stringify(profile.createJSON()))
            );
            console.log("Profile is Updated.");
            MyGs2._trialNum = 0;
            return res.getItem();
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.updateProfile(profile);
            } else {
                MyGs2._trialNum = 0;
                Events.target.emit(Events.List.Error, ERROR_TIMING.Title, "プロフィール更新エラー");
                cc.log(e[0]);
            }
        }
    }

    /** 自分のプロフィールを取得する */
    static async getProfile(): Promise<Profile> {
        let client: Gs2Friend.Gs2FriendRestClient = new Gs2Friend.Gs2FriendRestClient(this._session);
        try {
            MyGs2._trialNum++;
            let res: Gs2Friend.result.GetProfileResult = await client.getProfile(
                new Gs2Friend.request.GetProfileRequest()
                .withNamespaceName(this.nameSpace)
                .withAccessToken(this._token)
            );
            let profileData: any = res.getItem().getPublicProfile();
            let profile = new Profile();
            profile.parseJSON(JSON.parse(profileData));
            MyGs2._trialNum = 0;
            return profile;
            
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.getProfile();
            } else {
                MyGs2._trialNum = 0;
                let timing: ERROR_TIMING;
                if (cc.director.getScene().name === "Game") timing = ERROR_TIMING.Game;
                else timing = ERROR_TIMING.Title;
                Events.target.emit(Events.List.Error, timing, "プロフィール取得にエラー");
                cc.log(e[0]);
            }

        }
    }

    /** ギャザリングを募集する */
    static async createGathering(roomNumber: number): Promise<Gs2Matchmaking.model.Gathering> {
        let client: Gs2Matchmaking.Gs2MatchmakingRestClient = new Gs2Matchmaking.Gs2MatchmakingRestClient(this._session);
        try {
            MyGs2._trialNum++;
            let res: Gs2Matchmaking.result.CreateGatheringResult = await client.createGathering(
                new Gs2Matchmaking.request.CreateGatheringRequest()
                .withNamespaceName(this.nameSpace)
                .withAccessToken(this._token)
                .withPlayer(new Gs2Matchmaking.model.Player()
                    .withAttributes([
                        new Gs2Matchmaking.model.Attribute()
                        .withName("roomNumber")
                        .withValue(roomNumber)
                ]))
                .withCapacityOfRoles([
                    new Gs2Matchmaking.model.CapacityOfRole()
                    .withRoleName("default")
                    .withCapacity(2)
                ])
                .withAllowUserIds(null)
                .withExpiresAt(null)
            );
            console.log("gathering is created.");
            MyGs2._trialNum = 0;
            return res.getItem();
        } catch(e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.createGathering(roomNumber);
            } else {
                MyGs2._trialNum = 0;
                Events.target.emit(Events.List.Error, ERROR_TIMING.Title, "部屋を作成できませんでした。");
                cc.log(e[0]);
            }
        }
    }

    /** ギャザリングに参加する */
    static async doMatching(roomNumber: number): Promise<Gs2Matchmaking.model.Gathering | null> {
        let client: Gs2Matchmaking.Gs2MatchmakingRestClient = new Gs2Matchmaking.Gs2MatchmakingRestClient(this._session);
        try {
            let res: Gs2Matchmaking.result.DoMatchmakingResult = await client.doMatchmaking(
                new Gs2Matchmaking.request.DoMatchmakingRequest()
                .withNamespaceName(this.nameSpace)
                .withAccessToken(this._token)
                .withPlayer(new Gs2Matchmaking.model.Player()
                    .withUserId(this._account.userId)
                    .withAttributes([
                        new Gs2Matchmaking.model.Attribute()
                        .withName("roomNumber")
                        .withValue(roomNumber)
                ]))
                .withMatchmakingContextToken(MyGs2._matchmakingContextToken)
            );
            
            if (res.getItem() !== null) {
                // ギャザリングが見つかったとき
                console.log("room is detected.");
                MyGs2._trialNum = 0;
                MyGs2._matchmakingContextToken = null;
                return res.getItem();
            } else if (res.getMatchmakingContextToken() !== null) {
                // すべてのギャザリングが検索しきれなかったとき、続きから再開
                MyGs2.doMatching(roomNumber);
            } else {
                // ギャザリングが見つからない
                MyGs2._trialNum++;
                if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                    MyGs2._matchmakingContextToken = null;
                    MyGs2.doMatching(roomNumber);
                } else {
                    MyGs2._trialNum = 0;
                    Events.target.emit(Events.List.Error, ERROR_TIMING.Title, "部屋が存在しません。");
                }
            }
        } catch (e) {
            MyGs2._trialNum++;
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2._matchmakingContextToken = null;
                MyGs2.doMatching(roomNumber);
            } else {
                MyGs2._trialNum = 0;
                Events.target.emit(Events.List.Error, ERROR_TIMING.Title, "部屋の検索エラー");
                cc.log(e[0]);
            }
        }
    }
    
    /** Gatewayにつなぐ */
    static async connectGateway(): Promise<Gs2Gateway.model.WebSocketSession> {
        let webSocketSession: Gs2WebSocketSession = new Gs2WebSocketSession(this._credential, Gs2Core.Region.AP_NORTHEAST_1);
        await webSocketSession.connect();
        let websocketClient: Gs2Gateway.Gs2GatewayWebSocketClient = new Gs2Gateway.Gs2GatewayWebSocketClient(webSocketSession);
        try {
            MyGs2._trialNum++;
            let res: Gs2Gateway.result.SetUserIdResult = await websocketClient.setUserId(
                new Gs2Gateway.request.SetUserIdRequest()
                .withNamespaceName(this.nameSpace)
                .withAccessToken(this._token)
                .withAllowConcurrentAccess(false)
            );
            console.log("Gateway is connected.");
            websocketClient.session.onNotification((message): void => {
                // メッセージをハンドルする
                if (message.issuer.startsWith("Gs2Matchmaking:")) {
                    if (message.issuer.endsWith(":Complete")) {
                        let res = JSON.parse(message.payload);
                        this._gatheringName = res.gatheringName;
                        Events.target.emit(Events.List.CompleteMatching);
                    }
                } else if (message.issuer.startsWith("Gs2Chat:")) {
                    if (message.issuer.endsWith(":Post")) {
                        this.getMessage();
                    }
                }
            });
            MyGs2._trialNum = 0;
            return res.getItem();
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.connectGateway();
            } else {
                Events.target.emit(Events.List.Error, ERROR_TIMING.Title, "サーバー接続エラー");
                cc.log(e);
            }
        }
    }

    /** メッセージを受信する */
    static async getMessage(): Promise<void> {
        let client: Gs2Chat.Gs2ChatRestClient = new Gs2Chat.Gs2ChatRestClient(this._session);
        try {
            MyGs2._trialNum++;
            // 2件取得する(同時に送信した場合を考慮して)
            let res: Gs2Chat.result.DescribeMessagesResult = await client.describeMessages(
                new Gs2Chat.request.DescribeMessagesRequest()
                    .withNamespaceName(this.nameSpace)
                    .withRoomName(this._gatheringName)
                    .withPassword(null)
                    .withAccessToken(this._token)
                    .withStartAt(MyGs2._lastMessageCreatedAt)
                    .withLimit(10)
            );
            let items: Gs2Chat.model.Message[] = res.getItems().reverse();
            // 相手からの最新メッセージを抽出する
            let item: Gs2Chat.model.Message = items.find((v) => v.getUserId() !== PlayerData.account.userId);
            MyGs2._lastMessageCreatedAt = item.getCreatedAt();
            Events.target.emit(Events.List.GetMessage, item);
            MyGs2._trialNum = 0;
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.getMessage();
            } else {
                let timing: ERROR_TIMING;
                if (cc.director.getScene().name === "Title") timing = ERROR_TIMING.Title;
                else timing = ERROR_TIMING.Game;
                Events.target.emit(Events.List.Error, timing, "メッセージ取得エラー");
                console.error(e[0]);
            }
        }
    }

    /** Chatのroomへ接続する */
    static async subscribeRoom(): Promise<void> {
        let client: Gs2Chat.Gs2ChatRestClient = new Gs2Chat.Gs2ChatRestClient(this._session);
        try {
            MyGs2._trialNum++;
            let res: Gs2Chat.result.SubscribeResult = await client.subscribe(
                new Gs2Chat.request.SubscribeRequest()
                    .withNamespaceName(this.nameSpace)
                    .withRoomName(this._gatheringName)
                    .withAccessToken(this._token)
            );
            MyGs2._trialNum = 0;
            console.log("enter room.");
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.subscribeRoom();
            } else {
                Events.target.emit(Events.List.Error, ERROR_TIMING.Title, "部屋への接続エラー");
                console.error(e[0]);
            }
        }
    }

    /** roomへStartGameを送信する */
    static async postStartGame(): Promise<void> {
        let client: Gs2Chat.Gs2ChatRestClient = new Gs2Chat.Gs2ChatRestClient(this._session);
        try {
            MyGs2._trialNum++;
            await client.post(
                new Gs2Chat.request.PostRequest()
                .withNamespaceName(this.nameSpace)
                .withRoomName(this._gatheringName)
                .withAccessToken(this._token)
                .withCategory(CHAT_CATEGORY.GameStart as number)
                .withMetadata("startGame")
                .withPassword(null)
            );
            MyGs2._trialNum = 0;
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.postStartGame();
            } else {
                Events.target.emit(Events.List.Error, ERROR_TIMING.Game, "メッセージ送信エラー\nStartGame");
                console.error(e[0]);
            }
        }
    }

    /** roomへProfileを送信する */
    static async postProfile(): Promise<void> {
        let client: Gs2Chat.Gs2ChatRestClient = new Gs2Chat.Gs2ChatRestClient(this._session);
        try {
            MyGs2._trialNum++;
            await client.post(
                new Gs2Chat.request.PostRequest()
                .withNamespaceName(this.nameSpace)
                .withRoomName(this._gatheringName)
                .withAccessToken(this._token)
                .withCategory(CHAT_CATEGORY.Profile)
                .withMetadata(JSON.stringify(PlayerData.profile.createJSON()))
                .withPassword(null)
            );
            MyGs2._trialNum = 0;
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.postProfile();
            } else {
                Events.target.emit(Events.List.Error, ERROR_TIMING.Game, "メッセージ送信エラー\nPostProfile");
                console.error(e[0]);
            }
        }
    }

    /** roomへ優先権を送信する */
    static async postPriority(user: number): Promise<void> {
        let client: Gs2Chat.Gs2ChatRestClient = new Gs2Chat.Gs2ChatRestClient(this._session);
        let priority: USER;
        if (user === 1) priority = USER.Opponent;
        if (user === 2) priority = USER.Player;
        try {
            MyGs2._trialNum++;
            await client.post(
                new Gs2Chat.request.PostRequest()
                .withNamespaceName(this.nameSpace)
                .withRoomName(this._gatheringName)
                .withAccessToken(this._token)
                .withCategory(CHAT_CATEGORY.Priority)
                .withMetadata(priority.toString())
                .withPassword(null)
            );
            MyGs2._trialNum = 0;
            return;
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.postPriority(user);
            } else {
                Events.target.emit(Events.List.Error, ERROR_TIMING.Game, "メッセージ送信エラー\nPostPriority");
                console.error(e[0]);
            }
        }
    }

    /** roomへDeckを送信する */
    static async postDeck(deckData: OrbType[]): Promise<void> {
        let client: Gs2Chat.Gs2ChatRestClient = new Gs2Chat.Gs2ChatRestClient(this._session);
        try {
            MyGs2._trialNum++;
            await client.post(
                new Gs2Chat.request.PostRequest()
                .withNamespaceName(this.nameSpace)
                .withRoomName(this._gatheringName)
                .withAccessToken(this._token)
                .withCategory(CHAT_CATEGORY.Deck)
                .withMetadata(JSON.stringify(deckData))
                .withPassword(null)
            );
            MyGs2._trialNum = 0;
            return;
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.postDeck(deckData);
            } else {
                Events.target.emit(Events.List.Error, ERROR_TIMING.Game, "メッセージ送信エラー\nPostDeck");
                console.error(e[0]);
            }
            
        }
    }

    /** roomへDeckを再送信する */
    static async repostDeck(deckData: OrbType[]): Promise<void> {
        let client: Gs2Chat.Gs2ChatRestClient = new Gs2Chat.Gs2ChatRestClient(this._session);
        try {
            MyGs2._trialNum++;
            await client.post(
                new Gs2Chat.request.PostRequest()
                .withNamespaceName(this.nameSpace)
                .withRoomName(this._gatheringName)
                .withAccessToken(this._token)
                .withCategory(CHAT_CATEGORY.ReDeck)
                .withMetadata(JSON.stringify(deckData))
                .withPassword(null)
            );
            MyGs2._trialNum = 0;
            return;
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.repostDeck(deckData);
            } else {
                Events.target.emit(Events.List.Error, ERROR_TIMING.Game, "メッセージ送信エラー\nRepostDeck");
                console.error("投稿失敗！");
                console.error(e[0]);
            }
        }
    }

    /** ルームへ出すカードを送信する */
    static async postPlayCard(playCardData: PlayCardType): Promise<void> {
        let client: Gs2Chat.Gs2ChatRestClient = new Gs2Chat.Gs2ChatRestClient(this._session);
        try {
            MyGs2._trialNum++;
            let res: Gs2Chat.result.PostResult = await client.post(
                new Gs2Chat.request.PostRequest()
                .withNamespaceName(this.nameSpace)
                .withRoomName(this._gatheringName)
                .withAccessToken(this._token)
                .withCategory(CHAT_CATEGORY.PlayCard)
                .withMetadata(JSON.stringify(playCardData))
                .withPassword(null)
            );
            MyGs2._trialNum = 0;
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.postPlayCard(playCardData);
            } else {
                Events.target.emit(Events.List.Error, ERROR_TIMING.Game, "メッセージ送信エラー\nPostCard");
                console.error(e[0]);                
            }
        }
    }

    /** フェアリーの効果で指定したカードを送信する */
    static async postUseFairy(key: number): Promise<void> {
        let client: Gs2Chat.Gs2ChatRestClient = new Gs2Chat.Gs2ChatRestClient(this._session);
        try {
            MyGs2._trialNum++;
            let res: Gs2Chat.result.PostResult = await client.post(
                new Gs2Chat.request.PostRequest()
                .withNamespaceName(this.nameSpace)
                .withRoomName(this._gatheringName)
                .withAccessToken(this._token)
                .withCategory(CHAT_CATEGORY.Fairy)
                .withMetadata(key.toString())
                .withPassword(null)
            );
            MyGs2._trialNum = 0;
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.postUseFairy(key);
            } else {
                Events.target.emit(Events.List.Error, ERROR_TIMING.Game, "メッセージ送信エラー\nFairy");
                console.error(e[0]);
            }

        }
    }

    /** メドゥーサの効果で指定したカードを送信する */
    static async postUseMedusa(key: number): Promise<void> {
        let client: Gs2Chat.Gs2ChatRestClient = new Gs2Chat.Gs2ChatRestClient(this._session);
        try {
            MyGs2._trialNum++;
            let res: Gs2Chat.result.PostResult = await client.post(
                new Gs2Chat.request.PostRequest()
                .withNamespaceName(this.nameSpace)
                .withRoomName(this._gatheringName)
                .withAccessToken(this._token)
                .withCategory(CHAT_CATEGORY.Medusa)
                .withMetadata(key.toString())
                .withPassword(null)
            );
            MyGs2._trialNum = 0;
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.postUseMedusa(key);
            } else {
                Events.target.emit(Events.List.Error, ERROR_TIMING.Game, "メッセージ送信エラー\nMedusa");
                console.error(e[0]);
            }
        }
    }

    /** 投了する */
    static async postResign(): Promise<void> {
        let client: Gs2Chat.Gs2ChatRestClient = new Gs2Chat.Gs2ChatRestClient(this._session);
        try {
            MyGs2._trialNum++;
            let res: Gs2Chat.result.PostResult = await client.post(
                new Gs2Chat.request.PostRequest()
                .withNamespaceName(this.nameSpace)
                .withRoomName(this._gatheringName)
                .withAccessToken(this._token)
                .withCategory(CHAT_CATEGORY.Resing)
                .withMetadata("resign")
                .withPassword(null)
            );
            MyGs2._trialNum = 0;
        } catch (e) {
            if (MyGs2._trialNum < MyGs2.maxTtrialNum) {
                MyGs2.postResign();
            } else {
                Events.target.emit(Events.List.Error, ERROR_TIMING.Game, "メッセージ送信エラー\nConfirmResign");
                console.error(e[0]);
            }
        }
    }
}