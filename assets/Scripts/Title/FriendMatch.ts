import Message from "gs2/chat/model/Message";
import BitmapNum from "../Common/BitmapNum";
import Events from "../Common/Events";
import MyGs2 from "../Common/Gs2/MyGs2";
import { SwitchNode } from "../Common/NodeSwitchBtn";
import Profile from "../Common/Profile";
import { AUDIO_TYPE, CHAT_CATEGORY, ERROR_TIMING, USER, USER_ROLE } from "../Common/SystemConst";
import { OpponentData, PlayerData } from "../Common/UserData";
import UserIcon from "../Common/UserIcon";
import { GAME_MODE } from "../Game/Common/GameConst";
import GameSetting from "../Game/Common/GameSetting";

/*
    対戦までの流れ
    1 ホスト側が部屋番号を確定してGatheringを作成(createGathering) -> 待機画面へ
    2 ゲスト側が部屋番号からGatheringを検索して参加(doMatching)
    3 2人がGatheringに参加すると、Gs2Matchmaking::Completeイベントが発行され、ChatRoomが作成される(Gatheringは破棄される)
    4 Gatewayでイベントを取得し、CompleteMatchingイベントが発行される(ゲーム内)
    5 イベントをハンドリングして、ChatRoomに入室する
*/

const {ccclass, property} = cc._decorator;

@ccclass
export default class FriendMatch extends SwitchNode {
    @property(cc.Node) backBtn: cc.Node = null;
    @property(cc.Node) selectRoleNode: cc.Node = null;
    @property(cc.Node) roomNumberNode: cc.Node = null;
    @property(cc.Node) standByNode: cc.Node = null;
    @property(BitmapNum) roomNumberBitmapNum: BitmapNum = null;
    @property(cc.Button) enterBtn: cc.Button = null;
    @property(cc.Node) deleteBtnNode: cc.Node = null;
    @property(BitmapNum) enteredRoomNumberBitmapNum: BitmapNum = null;
    @property(cc.Node) playerProfileNode: cc.Node = null;
    @property(UserIcon) playerIcon: UserIcon = null;
    @property(cc.Label) playerNameLabel: cc.Label = null;
    @property(cc.Node) opponentProfileNode: cc.Node = null;
    @property(UserIcon) opponentIcon: UserIcon = null;
    @property(cc.Label) opponentNameLabel: cc.Label = null;
    @property(cc.Node) startBtn: cc.Node = null;
    

    private _roomNumber: string = "";
    private _roomNumberLength: number = 4; // 部屋番号の桁数
    private _isSubscribed: boolean = false; // 2人とも部屋の購読が完了したかどうか

    public show(): void {
        this.node.opacity = 0;
        this.standByNode.active = false;
        this.roomNumberNode.active = false;
        this.selectRoleNode.active = true;
        this.enterBtn.node.opacity = 180;
        this.roomNumberBitmapNum.reset();
        this.node.active = true;
        cc.tween(this.node)
        .to(.1, {opacity: 255})
        .start();
    }

    public hide(): void {
        cc.tween(this.node)
        .to(.1, {opacity: 0})
        .call((): void => {
            this.node.active = false;
            this._roomNumber = "";
            this.enterBtn.node.opacity = 180;
            this.roomNumberBitmapNum.reset();
        })
        .start();
    }

    /** chatのルームを購読する */
    public async subscribeRoom(): Promise<void> {
        await MyGs2.subscribeRoom();
        if (PlayerData.userRole === USER_ROLE.Host) this._sendProfile();
    }

    private _sendProfile(): void {
        setTimeout(() => {
            MyGs2.postProfile();
            console.log("subscribing...");
            if (!this._isSubscribed) this._sendProfile();
        }, 1000);
    }

    private async _getProfile(message: Message): Promise<void> {
        this._isSubscribed = true;
        let profile: Profile = new Profile();
        profile.parseJSON(JSON.parse(message.getMetadata()));
        OpponentData.profile = profile;
        let dir: USER = (PlayerData.userRole === USER_ROLE.Host) ? USER.Opponent : USER.Player;
        this.opponentIcon.setup(dir, OpponentData.profile.icon);
        this.opponentNameLabel.string = OpponentData.profile.name;
        if (PlayerData.userRole === USER_ROLE.Host) this.startBtn.active = true;
    }

    private _startGame(): void {
        GameSetting.gameMode = GAME_MODE.Friend;
        cc.director.loadScene("Game");
    }

