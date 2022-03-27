import User from "../../models/User";

export default interface ForStoringUsers 
{
	getAllUsers(): Promise<User[]>;
	createUser(user: User): Promise<void>;
}

