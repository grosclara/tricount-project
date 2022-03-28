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

    CreateUser(username: string): User {
        throw new Error("Method not implemented.");
    }
    GetAllUsers(): User[] {
        throw new Error("Method not implemented.");
    }
}
