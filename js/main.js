// HEADER
const availableMoney = document.querySelector('.available-money');
//Control Panel
const addTransactionBtn = document.querySelector('.add-transaction');
const deleteAllBtn = document.querySelector('.delete-all');
const addTransactionPanel = document.querySelector('.add-transaction-panel');
// Style
const changeStylBtn = document.querySelector('.change-styl');
const lightBtn = document.querySelector('.light');
const darkBtn = document.querySelector('.dark');
const colorButtons = document.querySelector('.color-buttons');

// Transaction-list
const allTransactions = document.querySelector('.all-transactions');

// New Transaction form
const nameInput = document.querySelector('#name');
const amountInput = document.querySelector('#amount');
const radioList = document.querySelectorAll('.radio');
const radioIncomeBtn = document.querySelector('#radio-income');
const radioExpensesBtn = document.querySelector('#radio-expenses');
const incomeCategorySelect = document.querySelector('#income-category');
const extensesCategorySelect = document.querySelector('#expenses-category');
const categorySelectList = document.querySelectorAll('.category-select');
const saveBtn = document.querySelector('.save');
const cancelBtn = document.querySelector('.cancel');
const editBtn = document.querySelector('.edit-button');
// Alert
const alertMsg1 = document.querySelector('.alert1');
const alertMsg2 = document.querySelector('.alert2');
const acceptCreditBtn = document.querySelector('.accept-credit');
const rejectCreditBtn = document.querySelector('.reject-credit');
const okAlert2Btn = document.querySelector('.Ok-alert-Btn');

//Info-Brick
const infoBrick = document.querySelector('.info-brick');
const averageExpenses = document.querySelector('.average-expenses');
const averageIncome = document.querySelector('.average-income');
const maxExpenseTransactionBrick = document.querySelector('.max-expense-transaction');
const maxIncomeTransactionBrick = document.querySelector('.max-income-transaction');
const minExpenseTransactionBrick = document.querySelector('.min-expense-transaction');
const minIncomeTransactionBrick = document.querySelector('.min-income-transaction');
const creditAmountBrick = document.querySelector('.credit-amount');

let inputArr = [nameInput, amountInput, incomeCategorySelect, extensesCategorySelect]
let root = document.documentElement;
let ID = 0;
let categoryIcon;
let selectedCategory;
let moneyArr = [0];
let incomeArr = [0];
let incomeTransactionName = [0]
let incomeTransactionIcon = [0]
let expensesArr = [0];
let expensesTransactionName = [0]
let expensesTransactionIcon = [0]
let categorySelect = categorySelectList[0];
let creditArr = [0];
let creditAmount = 0;
let balance = 0;
let transactionToEdit;
let editedElementId;
let oldTransactionAmount;
let virtualBalance;
let actualCategory = 'income';
let oldCategory;

const popupTransactionPanel = id => {
    addTransactionPanel.classList.toggle('popup');

    if (alertMsg1.classList.contains('show')) {
        alertMsg1.classList.remove('show');
    } else if (alertMsg2.classList.contains('show')) {
        alertMsg2.classList.remove('show');
    }
    infoBrick.classList.toggle('hide');
    clearError();
    clearInputs();
    if (id >= 0) {
        saveBtn.classList.add('hide');
        editBtn.classList.add('show2');
    } else {
        saveBtn.classList.remove('hide');
        editBtn.classList.remove('show2');
    }
}

const checkFormInputs = e => {
    if (e.target.classList.contains('save')) {
        newTransactionInputsCheck()
    } else {
        editTransactionInputsCheck()
    }
}

const newTransactionInputsCheck = () => {
    if (nameInput.value !== '' && amountInput.value !== '' && amountInput.value >= '1' && categorySelect.value !== 'none') {
        let amount = parseFloat(amountInput.value);
        if (categorySelect !== categorySelectList[0]) {
            if (selectedCategory === 'Spłata kredytu' && balance - amount < 0) {
                showElement(alertMsg2)
            } else if (balance - amount < 0) {
                showElement(alertMsg1);
            } else {
                amount = amount * -1;
                createNewTransaction(amount)
            }
        } else {
            createNewTransaction(amount)
        }
    } else {
        inputArr.forEach(el => {
            if (el.value === '' || el.value === 'none' || el.value < '1') {
                showError(el);
            } else {
                hideError(el);
            }
        })
    }
}

