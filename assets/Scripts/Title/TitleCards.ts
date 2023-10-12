import { SwitchNode } from "../Common/NodeSwitchBtn";
import { MONSTER_KEY } from "../Game/Monster/MonsterKey";
import MonsterNode from "../Game/Monster/MonsterNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TitleCards extends SwitchNode {

    @property(cc.Node) contentNode: cc.Node = null;
    @property(MonsterNode) monsterNode: MonsterNode = null;
    @property(cc.Label) nameLabel: cc.Label = null;
    @property(cc.Label) skillNameLabel: cc.Label = null;
    @property(cc.Label) textLabel: cc.Label = null;
    @property(cc.Label) adviceLabel: cc.Label = null;
    @property(cc.Label) pageIndexLabel: cc.Label = null;
    @property(cc.Sprite) emblemSprite: cc.Sprite = null;
    @property(cc.SpriteFrame) emblemSpriteFrames: cc.SpriteFrame[] = [];
    @property(cc.JsonAsset) monsterJson: cc.JsonAsset = null;

    private _currentPageIndex: number = 0;

    public start(): void {
        this._changePage();
    }

    public show(): void {
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
        this.pageIndexLabel.string = `${this._currentPageIndex + 1} / ${this.monsterJson.json.length}`;
        this.monsterNode.setup((this._currentPageIndex + 1) as MONSTER_KEY);
        this.emblemSprite.spriteFrame = this.emblemSpriteFrames[this._currentPageIndex];
        let monster = this.monsterJson.json[this._currentPageIndex];
        this.nameLabel.string = monster.name + "  " + monster.english.toUpperCase();
        this.skillNameLabel.string = monster.skillName;
        this.textLabel.string = monster.skillText;
        this.adviceLabel.string = monster.advice;
    }

    public pressPrevArrow(): void {
        if (this._currentPageIndex <= 0) this._currentPageIndex = this.monsterJson.json.length - 1;
        else this._currentPageIndex--;
        cc.tween(this.contentNode)
        .to(.1, {position: cc.v3(50, this.contentNode.y, 0), opacity: 0})
        .to(0, {position: cc.v3(-50, this.contentNode.y, 0)})
        .call((): void => {this._changePage();})
        .to(.1, {position: cc.v3(0, this.contentNode.y, 0), opacity: 255})
        .start();
    }

    public pressNextArrow(): void {
        if (this._currentPageIndex >= this.monsterJson.json.length - 1) this._currentPageIndex = 0;
        else this._currentPageIndex++;
        cc.tween(this.contentNode)
        .to(.1, {position: cc.v3(-50, this.contentNode.y, 0), opacity: 0})
        .to(0, {position: cc.v3(50, this.contentNode.y, 0)})
        .call((): void => {this._changePage();})
        .to(.1, {position: cc.v3(0, this.contentNode.y, 0), opacity: 255})
        .start();
    }
}
