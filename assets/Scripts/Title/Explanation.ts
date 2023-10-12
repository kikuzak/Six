import Loading from "../Common/Loading";
import { SwitchNode } from "../Common/NodeSwitchBtn";
import MainMenu from "./MainMenu";
import TitleRule from "./TitleRule";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Explanation extends SwitchNode {

    @property(cc.Node) logoNode: cc.Node = null;
    @property(Loading) loading: Loading = null;
    @property(MainMenu) mainMenu: MainMenu = null;
    @property(TitleRule) titleRule: TitleRule= null;

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

    public pressRule(): void {
        this.hide();
        this.titleRule.show();
    }

    public pressCards(): void {
        this.hide();
    }

    public pressDisplay(): void {
        this.hide();
    }

    public pressFaq(): void {
        this.hide();
    }

    public pressBtnBack(): void {
        this.hide();
        this.mainMenu.show();
    }
}