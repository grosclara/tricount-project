import 'mocha'
import chai from 'chai';
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

import Expense from '../src/hexagon/models/Expense';
import User from '../src/hexagon/models/User';
import { AccountCalculator } from '../src/hexagon/usecases/AccountCalculator';

// récupérer toutes les expenses, pas d'expenses
// récupérer toutes les expenses, vérifier qu'on a les bonnes choses dedans

// calculer les balances si on a pas de user
// calculer les balances si on a pas de dépenses
// calculer les balances si on a une seule dépense
// calculer les balances si on a une seule personne qui a fait plusieurs dépenses
// calculer les balances si plusieurs personnes ont fait au moins une dépenses
// calculer les balances avec des dépenses qui ne sont pas des multiples de 3

function areBalancesEqual(balances: Map<String, Map<String, number>>, expectedBalances: Map<String, Map<String, number>>): Boolean {
    if (balances.size !== expectedBalances.size) return false;

    for (var [userName, expectedUserDebts] of expectedBalances) {
        if (!balances.has(userName)) return false;
        const userDebts = balances.get(userName);
        if (!userDebts) return false;
        if (!areUserDebtsEquals(userDebts, expectedUserDebts)) return false;
    }
    return true;
}

function areUserDebtsEquals(debts: Map<String, number>, expectedDebts: Map<String, number>): Boolean {
    if (debts.size !== expectedDebts.size) return false;
    for (var [lenderName, debtAmount] of expectedDebts) {
        if (!debts.has(lenderName)) return false;
        if (debts.get(lenderName) != debtAmount || !debts.get(lenderName)) return false;
    }
    return true;
}

