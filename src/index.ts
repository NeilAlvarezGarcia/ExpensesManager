import { Account, Entry, CategoryEnum } from "./Account.js";
import { UI } from "./util.js";

const form = document.querySelector('form') as HTMLFormElement;
let account: Account;
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    const initialAccount = getAccountFromStorage();
    
    if(initialAccount) {
        account = new Account(initialAccount as Account);
    } else {
        account = new Account();
        localStorage.setItem('account', JSON.stringify(account));
    }
    ui.setBalanceAmount(account);
});

form.addEventListener('submit', e => {
    e.preventDefault();

    const expense: string = form.gasto.value;
    const amount: number = Number(form.cantidad.value);
    let category: CategoryEnum;
    
    if(expense === '') {
        ui.showAlert('No field can be empty', 'error');
        return;
    } else if(amount <= 0 || isNaN(amount)) {
        ui.showAlert('Amount invalid', 'error');
        
        return;
    }
    
    if(form.category.value === CategoryEnum.expense) {
        category = CategoryEnum.expense
    } else {
        category = CategoryEnum.income;
    }
    
    const entry = new Entry(expense, amount, category);
    
    account.addEntry(entry);
    ui.setBalanceAmount(account);
    ui.showAlert('Record added to the wallet', 'success');
    form.reset();
});


function getAccountFromStorage():Account | boolean {
    const accountFromStorage = localStorage.getItem('account');

    return accountFromStorage ? JSON.parse(accountFromStorage) : false;
}
