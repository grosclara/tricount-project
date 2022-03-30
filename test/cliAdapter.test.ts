import 'mocha'
import chai from 'chai';
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import User from '../src/hexagon/models/User';
import Terminal from '../src/adapters/driver/terminal-helper';
import CliAdapter from '../src/adapters/driver/cli.adapter';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('CliAdapter', () => {

    // var mockUsers: User[];

    // beforeEach('parametrage', () => {
    //     mockUsers = [
    //         new User("Clara"),
    //         new User("Paul"),
    //         new User("Jeanne")
    //     ];
    // });
    
    describe('Start the CLI', () => {
        it('GIVEN a Tricount, WHEN we start the CLI, THEN it should print a welcome message', async () => {
            // ARRANGE
            const mockTerminal = { print: sinon.stub(), readInput: sinon.stub() };
            const mockExpenseRecorder = { RecordExpense: sinon.stub() }
            const mockUserRecorder = { GetAllUsers: sinon.stub(), CreateUser: sinon.stub() }
            const mockAccountCalculator = { GetAccountBalance: sinon.stub() }

            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)

            // ACT
    		await cli.start();

            // ASSERT
            expect(mockTerminal.print).to.be.calledOnceWith('Hello, I\'m the Tricount CLI :)\n');
        });
        it.skip('GIVEN a new CLI with no previous member, WHEN we start the CLI, THEN it should ask for creating a new Tricount');
        it.skip('GIVEN a Tricount with members, WHEN we start the CLI, THEN it should run the app without asking for the Tricount creation');

    }),
    describe('Create a new Tricount', () => {
        it.skip('GIVEN a new CLI with with no previous member, WHEN one does not want to create a new Tricount, THEN it should print a goodbye message');
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to create a new Tricount, THEN it should ask for adding a member to the Tricount');
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to validate the Tricount creation with exactly 1 member, THEN it should print a warning message and ask for adding another user');
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to add 2 members with the same username, THEN it should print a AlreadyExistingUser error');
        it.skip('[happy path] GIVEN a new CLI with with no previous member, WHEN one adds 2 distinct members and validate, THEN it should print a success message');
    })
    describe('Create a new Tricount', () => {
        it.skip('GIVEN a new CLI with with no previous member, WHEN one does not want to create a new Tricount, THEN it should print a goodbye message');
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to create a new Tricount, THEN it should ask for adding a member to the Tricount');
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to validate the Tricount creation with exactly 1 member, THEN it should print a warning message and ask for adding another user');
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to add 2 members with the same username, THEN it should print a AlreadyExistingUser error');
        it.skip('[happy path] GIVEN a new CLI with with no previous member, WHEN one adds 2 distinct members and validate, THEN it should print a success message');
    })
})