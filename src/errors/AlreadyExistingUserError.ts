import { User } from "../hexagon/models/User";

export class AlreadyExistingUserError extends Error {

    user: User;

    constructor(msg: string, user: User) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, AlreadyExistingUserError.prototype);
        this.user = user;
    }
} 