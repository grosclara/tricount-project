import 'mocha'
import chai from 'chai';
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

import { Expense } from '../src/hexagon/models/Expense';
import { User } from '../src/hexagon/models/User';
import { AccountCalculator } from '../src/hexagon/usecases/AccountCalculator';

// récupérer toutes les expenses, pas d'expenses
// récupérer toutes les expenses, vérifier qu'on a les bonnes choses dedans

// calculer les balances si on a pas de user
// calculer les balances si on a pas de dépenses
// calculer les balances si on a une seule dépense
// calculer les balances si on a une seule personne qui a fait plusieurs dépenses
// calculer les balances si plusieurs personnes ont fait au moins une dépenses
// calculer les balances avec des dépenses qui ne sont pas des multiples de 3

function areBalancesEqual(balances: Map<User, Map<User, number>>, expectedBalances: Map<User, Map<User, number>>): Boolean {
    if (balances.size !== expectedBalances.size) return false;

    for (var [user, expectedUserDebts] of expectedBalances) {
        if (!balances.has(user)) return false;
        const userDebts = balances.get(user);
        if (!userDebts) return false;
        if (!areUserDebtsEquals(userDebts, expectedUserDebts)) return false;
    }
    return true;
}

function areUserDebtsEquals(debts: Map<User, number>, expectedDebts: Map<User, number>): Boolean {
    if (debts.size !== expectedDebts.size) return false;
    for (var [lender, debtAmount] of expectedDebts) {
        if (!debts.has(lender)) return false;
        if (debts.get(lender) != debtAmount || !debts.get(lender)) return false;
    }
    return true;
}

