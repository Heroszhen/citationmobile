export interface IData {
    status:number,
    data:any
}

export interface ILogin {
    status:number,
    data: string
}

export interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
    prompt(): Promise<void>;
}

export interface IUser {
    firstname:string,
    lastname:string,
    email:string,
    photo: {name:string, url:string},
    roles: string[],
    created:string
}