import 'mocha'
import chai from 'chai';
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

import { ExpenseInMemoryAdapter } from '../src/adapters/driven/expense.in.memory.adapter';
import Expense from '../src/hexagon/models/Expense';
import { ExpenseRecorder } from '../src/hexagon/usecases/ExpenseRecorder';

describe('ExpenseRecorder', () => {
	it('given an expense Repository when adding an expense with an invalid amount then it should fail with invalid amount error', () => {
		// ARRANGE
		const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() }
    	const expenseRecorder = new ExpenseRecorder(mockExpenseRepository)

		// ACT
		let invalidExpense = new Expense("Negative amount", -1, "Clara");

		// ASSERT
		expect(() => expenseRecorder.RecordExpense(invalidExpense)).to.throw(Error, 'Invalid amount error');
		expect(mockExpenseRepository.createExpense).to.have.not.been.called;
	});
	it('given an expense Repository when adding a valid expense then it should create the expense', () => {
		// ARRANGE
		const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() }
    	const expenseRecorder = new ExpenseRecorder(mockExpenseRepository)

		// ACT
		let validExpense = new Expense("Valid expense", 20, "Clara");
		expenseRecorder.RecordExpense(validExpense);
		
		// ASSERT
		expect(mockExpenseRepository.createExpense).to.have.been.calledOnceWithExactly(validExpense);
	})

})