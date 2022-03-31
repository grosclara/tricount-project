import { User } from "../../models/User";

export interface ForRecordingUsers     
{
	createUser( username: string ): Promise<User> ;
    getAllUsers(): Promise<User[]> ;
}
