import 'mocha'
import chai from 'chai';
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

import { ExpenseRecorder } from '../src/hexagon/usecases/ExpenseRecorder';
import { InvalidAmountError } from '../src/errors/InvalidAmountError';
import { User } from '../src/hexagon/models/User';
import { UnknownUserError } from '../src/errors/UnknownUserError';
import { Expense } from '../src/hexagon/models/Expense';

describe('ExpenseRecorder', () => {
	it('GIVEN a new expense recorder, WHEN adding an expense with a negative amount, THEN it should fail with an invalid amount error', async () => {
		// ARRANGE
		const amount = -1;
		const username = "Clara"
		const title = "Negative amount"
		
		const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() }
		const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() }
		const expenseRecorder = new ExpenseRecorder(mockExpenseRepository, mockUserRepository)
	
		// ACT
		const promise = expenseRecorder.recordExpense(title, amount, username);

		// ASSERT
		await expect(promise).to.be.rejectedWith(InvalidAmountError, `Invalid amount error: ${amount} should be a positive integer`);
		expect(mockUserRepository.getAllUsers).to.have.not.been.called;
		expect(mockExpenseRepository.createExpense).to.have.not.been.called;
	});
	it('GIVEN a new expense recorder, WHEN adding an expense with an unknown user, THEN it should fail with unknown user error', async () => {		
		// ARRANGE
		const amount = 10;
		const username = "Jeanne"
		const title = "Unknown user"

		const user = new User("Clara")
		const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() }
		const mockUserRepository = { getAllUsers: sinon.stub().resolves([user]), createUser: sinon.stub() }

		const expenseRecorder = new ExpenseRecorder(mockExpenseRepository, mockUserRepository)

		// ACT
		const promise = expenseRecorder.recordExpense(title, amount, username);

		// ASSERT
		await expect(promise).to.be.rejectedWith(UnknownUserError, `Unknown user error: ${username} does not exist yet`);
		expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
		expect(mockExpenseRepository.createExpense).to.have.not.been.called;
	});
	it('GIVEN a new expense recorder, WHEN adding a valid expense, THEN it should add the expense to the repository', async () => {
		// ARRANGE
		let amount = 10;
		let username = "Clara"
		let title = "Valid expense"

		const user = new User(username)
		const expense = new Expense(title, amount, username)

		const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub().resolves(expense) }
		const mockUserRepository = { getAllUsers: sinon.stub().resolves([user]), createUser: sinon.stub() }

		const expenseRecorder = new ExpenseRecorder(mockExpenseRepository, mockUserRepository)

		// ACT
		let promise = expenseRecorder.recordExpense(title, amount, username);
		let result = await promise;

		// ASSERT
		expect(promise).to.be.fulfilled;
		expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
		expect(mockExpenseRepository.createExpense).to.have.been.calledOnce;
		expect(result).to.eql(expense);		
	});
})
