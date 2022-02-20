import { Account, CategoryEnum} from "./Account.js";

const recordsContainer = document.querySelector('#gastos .list-group') as HTMLElement;

export function getRandomId(): number {
    return Math.floor(Math.random() * Date.now());
}

export interface UI {
    setBalanceAmount(account: Account): void;
    showAlert(message: string, type: string): void;
    printEntry(account: Account): void;
    cleanUp(account: Account): void;
}

export class UI implements UI{
    setBalanceAmount(account: Account):void {
        const balanceAmountHtmlElement = document.querySelector('#total') as HTMLElement;
        const balanceAccount = account.getBalance();
        balanceAmountHtmlElement.textContent = `${balanceAccount}.00`;

        this.printEntry(account);
    }

    showAlert(message: string, type: string): void {
        const existe = document.querySelector('.mensaje')!;

        if(!existe) {
            const messageAlert = document.createElement('p');
            messageAlert.classList.add('text-center', 'alert');
            messageAlert.textContent = message;

            if(type === 'error') {
                messageAlert.classList.add('alert-danger', 'mensaje');
            } else {
                messageAlert.classList.add('alert-success');
            }

            const container = document.querySelector('.primario') as HTMLElement;
            const form = container.querySelector('form') as HTMLFormElement;

            container.insertBefore(messageAlert, form);

            setTimeout(() => {
                messageAlert.remove();
            }, 3000);
        }
    }

    printEntry(account: Account): void {
        this.cleanUp();

        const entries = account.getEntries();
        entries.forEach(entry => {
            const {concept, amount, category, id} = entry;
        
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.id = id.toString();
            nuevoGasto.innerHTML = `
                ${concept} 
                <span class="badge ${category === CategoryEnum.expense ? 'badge-warning' : 'badge-primary'}"> ${category === CategoryEnum.expense ? `-$${amount}` : `+$${amount}`} </span>
            `;
        
            const eliminarBtn = document.createElement('button');
            eliminarBtn.classList.add('btn', 'btn-outline-danger', 'borrar-gasto');
            eliminarBtn.innerHTML = 'X';
            eliminarBtn.onclick = () => {
                account.deleteEntryById(id);
                this.setBalanceAmount(account);
            }
            
            nuevoGasto.appendChild(eliminarBtn);
            
            recordsContainer.appendChild(nuevoGasto); 
        })
    }
    cleanUp(): void {
        while(recordsContainer.firstChild) {
            recordsContainer.removeChild(recordsContainer.firstChild);
        }
    }
}