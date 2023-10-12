const {ccclass, property} = cc._decorator;

@ccclass
export default class FaqListItem extends cc.Component {

    @property(cc.Label) titleLabel: cc.Label = null;

    private _id: number;

    public setup(id: number, title: string): void {
        this._id = id;
        this.titleLabel.string = title;
    }

    public pressItem(): void {
        let event: cc.Event.EventCustom = new cc.Event.EventCustom("pressItem", true);
        event.setUserData({id: this._id});
        this.node.dispatchEvent(event);
    }
}
