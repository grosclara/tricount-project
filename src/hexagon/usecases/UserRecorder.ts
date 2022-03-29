import UserAlreadyExistsError from "../../errors/UserAlreadyExistsError";
import User from "../models/User";
import ForStoringUsers from "../ports/driven/for.storing.users";
import ForRecordingUsers from "../ports/driver/for.recording.users";

export class UserRecorder implements ForRecordingUsers {
    
    userRepository: ForStoringUsers

    constructor(
        userRepository: ForStoringUsers, 
    ){
        this.userRepository = userRepository;
    }

    async CreateUser(username: string): Promise<User> {
        let userToAdd = new User(username);
        const users = await this.userRepository.getAllUsers();
        users.forEach((user) => {
            if (user.username.toLowerCase() === userToAdd.username.toLowerCase()){
                throw new UserAlreadyExistsError(`User already exists error: ${username} already exists in database`);
            }
        })
        const createdUser = await this.userRepository.createUser(userToAdd);   

        return createdUser; 
    }
    async GetAllUsers(): Promise<User[]> {
        return this.userRepository.getAllUsers();
    }
}
