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
const extensesCategorySelect = document.querySelector('#extenses-category');
const categorySelectList = document.querySelectorAll('.category-select');
const saveBtn = document.querySelector('.save');
const cancelBtn = document.querySelector('.cancel');

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
let creditAmount = 0;

const popupTransactionPanel = () => {
    addTransactionPanel.classList.toggle('popup');
    infoBrick.classList.toggle('hide');
    clearError()
    clearInputs()
}

const checkFormInputs = () => {
    if (nameInput.value !== '' && amountInput.value !== '' && amountInput.value >= '1' && categorySelect.value !== 'none') {
        let amount = parseFloat(amountInput.value);
        createNewTransaction(amount)
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

const countBalance = () => {
    let sum = moneyArr.reduce((a, b) => a + b)

    if (sum < 0) {
        availableMoney.innerText = `${sum} zł`
        availableMoney.style.color = 'rgb(255, 104, 104)'
    } else {
        availableMoney.innerText = `${sum} zł`
        availableMoney.style.color = 'var(--second-color)'
    }
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
        <p class="transaction-amount">${max} zł</p>`
    } else {
        name.innerHTML = `<p class="max-transaction-income transaction-name">${expensesTransactionIcon[indexNumber]}${expensesTransactionName[indexNumber]}</p>
        <p class="transaction-amount ">${max} zł</p>`
    }
}

const createMinTransaction = (arr, min, name) => {
    indexNumber = arr.indexOf(min)

    if (min > 1) {
        name.innerHTML = `<p class="min-transaction-income transaction-name">${incomeTransactionIcon[indexNumber]}${incomeTransactionName[indexNumber]}</p>
        <p class="transaction-amount ">${min} zł</p>`
    } else {
        name.innerHTML = `<p class="min-transaction-income transaction-name">${expensesTransactionIcon[indexNumber]}${expensesTransactionName[indexNumber]}</p>
        <p class="transaction-amount ">${min} zł</p>`
    }
}

const credit = amount => {
    console.log(amount)
    if (amount < 0 ){
        if(creditAmount >= amount ) {
            creditAmount += amount
            creditAmountBrick.innerText = `${creditAmount} zł`
        } else {
            refoundAmount = amount - creditAmount;
            creditAmountBrick.innerText = `0 zł`
            refound(refoundAmount);
        }
    } else {
        creditAmount += amount
        creditAmountBrick.innerText = `${creditAmount} zł`
    }
    
    console.log(creditAmount)
}

const refound = refoundAmount => {
    console.log(`funkcja refound -> ${refoundAmount}`)
}


const createNewTransaction = amount => {
    const newTransaction = document.createElement('div');
    newTransaction.classList.add('transaction');
    newTransaction.setAttribute('id', ID);
    checkCategory(selectedCategory, amount);
    if (categorySelect !== categorySelectList[0]) {
        amount = amount * -1
        expensesArr.push(amount);
        expensesTransactionName.push(nameInput.value);
        expensesTransactionIcon.push(categoryIcon);
        averageCounter(expensesArr, averageExpenses);
        maxTransaction(expensesArr, maxExpenseTransactionBrick)
        minTransaction(expensesArr, minExpenseTransactionBrick)
    } else {
        incomeArr.push(amount);
        incomeTransactionName.push(nameInput.value);
        incomeTransactionIcon.push(categoryIcon);
        averageCounter(incomeArr, averageIncome)
        maxTransaction(incomeArr, maxIncomeTransactionBrick)
        minTransaction(incomeArr, minIncomeTransactionBrick)
    }
    newTransaction.innerHTML = `
            <p class="transaction-name">${categoryIcon} ${nameInput.value}</p>
            <p class="transaction-amount">${amount}zł
            <button class="delete" onclick='deleteTransaction(${ID})'><i class="fas fa-times"></i></button> </p>`

    allTransactions.appendChild(newTransaction);
    moneyArr.push(amount);
    countBalance();
    popupTransactionPanel();
    ID++;
}



const selectCategory = () => {
    selectedCategory = categorySelect.options[categorySelect.selectedIndex].text;
}

const checkCategory = (trasaction, amount) => {
    switch (trasaction) {
        case 'Wypłata':
            categoryIcon = '<i class="fas fa-money-bill-wave pos"></i>'
            break;
        case 'Kredyt':
            categoryIcon = '<i class="far fa-credit-card pos"></i>';
            credit(amount);
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
            credit(amount * -1);
            break;
        default:
            categoryIcon = '<i class="far fa-frown-open"></i>';
            break;
    }
}

const deleteTransaction = id => {
    const transactionToDelete = document.getElementById(id);
    const transactionAmount = parseFloat(transactionToDelete.childNodes[3].innerText);

    if (transactionAmount < 0) {
        const indexOfExpenses = expensesArr.indexOf(transactionAmount);
        expensesArr.splice(indexOfExpenses, 1);
        expensesTransactionName.splice(indexOfExpenses, 1);
        expensesTransactionIcon.splice(indexOfExpenses, 1);
        averageCounter(expensesArr, averageExpenses);
        maxTransaction(expensesArr, maxExpenseTransactionBrick);
        minTransaction(expensesArr, minExpenseTransactionBrick);
        credit(transactionAmount);
    } else {
        const indexOfIncome = incomeArr.indexOf(transactionAmount);
        incomeArr.splice(indexOfIncome, 1);
        incomeTransactionName.splice(indexOfIncome, 1);
        incomeTransactionIcon.splice(indexOfIncome, 1);
        averageCounter(incomeArr, averageIncome);
        maxTransaction(incomeArr, maxIncomeTransactionBrick);
        minTransaction(incomeArr, minIncomeTransactionBrick);
        credit(transactionAmount * -1);
    }

    const indexOfTransaction = moneyArr.indexOf(transactionAmount);
    moneyArr.splice(indexOfTransaction, 1)
    allTransactions.removeChild(transactionToDelete);
    countBalance()
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
    incomeTransactionName = [0]
    incomeTransactionIcon = [0]
    expensesTransactionName = [0]
    expensesTransactionIcon = [0]
    maxExpenseTransactionBrick.innerHTML = '';
    minExpenseTransactionBrick.innerHTML = '';
    maxIncomeTransactionBrick.innerHTML = '';
    minIncomeTransactionBrick.innerHTML = '';
}


// Radio switch category function
let rad = radioList;
for (let i = 0; i < rad.length; i++) {
    rad[i].addEventListener('change', function () {
        if (this.value == 'income') {
            categorySelect = categorySelectList[0]
            extensesCategorySelect.classList.add('hide');
            incomeCategorySelect.classList.remove('hide');
        } else {
            categorySelect = categorySelectList[1]
            extensesCategorySelect.classList.remove('hide');
            incomeCategorySelect.classList.add('hide');
        }
    });
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
saveBtn.addEventListener('click', checkFormInputs)
deleteAllBtn.addEventListener('click', deleteAllTransaction)
lightBtn.addEventListener('click', changeStyleToLight)
darkBtn.addEventListener('click', changeStyleToDark)


// Animate.css

// const animateCSS = (element, animation) =>
//   // We create a Promise and return it
//   new Promise((resolve, reject) => {
//     const animationName = animation;
//     const node = element;

//     node.classList.add(animationName);

//     // When the animation ends, we clean the classes and resolve the Promise
//     function handleAnimationEnd() {
//       node.classList.remove(animationName);
//       node.removeEventListener('animationend', handleAnimationEnd);

//       resolve('Animation ended');
//     }

//     node.addEventListener('animationend', handleAnimationEnd);
//   });