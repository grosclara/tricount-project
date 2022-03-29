export default class UserAlreaydExistsError extends Error {
    constructor(msg: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UserAlreaydExistsError.prototype);
    }
}