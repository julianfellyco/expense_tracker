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
    li.classList.add(tx.amount > 0 ? 'income' : 'expense');
    li.innerHTML = `
      ${tx.desc} <span>Rp${tx.amount}</span>
      <button onclick="removeTx(${index})" style="background:none;border:none;color:#888;cursor:pointer;">❌</button>
    `;
    list.appendChild(li);

    total += tx.amount;
    if (tx.amount > 0) totalIncome += tx.amount;
    else totalExpense += Math.abs(tx.amount);
  });

  balance.textContent = `Rp${total}`;
  income.textContent = `Rp${totalIncome}`;
  expense.textContent = `Rp${totalExpense}`;
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
