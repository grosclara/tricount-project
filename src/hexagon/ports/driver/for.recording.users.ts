import User from "../../models/User";

export default interface ForRecordingUsers     
{
	CreateUser( username: string ): Promise<User>;
    GetAllUsers(): Promise<User[]> ;
}
