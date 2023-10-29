export class Citation {
    _id:string = "";
    created:string = "";
    message:string = "";
    photo: {
        name:string,
        url:string
    } | null = null;
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