const editTransactionInputsCheck = () => {

    if (nameInput.value !== '' && amountInput.value !== '' && amountInput.value >= '1' && categorySelect.value !== 'none') {
        let amount = parseFloat(amountInput.value);

        if (categorySelect !== categorySelectList[0]) {
            // virtualBalance = balance - oldTransactionAmount;
            let actual = (balance - oldTransactionAmount) - amount;
            if (actual <= 0) {
                showElement(alertMsg2);
                // }
                // else if (balance - amount <= 0 || selectedCategory === 'Spłata kredytu') {
                //     showElement(alertMsg2);
            } else {
                amount = amount * -1;
                createEditTransaction(amount)
            }
        } else {
            createEditTransaction(amount)
        }
    } else {
        inputArr.forEach(el => {
            if (el.value === '' || el.value === 'none' || el.value < '1') {
                showError(el);
            } else {
                hideError(el);
            }
        })
    }
}

const takeFastCredit = () => {
    let fastCredit = 0;
    const fastCreditTransaction = 'true';
    fastCredit = balance - parseFloat(amountInput.value);
    balance = 0;
    createNewTransaction(fastCredit, fastCreditTransaction);
    creditArr.push((fastCredit * -1));
    countCreditBalence(creditArr);
    fastCredit = 0;
}

const countBalance = moneyArr => {
    balance = moneyArr.reduce((a, b) =>
        a + b);
    if (balance > 0) {
        availableMoney.innerText = `${balance} zł`;
    } else {
        balance = 0;
        availableMoney.innerText = `${balance} zł`;
    }

    availableMoney.style.color = 'var(--second-color)';
}

const countCreditBalence = creditArr => {
    creditBalance = creditArr.reduce((a, b) =>
        a + b);
    creditAmountBrick.innerText = `${creditBalance} zł`
    availableMoney.innerText = `${balance} zł`;
}

const averageCounter = (arr, name) => {
    if (arr.length > 1) {
        let sum = arr.reduce((a, b) => a + b);
        let avr = sum / (arr.length - 1);
        name.innerText = `${avr.toFixed(2)} zł`
    } else {
        name.innerText = `0 zł`
    }
}

const maxTransaction = (arr, name) => {
    let max = 0;
    if (arr.length > 1) {
        if (arr[1] > 0) {
            for (let i = 0; i < arr.length; i++) {
                if (max <= arr[i]) {
                    max = arr[i];
                }
            }
            createMaxTransaction(arr, max, name);
        } else {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] <= max) {
                    max = arr[i];
                }
            }
            createMaxTransaction(arr, max, name);
        }
    } else {
        name.innerHTML = '';
    }
}

const minTransaction = (arr, name) => {
    if (arr.length > 1) {
        let min = arr[1];
        if (arr[1] < 0) {
            for (let i = 1; i < arr.length; i++) {
                if (min <= arr[i]) {
                    min = arr[i];
                }
            }
            createMinTransaction(arr, min, name);
        } else {
            for (let i = 1; i < arr.length; i++) {
                if (arr[i] <= min) {
                    min = arr[i];
                }
            }
            createMinTransaction(arr, min, name);
        }
    } else {
        name.innerHTML = '';
    }
}

const createMaxTransaction = (arr, max, name) => {
    indexNumber = arr.indexOf(max)

    if (max >= 1) {
        name.innerHTML = `<p class="max-transaction-income transaction-name">${incomeTransactionIcon[indexNumber]}${incomeTransactionName[indexNumber]}</p>
        <p class="max-income-transaction-amount">${max} zł</p>`
    } else {
        name.innerHTML = `<p class="max-transaction-income transaction-name">${expensesTransactionIcon[indexNumber]}${expensesTransactionName[indexNumber]}</p>
        <p class="max-expenses-transaction-amount ">${max} zł</p>`
    }
}

