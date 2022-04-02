import 'mocha'
import chai from 'chai';
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { CliAdapter } from '../src/adapters/driver/cli.adapter';
import { User } from '../src/hexagon/models/User';
import { AlreadyExistingUserError } from '../src/errors/AlreadyExistingUserError';
import { Expense } from '../src/hexagon/models/Expense';
import { InvalidAmountError } from '../src/errors/InvalidAmountError';
import { UnknownUserError } from '../src/errors/UnknownUserError';
import { BlankUsernameError } from '../src/errors/BlankUsernameError';

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
            expect(mockTerminal.readInput).to.be.calledWith('Do you want to create a new Tricount? [y/N] ');
        });
        it('GIVEN a Tricount with members, WHEN we start the CLI, THEN it should run the app without asking for the Tricount creation', async () => {
            // ARRANGE
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            const mockExpenseRecorder = { recordExpense: sinon.stub() }
            const mockUserRecorder = { getAllUsers: sinon.stub(), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub(), getAllExpenses: sinon.stub()}

            mockUserRecorder.getAllUsers.resolves([new User("Clara"), new User("Paul")]);
            mockTerminal.readInput.resolves('4') // exit app

            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)

            // ACT
            await cli.start();

            // ASSERT
            expect(mockTerminal.readInput).to.be.not.calledWith('Do you want to create a new Tricount? [y/N] ');
            expect(mockTerminal.print).to.be.calledWith('Welcome to your Tricount!');
        });

    }),
    describe('Create a new Tricount', () => {
        it('GIVEN a new CLI with with no previous member, WHEN one does not want to create a new Tricount, THEN it should print a goodbye message', async () => {
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            const mockExpenseRecorder = { recordExpense: sinon.stub() }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub(), getAllExpenses : sinon.stub() }

            mockTerminal.readInput.resolves('N'); // don't want to create a new Tricount

            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)

            // ACT
            await cli.start();

            // ASSERT
            expect(mockTerminal.readInput).to.be.calledWith('Do you want to create a new Tricount? [y/N] ');
            expect(mockTerminal.print).to.be.not.calledWith('Welcome to your Tricount!');
            expect(mockTerminal.print).to.be.calledWith('ok bye!');
        });

        it('GIVEN a new CLI with with no previous member, WHEN one wants to add a member with a blank username, THEN it should print a UserShouldNotHaveBlankUsername error', async () => {
            // ARRANGE
            const user1 = new User('Clara');
            const user2 = new User('Paula');
            
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            const mockExpenseRecorder = { recordExpense: sinon.stub() }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub(), getAllExpenses: sinon.stub() }

            // tricount creation
            mockUserRecorder.getAllUsers.onCall(0).resolves([]);
            mockTerminal.readInput.onCall(0).resolves('y');

            // 1st user creation
            mockTerminal.readInput.onCall(1).resolves(user1.username); // enter 1st username 
            mockUserRecorder.createUser.onCall(0).resolves(user1);
            mockUserRecorder.getAllUsers.onCall(1).resolves([user1]);

            // 2nd user creation - with blank name
            mockTerminal.readInput.onCall(2).resolves(''); // enter 2nd username
            mockUserRecorder.createUser.onCall(1).rejects(new BlankUsernameError('User can not have blank name'));
            mockUserRecorder.getAllUsers.onCall(2).resolves([user1]);

            // 2nd user creation - with correct name
            mockTerminal.readInput.onCall(3).resolves(user2.username); // enter 2nd username
            mockUserRecorder.createUser.onCall(2).resolves(user2);
            mockUserRecorder.getAllUsers.onCall(3).resolves([user1, user2]);

            // exit
            mockTerminal.readInput.onCall(4).resolves('N');
            mockUserRecorder.getAllUsers.onCall(4).resolves([user1, user2]);
            mockTerminal.readInput.onCall(5).resolves('4');

            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)

            // // ACT
            await cli.start();

            // ASSERT
            expect(mockTerminal.print).to.be.calledWith(`User can not have blank name`);
        });
        
        it.skip('GIVEN a new CLI with with one member, WHEN one wants to validate the Tricount creation with exactly 1 member, THEN it should print a warning message and ask for adding another user', async () => {
            // ARRANGE
            const user1 = new User("Clara");
            const user2 = new User('Paul');
            
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            const mockExpenseRecorder = { recordExpense: sinon.stub() }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub(), getAllExpenses: sinon.stub() }

            mockUserRecorder.getAllUsers.onCall(0).resolves([]) // 0 initial user
            mockTerminal.readInput.onCall(0).resolves('y'); // create a Tricount
            mockTerminal.readInput.onCall(1).resolves('y'); // add a user? (1st)
            mockTerminal.readInput.onCall(2).resolves(user1.username); // enter username (1st)
            mockUserRecorder.createUser.onCall(0).resolves(user1);
            mockUserRecorder.getAllUsers.onCall(1).resolves([user1]) // one initial user
            mockTerminal.readInput.onCall(3).resolves('N'); // add a user? (2nd)
            mockTerminal.readInput.onCall(4).resolves(user2.username); // enter username (2nd)
            mockUserRecorder.createUser.onCall(1).resolves(user2);
            mockTerminal.readInput.onCall(5).resolves('N'); // add a user? (3st)
            mockUserRecorder.getAllUsers.onCall(2).resolves([user1, user2]) // one initial user
            mockTerminal.readInput.onCall(6).resolves('4'); // exit

            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)

            // // ACT
            await cli.start();

            // ASSERT
            expect(mockTerminal.print).to.be.calledWith('You must add at least two members in the Tricount!');
            expect(mockUserRecorder.createUser).to.be.calledTwice;
        });

        it('GIVEN a new CLI with with no previous member, WHEN one wants to add 2 members with the same username, THEN it should print a AlreadyExistingUser error', async () => {
            // ARRANGE
            const user1 = new User("Clara");
            const user2 = new User('Paul');
            
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            const mockExpenseRecorder = { recordExpense: sinon.stub() }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub(), getAllExpenses: sinon.stub() }

            // tricount creation
            mockUserRecorder.getAllUsers.onCall(0).resolves([]);
            mockTerminal.readInput.onCall(0).resolves('y');

            // 1st user creation
            mockTerminal.readInput.onCall(1).resolves(user1.username); // enter 1st username 
            mockUserRecorder.createUser.onCall(0).resolves(user1);
            mockUserRecorder.getAllUsers.onCall(1).resolves([user1]);

            // 2nd user creation - with blank name
            mockTerminal.readInput.onCall(2).resolves(user1.username); // enter 2nd username
            mockUserRecorder.createUser.onCall(1).rejects(new AlreadyExistingUserError('err', user1));
            mockUserRecorder.getAllUsers.onCall(2).resolves([user1]);

            // 2nd user creation - with correct name
            mockTerminal.readInput.onCall(3).resolves(user2.username); // enter 2nd username
            mockUserRecorder.createUser.onCall(2).resolves(user2);
            mockUserRecorder.getAllUsers.onCall(3).resolves([user1, user2]);

            // exit
            mockTerminal.readInput.onCall(4).resolves('N');
            mockUserRecorder.getAllUsers.onCall(4).resolves([user1, user2]);
            mockTerminal.readInput.onCall(5).resolves('4');

            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)

            // // ACT
            await cli.start();

            // ASSERT
            expect(mockTerminal.print).to.be.calledWith(`User ${user1.username} is already a member!`);
        });

        it('[happy path] GIVEN a new CLI with with no previous member, WHEN one adds 2 distinct members and validate, THEN it should print a success message', async () => {
            // ARRANGE
            const user1 = new User("Clara");
            const user2 = new User('Paul');
            
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            const mockExpenseRecorder = { recordExpense: sinon.stub() }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub(), getAllExpenses: sinon.stub() }

            // tricount creation
            mockUserRecorder.getAllUsers.onCall(0).resolves([]);
            mockTerminal.readInput.onCall(0).resolves('y');

            // 1st user creation
            mockTerminal.readInput.onCall(1).resolves(user1.username); // enter 1st username 
            mockUserRecorder.createUser.onCall(0).resolves(user1);
            mockUserRecorder.getAllUsers.onCall(1).resolves([user1]);

            // 2nd user creation
            mockTerminal.readInput.onCall(2).resolves(user2.username); // enter 2nd username
            mockUserRecorder.createUser.onCall(1).resolves(user2);
            mockUserRecorder.getAllUsers.onCall(2).resolves([user1, user2]);

            // exit
            mockTerminal.readInput.onCall(3).resolves('N');
            mockUserRecorder.getAllUsers.onCall(3).resolves([user1, user2]);
            mockTerminal.readInput.onCall(4).resolves('4');

            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator);

            // // ACT
            await cli.start();

            // ASSERT
            expect(mockTerminal.print).to.be.calledWith('\nLet\'s add 2 users at least to create your tricount');
            expect(mockTerminal.readInput).to.be.calledWith('Enter a unique username: ');
            expect(mockTerminal.print).to.be.calledWith(`User ${user1.username} successfully added to the Tricount!\n`);
            expect(mockTerminal.print).to.be.calledWith('Let\'s add a second user');
            expect(mockTerminal.print).to.be.calledWith(`User ${user2.username} successfully added to the Tricount!\n`);
            expect(mockTerminal.print).to.be.calledWith("Welcome to your Tricount!");
            expect(mockTerminal.print).to.be.calledWith(`Here are the members of you Tricount:\n${user1.username}\n${user2.username}\n`);
            expect(mockTerminal.print).to.be.calledWith('ok bye!\n');

            expect(mockUserRecorder.createUser).to.be.calledWith(user1.username);
            expect(mockUserRecorder.createUser).to.be.calledWith(user2.username);
            expect(mockUserRecorder.createUser).to.be.calledTwice;
        });
    }),
    describe('Record expense', () => {
        it("[happy path] GIVEN an expense repo, WHEN adding a valid expense, THEN it should add the expense to the repository", async () => {
            // ARRANGE
            const user1 = new User("Clara");
            const user2 = new User('Paul');

            const expense = new Expense("Test expense", 10, user1);
            
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            const mockExpenseRecorder = { recordExpense: sinon.stub().resolves(expense) }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([user1, user2]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub(), getAllExpenses: sinon.stub() }

            mockTerminal.readInput.onCall(0).resolves('1'); // record expense
            mockTerminal.readInput.onCall(1).resolves(expense.user.username); // expense user
            mockTerminal.readInput.onCall(2).resolves(expense.amount); // expense amount
            mockTerminal.readInput.onCall(3).resolves(expense.title); // expense title   
            mockTerminal.readInput.onCall(4).resolves('4'); // exit   
            
            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)
            
            // ACT
            await cli.start();

            // ASSERT
            expect(mockExpenseRecorder.recordExpense).to.be.calledOnceWith(expense.title, expense.amount, expense.user.username);
            expect(mockTerminal.print).to.be.calledWith(`Expense successfully recorded: ${expense.user.username} paid ${expense.amount} for ${expense.title}!\n`);
        });
        it("GIVEN an expense repo, WHEN adding an expense with a negative amount, THEN it should not add the expense and raise an InvalidAmountError", async () => {
            // ARRANGE
            const user1 = new User("Clara");
            const user2 = new User('Paul');

            const expense = new Expense("Test expense", -10, user1);
            
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            const mockExpenseRecorder = { recordExpense: sinon.stub().rejects(new InvalidAmountError(`Invalid amount error: ${expense.amount} should be a positive integer`)) }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([user1, user2]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub(), getAllExpenses: sinon.stub() }

            mockTerminal.readInput.onCall(0).resolves('1'); // record expense
            mockTerminal.readInput.onCall(1).resolves(expense.user.username); // expense user
            mockTerminal.readInput.onCall(2).resolves(expense.amount); // expense amount
            mockTerminal.readInput.onCall(3).resolves(expense.title); // expense title   
            mockTerminal.readInput.onCall(4).resolves('4'); // exit   
            
            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)
            
            // ACT
            await cli.start();

            // ASSERT
            expect(mockTerminal.print).to.not.have.been.calledWith(`Expense successfully recorded: ${expense.user.username} paid ${expense.amount} for ${expense.title}!\n`)
            expect(mockTerminal.print).to.be.calledWith(`Invalid amount error: ${expense.amount} should be a positive integer\n`);
        });
        it("GIVEN an expense repo, WHEN adding an expense with an unknown user, THEN it should not add the expense and raise an UnknownUserError", async () => {
            // ARRANGE
            const user1 = new User("Clara");
            const user2 = new User('Paul');
            const unknownUser = new User('Jeanne');

            const expense = new Expense("Test expense", 10, unknownUser);
            
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            const mockExpenseRecorder = { recordExpense: sinon.stub().rejects(new UnknownUserError(`Unknown user error: ${expense.user.username} does not exist`)) }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([user1, user2]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub(), getAllExpenses: sinon.stub() }

            mockTerminal.readInput.onCall(0).resolves('1'); // record expense
            mockTerminal.readInput.onCall(1).resolves(expense.user.username); // expense user
            mockTerminal.readInput.onCall(2).resolves(expense.amount); // expense amount
            mockTerminal.readInput.onCall(3).resolves(expense.title); // expense title   
            mockTerminal.readInput.onCall(4).resolves('4'); // exit   
            
            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)
            
            // ACT
            await cli.start();

            // ASSERT
            expect(mockTerminal.print).to.not.have.been.calledWith(`Expense successfully recorded: ${expense.user.username} paid ${expense.amount} for ${expense.title}!\n`)
            expect(mockTerminal.print).to.be.calledWith(`Unknown user error: ${expense.user.username} does not exist\n`);
        });
    }),
    describe('Get balance', () => {
        it("[happy path] GIVEN an expense repo empty, WHEN querying balance account, THEN it should show the list of users without debts", async () => {
            // ARRANGE
            const user0 = new User("Clara");
            const user1 = new User('Paul');

            const expectedBalances: Map<User, Map<User, number>> = new Map<User, Map<User, number>>();
            const user0Debt: Map<User, number> = new Map<User, number>();
            const user1Debt: Map<User, number> = new Map<User, number>();

            expectedBalances.set(user0, user0Debt);
            expectedBalances.set(user1, user1Debt);
            
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            const mockExpenseRecorder = { recordExpense: sinon.stub() }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([user0, user1]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub().resolves(expectedBalances), getAllExpenses: sinon.stub() }

            mockTerminal.readInput.onCall(0).resolves('3'); // get balance 
            mockTerminal.readInput.onCall(1).resolves('4'); // exit   
            
            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)
            
            // ACT
            await cli.start();

            // ASSERT
            expect(mockTerminal.print).to.have.been.calledWith(
                "\nClara has no debt !\n\nPaul has no debt !\n"
            );
        });
        it("[happy path] GIVEN an expense repo not empty, WHEN querying balance account, THEN it should show the list of debtors & creditors", async () => {
            // ARRANGE
            const user0 = new User("Clara");
            const user1 = new User('Paul');

            const expectedExpenses: Map<User, Map<User, number>> = new Map<User, Map<User, number>>();
            const user0Debt: Map<User, number> = new Map<User, number>();
            const user1Debt: Map<User, number> = new Map<User, number>();
            user0Debt.set(user1, 3);
            user1Debt.set(user0, 5);

            expectedExpenses.set(user0, user0Debt);
            expectedExpenses.set(user1, user1Debt);
            
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            const mockExpenseRecorder = { recordExpense: sinon.stub() }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([user0, user1]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub().resolves(expectedExpenses), getAllExpenses: sinon.stub() }

            mockTerminal.readInput.onCall(0).resolves('3'); // get balance 
            mockTerminal.readInput.onCall(1).resolves('4'); // exit   
            
            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)
            
            // ACT
            await cli.start();

            // ASSERT
            expect(mockTerminal.print).to.have.been.calledWith("\nClara's debts\n\t- debt of 3€ to Paul\n\nPaul's debts\n\t- debt of 5€ to Clara\n")
        });
    }),
    describe('Get expenses', () => {
        it("[happy path] GIVEN an expense repo not empty, WHEN querying list of all expenses, THEN it should show the list of expenses", async () => {
            // ARRANGE
            const user0 = new User("Clara");
            const user1 = new User('Paul');

            const expense1 = new Expense("Thé & biscuits", 30, user0);
            const expense2 = new Expense("Jeu de switch Pokémon Diamant", 60, user0);
            const expense3 = new Expense("Mojito", 9, user1)

            let expenseList = '';
            [expense1, expense2, expense3].forEach(expense => expenseList = expenseList + `${expense.user.username} paid ${expense.amount} for ${expense.title}\n`);
            
            const mockTerminal = { print: sinon.stub().resolves(), readInput: sinon.stub() };
            const mockExpenseRecorder = { recordExpense: sinon.stub() }
            const mockUserRecorder = { getAllUsers: sinon.stub().resolves([user0, user1]), createUser: sinon.stub() }
            const mockAccountCalculator = { getAccountBalance: sinon.stub(), getAllExpenses: sinon.stub().resolves([expense1, expense2, expense3]) }

            mockTerminal.readInput.onCall(0).resolves('2'); // get list of expenses 
            mockTerminal.readInput.onCall(1).resolves('4'); // exit   
            
            const cli = new CliAdapter(mockTerminal, mockExpenseRecorder, mockUserRecorder, mockAccountCalculator)
            
            // ACT
            await cli.start();

            // ASSERT
            expect(mockTerminal.print).to.have.been.calledWith('List of expenses:\n');
            expect(mockTerminal.print).to.have.been.calledWith(expenseList);
        });
    })
})