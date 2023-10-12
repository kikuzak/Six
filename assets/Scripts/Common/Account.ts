export default class Account {
    private _accountId: string;
    private _userId: string;
    private _password: string;
    private _timeOffset: number;
    private _createdAt: number;

    constructor() {}

    public get accountId(): string {
        return this._accountId;
    }
    public set accountId(value: string) {
        this._accountId = value;
    }

    public get userId(): string {
        return this._userId;
    }
    public set userId(value: string) {
        this._userId = value;
    }

    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }

    public set timeOffset(value: number) {
        this._timeOffset = value;
    }

    public set createdAt(value: number) {
        this._createdAt = value;
    }

    public createJSON(): any {
        let data = {
            accountId: this._accountId,
            userId: this._userId,
            password: this._password,
            timeOffset: this._timeOffset,
            createdAt: this._createdAt
        }
        return data;
    }

    public parseJSON(accountData: any): void {
        this._accountId = accountData.accountId;
        this._userId = accountData.userId;
        this._password = accountData.password;
        this._timeOffset = accountData.timeOffset;
        this._accountId = accountData.accountId;
        this._createdAt = accountData.createdAt;
    }
}