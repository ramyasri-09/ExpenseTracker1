const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const search = document.getElementById('search');
const darkModeToggle = document.getElementById('dark-mode-toggle');

let transactions = [];

function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a description and amount');
        return;
    }

    const transaction = {
        id: Math.floor(Math.random() * 1000000),
        text: text.value,
        amount: +amount.value,
        category: category.value
    };

    transactions.push(transaction);
    saveToLocalStorage();
    updateUI();
    text.value = '';
    amount.value = '';
}

function updateUI() {
    transactionList.innerHTML = '';
    let total = 0, income = 0, expense = 0;
    let categories = {};

    transactions.forEach(transaction => {
        const sign = transaction.amount < 0 ? '-' : '+';
        total += transaction.amount;
        if (transaction.amount > 0) income += transaction.amount;
        else expense += transaction.amount;

        categories[transaction.category] = (categories[transaction.category] || 0) + Math.abs(transaction.amount);

        const item = document.createElement('li');
        item.innerHTML = `${transaction.text} (${transaction.category}) <span>${sign}$${Math.abs(transaction.amount)}</span>
        <button onclick="deleteTransaction(${transaction.id})">❌</button>`;
        item.classList.add('fade-in');
        transactionList.appendChild(item);
    });

    balance.innerText = `$${total.toFixed(2)}`;
    money_plus.innerText = `$${income.toFixed(2)}`;
    money_minus.innerText = `$${Math.abs(expense).toFixed(2)}`;

    updateChart(categories);
}

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    saveToLocalStorage();
    updateUI();
}

function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadFromLocalStorage() {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
        updateUI();
    }
}

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Search & Filter Transactions
search.addEventListener('input', () => {
    const query = search.value.toLowerCase();
    document.querySelectorAll('.list li').forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(query) ? 'flex' : 'none';
    });
});

// Chart.js for visualization
function updateChart(categories) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Expenses by Category',
                data: Object.values(categories),
                backgroundColor: ['red', 'blue', 'green', 'orange'],
            }]
        }
    });
}

form.addEventListener('submit', addTransaction);
loadFromLocalStorage();
