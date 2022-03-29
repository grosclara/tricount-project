export default class InvalidAmountError extends Error {
    constructor(msg: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidAmountError.prototype);
    }
}