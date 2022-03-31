"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownUserError = void 0;
class UnknownUserError extends Error {
    constructor(msg) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UnknownUserError.prototype);
    }
}
exports.UnknownUserError = UnknownUserError;
