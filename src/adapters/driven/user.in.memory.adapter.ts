
import User from "../../hexagon/models/User"
import UserRepository from "../../hexagon/ports/driven/for.storing.users";

export class UserInMemoryAdapter implements UserRepository {

	private users: User[]
	constructor(users: User[]) {
		this.users = users;
	}
	getAllUsers(): Promise<User[]> {
		return Promise.resolve(this.users);
	}
	createUser(user: User): Promise<void> {
		this.users.push(user);
		return Promise.resolve();
	}
}
