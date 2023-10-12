import { SwitchNode } from "../Common/NodeSwitchBtn";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Credit extends SwitchNode {

    public show(): void {
        this.node.opacity = 0;
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
        })
        .start();
    }
}
