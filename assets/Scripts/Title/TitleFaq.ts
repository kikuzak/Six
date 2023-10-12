import Events from "../Common/Events";
import { SwitchNode } from "../Common/NodeSwitchBtn";
import { ERROR_TIMING } from "../Common/SystemConst";
import FaqListItem from "./TitleFaqItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TitleFaq extends SwitchNode {

    @property(cc.Node) listNode: cc.Node = null;
    @property(cc.Node) detailNode: cc.Node = null;
    @property(cc.Prefab) listItemPrefab: cc.Prefab = null;
    @property(cc.Node) listContentNode: cc.Node = null;
    @property(cc.JsonAsset) faqJson: cc.JsonAsset = null;
    @property(cc.Label) titleLabel: cc.Label = null;
    @property(cc.Label) textLabel: cc.Label = null;
    @property(cc.Node) detailBackBtnNode: cc.Node = null;

    start() {
        this.node.on("pressItem", (e: cc.Event.EventCustom): void => {
            this.showDetail(e.getUserData().id);
        });
    }

    public show(): void {
        let height: number = 0;
        for (let i: number = 0; i < this.faqJson.json.length; i++) {
            let itemNode: cc.Node = cc.instantiate(this.listItemPrefab);
            let item: FaqListItem = itemNode.getComponent(FaqListItem);
            item.setup(this.faqJson.json[i].id, this.faqJson.json[i].title);
            itemNode.setPosition(0, -itemNode.height * i);
            if (height === 0) height = itemNode.height;
            this.listContentNode.addChild(itemNode);
        }
        this.listContentNode.height = height * this.faqJson.json.length;
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
            this.listNode.active = true;
            this.detailNode.active = false;
            this.listContentNode.removeAllChildren();
        })
        .start();
    }

    public showDetail(id: number): void {
        let item = this.faqJson.json.find((v) => v.id === id);
        this.titleLabel.string = item.title;
        this.textLabel.string = item.text;

        cc.tween(this.listNode)
        .to(.1, {opacity: 0})
        .call((): void => {this.listNode.active = false;})
        .start();

        this.detailNode.opacity = 0;
        this.detailNode.active = true;
        cc.tween(this.detailNode)
        .to(.1, {opacity: 255})
        .start();
    }

    public pressDetailBackBtn(): void {
        cc.tween(this.detailNode)
        .to(.1, {opacity: 0})
        .call((): void => {this.detailNode.active = false})
        .start();

        this.listNode.active = true;
        cc.tween(this.listNode)
        .to(.1, {opacity: 255})
        .start();
    }

    protected onLoad(): void {
        Events.target.on(Events.List.ErrorConfirm, (timing: ERROR_TIMING): void => {
            if (timing === ERROR_TIMING.Title) {
                this.hide();
            }
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}
