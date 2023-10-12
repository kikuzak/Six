import BitmapNum from "../Common/BitmapNum";
import { ProfileContent } from "../Common/Profile";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TitleProfileListItem extends cc.Component {

    @property(cc.Label) nameLabel: cc.Label = null;
    @property(BitmapNum) bitmapNum: BitmapNum = null;
    @property(cc.Label) unitLabel: cc.Label = null;

    public setup(item: ProfileContent): void {
        this.nameLabel.string = item.key;
        this.bitmapNum.show(item.value.toString());
        if (item.unit === null || item.unit === "" || item.unit === undefined) {
            this.bitmapNum.node.x = 94;
            this.unitLabel.node.active = false;
        } else {
            this.unitLabel.string = item.unit;
        }
    }
}
