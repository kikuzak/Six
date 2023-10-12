import Events from "./Events";
import { ERROR_TIMING } from "./SystemConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ErrorView extends cc.Component {

    @property(cc.Label) textLabel: cc.Label = null;

    private _timing: ERROR_TIMING;

    /** msgを表示する */
    private _show(msg: string): void {
        this.textLabel.string = msg;
        cc.tween(this.node)
        .to(.2, {scale: 1}, {easing: "backOut"})
        .start();
    }

    public pressBtn(): void {
        cc.tween(this.node)
        .to(.2, {scale: 0}, {easing: "backOut"})
        .call((): void => {
            Events.target.emit(Events.List.ErrorConfirm, this._timing);
        })
        .start();
    }

    protected onLoad(): void {
        Events.target.on(Events.List.Error, (timing: ERROR_TIMING, msg: string): void => {
            this._timing = timing;
            this._show(msg);
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}
