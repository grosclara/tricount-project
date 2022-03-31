"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlreadyExistingUserError = void 0;
class AlreadyExistingUserError extends Error {
    constructor(msg, user) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, AlreadyExistingUserError.prototype);
        this.user = user;
    }
}
exports.AlreadyExistingUserError = AlreadyExistingUserError;
