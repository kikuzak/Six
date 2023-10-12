const {ccclass, property} = cc._decorator;

@ccclass
export default class FairyTarget extends cc.Component {

    @property(cc.Node) partsNode: cc.Node = null;

    public show(): void {
        cc.tween(this.partsNode)
        .repeatForever(
            cc.tween(this.partsNode)
            .to(.4, {scale: 1.2}, {easing: "sineIn"})
            .to(.2, {scale: 1}, {easing: "sineOut"})
            .start()
        )
        .start();
    }

    public remomve(): void {
        this.node.stopAllActions();
        this.node.parent.removeChild(this.node);
    }
}