    /** 「部屋を作成」を押した */
    public pressCreateRoomBtn(): void {
        Events.target.emit(Events.List.StartLoading);
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemEnter);
        PlayerData.userRole = USER_ROLE.Host;

        this.playerProfileNode.setPosition(-600, 0);
        this.opponentProfileNode.setPosition(600, 0);
        this.selectRoleNode.active = false;
        // this.roomNumberNode.active = true;
        const roomNumber: number = Math.floor(Math.random() * 10) * 1000 + Math.floor(Math.random() * 10) * 100 + Math.floor(Math.random() * 10) * 10 + Math.floor(Math.random());
        const strRoomNumber: string = ('0000' + roomNumber).slice(-4);
        this._roomNumber = strRoomNumber;
        this.pressEnter();
    }

    /** 「参加する」を押した*/
    public pressJoinRoomBtn(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemEnter);
        PlayerData.userRole = USER_ROLE.Guest;
        this.playerProfileNode.setPosition(600, 0);
        this.opponentProfileNode.setPosition(-600, 0);
        this.selectRoleNode.active = false;
        this.roomNumberNode.active = true;
    }

    public pressNumber(e, code: string): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemSelect);
        if (this._roomNumber.length >= this._roomNumberLength) return;
        this._roomNumber += code;
        this.roomNumberBitmapNum.showAsRoomNumber(this._roomNumber);

        if (this._roomNumber.length === this._roomNumberLength) {
            this.enterBtn.node.opacity = 255;
            this.enterBtn.interactable = true;
        } else {
            this.enterBtn.node.opacity = 180;
            this.enterBtn.interactable = false;
        }
    }

    public pressBackSpace(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemCancel);
        if (this._roomNumber.length < 1) return;
        this._roomNumber = this._roomNumber.slice(0, -1);
        this.roomNumberBitmapNum.showAsRoomNumber(this._roomNumber);

        if (this._roomNumber.length === this._roomNumberLength) {
            this.enterBtn.node.opacity = 255;
            this.enterBtn.interactable = true;
        } else {
            this.enterBtn.node.opacity = 180;
            this.enterBtn.interactable = false;
        }
    }

    /** 部屋番号を確定した */
    public async pressEnter(): Promise<void> {
        // Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemEnter);
        // Events.target.emit(Events.List.StartLoading);
        // this.enterBtn.interactable = false;
        // cc.tween(this.enterBtn.node)
        // .to(.05, {scale: 1.1})
        // .to(.05, {scale: 1})
        // .call((): void => {
        //     this.enterBtn.interactable = false;
        //     this.enterBtn.node.opacity = 255;
        // })
        // .start();

        if (PlayerData.userRole === USER_ROLE.Host) {
            await MyGs2.createGathering(Number(this._roomNumber));
            Events.target.emit(Events.List.EndLoading);
        } else {
            await MyGs2.doMatching(Number(this._roomNumber));
        }
        this.deleteBtnNode.active = false;
        this.enteredRoomNumberBitmapNum.show(this._roomNumber);
        let dir: USER = (PlayerData.userRole === USER_ROLE.Host) ? USER.Opponent : USER.Player;
        this.playerIcon.setup(dir, PlayerData.profile.icon);
        this.playerNameLabel.string = PlayerData.profile.name;
        this.roomNumberNode.active = false;
        this.standByNode.active = true;
    }

    public pressStartBtn(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemEnter);
        cc.tween(this.enterBtn.node)
        .to(.05, {scale: 1.1})
        .to(.05, {scale: 1})
        .call((): void => {
            this.startBtn.active = false;
            MyGs2.postStartGame();
            this._startGame();
        })
        .start();
    }

    protected async onLoad(): Promise<void> {
        Events.target.on(Events.List.CompleteMatching, (): void => {
            this.backBtn.active = false;
            this.subscribeRoom();
        }, this.node);

        Events.target.on(Events.List.GetMessage, (message: Message): void => {
            if (message.getCategory() === CHAT_CATEGORY.Profile &&!this._isSubscribed) {
                this._getProfile(message);
                if (PlayerData.userRole === USER_ROLE.Guest) {
                    MyGs2.postProfile();
                    Events.target.emit(Events.List.EndLoading);
                }
            } else if (message.getCategory() === CHAT_CATEGORY.GameStart) {
                this._startGame();
            }
        }, this.node);

        Events.target.on(Events.List.ErrorConfirm, (timing: ERROR_TIMING): void => {
            if (timing === ERROR_TIMING.Title) {
                this.hide();
            }
        }, this.node);
    }
    
    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}
