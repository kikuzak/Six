import { SwitchNode } from "../Common/NodeSwitchBtn";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TitleRule extends SwitchNode {

    @property(cc.Node) contentNode: cc.Node = null;
    @property(cc.Label) headLineLabel: cc.Label = null;
    @property(cc.Label) textLabel: cc.Label = null;
    @property(cc.JsonAsset) ruleJson: cc.JsonAsset = null;
    @property(cc.Label) pageIndexLabel: cc.Label = null;

    private _currentPageIndex: number = 0;

    public start() {
        this._changePage();
        this.headLineLabel.string = this.ruleJson.json[this._currentPageIndex].headline;
        this.textLabel.string = this.ruleJson.json[this._currentPageIndex].explain;
    }

    public show(): void {
        this._currentPageIndex = 0;
        this._changePage();
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

    private _changePage(): void {
        this.pageIndexLabel.string = `${this._currentPageIndex + 1} / ${this.ruleJson.json.length}`;
        this.headLineLabel.string = this.ruleJson.json[this._currentPageIndex].headline;
        this.textLabel.string = this.ruleJson.json[this._currentPageIndex].explain;
    }

    public pressPrevArrow(): void {
        if (this._currentPageIndex <= 0) this._currentPageIndex = this.ruleJson.json.length - 1;
        else this._currentPageIndex--;
        cc.tween(this.contentNode)
        .to(.1, {position: cc.v3(50, this.contentNode.y, 0), opacity: 0})
        .to(0, {position: cc.v3(-50, this.contentNode.y, 0)})
        .call((): void => {this._changePage();})
        .to(.1, {position: cc.v3(0, this.contentNode.y, 0), opacity: 255})
        .start();
    }

    public pressNextArrow(): void {
        if (this._currentPageIndex >= this.ruleJson.json.length - 1) this._currentPageIndex = 0;
        else this._currentPageIndex++;
        cc.tween(this.contentNode)
        .to(.1, {position: cc.v3(-50, this.contentNode.y, 0), opacity: 0})
        .to(0, {position: cc.v3(50, this.contentNode.y, 0)})
        .call((): void => {this._changePage();})
        .to(.1, {position: cc.v3(0, this.contentNode.y, 0), opacity: 255})
        .start();
    }
}
