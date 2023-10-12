import Events from "../Common/Events";
import MyGs2 from "../Common/Gs2/MyGs2";
import Profile from "../Common/Profile";
import { AUDIO_TYPE } from "../Common/SystemConst";
import { PlayerData } from "../Common/UserData";
import MainMenu from "./MainMenu";
// import TitleProfile from "./TitleProfile";

const {ccclass, property} = cc._decorator;

@ccclass
export default class InputPlayerName extends cc.Component {

    @property(cc.Node) inputArea: cc.Node = null;
    @property(cc.Node) confirmArea: cc.Node = null;
    @property(cc.Label) introductionLabel: cc.Label = null;
    @property(cc.EditBox) nameInput: cc.EditBox = null;
    @property(cc.Label) nameLabel: cc.Label = null;
    @property(MainMenu) mainMenu: MainMenu = null;

    /** 名前を入力した */
    public pressInputEnterBtn(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemEnter);
        if (this.nameInput.string.length === 0) {
            this.introductionLabel.string = "名前は1文字以上入力してください。";
            return;
        }
        this.introductionLabel.string = "この名前でよろしいですか？";
        this.nameLabel.string = this.nameInput.string;
        this.inputArea.active = false;
        this.confirmArea.active = true;
    }

    /** 名前を確認して「はい」を押した */
    public async pressY(): Promise<void> {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemEnter);
        Events.target.emit(Events.List.StartLoading);
        this.node.active = false;
        cc.log(this.nameInput.string);
        // 入力情報からプロフィールを作成する
        let profile: Profile = new Profile();
        profile.name = this.nameInput.string;
        await MyGs2.updateProfile(profile);
        cc.sys.localStorage.setItem("profile", JSON.stringify(profile.createJSON()));
        PlayerData.profile = profile;
        
        this.hide();
        Events.target.emit(Events.List.CreateAccount);
        this.mainMenu.show();
        Events.target.emit(Events.List.EndLoading);
    }

    /** 名前を確認して「いいえ」を押した */
    public pressN(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemCancel);
        this.introductionLabel.string = "ようこそ！";
        this.nameInput.string = "";
        this.inputArea.active = true;
        this.confirmArea.active = false;
    }

    public show(): void {
        this.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
        this.nameInput.string = "";
    }
}
