const {ccclass, property} = cc._decorator;

@ccclass
export default class Resize extends cc.Component {

    @property(cc.Canvas) canvas: cc.Canvas = null;
    @property(cc.Node) contentsNode: cc.Node = null;

    private _initialWidth: number;
    private _initialHeight: number;

    start() {
        this._resize();
        window.addEventListener("resize", (): void => {
            this._resize();
        });
    }

    private _resize(): void {
        let w: number = window.innerWidth;
        let h: number = window.innerHeight;

        // this.canvas.node.scaleX = 0.9;

    }
}
