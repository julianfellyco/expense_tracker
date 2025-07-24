const desc = document.getElementById('text');
const amount = document.getElementById('amount');
const list = document.getElementById('list');
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const themeToggle = document.getElementById('theme-toggle');
const form = document.getElementById('form');
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let pieChart;

// Load theme preference
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '🌞 Light Mode';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '🌞 Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const descVal = desc.value.trim();
  const amtVal = +amount.value;

  if (descVal === '' || isNaN(amtVal)) {
    alert('Please enter valid data!');
    return;
  }

  transactions.push({ desc: descVal, amount: amtVal });
  desc.value = '';
  amount.value = '';
  updateUI();
});

function removeTx(index) {
  transactions.splice(index, 1);
  updateUI();
}

function updateUI() {
  list.innerHTML = '';
  let total = 0, totalIncome = 0, totalExpense = 0;

  transactions.forEach((tx, index) => {
    const li = document.createElement('li');
    li.className = `
      flex justify-between items-center bg-gray-100 dark:bg-gray-700 text-black dark:text-white 
      p-2 rounded transition-colors duration-300
    `;
    li.innerHTML = `
      ${tx.desc} <span>Rp${tx.amount.toLocaleString()}</span>
      <button onclick="removeTx(${index})" class="ml-2 text-gray-500 hover:text-red-500">❌</button>
    `;
    list.appendChild(li);

    total += tx.amount;
    if (tx.amount > 0) totalIncome += tx.amount;
    else totalExpense += Math.abs(tx.amount);
  });

  animateNumber(balance, getNumber(balance.textContent), total);
  animateNumber(income, getNumber(income.textContent), totalIncome);
  animateNumber(expense, getNumber(expense.textContent), totalExpense);

  renderChart(totalIncome, totalExpense);
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function getNumber(text) {
  return parseInt(text.replace(/[^\d]/g, '')) || 0;
}

function animateNumber(el, start, end, duration = 300) {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    el.textContent = `Rp${value.toLocaleString()}`;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function renderChart(incomeAmount, expenseAmount) {
  const ctx = document.getElementById('pieChart').getContext('2d');
  if (pieChart) pieChart.destroy();

  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [incomeAmount, expenseAmount],
        backgroundColor: ['#16a34a', '#dc2626'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: document.body.classList.contains('dark') ? 'white' : 'black'
          }
        }
      }
    }
  });
}

window.addEventListener('load', updateUI);
