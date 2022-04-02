export class BlankUsernameError extends Error {

    constructor(msg: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, BlankUsernameError.prototype);
    }
} 
