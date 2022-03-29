import 'mocha'
import chai from 'chai';
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

import { UserInMemoryAdapter } from '../src/adapters/driven/user.in.memory.adapter';
import User from '../src/hexagon/models/User';
import { UserRecorder } from '../src/hexagon/usecases/UserRecorder';
import UserAlreadyExistsError from '../src/errors/UserAlreadyExistsError';

// There is a user named Sophie, I try to add another one named Sophie : fail 
// There is a user named Sophie, I try to add another one named sophie : fail 
// There is a user named Sophie, I try to add another one named Sophie G. : OK
// Get all users when ther is no users : empty
// Get all users when one user is creatd 
// Get all users when there are 2 users


describe('User Recorder', () => {
	it('given an user Repository without any user, when adding a user with a username "Sophie" then it should add the user', async () => {
		// ARRANGE
		let username = 'Sophie';
		let firstUser = new User(username);

		const mockUserRepository = { getAllUsers: sinon.stub().resolves([]), createUser: sinon.stub().resolves(firstUser) };
    	const userRecorder = new UserRecorder(mockUserRepository);

		// ACT
		let result = await userRecorder.CreateUser(username);

		// ASSERT
		expect(mockUserRepository.createUser).to.have.been.calledOnce;
		expect(result).to.eql(firstUser);
	});

	it('given an user Repository with a user "Sophie", when adding a user with a username "Sophie" then it should fail with error "Already exists"', async () => {
		// ARRANGE
		let username = 'Sophie';
		let firstUser = new User(username);

		const mockUserRepository = { getAllUsers: sinon.stub().resolves([firstUser]), createUser: sinon.stub() };
    	const userRecorder = new UserRecorder(mockUserRepository);

		// ACT
		const promise = userRecorder.CreateUser(username);
	
		// ASSERT
		await expect(promise).to.be.rejectedWith(UserAlreadyExistsError, `User already exists error: ${username} already exists in database`);
		expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
		expect(mockUserRepository.createUser).to.not.have.been.called;
	});

	it('given an user Repository with a user "Sophie", when adding a user with a username "sophie" then it should fail with error "Already exists"', async () => {
		// ARRANGE
		let usernameInDB = 'Sophie';
		let usernameToAdd = 'sophie';
		let userInDB = new User(usernameInDB);

		const mockUserRepository = { getAllUsers: sinon.stub().resolves([userInDB]), createUser: sinon.stub() };
    	const userRecorder = new UserRecorder(mockUserRepository);

		// ACT
		const promise = userRecorder.CreateUser(usernameToAdd);
	
		// ASSERT
		await expect(promise).to.be.rejectedWith(UserAlreadyExistsError, `User already exists error: ${usernameToAdd} already exists in database`);
		expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
		expect(mockUserRepository.createUser).to.not.have.been.called;
	});

	it('given an user Repository with a user named "Sophie", when adding a user with a username "Sophie G" then it should add the user', async () => {
		// ARRANGE
		let usernameInDB = 'Sophie';
		let usernameToAdd = 'Sophie G'
		let userInDB = new User(usernameInDB);
		let userToAdd = new User(usernameToAdd);

		const mockUserRepository = { getAllUsers: sinon.stub().resolves([ userInDB ]), createUser: sinon.stub().resolves(userToAdd) };
    	const userRecorder = new UserRecorder(mockUserRepository);

		// ACT
		let result = await userRecorder.CreateUser(usernameToAdd);

		// ASSERT
		expect(mockUserRepository.createUser).to.have.been.calledOnce;
		expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
		expect(result).to.eql(userToAdd);
	});
})