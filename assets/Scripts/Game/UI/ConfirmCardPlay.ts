import Events from "../../Common/Events";
import { AUDIO_TYPE } from "../../Common/SystemConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ConfirmCardPlay extends cc.Component {

    @property(cc.Node) btnBoard: cc.Node = null;
    @property(cc.Node) hideAreaNode: cc.Node = null;

    public show(): void {
        this.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
    }

    public onPressBtnEnter(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemEnter);
        Events.target.emit(Events.List.EnterCard);
        this.hide();
    }

    public onPressBtnCance(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemCancel);
        Events.target.emit(Events.List.DeselectPlace);
        this.hide();
    }

    protected onLoad(): void {
        // ---------- Touch Events ----------
        this.btnBoard.on(cc.Node.EventType.TOUCH_START, ():void => {
            this.hideAreaNode.active = false;
        }, this.node);
        this.btnBoard.on(cc.Node.EventType.TOUCH_END, ():void => {
            this.hideAreaNode.active = true;
        }, this.node);
        this.btnBoard.on(cc.Node.EventType.TOUCH_CANCEL, ():void => {
            this.hideAreaNode.active = true;
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}
