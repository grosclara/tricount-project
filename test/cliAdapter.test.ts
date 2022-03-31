import 'mocha'
import chai from 'chai';
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { CliAdapter } from '../src/adapters/driver/cli.adapter';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('CliAdapter', () => {    
    describe('Start the CLI', () => {
        it('GIVEN a Tricount, WHEN we start the CLI, THEN it should print a welcome message', async () => {
            // ARRANGE
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub().resolves('') };
            const mockExpenseRecorder = { recordExpense: sinon.stub() }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub(), getAllExpenses : sinon.stub() }

            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)

            // ACT
    		await cli.start();

            // ASSERT
            expect(mockTerminal.print).to.be.calledWith('Hello, I\'m the Tricount CLI :)\n');
        });
        it('GIVEN a new CLI with no previous member, WHEN we start the CLI, THEN it should ask for creating a new Tricount', async () => {
            // ARRANGE
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub().resolves('') };
            const mockExpenseRecorder = { recordExpense: sinon.stub() }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub(), getAllExpenses : sinon.stub() }

            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)

            // ACT
            await cli.start();

            // ASSERT
            expect(mockTerminal.readInput).to.be.calledWith('\nDo you want to create a new Tricount? [y/N] ');
        });
        it.skip('GIVEN a Tricount with members, WHEN we start the CLI, THEN it should run the app without asking for the Tricount creation', async () => {
            // // ARRANGE
            // const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub().resolves('') };
            // const mockExpenseRecorder = { RecordExpense: sinon.stub() }
            // const mockUserRecorder = { GetAllUsers: sinon.stub(), CreateUser: sinon.stub() }
            // const mockAccountCalculator = { GetAccountBalance: sinon.stub() }

            // mockUserRecorder.GetAllUsers.resolves([new User("Clara"), new User("Paul")]);

            // const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)

            // // ACT
            // await cli.start();

            // // ASSERT
            // expect(mockTerminal.readInput).to.be.not.calledWith('\nDo you want to create a new Tricount? [y/N] ');
            // expect(mockTerminal.print).to.be.calledWith('Welcome to your Tricount!');

        });

    }),
    describe('Create a new Tricount', () => {
        it('GIVEN a new CLI with with no previous member, WHEN one does not want to create a new Tricount, THEN it should print a goodbye message', async () => {
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            const mockExpenseRecorder = { recordExpense: sinon.stub() }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub(), getAllExpenses : sinon.stub() }

            mockTerminal.readInput.resolves('N');

            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)

            // ACT
            await cli.start();

            // ASSERT
            expect(mockTerminal.readInput).to.be.calledWith('\nDo you want to create a new Tricount? [y/N] ');
            expect(mockTerminal.print).to.be.not.calledWith('Welcome to your Tricount!');
            expect(mockTerminal.print).to.be.calledWith('ok bye!\n');
        });
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to create a new Tricount, THEN it should ask for adding a member to the Tricount', async () => {
            // const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            // const mockExpenseRecorder = { RecordExpense: sinon.stub() }
            // const mockUserRecorder = { GetAllUsers: sinon.stub().resolves([]), CreateUser: sinon.stub().resolves(new User('Clara')) }
            // const mockAccountCalculator = { GetAccountBalance: sinon.stub() }

            // mockTerminal.readInput.onCall(0).resolves('y'); // create Tricount
            // mockTerminal.readInput.onCall(1).resolves('Clara'); // name of the first user
            // mockTerminal.readInput.onCall(2).resolves('y'); // add second user
            // mockTerminal.readInput.onCall(3).resolves('Clara'); // name of the second user
            // mockTerminal.readInput.onCall(4).resolves('N'); // add thrid user?

            // mockUserRecorder.GetAllUsers.onCall(0).resolves([]);
            // mockUserRecorder.GetAllUsers.onCall(1).resolves([new User("Clara"), new User("Paul")]);

            // const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)

            // // ACT
            // await cli.start();

            // // ASSERT
            // expect(mockTerminal.readInput).to.be.calledWith('\nDo you want to create a new Tricount? [y/N] ');
            // expect(mockTerminal.readInput).to.be.calledWith('\nEnter a unique username: ');
        });
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to validate the Tricount creation with exactly 1 member, THEN it should print a warning message and ask for adding another user', async () => {
            // // ARRANGE
            // const user = new User("Clara");
            
            // const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            // const mockExpenseRecorder = { RecordExpense: sinon.stub() }
            // const mockUserRecorder = { GetAllUsers: sinon.stub().resolves([]), CreateUser: sinon.stub().resolves(user) }
            // const mockAccountCalculator = { GetAccountBalance: sinon.stub() }

            // mockTerminal.readInput.onCall(0).resolves('y'); // do you want to create a new Tricount
            // mockTerminal.readInput.onCall(1).resolves('Clara'); // enter a unique username
            // mockTerminal.readInput.onCall(2).resolves('N'); // add another user?
            // mockTerminal.readInput.onCall(3).resolves('Paul'); // add another user?

            // mockUserRecorder.GetAllUsers.onCall(0).resolves([]);
            // mockUserRecorder.GetAllUsers.onCall(1).resolves([new User("Clara")]);
            // mockUserRecorder.GetAllUsers.onCall(2).resolves([new User("Clara"), new User('Paul')]);

            // const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)

            // // ACT
            // await cli.start();

            // // ASSERT
            // expect(mockTerminal.readInput).to.be.calledTwice.with('\nEnter a unique username: ');
            // expect(mockUserRecorder.CreateUser).to.be.calledTwice.with('Clara', 'Paul');
            // expect(mockTerminal.print).to.be.calledTwice.with(`User ${user.username} successfully added to the Tricount!`);
            // expect(mockTerminal.print).to.be.calledWith('You must add at least two members in the Tricount!');

        });
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to add 2 members with the same username, THEN it should print a AlreadyExistingUser error');
        it.skip('[happy path] GIVEN a new CLI with with no previous member, WHEN one adds 2 distinct members and validate, THEN it should print a success message');
    })
})