const createMinTransaction = (arr, min, name) => {
    indexNumber = arr.indexOf(min)

    if (min > 1) {
        name.innerHTML = `<p class="min-transaction-income transaction-name">${incomeTransactionIcon[indexNumber]}${incomeTransactionName[indexNumber]}</p>
        <p class="min-income-transaction-amount ">${min} zł</p>`
    } else {
        name.innerHTML = `<p class="min-transaction-income transaction-name">${expensesTransactionIcon[indexNumber]}${expensesTransactionName[indexNumber]}</p>
        <p class="min-expenses-transaction-amount ">${min} zł</p>`
    }
}

const infoBrickMain = amount => {
    if (amount < 0) {
        expensesArr.push(amount);
        expensesTransactionName.push(nameInput.value);
        expensesTransactionIcon.push(categoryIcon);
        averageCounter(expensesArr, averageExpenses);
        maxTransaction(expensesArr, maxExpenseTransactionBrick);
        minTransaction(expensesArr, minExpenseTransactionBrick);
    } else {
        incomeArr.push(amount);
        incomeTransactionName.push(nameInput.value);
        incomeTransactionIcon.push(categoryIcon);
        averageCounter(incomeArr, averageIncome);
        maxTransaction(incomeArr, maxIncomeTransactionBrick);
        minTransaction(incomeArr, minIncomeTransactionBrick);
    }
}


const createNewTransaction = (amount, fastCreditTransaction) => {
    const newTransaction = document.createElement('div');
    newTransaction.classList.add('transaction');
    newTransaction.setAttribute('id', ID);
    checkCategory(selectedCategory);

    if (fastCreditTransaction) {
        categoryIcon = '<i class="far fa-credit-card neg"></i> ' + categoryIcon
    } else {
        moneyArr.push(amount);
        countBalance(moneyArr);
    }

    if (selectedCategory === 'Kredyt' || selectedCategory === 'Spłata kredytu' && !fastCreditTransaction) {
        creditArr.push(amount);
        countCreditBalence(creditArr);

    }
    infoBrickMain(amount);
    newTransaction.innerHTML = `
            <p class="transaction-name">${categoryIcon} ${nameInput.value}</p>
            <p class="transaction-amount">${amount}zł
            <button class="edit" Title="Edytuj" onclick='editTransaction(${ID})'><i class="far fa-edit"></i></button> </p>`

    allTransactions.appendChild(newTransaction);
    popupTransactionPanel();
    ID++;
}

const selectCategory = () => {
    selectedCategory = categorySelect.options[categorySelect.selectedIndex].text;
}

const checkCategory = trasaction => {
    switch (trasaction) {
        case 'Wypłata':
            categoryIcon = '<i class="fas fa-money-bill-wave pos"></i>'
            break;
        case 'Kredyt':
            categoryIcon = '<i class="far fa-credit-card pos"></i>';
            break;
        case 'Nagroda Nobla':
            categoryIcon = '<i class="fas fa-award pos"></i>';
            break;
        case 'Sprzedaż butelek':
            categoryIcon = '<i class="fas fa-wine-bottle pos"></i>';
            break;
        case 'Jedzenie':
            categoryIcon = '<i class="fas fa-pizza-slice neg"></i>';
            break;
        case 'Rachunki':
            categoryIcon = '<i class="fas fa-file-invoice-dollar neg"></i>';
            break;
        case 'Czynsz':
            categoryIcon = '<i class="fas fa-truck-moving neg"></i>';
            break;
        case 'Ubrania':
            categoryIcon = '<i class="fas fa-tshirt neg"></i>';
            break;
        case 'Spłata kredytu':
            categoryIcon = '<i class="fas fa-money-check-alt neg"></i>';
            break;
        default:
            categoryIcon = '<i class="far fa-frown-open"></i>';
            break;
    }
}

