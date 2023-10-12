import UserProfile from "../Common/Profile";
import MyGs2 from "../Common/Gs2/MyGs2";
import { SwitchNode } from "../Common/NodeSwitchBtn";
import { AUDIO_TYPE, USER } from "../Common/SystemConst";
import { OpponentData, PlayerData } from "../Common/UserData";
import { MONSTER_KEY } from "../Game/Monster/MonsterKey";
import TitleProfileListItem from "./TitleProfileListItem";
import Events from "../Common/Events";
import Profile from "../Common/Profile";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TitleProfile extends SwitchNode {

    @property(cc.Node) displayNode: cc.Node = null;
    @property(cc.Node) editNameNode: cc.Node = null;
    @property(cc.Node) editIconNode: cc.Node = null;
    @property(cc.ScrollView) scrollView: cc.ScrollView = null;
    @property(cc.Node) listContent: cc.Node = null;
    @property(cc.Node) listContentInner: cc.Node = null;
    @property(cc.Prefab) listItemPrefab: cc.Prefab = null;
    @property(cc.Label) nameLabel: cc.Label = null;
    @property(cc.Sprite) monsterSprite: cc.Sprite = null;
    @property(cc.SpriteFrame) monsterSpriteFrames: cc.SpriteFrame[] = [];
    @property(cc.EditBox) nameEditBox: cc.EditBox = null;
    @property(cc.Sprite) editMonsterSprite: cc.Sprite = null;
    @property(cc.Node) headLineNodes: cc.Node[] = [];
    @property(cc.Node) confirmResetNode: cc.Node = null;

    private readonly _margin: number = 36;
    private readonly _column: number = 3;

    private _currentIndex: number = 0;
    private _monsterLength: number = 6;

    public async show(): Promise<void> {
        Events.target.emit(Events.List.StartLoading);
        this.scrollView.scrollToTop();
        await this._setup(USER.Player);
        this.node.opacity = 0;
        this.node.active = true;
        cc.tween(this.node)
        .to(.1, {opacity: 255})
        .call((): void => {
            Events.target.emit(Events.List.EndLoading);
        })
        .start();
    }

    public hide(): void {
        cc.tween(this.node)
        .to(.1, {opacity: 0})
        .call((): void => {
            this.node.active = false;
        })
        .start();
        this.listContentInner.removeAllChildren();
    }

    public showOpponent(): void {
        this._setup(USER.Opponent);
        cc.tween(this.node)
        .to(.1, {opacity: 255})
        .start();
    }

    private async _setup(user: USER): Promise<void> {
        cc.log(PlayerData.profile);
        return new Promise((resolve) => {
            let profile: UserProfile;
            if (user === USER.Player) profile = PlayerData.profile;
            else profile = OpponentData.profile;
    
            let totalHeight: number = 0;
            let headLineHeight: number = this.headLineNodes[0].height;
            let lineHeight: number = 0;
            this.nameLabel.string = profile.name;
            this.monsterSprite.spriteFrame = this.monsterSpriteFrames[profile.icon - 1];
    
            // データ
            this.headLineNodes[1].setPosition(this.headLineNodes[0].x,  -totalHeight - this._margin)
            totalHeight += this._margin * 2 + headLineHeight;
            for (let i: number = 0; i < profile.contentData.length; i++) {
                let itemNode: cc.Node = cc.instantiate(this.listItemPrefab);
                if (lineHeight === 0) lineHeight = itemNode.height;
                let con: TitleProfileListItem = itemNode.getComponent(TitleProfileListItem);
                con.setup(profile.contentData[i]);
                itemNode.setPosition((itemNode.width + this._margin) * (i % this._column - 1), -totalHeight - (itemNode.height + this._margin) * (Math.floor(i / this._column)));
                this.listContentInner.addChild(itemNode);
            }
            totalHeight += (lineHeight + this._margin) * (Math.floor(profile.contentData.length / 3) + 1);
    
            // プレイ傾向
            this.headLineNodes[1].setPosition(this.headLineNodes[1].x,  -totalHeight - this._margin);
            totalHeight += this._margin * 2 + headLineHeight;
            for (let i: number = 0; i < profile.contentTendency.length; i++) {
                let itemNode: cc.Node = cc.instantiate(this.listItemPrefab);
                if (lineHeight === 0) lineHeight = itemNode.height;
                let con: TitleProfileListItem = itemNode.getComponent(TitleProfileListItem);
                con.setup(profile.contentTendency[i]);
                itemNode.setPosition((itemNode.width + this._margin) * (i % this._column - 1), -totalHeight - (itemNode.height + this._margin) * (Math.floor(i / this._column)));
                this.listContentInner.addChild(itemNode);
            }
            totalHeight += (lineHeight + this._margin) * (Math.floor(profile.contentTendency.length / 3) + 1);
            
            // プレイ傾向
            this.headLineNodes[2].setPosition(this.headLineNodes[2].x, -totalHeight - this._margin)
            totalHeight += this._margin * 2 + headLineHeight;
            for (let i: number = 0; i < profile.contentAchievement.length; i++) {
                let itemNode: cc.Node = cc.instantiate(this.listItemPrefab);
                if (lineHeight === 0) lineHeight = itemNode.height;
                let con: TitleProfileListItem = itemNode.getComponent(TitleProfileListItem);
                con.setup(profile.contentAchievement[i]);
                itemNode.setPosition((itemNode.width + this._margin) * (i % this._column - 1), -totalHeight - (itemNode.height + this._margin) * (Math.floor(i / this._column)));
                this.listContentInner.addChild(itemNode);
            }
            totalHeight += (lineHeight + this._margin) * (Math.floor(profile.contentAchievement.length / 3) + 1);
    
            this.listContent.height = totalHeight;
            resolve();
        });
    }

    private _saveProfile(): void {
        cc.sys.localStorage.setItem("profile", JSON.stringify(PlayerData.profile.createJSON()));
        MyGs2.updateProfile(PlayerData.profile);
    }

    public pressEditName(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemSelect);
        this.nameEditBox.string = PlayerData.profile.name;
        this.displayNode.active = false;
        this.editNameNode.active = true;
    }

    public pressEditIcon(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemSelect);
        this._currentIndex = PlayerData.profile.icon as number;
        this.editMonsterSprite.spriteFrame = this.monsterSpriteFrames[this._currentIndex - 1];
        this.displayNode.active = false;
        this.editIconNode.active = true;
    }

    public pressEnterName(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemEnter);
        if (PlayerData.profile.name !== this.nameEditBox.string) {
            // 変更があった場合
            cc.log("Name is changed.");
            PlayerData.profile.name = this.nameEditBox.string;
            this.nameLabel.string = this.nameEditBox.string;
            this._saveProfile();
        }
        this.editNameNode.active = false;
        this.displayNode.active = true;
    }

    public pressArrowPrev(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemSelect);
        if (this._currentIndex === 1) this._currentIndex = this._monsterLength;
        else this._currentIndex--;
        cc.tween(this.editMonsterSprite.node)
        .to(.1, {position: cc.v3(50, this.editMonsterSprite.node.y, 0), opacity: 0})
        .to(0, {position: cc.v3(-50, this.editMonsterSprite.node.y, 0)})
        .call((): void => {this.editMonsterSprite.spriteFrame = this.monsterSpriteFrames[this._currentIndex - 1]})
        .to(.1, {position: cc.v3(0, this.editMonsterSprite.node.y, 0), opacity: 255})
        .start();
    }

    public pressArrowNext(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemSelect);
        if (this._currentIndex === this._monsterLength) this._currentIndex = 1;
        else this._currentIndex++;
        cc.tween(this.editMonsterSprite.node)
        .to(.1, {position: cc.v3(-50, this.editMonsterSprite.node.y, 0), opacity: 0})
        .to(0, {position: cc.v3(50, this.editMonsterSprite.node.y, 0)})
        .call((): void => {this.editMonsterSprite.spriteFrame = this.monsterSpriteFrames[this._currentIndex - 1]})
        .to(.1, {position: cc.v3(0, this.editMonsterSprite.node.y, 0), opacity: 255})
        .start();
    }

    public pressEnterIcon(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemEnter);
        if (PlayerData.profile.icon as number !== this._currentIndex) {
            // 変更があった場合
            cc.log("Icon is changed.");
            PlayerData.profile.icon = this._currentIndex as MONSTER_KEY;
            this._saveProfile();
        }
        this.monsterSprite.spriteFrame = this.monsterSpriteFrames[PlayerData.profile.icon as number - 1];
        this.editIconNode.active = false;
        this.displayNode.active = true;
    }

    public pressReset(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemSelect);
        this.displayNode.active = false;
        this.confirmResetNode.active = true;
    }

    public async pressConfirmResetY(): Promise<void> {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemEnter);
        let profile: Profile = new Profile();
        profile.name = PlayerData.profile.name;
        profile.icon = PlayerData.profile.icon;
        PlayerData.profile = profile;
        cc.sys.localStorage.setItem("profile", JSON.stringify(profile.createJSON()));
        MyGs2.updateProfile(profile);
        this.listContentInner.removeAllChildren();
        await this._setup(USER.Player);
        this.confirmResetNode.active = false;
        this.displayNode.active = true;
    }

    public pressConfirmResetN(): void {
        Events.target.emit(Events.List.Sound, AUDIO_TYPE.SE_SystemCancel);
        this.confirmResetNode.active = false;
        this.displayNode.active = true;
    }
}
