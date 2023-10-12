import MyGs2 from "../Common/Gs2/MyGs2";
import { PlayerData } from "../Common/UserData";
import InputPlayerName from "./InputPlayerName";
import MainMenu from "./MainMenu";
import Account from "../Common/Account";
import Profile from "../Common/Profile";
import GameSetting from "../Game/Common/GameSetting";
import Events from "../Common/Events";
import { AUDIO_TYPE, ERROR_TIMING } from "../Common/SystemConst";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TitleMain extends cc.Component {

    @property(cc.Node) touchAreaNode: cc.Node = null;
    @property(cc.Node) logoNode: cc.Node = null;
    @property(cc.Node) orbNodes: cc.Node[] = [];
    @property(InputPlayerName) inputPlayerName: InputPlayerName = null;
    @property(MainMenu) mainMenu: MainMenu = null;
    @property(cc.Node) textNode: cc.Node = null;

    async start() {
        this._loadGameSetting();
        if (!GameSetting.returnFlg) {
            // 新しくはじまった
            this.touchAreaNode.on(cc.Node.EventType.TOUCH_START, (): void => {
                this._touchStart();
            });
            this.touchAreaNode.active = true;
        } else {
            // 試合から帰ってきた
            Events.target.emit(Events.List.Sound, AUDIO_TYPE.BGM_Title);
            this.hide();
            this.mainMenu.show();
        }

        cc.tween(this.textNode)
        .repeatForever(
            cc.tween(this.textNode)
            .to(.6, {opacity: 255}, {easing: "sineIn"})
            .delay(1)
            .to(.6, {opacity: 0}, {easing: "sineOut"})
            .start()
        ).start();
    }

    private async _touchStart(): Promise<void> {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.BGM_Title);
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_TapToStart);
        Events.target.emit(Events.List.StartLoading);
        this.textNode.stopAllActions();
        this.textNode.active = false;
        this.touchAreaNode.active = false;
        // Gs2の初期化・ログインなど
        await MyGs2.initialize();

        // アカウントの確認
        if (!this._hasLocalAccount()) {
            cc.log("Welcome to SIX !");
            let account: Account = await MyGs2.createAccount();
            PlayerData.account = account;
            cc.sys.localStorage.setItem("account", JSON.stringify(account.createJSON()));
        } else {
            // 既存アカウントをロードする
            cc.log("Account already exists.");
            let account: Account = this._getLocalAccount();
            PlayerData.account = account;
            MyGs2.registerAccount(account);
        }

        await MyGs2.authenticate();
        await MyGs2.login();
        await MyGs2.connectGateway();

        // 次の画面へ
        if (!this._hasLocalProfile()) {
            Events.target.emit(Events.List.EndLoading);
            this.inputPlayerName.show();
        } else {
            await this._getProfile();
            Events.target.emit(Events.List.EndLoading);
            this.hide();
            this.mainMenu.show();
        }
    }

    public show(): void {
        this.node.active = true;
    }

    public async hide(): Promise<void> {
        return new Promise((resolve): void => {
            cc.tween(this.logoNode)
            .to(.2, {scale: 1.1, opacity: 0})
            .delay(.2)
            .call((): void => {
                resolve();
            })
            .start();
            
            for (let i: number = 0; i < this.orbNodes.length; i++) {
                cc.tween(this.orbNodes[i])
                .to(.2, {opacity: 0})
                .delay(.2)
                .start(); 
            }
        })
    }

    private _loadGameSetting(): void {
        let gameSettingData = cc.sys.localStorage.getItem("gameSetting");
        if (gameSettingData === null || gameSettingData === void 0 || gameSettingData === "undefined") {
            let data = {
                bgmVolume: 0.5,
                seVolume: 0.5
            }
            cc.sys.localStorage.setItem("gameSetting", JSON.stringify(data));
        } else {
            let data = JSON.parse(gameSettingData);
            GameSetting.bgmVolume = data.bgmVolume;
            GameSetting.seVolume = data.seVolume;
        }
    }

    /** ローカルにアカウントがあるかどうかを判定 */
    private _hasLocalAccount(): boolean {
        if (this._getLocalAccount() === null) return false;
        else return true;
    }

    /** ローカルストレージのアカウントを取得 */
    private _getLocalAccount(): Account | null {
        let localAccountData = cc.sys.localStorage.getItem("account");
        if (localAccountData === null || localAccountData === void 0 || localAccountData === "undefined") {
            return null;
        } else {
            let account = new Account();
            account.parseJSON(JSON.parse(localAccountData));
            return account;
        }
        
    }

    /** ローカルにプロフィールが保存されているかどうかを判定 */
    private _hasLocalProfile(): boolean {
        let localProfileData = cc.sys.localStorage.getItem("profile");
        if (localProfileData === null || localProfileData === void 0 || localProfileData === "undefined") {
            return false;
        } else {
            return true;
        }
    }

    /** プロフィールをGs2から取得する(ログイン時1度のみ) */
    private async _getProfile(): Promise<Profile> {
        let profile: Profile = await MyGs2.getProfile();
        cc.sys.localStorage.setItem("profile", JSON.stringify(profile.createJSON()));
        PlayerData.profile = profile;
        cc.log("My Profile is Loaded.");
        return profile;
    }

    public pressRule(): void {
        window.open("https://loghouse.x0.com/six/rule");
    }

    public pressLink(e, url: string): void {
        window.open(url);
    }

    protected onLoad(): void {
        Events.target.clear();

        Events.target.on(Events.List.CreateAccount, (): void => {
            this.hide();
        });
        Events.target.on(Events.List.ErrorConfirm, (timing: ERROR_TIMING): void => {
            if (timing === ERROR_TIMING.BeforeInitialization) {
                cc.director.loadScene("Title");
            }
        }, this.node);
        Events.target.on(Events.List.StartSkillUse, (): void => {
            cc.log(this.node);
        }, this.node);
    }
    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}