const editTransaction = id => {
    editedElementId = id;
    transactionToEdit = document.getElementById(id);
    oldTransactionAmount = parseFloat(transactionToEdit.childNodes[3].innerText);
    popupTransactionPanel(id);
    nameInput.value = transactionToEdit.childNodes[1].innerText;

    if (oldTransactionAmount > 0) {
        amountInput.value = parseFloat(transactionToEdit.childNodes[3].innerText);
        radioIncomeBtn.checked = true;
        selectIncomeCategories();
        oldCategory = 'income';
    } else {
        amountInput.value = oldTransactionAmount * -1;
        radioExpensesBtn.checked = true;
        selectExpensesCategories();
        oldCategory = 'expenses';
    }
}

const createEditTransaction = amount => {
    checkCategory(selectedCategory);
    transactionToEdit.innerHTML = `
            <p class="transaction-name">${categoryIcon} ${nameInput.value}</p>
            <p class="transaction-amount">${amount}zł
            <button class="edit" Title="Edytuj" onclick='editTransaction(${editedElementId})'><i class="far fa-edit"></i></button> </p>`
    popupTransactionPanel();
    infoBrickEditedValues(amount);
}

const infoBrickEditedValues = amount => {
    const indexOfIncome = incomeArr.indexOf(oldTransactionAmount);
    const indexOfExpenses = expensesArr.indexOf(oldTransactionAmount);
    if (actualCategory == oldCategory) {
        if (amount < 0) {
            expensesArreysItemReplace(amount, indexOfExpenses);
        } else {
            incomeArreysItemReplace(amount, indexOfIncome);
        }
    } else {
        
        if (amount < 0) {
            infoBrickMain(amount);
            deleteOldItemsInIncomeArreys(indexOfIncome)
        } else {
            infoBrickMain(amount);
            deleteOldItemsInExpensesArreys(indexOfExpenses)
        }
    }

    const indexOfTransaction = moneyArr.indexOf(oldTransactionAmount);
    moneyArr.splice(indexOfTransaction, 1, amount)
    countBalance(moneyArr)
}

const expensesArreysItemReplace = (amount, indexOfExpenses) => {
    if(expensesArr.length > 1){
        expensesArr.splice(indexOfExpenses, 1, amount);
        expensesTransactionName.splice(indexOfExpenses, 1, nameInput.value);
        expensesTransactionIcon.splice(indexOfExpenses, 1, categoryIcon);
    } else {
        expensesArr.push(amount);
        expensesTransactionName.push(nameInput.value);
        expensesTransactionIcon.push(categoryIcon);
    }
    averageCounter(expensesArr, averageExpenses);
    maxTransaction(expensesArr, maxExpenseTransactionBrick);
    minTransaction(expensesArr, minExpenseTransactionBrick);
}
const incomeArreysItemReplace = (amount, indexOfIncome) => {
    incomeArr.splice(indexOfIncome, 1, amount);
   
    incomeTransactionName.splice(indexOfIncome, 1, nameInput.value);
    incomeTransactionIcon.splice(indexOfIncome, 1, categoryIcon);
    averageCounter(incomeArr, averageIncome);
    maxTransaction(incomeArr, maxIncomeTransactionBrick);
    minTransaction(incomeArr, minIncomeTransactionBrick);
}

const deleteOldItemsInIncomeArreys = (indexOfIncome) => {
    incomeArr.splice(indexOfIncome, 1);
    incomeTransactionName.splice(indexOfIncome, 1);
    incomeTransactionIcon.splice(indexOfIncome, 1);
    averageCounter(incomeArr, averageIncome);
    maxTransaction(incomeArr, maxIncomeTransactionBrick);
    minTransaction(incomeArr, minIncomeTransactionBrick);
}
const deleteOldItemsInExpensesArreys = (indexOfExpenses) => {
    expensesArr.splice(indexOfExpenses, 1);
    expensesTransactionName.splice(indexOfExpenses, 1);
    expensesTransactionIcon.splice(indexOfExpenses, 1);
    averageCounter(expensesArr, averageExpenses);
    maxTransaction(expensesArr, maxExpenseTransactionBrick);
    minTransaction(expensesArr, minExpenseTransactionBrick);
}

