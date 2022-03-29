import User from "../../models/User";

export default interface ForRecordingUsers     
{
	CreateUser( username: string ): User ;
    GetAllUsers(): User[] ;
}
