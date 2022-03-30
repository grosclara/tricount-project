import Expense from "../models/Expense";
import User from "../models/User";
import ForStoringExpenses from "../ports/driven/for.storing.expenses";
import ForStoringUsers from "../ports/driven/for.storing.users";
import ForBalancingAccounts from "../ports/driver/for.balancing.accounts";

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
            return balances;
        }
        const totalAmountPaidByUser = new Map<User, number>();
        const rawDebts = new Map<User, Map<User, number>>();
        users.forEach(user => {
            totalAmountPaidByUser.set(user, 0);
            rawDebts.set(user, new Map<User, number>());
        });

        // sum of all expenses spent by each person
        expenses.forEach(expense => {
            const { user, amount } = expense;
            const currentAmountPaidByUser: number | undefined = totalAmountPaidByUser.get(user)
            if (currentAmountPaidByUser == undefined) return;
            totalAmountPaidByUser.set(user, currentAmountPaidByUser + amount);
        });

        // share these expenses to get a first ugly version of balances
        const userNb = users.length;
        users.forEach(userWhoPaid => {
            const totalByUser = totalAmountPaidByUser.get(userWhoPaid);
            if (!totalByUser) return;
            const amountToShare = Math.floor(totalByUser/userNb);
            for (var user of users) {
                if (user.username != userWhoPaid.username) {
                    const userDebts: Map<User, number> | undefined = rawDebts.get(user);
                    if (userDebts == undefined) continue;
                    const currentUserDebtToUserWhoPaid = userDebts.get(userWhoPaid);
                    const updatedDebtToUserWhoPaid: number = (currentUserDebtToUserWhoPaid == undefined) ? amountToShare : currentUserDebtToUserWhoPaid + amountToShare;
                    userDebts.set(
                        userWhoPaid,
                        updatedDebtToUserWhoPaid
                    );
                }
            }
        });

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
                        lenderDebts.set(user, lenderDebtAmountToUser - debtAmount);
                    } else if (lenderDebtAmountMinusUserDebtAmount < 0) {
                        userDebts.set(lenderName, lenderDebtAmountToUser - debtAmount);
                        lenderDebts.delete(user);
                    } else {
                        userDebts.delete(lenderName);
                        lenderDebts.delete(user);
                    }
                }
            }
        });
        this.printRawDebts(rawDebts);

        return rawDebts;

        // Proposition pour un algo plus poussé
        // pour chaque personne, on regarde si on a plus encore plus de 2 dettes. Si oui, alors on regarde chaque dette et le créancier associé
        // si le créancier a lui-même une dette envers un autre créancier de l'utilisateur qu'on regarde, on procède à un équilibrage
        // on renvoie la liste au bout de 10 itérations ou si la liste des équilibres ne changent plus entre le début et la fin d'une boucle
    }

    async getAllExpenses(): Promise<Expense[]> {
        return this.expenseRepository.getAllExpenses();
    }

    printRawDebts(balances: Map<User, Map<User, number>>): void {
        console.log('on print les raw debts');
        for (var [user, debts] of balances) {
            console.log('Dettes de ' + user.username);
            for (var [lender, debtAmount] of debts) {
                console.log(`Créancier : ${lender.username}, amount : ${debtAmount}`);
            }
            console.log('');
        }
    }
}
