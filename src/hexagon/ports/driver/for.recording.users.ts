import { User } from "../../models/User";

export interface ForRecordingUsers     
{
	createUser( username: string ): User ;
    getAllUsers(): User[] ;
}
