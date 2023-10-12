import Events from "./Events";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Sprite) emblemSprite: cc.Sprite = null;
    @property(cc.SpriteFrame) emblemSpriteFrames: cc.SpriteFrame[] = [];
    @property(cc.Node) textNodes: cc.Node[] = [];

    private colors: cc.Color[] = [
        cc.color().fromHEX("36ff2a"),
        cc.color().fromHEX("ffffff"),
        cc.color().fromHEX("8900bc"),
        cc.color().fromHEX("ff0000"),
        cc.color().fromHEX("002fff"),
        cc.color().fromHEX("ffd200"),
    ]

    public show(): void {
        this.node.opacity = 255;
        let index: number = Math.floor(Math.random() * 6);
        this.emblemSprite.spriteFrame = this.emblemSpriteFrames[index];
        for (let i: number = 0; i < this.textNodes.length; i++) {
            this.textNodes[i].color = this.colors[index];    
        }
        this.node.active = true;
        this.run();
    }

    public hide(): void {
        this.node.opacity = 0;
        this.stop();
    }

    public run(): void {
        for (let i: number = 0; i < this.textNodes.length; i++) {
            cc.tween(this.textNodes[i])
            .repeatForever(
                cc.tween(this.textNodes[i])
                .delay(.1 * i)
                .by(.4, {opacity: -255}, {easing: "sineIn"})
                .by(.4, {opacity: 255}, {easing: "sineOut"})
                .delay(1.2 - .1 * i)
                .start()
            ).start();
        }
    }

    public stop(): void {
        for (let i: number = 0; i < this.textNodes.length; i++) {
            this.textNodes[i].stopAllActions();
            this.textNodes[i].opacity = 255;
        }
    }

    protected onLoad(): void {
        Events.target.on(Events.List.StartLoading, (): void => {
            this.show();
        }, this.node);
        Events.target.on(Events.List.EndLoading, (): void => {
            this.hide();
        }, this.node);
    }

    protected onDestroy(): void {
        cc.log(Events.target);
        Events.target.targetOff(this);
    }
}
