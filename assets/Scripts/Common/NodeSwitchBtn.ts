import Events from "./Events";
import { AUDIO_TYPE } from "./SystemConst";

const {ccclass, property} = cc._decorator;

export abstract class SwitchNode extends cc.Component {
    abstract show(): void;
    abstract hide(): void;
}

@ccclass
export default class NodeSwitchBtn extends cc.Component {
    @property(cc.Node) fromNode: cc.Node = null;
    @property(cc.Node) toNode: cc.Node = null;

    public switch(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemSelect);
        this.fromNode.getComponent(SwitchNode).hide();
        this.toNode.getComponent(SwitchNode).show();
    }
}
