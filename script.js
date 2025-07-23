const desc = document.getElementById('desc');
const amount = document.getElementById('amount');
const addBtn = document.getElementById('add');
const list = document.getElementById('list');
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateUI() {
  list.innerHTML = '';
  let total = 0, totalIncome = 0, totalExpense = 0;

  transactions.forEach((tx, index) => {
    const li = document.createElement('li');
    li.classList.add(tx.amount > 0 ? 'income' : 'expense', 'fade-slide');
    li.innerHTML = `
      ${tx.desc} <span>Rp${tx.amount}</span>
      <button onclick="removeTx(${index})" style="background:none;border:none;color:#888;cursor:pointer;">❌</button>
    `;
    list.appendChild(li);

    total += tx.amount;
    if (tx.amount > 0) totalIncome += tx.amount;
    else totalExpense += Math.abs(tx.amount);
  });

  animateNumber(balance, parseInt(balance.textContent.replace(/\D/g,'')) || 0, total);
  animateNumber(income, parseInt(income.textContent.replace(/\D/g,'')) || 0, totalIncome);
  animateNumber(expense, parseInt(expense.textContent.replace(/\D/g,'')) || 0, totalExpense);
  renderChart(totalIncome, totalExpense);
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTx() {
  const descVal = desc.value.trim();
  const amtVal = +amount.value;

  if (descVal === '' || amount.value === '') return alert('Isi semua kolom!');
  transactions.push({ desc: descVal, amount: amtVal });
  desc.value = '';
  amount.value = '';
  updateUI();
}

function removeTx(index) {
  transactions.splice(index, 1);
  updateUI();
}

addBtn.addEventListener('click', addTx);
window.addEventListener('load', updateUI);

function animateNumber(el, start, end, duration = 300) {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    el.textContent = `Rp${value}`;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
let pieChart;

function renderChart(incomeAmount, expenseAmount) {
  const ctx = document.getElementById('pieChart').getContext('2d');
  if (pieChart) pieChart.destroy(); // clear chart if exists

  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [incomeAmount, expenseAmount],
        backgroundColor: ['#28a745', '#dc3545'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

