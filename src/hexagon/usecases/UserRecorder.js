"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRecorder = void 0;
const User_1 = require("../models/User");
const AlreadyExistingUserError_1 = require("../../errors/AlreadyExistingUserError");
class UserRecorder {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(username) {
        let userToAdd = new User_1.User(username);
        const users = await this.userRepository.getAllUsers();
        users.forEach((user) => {
            if (user.username.toLowerCase() === userToAdd.username.toLowerCase()) {
                throw new AlreadyExistingUserError_1.AlreadyExistingUserError(`User already exists error: ${username} already exists in database`, user);
            }
        });
        const createdUser = await this.userRepository.createUser(userToAdd);
        return createdUser;
    }
    async getAllUsers() {
        return this.userRepository.getAllUsers();
    }
}
exports.UserRecorder = UserRecorder;
