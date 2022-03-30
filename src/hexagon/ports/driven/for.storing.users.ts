import { User } from "../../models/User";

export interface ForStoringUsers 
{
	getAllUsers(): Promise<User[]>;
	createUser(user: User): Promise<void>;
}
