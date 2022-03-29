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

describe('ExpenseRecorder', () => {
	it('GIVEN a new expense recorder, WHEN adding an expense with a negative amount, THEN it should fail with an invalid amount error', () => {
		// ARRANGE
		const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() }
		const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() }
		const expenseRecorder = new ExpenseRecorder(mockExpenseRepository, mockUserRepository)
	
		// ACT
		let amount = -1;
		let username = "Clara"
		let title = "Negative amount"
	
		// ASSERT
		expect(() => expenseRecorder.RecordExpense(title, amount, username)).to.throw(InvalidAmountError, 'Invalid amount error');
		expect(mockExpenseRepository.createExpense).to.have.not.been.called;
	});
	it.skip('GIVEN a new expense recorder, WHEN adding an expense with an unknown user, THEN it should fail with unknown user error');
	it.skip('GIVEN a new expense recorder, WHEN adding an expense with a valid amount and a known user, THEN it should add the expense to the repository');
})