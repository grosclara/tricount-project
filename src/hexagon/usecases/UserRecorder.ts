import { User } from "../models/User";
import { ForStoringUsers } from "../ports/driven/for.storing.users";
import { ForRecordingUsers } from "../ports/driver/for.recording.users";
import { AlreadyExistingUserError } from "../../errors/AlreadyExistingUserError";
import { BlankUsernameError } from "../../errors/BlankUsernameError";

export class UserRecorder implements ForRecordingUsers {
    
    userRepository: ForStoringUsers

    constructor(
        userRepository: ForStoringUsers, 
    ){
        this.userRepository = userRepository;
    }

    async createUser(username: string): Promise<User> {
        if (username == '') {
            throw new BlankUsernameError('User can not have blank name');
        }
        let userToAdd = new User(username);
        const users = await this.userRepository.getAllUsers();
        users.forEach((user) => {
            if (user.username.toLowerCase() === userToAdd.username.toLowerCase()){
                throw new AlreadyExistingUserError(`User already exists error: ${username} already exists in database`, user);
            }
        })
        const createdUser = await this.userRepository.createUser(userToAdd);   

        return createdUser; 
    }
    
    async getAllUsers(): Promise<User[]> {
        return this.userRepository.getAllUsers();
    }
}
