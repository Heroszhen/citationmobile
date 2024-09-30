import { Model } from "./model";

export class User extends Model{
    lastname = "";
    firstname = "";
    email = "";
    file:File|null = null;

    public constructor(
        lastname = "",
        firstname = "",
        email = ""
    ) {
        super();
        this.lastname = lastname;
        this.firstname = firstname;
        this.email = email;
    }
}
