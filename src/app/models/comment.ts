import { Model } from "./model";

export class Comment extends Model{
    _id:string = "";
    created:string = "";
    message:string = "";
    user: {
        _id:string,
        firstname:string,
        lastname:string,
        photo: {
            name:string,
            url:string
        }
    }
}