describe('Account Calculator tests', () => {
    var mockUsers: User[];

    beforeEach('parametrage', () => {
        mockUsers = [
            { username: 'Clara'},
            { username: 'Jeanne'},
            { username: 'Julie'}
        ];
    });

    describe('getAllExpenses', () => {
        it('given a tricount without expenses when get all the expenses then it should return an empty array', async () => {
            // ARRANGE
            const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() }
            const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() }
            mockExpenseRepository.getAllExpenses.resolves([]);
            const accountCalculator = new AccountCalculator(mockExpenseRepository, mockUserRepository)

            // ACT
            const expenses = await accountCalculator.getAllExpenses();
            const expectedExpenses: any[] = []
    
            // ASSERT
            expect(expenses).to.be.deep.equal(expectedExpenses)
            expect(mockExpenseRepository.getAllExpenses).to.have.been.calledOnce;

            // expect( async () => accountCalculator.getAllExpenses()).to.throw(Error, 'Invalid amount error');
            // expect(mockExpenseRepository.createExpense).to.have.not.been.called;
        });

        it('given a tricount with some expenses when get all the expenses then it should return an array containing the expenses', async () => {
            // ARRANGE
            const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() }
            const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() }

            const mockExpenses: Expense[] = [
                {
                    id: 1,
                    username: "Clara G",
                    amount: 4,
                    title: "Thé & biscuits"
                },
                {
                    id: 2,
                    username: "Jeanne",
                    amount: 10,
                    title: "Cookies"
                },
                {
                    id: 3,
                    username: "Julie",
                    amount: 15,
                    title: "Pizza"
                }
            ];
            mockExpenseRepository.getAllExpenses.resolves(mockExpenses);
            const accountCalculator = new AccountCalculator(mockExpenseRepository, mockUserRepository)

            // ACT
            const expenses = await accountCalculator.getAllExpenses();
    
            // ASSERT
            expect(expenses).to.be.deep.equal(mockExpenses)
            expect(mockExpenseRepository.getAllExpenses).to.have.been.calledOnce;
        })
    });

    describe('Compute Balance tests', () => {
        it('given a tricount without users when compute the balances then it should throw a no user error', async () => {
            // ARRANGE
            const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() }
            const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() }
            mockUserRepository.getAllUsers.resolves([]);
            const accountCalculator = new AccountCalculator(mockExpenseRepository, mockUserRepository)
    
            // ACT & ASSERT
            await expect(accountCalculator.getAccountBalance()).to.be.rejectedWith(Error, 'No user!');
            expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
        });

        it('given a tricount with users and without expenses when compute the balances then it should return 0 for each user', async () => {
            // ARRANGE
            const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() };
            const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() };

            mockUserRepository.getAllUsers.resolves(mockUsers);
            mockExpenseRepository.getAllExpenses.resolves([]);

            const accountCalculator = new AccountCalculator(mockExpenseRepository, mockUserRepository);

            // ACT
            const balances: Map<String, Map<String, number>> = await accountCalculator.getAccountBalance();
            const expectedExpenses: Map<String, Map<String, number>> = new Map<String, Map<String, number>>();
            mockUsers.forEach(user => {
                expectedExpenses.set(user.username, new Map<String, number>());
            });
    
            // ASSERT
            expect(areBalancesEqual(balances, expectedExpenses)).to.true;
            expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
            expect(mockExpenseRepository.getAllExpenses).to.have.been.calledOnce;
        });

        it('given a tricount with users and 1 expense when compute the balances then it should return the right balance for each user', async () => {
            // ARRANGE
            const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() };
            const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() };

            mockUserRepository.getAllUsers.resolves(mockUsers);
            const mockExpense: Expense = {
                id: 1,
                username: "Clara",
                amount: 30,
                title: "Thé & biscuits"
            };
            mockExpenseRepository.getAllExpenses.resolves([mockExpense]);

            const accountCalculator = new AccountCalculator(mockExpenseRepository, mockUserRepository);

            // ACT
            const balances = await accountCalculator.getAccountBalance();
            const expectedExpenses: Map<String, Map<String, number>> = new Map<String, Map<String, number>>();
            const defaultDebt: Map<String, number> = new Map<String, number>();
            defaultDebt.set("Clara", 10);

            mockUsers.forEach((user, ind) => {
                ind == 0 ?
                    expectedExpenses.set(user.username, new Map<String, number>()) : 
                    expectedExpenses.set(user.username, defaultDebt);
            });
    
            // ASSERT
            expect(areBalancesEqual(balances, expectedExpenses)).to.true;
            expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
            expect(mockExpenseRepository.getAllExpenses).to.have.been.calledOnce;
        });

        it('given a tricount with users and 2 expense when compute the balances then it should return the right balance for each user', async () => {
            // ARRANGE
            const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() };
            const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() };

            mockUserRepository.getAllUsers.resolves(mockUsers);
            const mockExpenses: Expense[] = [{
                id: 1,
                username: "Clara",
                amount: 30,
                title: "Thé & biscuits"
            }, {
                id: 2,
                username: "Clara",
                amount: 60,
                title: "Jeu de switch Pokémon Diamant"
            }];
            mockExpenseRepository.getAllExpenses.resolves(mockExpenses);

            const accountCalculator = new AccountCalculator(mockExpenseRepository, mockUserRepository);

            // ACT
            const balances = await accountCalculator.getAccountBalance();
            const expectedExpenses: Map<String, Map<String, number>> = new Map<String, Map<String, number>>();
            const defaultDebt: Map<String, number> = new Map<String, number>();
            defaultDebt.set("Clara", 30);

            mockUsers.forEach((user, ind) => {
                ind == 0 ?
                    expectedExpenses.set(user.username, new Map<String, number>()) : 
                    expectedExpenses.set(user.username, defaultDebt);
            });
    
            // ASSERT
            expect(areBalancesEqual(balances, expectedExpenses)).to.true;
            expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
            expect(mockExpenseRepository.getAllExpenses).to.have.been.calledOnce;
        });

        it('given a tricount with users and 2 expense when compute the balances then it should return the right balance for each user', async () => {
            // ARRANGE
            const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() };
            const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() };

            mockUserRepository.getAllUsers.resolves(mockUsers);
            const mockExpenses: Expense[] = [{
                id: 1,
                username: mockUsers[0].username,
                amount: 30,
                title: "Thé & biscuits"
            }, {
                id: 2,
                username: mockUsers[0].username,
                amount: 60,
                title: "Jeu de switch Pokémon Diamant"
            }, {
                id: 3,
                username: mockUsers[1].username,
                amount: 15,
                title: "Crêpes"
            }, {
                id: 4,
                username: mockUsers[1].username,
                amount: 75,
                title: "Meuble pour le salon"
            }, {
                id: 5,
                username: mockUsers[2].username,
                amount: 6,
                title: "Rose"
            }];
            mockExpenseRepository.getAllExpenses.resolves(mockExpenses);

            const accountCalculator = new AccountCalculator(mockExpenseRepository, mockUserRepository);

            // ACT
            const balances = await accountCalculator.getAccountBalance();
            const expectedExpenses: Map<String, Map<String, number>> = new Map<String, Map<String, number>>();
            const user0Debt: Map<String, number> = new Map<String, number>();

            const user1Debt: Map<String, number> = new Map<String, number>();

            const user2Debt: Map<String, number> = new Map<String, number>();
            user2Debt.set(mockUsers[0].username, 28);
            user2Debt.set(mockUsers[1].username, 28);

            expectedExpenses.set(mockUsers[0].username, user0Debt);
            expectedExpenses.set(mockUsers[1].username, user1Debt);
            expectedExpenses.set(mockUsers[2].username, user2Debt);
    
            // ASSERT
            expect(areBalancesEqual(balances, expectedExpenses)).to.true;
            expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
            expect(mockExpenseRepository.getAllExpenses).to.have.been.calledOnce;
        });

        it('given a tricount with 1 expense of 10€ and 3 users when compute the balances then it should return an balanced array', async () => {
            // ARRANGE
            const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() };
            const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() };

            mockUserRepository.getAllUsers.resolves(mockUsers);
            const mockExpenses: Expense[] = [{
                id: 1,
                username: mockUsers[0].username,
                amount: 10,
                title: "Thé & biscuits"
            }];
            mockExpenseRepository.getAllExpenses.resolves(mockExpenses);

            const accountCalculator = new AccountCalculator(mockExpenseRepository, mockUserRepository);

            const expectedExpenses: Map<String, Map<String, number>> = new Map<String, Map<String, number>>();
            const user0Debt: Map<String, number> = new Map<String, number>();
            const user1Debt: Map<String, number> = new Map<String, number>();
            user1Debt.set(mockUsers[0].username, 3);
            const user2Debt: Map<String, number> = new Map<String, number>();
            user2Debt.set(mockUsers[0].username, 3);

            expectedExpenses.set(mockUsers[0].username, user0Debt);
            expectedExpenses.set(mockUsers[1].username, user1Debt);
            expectedExpenses.set(mockUsers[2].username, user2Debt);

            // ACT
            const balances = await accountCalculator.getAccountBalance();
    
            // ASSERT
            expect(areBalancesEqual(balances, expectedExpenses)).to.true;
            expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
            expect(mockExpenseRepository.getAllExpenses).to.have.been.calledOnce;
        })
    });
})