import AudioManager from "../../Common/AudioManager";
import Events from "../../Common/Events";
import MyGs2 from "../../Common/Gs2/MyGs2";
import { AUDIO_TYPE, USER } from "../../Common/SystemConst";
import { GAME_MODE } from "../Common/GameConst";
import GameSetting from "../Common/GameSetting";
import Result from "./Result";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Setting extends cc.Component {

    @property(cc.Node) contentNode: cc.Node = null;
    @property(cc.Node) mainNode: cc.Node = null;
    @property(cc.Node) confirmNode: cc.Node = null;
    @property(cc.Slider) bgmSlider: cc.Slider = null;
    @property(cc.Slider) seSlider: cc.Slider = null;
    @property(cc.Node) btnEnterNode: cc.Node = null;
    @property(cc.Node) btnCancelNode: cc.Node = null;
    @property(Result) result: Result = null;
    @property(AudioManager) audioManager: AudioManager = null;

    start() {
        this.bgmSlider.progress = GameSetting.bgmVolume;
        this.seSlider.progress = GameSetting.seVolume;
    }

    public changeVolumeBGM(e): void {
        GameSetting.bgmVolume = e.progress;
        this.audioManager.changeVolumeBGM();
        let data = {
            bgmVolume: e.progress,
            seVolume: GameSetting.seVolume
        }
        cc.sys.localStorage.setItem("gameSetting", JSON.stringify(data));
    }
    public changeVolumeSE(e): void {
        GameSetting.seVolume = e.progress;
        let data = {
            bgmVolume: GameSetting.bgmVolume,
            seVolume: e.progress
        }
        cc.sys.localStorage.setItem("gameSetting", JSON.stringify(data));
    }

    public pressBtn(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemSelect);
        this.contentNode.active = true;
        cc.tween(this.contentNode)
        .to(.1, {opacity: 255})
        .start();
    }

    public hide(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemSelect);
        cc.tween(this.contentNode)
        .to(.1, {opacity: 0})
        .call((): void => {
            this.contentNode.active = false;
        })
        .start();
    }

    public pressResign(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemSelect);
        this.mainNode.active = false;
        this.confirmNode.active = true;
    }

    public pressY(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemEnter);
        this.hide();
        if (GameSetting.gameMode === GAME_MODE.Friend) MyGs2.postResign();
        this.result.show(USER.Opponent);
    }

    public pressN(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemCancel);
        this.confirmNode.active = false;
        this.mainNode.active = true;
    }
}
