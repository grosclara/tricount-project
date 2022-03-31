"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidAmountError = void 0;
class InvalidAmountError extends Error {
    constructor(msg) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidAmountError.prototype);
    }
}
exports.InvalidAmountError = InvalidAmountError;