describe('Account Calculator tests', () => {
    var mockUsers: User[];

    beforeEach('parametrage', () => {
        mockUsers = [
            new User('Clara'),
            new User('Jeanne'),
            new User('Julie'),
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
        });

        it('given a tricount with some expenses when get all the expenses then it should return an array containing the expenses', async () => {
            // ARRANGE
            const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() }
            const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() }

            const mockExpenses: Expense[] = [
                new Expense(
                    "Thé & biscuits",
                    4,
                    mockUsers[0]
                ),
                new Expense(
                    "Cookies",
                    10,
                    mockUsers[1]
                ),
                new Expense(
                    "Pizza",
                    15,
                    mockUsers[2]
                )
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
            const balances: Map<User, Map<User, number>> = await accountCalculator.getAccountBalance();
            const expectedExpenses: Map<User, Map<User, number>> = new Map<User, Map<User, number>>();
            mockUsers.forEach(user => {
                expectedExpenses.set(user, new Map<User, number>());
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
            const mockExpense = new Expense("Thé & biscuits", 30, mockUsers[0])
            mockExpenseRepository.getAllExpenses.resolves([mockExpense]);

            const accountCalculator = new AccountCalculator(mockExpenseRepository, mockUserRepository);

            // ACT
            const balances = await accountCalculator.getAccountBalance();
            const expectedExpenses: Map<User, Map<User, number>> = new Map<User, Map<User, number>>();
            const defaultDebt: Map<User, number> = new Map<User, number>();
            defaultDebt.set(mockUsers[0], 10);

            mockUsers.forEach((user, ind) => {
                ind == 0 ?
                    expectedExpenses.set(user, new Map<User, number>()) : 
                    expectedExpenses.set(user, defaultDebt);
            });
    
            // ASSERT
            expect(areBalancesEqual(balances, expectedExpenses)).to.true;
            expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
            expect(mockExpenseRepository.getAllExpenses).to.have.been.calledOnce;
        });

        it('given a tricount with users and 2 expenses when compute the balances then it should return the right balance for each user', async () => {
            // ARRANGE
            const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() };
            const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() };

            mockUserRepository.getAllUsers.resolves(mockUsers);
            const mockExpenses: Expense[] = [
                new Expense(
                    "Thé & biscuits",
                    30,
                    mockUsers[0]
                ),
                new Expense(
                    "Jeu de switch Pokémon Diamant",
                    60,
                    mockUsers[0]
                )
            ];
            mockExpenseRepository.getAllExpenses.resolves(mockExpenses);

            const accountCalculator = new AccountCalculator(mockExpenseRepository, mockUserRepository);

            // ACT
            const balances = await accountCalculator.getAccountBalance();
            const expectedExpenses: Map<User, Map<User, number>> = new Map<User, Map<User, number>>();
            const defaultDebt: Map<User, number> = new Map<User, number>();
            defaultDebt.set(mockUsers[0], 30);

            mockUsers.forEach((user, ind) => {
                ind == 0 ?
                    expectedExpenses.set(user, new Map<User, number>()) : 
                    expectedExpenses.set(user, defaultDebt);
            });
    
            // ASSERT
            expect(areBalancesEqual(balances, expectedExpenses)).to.true;
            expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
            expect(mockExpenseRepository.getAllExpenses).to.have.been.calledOnce;
        });

        it('given a tricount with users and 5 expenses when compute the balance then it should return the right balance for each user', async () => {
            // ARRANGE
            const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() };
            const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() };

            mockUserRepository.getAllUsers.resolves(mockUsers);
            const mockExpenses: Expense[] = [
                new Expense(
                    "Thé & biscuits",
                    30,
                    mockUsers[0]
                ),
                new Expense(
                    "Jeu de switch Pokémon Diamant",
                    60,
                    mockUsers[0]
                ),
                new Expense(
                    "Crêpes",
                    15,
                    mockUsers[1]
                ),
                new Expense(
                    "Meuble pour le salon",
                    75,
                    mockUsers[1]
                ),
                new Expense(
                    "Rose",
                    6,
                    mockUsers[2]
                )
            ];
            mockExpenseRepository.getAllExpenses.resolves(mockExpenses);

            const accountCalculator = new AccountCalculator(mockExpenseRepository, mockUserRepository);

            // ACT
            const balances = await accountCalculator.getAccountBalance();
            const expectedExpenses: Map<User, Map<User, number>> = new Map<User, Map<User, number>>();
            const user0Debt: Map<User, number> = new Map<User, number>();

            const user1Debt: Map<User, number> = new Map<User, number>();

            const user2Debt: Map<User, number> = new Map<User, number>();
            user2Debt.set(mockUsers[0], 28);
            user2Debt.set(mockUsers[1], 28);

            expectedExpenses.set(mockUsers[0], user0Debt);
            expectedExpenses.set(mockUsers[1], user1Debt);
            expectedExpenses.set(mockUsers[2], user2Debt);
    
            // ASSERT
            expect(areBalancesEqual(balances, expectedExpenses)).to.true;
            expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
            expect(mockExpenseRepository.getAllExpenses).to.have.been.calledOnce;
        });

        it('given a tricount with 1 expense of 10€ and 3 users when compute the balances then it should \
        return an balanced array and the user who paid should pay more to balance the tricount', async () => {
            // ARRANGE
            const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() };
            const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() };

            mockUserRepository.getAllUsers.resolves(mockUsers);
            const mockExpenses: Expense[] = [
                new Expense(
                    "Thé & biscuits",
                    10,
                    mockUsers[0]
                )
            ];
            mockExpenseRepository.getAllExpenses.resolves(mockExpenses);

            const accountCalculator = new AccountCalculator(mockExpenseRepository, mockUserRepository);

            const expectedExpenses: Map<User, Map<User, number>> = new Map<User, Map<User, number>>();
            const user0Debt: Map<User, number> = new Map<User, number>();
            // user0 should pay 4€, user1 and user2 both pay 3€
            const user1Debt: Map<User, number> = new Map<User, number>();
            user1Debt.set(mockUsers[0], 3);
            const user2Debt: Map<User, number> = new Map<User, number>();
            user2Debt.set(mockUsers[0], 3);

            expectedExpenses.set(mockUsers[0], user0Debt);
            expectedExpenses.set(mockUsers[1], user1Debt);
            expectedExpenses.set(mockUsers[2], user2Debt);

            // ACT
            const balances = await accountCalculator.getAccountBalance();
    
            // ASSERT
            expect(areBalancesEqual(balances, expectedExpenses)).to.true;
            expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
            expect(mockExpenseRepository.getAllExpenses).to.have.been.calledOnce;
        })

        it('given a tricount with 2 expenses and 3 users when compute the balances then it should \
        return an balanced array where all the amount are positive', async () => {
            // ARRANGE
            const mockExpenseRepository = { getAllExpenses: sinon.stub(), createExpense: sinon.stub() };
            const mockUserRepository = { getAllUsers: sinon.stub(), createUser: sinon.stub() };

            mockUserRepository.getAllUsers.resolves(mockUsers);
            const mockExpenses: Expense[] = [
                new Expense(
                    "Thé & biscuits",
                    20,
                    mockUsers[0]
                ), 
                new Expense(
                    "Galettes des rois",
                    30,
                    mockUsers[1]
                )
            ];
            mockExpenseRepository.getAllExpenses.resolves(mockExpenses);

            const accountCalculator = new AccountCalculator(mockExpenseRepository, mockUserRepository);

            const expectedExpenses: Map<User, Map<User, number>> = new Map<User, Map<User, number>>();
            // user0 should pay 4€ to user1, user1 should have no debt and user2 should pay 4€ to user0 and 10€ to user1
            const user0Debt: Map<User, number> = new Map<User, number>();
            user0Debt.set(mockUsers[1], 4);
            const user1Debt: Map<User, number> = new Map<User, number>();
            const user2Debt: Map<User, number> = new Map<User, number>();
            user2Debt.set(mockUsers[0], 6);
            user2Debt.set(mockUsers[1], 10);

            expectedExpenses.set(mockUsers[0], user0Debt);
            expectedExpenses.set(mockUsers[1], user1Debt);
            expectedExpenses.set(mockUsers[2], user2Debt);

            // ACT
            const balances = await accountCalculator.getAccountBalance();
    
            // ASSERT
            expect(areBalancesEqual(balances, expectedExpenses)).to.true;
            expect(mockUserRepository.getAllUsers).to.have.been.calledOnce;
            expect(mockExpenseRepository.getAllExpenses).to.have.been.calledOnce;
        })
    });
})
