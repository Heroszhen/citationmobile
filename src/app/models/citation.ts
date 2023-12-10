import { Model } from "./model";

interface ICitationPhoto {
    name:string,
    url:string,
    created:string
};

export class Citation extends Model{
    _id:string = "";
    created:string = "";
    message:string = "";
    photo: Array<ICitationPhoto> = [];
    video: {
        url: String,
        kind: Number, //1 : url, 2 : share en iframe
        created: string
    }| null = null;
    user: {
        _id:string,
        firstname:string,
        lastname:string,
        photo: {
            name:string,
            url:string
        },
    } | null = null;
}
