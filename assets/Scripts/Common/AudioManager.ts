import GameSetting from "../Game/Common/GameSetting";
import Events from "./Events";
import { AUDIO_TYPE } from "./SystemConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    @property(cc.AudioClip) bgmTitle: cc.AudioClip = null;
    @property(cc.AudioClip) bgmGame: cc.AudioClip = null;
    @property(cc.AudioClip) seTapToStart: cc.AudioClip = null;
    @property(cc.AudioClip) seSystemEnter: cc.AudioClip = null;
    @property(cc.AudioClip) seSystemCancel: cc.AudioClip = null;
    @property(cc.AudioClip) seSystemSelect: cc.AudioClip = null;
    @property(cc.AudioClip) seCardTurn: cc.AudioClip = null;
    @property(cc.AudioClip) seCardPlay: cc.AudioClip = null;
    @property(cc.AudioClip) seCardSelect: cc.AudioClip = null;
    @property(cc.AudioClip) seSkill: cc.AudioClip = null;
    @property(cc.AudioClip) seFairy: cc.AudioClip = null;
    @property(cc.AudioClip) seMedusa: cc.AudioClip = null;
    @property(cc.AudioClip) seCentaur: cc.AudioClip = null;
    @property(cc.AudioClip) seGhost: cc.AudioClip = null;
    @property(cc.AudioClip) sePlayerPoint: cc.AudioClip = null;
    @property(cc.AudioClip) seOpponentPoint: cc.AudioClip = null;
    @property(cc.AudioClip) seWin: cc.AudioClip = null;
    @property(cc.AudioClip) seLose: cc.AudioClip = null;

    private _bgmId: number;

    public changeVolumeBGM(): void {
        cc.audioEngine.setVolume(this._bgmId, GameSetting.bgmVolume);
    }

    public stopBGM(): void {
        cc.audioEngine.pause(this._bgmId);
    }

    public restartBGM(): void {
        cc.audioEngine.resume(this._bgmId);
    }
    
    protected onLoad(): void {
        Events.target.on(Events.List.Sound, (type: AUDIO_TYPE): void => {
            switch (type) {
                case AUDIO_TYPE.BGM_Title: this._bgmId = cc.audioEngine.play(this.bgmTitle, true, GameSetting.bgmVolume); break;
                case AUDIO_TYPE.BGM_Game: this._bgmId = cc.audioEngine.play(this.bgmGame, true, GameSetting.bgmVolume); break;
                case AUDIO_TYPE.SE_SystemEnter: cc.audioEngine.play(this.seSystemEnter, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_SystemCancel: cc.audioEngine.play(this.seSystemCancel, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_SystemSelect: cc.audioEngine.play(this.seSystemSelect, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_CardTurn: cc.audioEngine.play(this.seCardTurn, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_CardPlay: cc.audioEngine.play(this.seCardPlay, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_TapToStart: cc.audioEngine.play(this.seTapToStart, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_CardSelect: cc.audioEngine.play(this.seCardSelect, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_Skill: cc.audioEngine.play(this.seSkill, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_Fairy: cc.audioEngine.play(this.seFairy, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_Medusa: cc.audioEngine.play(this.seMedusa, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_Centaur: cc.audioEngine.play(this.seCentaur, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_Ghost: cc.audioEngine.play(this.seGhost, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_PlayerPoint: cc.audioEngine.play(this.sePlayerPoint, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_OpponentPoint: cc.audioEngine.play(this.seOpponentPoint, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_Win: cc.audioEngine.play(this.seWin, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.SE_Lose: cc.audioEngine.play(this.seLose, false, GameSetting.seVolume); break;
                case AUDIO_TYPE.Stop: cc.audioEngine.stopAll(); break;
            }
        });
    }

    protected onDestroy(): void {
        cc.audioEngine.stopAll();
        Events.target.targetOff(this.node);
    }
}