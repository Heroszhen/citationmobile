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