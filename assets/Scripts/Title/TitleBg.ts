const {ccclass, property} = cc._decorator;

@ccclass
export default class TitleBg extends cc.Component {

    @property(cc.Node) orbNodes: cc.Node[] = [];
    @property(cc.Node) logoNode: cc.Node = null;
    @property(cc.Sprite) bgSprite: cc.Sprite = null;

    public showAll(): void {
        this.orbNodes.forEach((v): void => {v.active = true;});
        this.logoNode.active = true;
        this.bgSprite.node.active = true;
    }

    public showOrbs(): void {
        this.orbNodes.forEach((v): void => {v.active = true;});
    }

    public hideOrbs(): void {
        this.orbNodes.forEach((v): void => {v.active = false;});
    }

    public showLogo(): void {
        this.logoNode.active = true;
    }

    public hideLogo(): void {
        this.logoNode.active = false;
    }

    public showBg(): void {
        this.bgSprite.node.active = true;
    }

    public hideBg(): void {
        this.bgSprite.node.active = false;
    }
}
