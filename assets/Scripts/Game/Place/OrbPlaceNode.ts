import Events from "../../Common/Events";
import { AUDIO_TYPE } from "../../Common/SystemConst";
import { OrbType } from "../Orb/Deck";
import OrbData from "../Orb/OrbData";
import OrbNode from "../Orb/OrbNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class orbPlaceNode extends cc.Component {

    @property(cc.Prefab) orbPrefab: cc.Prefab = null;
    
    private _orbData: OrbData = null;
    private _orbNode: OrbNode = null;

    get orbData(): OrbData {
        return this._orbData;
    }

    public async put(orbData: OrbData): Promise<void> {
        if (!this.isEmpty()) console.error("OrbPlace.putエラー:placeが空ではない");
        this._orbData = orbData;
        let orbNode: cc.Node = cc.instantiate(this.orbPrefab);
        this._orbNode = orbNode.getComponent(OrbNode);
        this._orbNode.setup(orbData);
        this._orbNode.faceUp();
        this.node.addChild(orbNode);
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_CardPlay);
        await this._orbNode.put();
    }

    public async remove(): Promise<OrbData> {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_CardPlay);
        let res: OrbData = this._orbData;
        this._orbData = null;
        await this._orbNode.remove();
        this._orbNode = null;
        return res;
    }

    public isEmpty(): boolean {
        if (this._orbData === null || this._orbData === void 0) return true;
        else return false;
    }

    public createJSON(): OrbType {
        return {
            color: this.orbData.color.key as number,
            number: this.orbData.number.value
        }
    }
}
