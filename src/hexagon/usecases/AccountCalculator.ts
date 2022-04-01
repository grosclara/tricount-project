import { Expense } from "../models/Expense";
import { User } from "../models/User";
import { ForStoringExpenses } from "../ports/driven/for.storing.expenses";
import { ForStoringUsers } from "../ports/driven/for.storing.users";
import { ForBalancingAccounts } from "../ports/driver/for.balancing.accounts";

export class AccountCalculator implements ForBalancingAccounts {
    
    expenseRepository: ForStoringExpenses
    userRepository: ForStoringUsers

    constructor(
        expenseRepository: ForStoringExpenses, 
        userRepository: ForStoringUsers
    ){
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    async getAccountBalance(): Promise<Map<User, Map<User, number>>> {
        const users: User[] = await this.userRepository.getAllUsers();
        if (users.length == 0) {
            throw new Error("No user!");
        }
        const expenses = await this.expenseRepository.getAllExpenses();
        if (expenses.length == 0) {
            const balances = new Map<User, Map<User, number>>();
            users.forEach(user => {
                balances.set(user, new Map<User, number>());
            });
            // this.printBalances(balances)
            return balances;
        }
        const totalAmountPaidByUser = new Map<String, number>();
        const rawDebts = new Map<User, Map<User, number>>();
        users.forEach(user => {
            totalAmountPaidByUser.set(user.username, 0);
            rawDebts.set(user, new Map<User, number>());
        });
        // this.printTotalAmount(totalAmountPaidByUser);

        // sum of all expenses spent by each person
        expenses.forEach(expense => {
            const { user, amount } = expense;
            const currentAmountPaidByUser: number | undefined = totalAmountPaidByUser.get(user.username)
            if (currentAmountPaidByUser == undefined) return;
            totalAmountPaidByUser.set(user.username, currentAmountPaidByUser + amount);
            // console.log(`Total amount payé updaté par ${user.username} : ${totalAmountPaidByUser.get(user.username)}`);
        });
        // this.printTotalAmount(totalAmountPaidByUser);

        // share these expenses to get a first ugly version of balances
        const userNb = users.length;
        // console.log(`On a ${userNb} users`);
        users.forEach(userWhoPaid => {
            const totalByUser = totalAmountPaidByUser.get(userWhoPaid.username);
            // console.log(`User ${userWhoPaid.username} a payé ${totalByUser}€`);
            if (!totalByUser) return;
            const amountToShare = Math.floor(totalByUser/userNb);
            for (var user of users) {
                // console.log(`User ${user.username} est bien différent de ${userWhoPaid.username}: ${user.username != userWhoPaid.username}`);
                if (user.username != userWhoPaid.username) {
                    // console.log(`${user.username} a une dette envers ${userWhoPaid.username} de ${amountToShare}`);
                    var userDebts: Map<User, number> | undefined = rawDebts.get(user);
                    var updatedDebtToUserWhoPaid: number;
                    if (userDebts == undefined) {
                        userDebts = new Map<User, number>();
                        updatedDebtToUserWhoPaid = amountToShare;
                    } else {
                        const currentUserDebtToUserWhoPaid = userDebts.get(userWhoPaid);
                        updatedDebtToUserWhoPaid = (currentUserDebtToUserWhoPaid == undefined) ? amountToShare : currentUserDebtToUserWhoPaid + amountToShare;
                    }
                    userDebts.set(
                        userWhoPaid,
                        updatedDebtToUserWhoPaid
                    );
                    // console.log(`${user.username}  - dette updatée envers ${userWhoPaid.username} : ${userDebts.get(userWhoPaid)}`);
                }
            }
        });
        // this.printBalances(rawDebts);

        // first rearrange the expenses
        // on prend chaque personne, on parcourt la liste de ses dettes
        // pour chaque dette, on regarde si le créancier lui doit aussi de l'argent, on équilibre une première fois
        users.forEach(user => {
            const userDebts: Map<User, number> | undefined = rawDebts.get(user);
            if (!userDebts) return;


            for (var [lenderName, debtAmount] of userDebts) {

                const lenderDebts = rawDebts.get(lenderName);
                if (!lenderDebts) continue;

                if (lenderDebts.has(user)) {
                    const lenderDebtAmountToUser = lenderDebts.get(user);
                    if (!lenderDebtAmountToUser) continue;
                    const lenderDebtAmountMinusUserDebtAmount = lenderDebtAmountToUser - debtAmount;

                    if (lenderDebtAmountMinusUserDebtAmount > 0) {
                        userDebts.delete(lenderName);
                        lenderDebts.set(user, lenderDebtAmountMinusUserDebtAmount);
                    } else if (lenderDebtAmountMinusUserDebtAmount < 0) {
                        userDebts.set(lenderName, -lenderDebtAmountMinusUserDebtAmount);
                        lenderDebts.delete(user);
                    } else {
                        userDebts.delete(lenderName);
                        lenderDebts.delete(user);
                    }
                }
            }
        });
        // this.printBalances(rawDebts);
        return rawDebts;

        // Proposition pour un algo plus poussé
        // pour chaque personne, on regarde si on a plus encore plus de 2 dettes. Si oui, alors on regarde chaque dette et le créancier associé
        // si le créancier a lui-même une dette envers un autre créancier de l'utilisateur qu'on regarde, on procède à un équilibrage
        // on renvoie la liste au bout de 10 itérations ou si la liste des équilibres ne changent plus entre le début et la fin d'une boucle
    }

    async getAllExpenses(): Promise<Expense[]> {
        return this.expenseRepository.getAllExpenses();
    }

    printBalances(balances: Map<User, Map<User, number>>): void {
        console.log('on print les raw debts');
        for (var [user, debts] of balances) {
            console.log('Dettes de ' + user.username);
            for (var [lender, debtAmount] of debts) {
                console.log(`Créancier : ${lender.username}, amount : ${debtAmount}`);
            }
            console.log('');
        }
    }

    printTotalAmount(totalAmount: Map<String, number>): void {
        console.log('');
        console.log('On print le total amount par personne');
        for (var [username, amount] of totalAmount) {
            console.log(`Personne qui a payé : ${username}, amount : ${amount}`);
        }
        console.log('');
    }
}
