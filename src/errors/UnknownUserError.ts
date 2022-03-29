export default class UnknownUserError extends Error {
    constructor(msg: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UnknownUserError.prototype);
    }
}
