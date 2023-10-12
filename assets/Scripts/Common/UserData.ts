import { USER_ROLE } from "../Common/SystemConst";
import Account from "./Account";
import Profile from "./Profile";

export class PlayerData {
    static account: Account;
    static profile: Profile;
    static userRole: USER_ROLE;
}

export class OpponentData {
    static userId: string
    static profile: Profile;
}