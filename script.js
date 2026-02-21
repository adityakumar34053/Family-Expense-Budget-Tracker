// --- 1. LOGIN LOGIC ---
const correctPIN = "1234"; // Yahan Aditya tum apna PIN change kar sakte ho

function checkPIN() {
    const enteredPIN = document.getElementById('pin-input').value;
    if (enteredPIN === correctPIN) {
        document.getElementById('login-screen').style.display = 'none';
    } else {
        document.getElementById('login-error').style.display = 'block';
        document.getElementById('pin-input').value = '';
    }
}

// --- 2. TAB SWITCHING LOGIC ---
function openSection(sectionName, title) {
    document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active-section'));
    document.getElementById('section-' + sectionName).classList.add('active-section');
    document.getElementById('app-title').innerText = title;
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active-nav'));
    event.currentTarget.classList.add('active-nav');
}

const today = new Date().toISOString().split('T')[0];

// --- 3. GHAR KA HISAAB LOGIC ---
let transactions = JSON.parse(localStorage.getItem('adityaTransactions')) || [];
const dateInput = document.getElementById('date');
if(dateInput) dateInput.value = today;

function updateHisabUI() {
    const list = document.getElementById('history-list');
    list.innerHTML = ''; 
    let totalBalance = 0;

    transactions.forEach((t, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<div><strong>${t.description}</strong><br><small>📅 ${t.date}</small></div>
                        <div>₹${t.amount} <button class="delete-btn" onclick="deleteHisab(${index})">X</button></div>`;
        
        if (t.type === 'income') { totalBalance += t.amount; li.style.borderLeftColor = '#2ecc71'; } 
        else { totalBalance -= t.amount; li.style.borderLeftColor = '#e74c3c'; }
        list.appendChild(li);
    });
    document.getElementById('balance').innerText = `₹${totalBalance}`;
}

document.getElementById('inc-btn').onclick = () => addHisab('income');
document.getElementById('exp-btn').onclick = () => addHisab('expense');

function addHisab(type) {
    const desc = document.getElementById('description').value;
    const amt = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    if (!desc || isNaN(amt) || amt <= 0 || !date) return alert("Sahi details daalo!");
    
    transactions.push({ description: desc, amount: amt, type: type, date: date });
    localStorage.setItem('adityaTransactions', JSON.stringify(transactions));
    updateHisabUI();
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

function deleteHisab(index) {
    transactions.splice(index, 1);
    localStorage.setItem('adityaTransactions', JSON.stringify(transactions));
    updateHisabUI();
}
updateHisabUI();

// --- 4. EMI CALCULATOR LOGIC ---
function calculateEMI() {
    const p = parseFloat(document.getElementById('emi-principal').value);
    const r = parseFloat(document.getElementById('emi-rate').value) / 12 / 100;
    const n = parseFloat(document.getElementById('emi-time').value);

    if (isNaN(p) || isNaN(r) || isNaN(n)) return alert("Saari details bhariye!");

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - p;

    document.getElementById('emi-result').style.display = 'block';
    document.getElementById('emi-amount').innerText = `₹${Math.round(emi)}`;
    document.getElementById('emi-interest').innerText = `₹${Math.round(totalInterest)}`;
    document.getElementById('emi-total').innerText = `₹${Math.round(totalAmount)}`;
}

// --- 5. GAON KA VYAJ LOGIC (Rupay Saikra) ---
function calculateVyaj() {
    const p = parseFloat(document.getElementById('vyaj-principal').value);
    const rate = parseFloat(document.getElementById('vyaj-rate').value);
    const time = parseFloat(document.getElementById('vyaj-time').value);

    if (isNaN(p) || isNaN(rate) || isNaN(time)) return alert("Saari details bhariye!");

    const interest = (p * rate * time) / 100;
    const total = p + interest;

    document.getElementById('vyaj-result').style.display = 'block';
    document.getElementById('vyaj-only').innerText = `₹${interest}`;
    document.getElementById('vyaj-total').innerText = `₹${total}`;
}

// --- 6. DUDH KA HISAAB LOGIC ---
let dudhRecords = JSON.parse(localStorage.getItem('adityaDudhRecords')) || [];
const dudhDate = document.getElementById('dudh-date');
if(dudhDate) dudhDate.value = today;

function updateDudhUI() {
    const list = document.getElementById('dudh-list');
    list.innerHTML = '';
    let totalLiter = 0;
    let totalBill = 0;

    dudhRecords.forEach((record, index) => {
        const totalDayLiter = record.morning + record.evening;
        const dayCost = totalDayLiter * record.rate;
        totalLiter += totalDayLiter;
        totalBill += dayCost;

        const li = document.createElement('li');
        li.style.borderLeftColor = '#3498db';
        li.innerHTML = `<div><strong>📅 ${record.date}</strong><br><small>M: ${record.morning}L | E: ${record.evening}L (@ ₹${record.rate})</small></div>
                        <div>₹${dayCost} <button class="delete-btn" onclick="deleteDudh(${index})">X</button></div>`;
        list.appendChild(li);
    });

    document.getElementById('dudh-total-liter').innerText = totalLiter;
    document.getElementById('dudh-total-bill').innerText = `₹${totalBill}`;
}

function addDudh() {
    const dDate = document.getElementById('dudh-date').value;
    const morn = parseFloat(document.getElementById('dudh-morning').value) || 0;
    const eve = parseFloat(document.getElementById('dudh-evening').value) || 0;
    const rate = parseFloat(document.getElementById('dudh-rate').value);

    if (!dDate || isNaN(rate) || (morn === 0 && eve === 0)) return alert("Date, rate aur dudh ki quantity daaliye!");

    dudhRecords.push({ date: dDate, morning: morn, evening: eve, rate: rate });
    localStorage.setItem('adityaDudhRecords', JSON.stringify(dudhRecords));
    updateDudhUI();
    
    document.getElementById('dudh-morning').value = '';
    document.getElementById('dudh-evening').value = '';
}

function deleteDudh(index) {
    dudhRecords.splice(index, 1);
    localStorage.setItem('adityaDudhRecords', JSON.stringify(dudhRecords));
    updateDudhUI();
}
updateDudhUI();
