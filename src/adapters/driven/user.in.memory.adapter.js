"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInMemoryAdapter = void 0;
class UserInMemoryAdapter {
    constructor(users) {
        this.users = users;
    }
    getAllUsers() {
        return Promise.resolve(this.users);
    }
    createUser(user) {
        this.users.push(user);
        return Promise.resolve(user);
    }
}
exports.UserInMemoryAdapter = UserInMemoryAdapter;
