import 'mocha'
import chai from 'chai';
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('ExpenseRecorder', () => {
	it.skip('GIVEN a new expense recorder, WHEN adding an expense with a negative amount, THEN it should fail with an invalid amount error');
	it.skip('GIVEN a new expense recorder, WHEN adding an expense with an unknown user, THEN it should fail with unknown user error');
	it.skip('GIVEN a new expense recorder, WHEN adding an expense with a valid amount and a known user, THEN it should add the expense to the repository');
})