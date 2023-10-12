import Events from "../../Common/Events";
import Profile from "../../Common/Profile";
import { USER } from "../../Common/SystemConst";
import UserIcon from "../../Common/UserIcon";
import OrbColor from "../Orb/OrbColor";
import { ORB_COLOR_KEY } from "../Orb/OrbColorKey";
import OrbData from "../Orb/OrbData";
import OrbNode from "../Orb/OrbNode";
import TotalPoint from "./TotalPoint";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreNode extends cc.Component {

    static readonly MOVE_DIST: number = 20;

    @property(UserIcon) icon: UserIcon = null;
    @property(cc.Label) nameOutput: cc.Label = null;
    @property(cc.Label) totalScoreOutput: cc.Label = null;
    @property(cc.Node) totalScoreBg: cc.Node = null;
    @property({type: cc.Enum(USER)}) user: USER = USER.Empty;
    @property(cc.Node) orbPlaceNodes: cc.Node[] = [];
    @property(cc.Prefab) orbPrefab: cc.Prefab = null;

    private _totalPoint: TotalPoint = new TotalPoint(0);
    private _acquiredOrbColorKeys: ORB_COLOR_KEY[] = []; // 集めたオーブの色の数
    private _acquiredTotalOrbNum: number = 0; // 色に関係なく、集めたオーブの合計の数
    private _acquiredOrbNumAtRound: number = 0; // 色に関係なく、このラウンドに集めたオーブの数

    get totalPoint(): TotalPoint {
        return this._totalPoint;
    }

    /** 獲得したすべてのオーブの数 */
    get acquiredTotalOrbNum(): number {
        return this._acquiredTotalOrbNum;
    }

    /** 集めたオーブの色の数 */
    get acquiredOrbColorNum(): number {
        return this._acquiredOrbColorKeys.length;
    }

    /** このラウンドに集めたオーブの数 */
    get acquiredOrbNumAtRound(): number {
        return this._acquiredOrbNumAtRound;
    }

    public setup(profile: Profile): void {
        this.icon.setup(this.user, profile.icon);
        this.totalScoreBg.color = cc.color().fromHEX(OrbData.getCodeFromMonsterKey(profile.icon));
        this.nameOutput.string = profile.name
    }

    public async earn(orbData: OrbData): Promise<void> {
        // まだ獲得していないかつオーブ獲得が3つ以下なら加算する
        let orbNode: cc.Node = cc.instantiate(this.orbPrefab);
        let con: OrbNode = orbNode.getComponent(OrbNode);
        con.setup(orbData);
        orbNode.opacity = 0;

        if (!this._own(orbData.color) && this.acquiredOrbColorNum <= 3) {
            this._acquiredOrbColorKeys.push(orbData.color.key);
            this.orbPlaceNodes[this.acquiredOrbColorNum - 1].addChild(orbNode);
            await con.putInScore();
        } else {
            this.icon.node.addChild(orbNode);
            await con.putInTotalScore();
        }

        // 合計点数と、獲得オーブ数を加算する
        this._totalPoint.add(orbData.number.value);
        this.totalScoreOutput.string = this._totalPoint.value.toString();
        this._acquiredTotalOrbNum++;
        this._acquiredOrbNumAtRound++;
    }

    /**
     * すでにその色を獲得しているかどうか
     * @param color - 調べる色
     */
    private _own(color: OrbColor): boolean {
        if (this._acquiredOrbColorKeys.indexOf(color.key) >= 0) return true;
        else return false;
    }

    protected onLoad(): void {
        Events.target.emit(Events.List.StartRound, (): void => {
            this._acquiredOrbNumAtRound = 0;
        }, this.node);
    }

    protected onDestroy(): void {
        Events.target.targetOff(this.node);
    }
}