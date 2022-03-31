"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountCalculator = void 0;
class AccountCalculator {
    constructor(expenseRepository, userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }
    async getAccountBalance() {
        const users = await this.userRepository.getAllUsers();
        if (users.length == 0) {
            throw new Error("No user!");
        }
        const expenses = await this.expenseRepository.getAllExpenses();
        if (expenses.length == 0) {
            const balances = new Map();
            users.forEach(user => {
                balances.set(user, new Map());
            });
            return balances;
        }
        const totalAmountPaidByUser = new Map();
        const rawDebts = new Map();
        users.forEach(user => {
            totalAmountPaidByUser.set(user, 0);
            rawDebts.set(user, new Map());
        });
        // sum of all expenses spent by each person
        expenses.forEach(expense => {
            const { user, amount } = expense;
            const currentAmountPaidByUser = totalAmountPaidByUser.get(user);
            if (currentAmountPaidByUser == undefined)
                return;
            totalAmountPaidByUser.set(user, currentAmountPaidByUser + amount);
        });
        // share these expenses to get a first ugly version of balances
        const userNb = users.length;
        users.forEach(userWhoPaid => {
            const totalByUser = totalAmountPaidByUser.get(userWhoPaid);
            if (!totalByUser)
                return;
            const amountToShare = Math.floor(totalByUser / userNb);
            for (var user of users) {
                if (user.username != userWhoPaid.username) {
                    const userDebts = rawDebts.get(user);
                    if (userDebts == undefined)
                        continue;
                    const currentUserDebtToUserWhoPaid = userDebts.get(userWhoPaid);
                    const updatedDebtToUserWhoPaid = (currentUserDebtToUserWhoPaid == undefined) ? amountToShare : currentUserDebtToUserWhoPaid + amountToShare;
                    userDebts.set(userWhoPaid, updatedDebtToUserWhoPaid);
                }
            }
        });
        // first rearrange the expenses
        // on prend chaque personne, on parcourt la liste de ses dettes
        // pour chaque dette, on regarde si le créancier lui doit aussi de l'argent, on équilibre une première fois
        users.forEach(user => {
            const userDebts = rawDebts.get(user);
            if (!userDebts)
                return;
            for (var [lenderName, debtAmount] of userDebts) {
                const lenderDebts = rawDebts.get(lenderName);
                if (!lenderDebts)
                    continue;
                if (lenderDebts.has(user)) {
                    const lenderDebtAmountToUser = lenderDebts.get(user);
                    if (!lenderDebtAmountToUser)
                        continue;
                    const lenderDebtAmountMinusUserDebtAmount = lenderDebtAmountToUser - debtAmount;
                    if (lenderDebtAmountMinusUserDebtAmount > 0) {
                        userDebts.delete(lenderName);
                        lenderDebts.set(user, lenderDebtAmountToUser - debtAmount);
                    }
                    else if (lenderDebtAmountMinusUserDebtAmount < 0) {
                        userDebts.set(lenderName, lenderDebtAmountToUser - debtAmount);
                        lenderDebts.delete(user);
                    }
                    else {
                        userDebts.delete(lenderName);
                        lenderDebts.delete(user);
                    }
                }
            }
        });
        return rawDebts;
        // Proposition pour un algo plus poussé
        // pour chaque personne, on regarde si on a plus encore plus de 2 dettes. Si oui, alors on regarde chaque dette et le créancier associé
        // si le créancier a lui-même une dette envers un autre créancier de l'utilisateur qu'on regarde, on procède à un équilibrage
        // on renvoie la liste au bout de 10 itérations ou si la liste des équilibres ne changent plus entre le début et la fin d'une boucle
    }
    async getAllExpenses() {
        return this.expenseRepository.getAllExpenses();
    }
}
exports.AccountCalculator = AccountCalculator;
