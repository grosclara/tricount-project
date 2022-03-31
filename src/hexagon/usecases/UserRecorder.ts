import { User } from "../models/User";
import { ForStoringUsers } from "../ports/driven/for.storing.users";
import { ForRecordingUsers } from "../ports/driver/for.recording.users";
import { AlreadyExistingUserError } from "../../errors/AlreadyExistingUserError";

export class UserRecorder implements ForRecordingUsers {
    
    userRepository: ForStoringUsers

    constructor(
        userRepository: ForStoringUsers, 
    ){
        this.userRepository = userRepository;
    }

    async createUser(username: string): Promise<User> {
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