const deleteAllTransaction = () => {
    allTransactions.innerHTML = '';
    availableMoney.textContent = '0 zł'
    averageExpenses.textContent = '0 zł'
    averageIncome.textContent = '0 zł'
    creditAmountBrick.innerText = `0 zł`
    creditAmount = 0;
    incomeArr = [0];
    expensesArr = [0];
    moneyArr = [0];
    incomeTransactionName = [0];
    incomeTransactionIcon = [0];
    expensesTransactionName = [0];
    expensesTransactionIcon = [0];
    creditArr = [0];
    maxExpenseTransactionBrick.innerHTML = '';
    minExpenseTransactionBrick.innerHTML = '';
    maxIncomeTransactionBrick.innerHTML = '';
    minIncomeTransactionBrick.innerHTML = '';
    creditAmount = 0;
    balance = 0;
}

let rad = radioList;
for (let i = 0; i < rad.length; i++) {
    rad[i].addEventListener('change', function () {
        if (this.value == 'income') {
            actualCategory = 'inocme';
            selectIncomeCategories()
        } else {
            selectExpensesCategories()
            actualCategory = 'expenses'
        }
    });
}

const selectIncomeCategories = () => {
    categorySelect = categorySelectList[0];
    extensesCategorySelect.classList.add('hide');
    incomeCategorySelect.classList.remove('hide');
}

const selectExpensesCategories = () => {
    categorySelect = categorySelectList[1];
    extensesCategorySelect.classList.remove('hide');
    incomeCategorySelect.classList.add('hide');
}


const showElement = (el, text) => {
    el.classList.add('show')
}

const hideAlert = e => {
    if (e.target.classList.contains('reject-credit')) {
        alertMsg1.classList.remove('show');
    } else {
        alertMsg2.classList.remove('show');
    }
}

const showError = el => {
    el.classList.add('error');
}
const hideError = el => {
    el.classList.remove('error');
}
const clearError = () => {
    inputArr.forEach(el => {
        el.classList.remove('error');
    })
}

const clearInputs = () => {
    nameInput.value = '';
    amountInput.value = '';
    incomeCategorySelect.selectedIndex = 0;
    extensesCategorySelect.selectedIndex = 0;
}

const popupStyle = () => {
    colorButtons.classList.toggle('popup-style')
}

const changeStyleToLight = () => {
    root.style.setProperty('--first-color', '#F9F9F9');
    root.style.setProperty('--second-color', '#14161F');
    root.style.setProperty('--border-color', 'rgba(0, 0, 0, .2)');
    root.style.setProperty('--bgc-radio1', 'rgb(221, 255, 221)');
    root.style.setProperty('--bgc-radio2', 'rgb(255, 221, 221)');
}

const changeStyleToDark = () => {
    root.style.setProperty('--first-color', '#14161F');
    root.style.setProperty('--second-color', '#F9F9F9');
    root.style.setProperty('--border-color', 'rgba(255, 255, 255, .4)');
    root.style.setProperty('--bgc-radio1', 'rgb(50, 82, 50)');
    root.style.setProperty('--bgc-radio2', 'rgb(82, 50, 50)');
}

function maxLengthCheck(object) {
    if (object.value.length > object.max.length)
        object.value = object.value.slice(0, object.max.length)
}


addTransactionBtn.addEventListener('click', popupTransactionPanel);
cancelBtn.addEventListener('click', popupTransactionPanel);
changeStylBtn.addEventListener('click', popupStyle);
saveBtn.addEventListener('click', checkFormInputs);
editBtn.addEventListener('click', checkFormInputs);
deleteAllBtn.addEventListener('click', deleteAllTransaction);
lightBtn.addEventListener('click', changeStyleToLight);
darkBtn.addEventListener('click', changeStyleToDark);
rejectCreditBtn.addEventListener('click', hideAlert);
okAlert2Btn.addEventListener('click', hideAlert);
acceptCreditBtn.addEventListener('click', takeFastCredit);