const FILAS = 10;
const COLUMNAS = 15;
let seats = [];
let isRunning = false;
let successCount = 0;
let collisionCount = 0;
let globalLock = false;

const grid = document.getElementById('seatGrid');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const logContent = document.getElementById('logContent');
const successEl = document.getElementById('successCount');
const collisionEl = document.getElementById('collisionCount');
const threadInput = document.getElementById('threadCount');
const threadVal = document.getElementById('threadCountVal');
const latencyInput = document.getElementById('latency');
const latencyVal = document.getElementById('latencyVal');
const lockStrategy = document.getElementById('lockStrategy');
const usePriority = document.getElementById('usePriority');
const attemptsInput = document.getElementById('attemptsCount');
const attemptsVal = document.getElementById('attemptsVal');

function initGrid() {
    grid.innerHTML = '';
    seats = [];
    for (let i = 0; i < FILAS; i++) {
        seats[i] = [];
        for (let j = 0; j < COLUMNAS; j++) {
            const el = document.createElement('div');
            el.className = 'seat';
            grid.appendChild(el);
            seats[i][j] = { el: el, isReserved: false, isLocked: false };
        }
    }
}

function addLog(msg, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logContent.prepend(entry);
    if (logContent.children.length > 30) logContent.lastChild.remove();
}

async function simulateUser(id, isVIP = false) {
    const attempts = parseInt(attemptsInput.value);
    const latency = parseInt(latencyInput.value);
    const strategy = lockStrategy.value;
    
    if (isVIP) await new Promise(r => setTimeout(r, Math.random() * 500));
    else await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));

    for (let i = 0; i < attempts && isRunning; i++) {
        const r = Math.floor(Math.random() * FILAS);
        const c = Math.floor(Math.random() * COLUMNAS);
        const seat = seats[r][c];

        addLog(`${isVIP ? '🌟 VIP' : 'User'} ${id} intentando [${r}, ${c}]`);
        
        let canAccess = false;
        if (strategy === 'global') {
            if (!globalLock) {
                globalLock = true;
                canAccess = true;
            }
        } else {
            if (!seat.isLocked) {
                seat.isLocked = true;
                canAccess = true;
            }
        }

        if (canAccess) {
            seat.el.classList.add('contested');
            await new Promise(r => setTimeout(r, latency)); 

            if (!seat.isReserved) {
                seat.isReserved = true;
                seat.el.classList.add('reserved');
                successCount++;
                successEl.textContent = successCount;
                addLog(`${isVIP ? '🌟' : ''} User ${id} RESERVÓ [${r}, ${c}]`, 'success');
            } else {
                collisionCount++;
                collisionEl.textContent = collisionCount;
                addLog(`User ${id} FALLÓ: Ocupado`, 'fail');
            }
            
            if (strategy === 'global') globalLock = false;
            else seat.isLocked = false;
            seat.el.classList.remove('contested');
        } else {
            collisionCount++;
            collisionEl.textContent = collisionCount;
            addLog(`User ${id} BLOQUEADO (Mutex Busy)`, 'fail');
        }
        await new Promise(r => setTimeout(r, Math.random() * 1000));
    }
}

async function startSimulation() {
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    startBtn.classList.add('running');
    startBtn.textContent = 'Simulación Pro en curso...';
    
    const count = parseInt(threadInput.value);
    const users = [];
    const priorityEnabled = usePriority.checked;

    for (let i = 0; i < count; i++) {
        const isVIP = priorityEnabled && (i % 5 === 0);
        users.push(simulateUser(i, isVIP));
    }
    await Promise.all(users);
    
    isRunning = false;
    startBtn.disabled = false;
    startBtn.classList.remove('running');
    startBtn.textContent = 'Lanzar Simulación';
    addLog('--- Simulación Finalizada ---', 'success');
}

latencyInput.addEventListener('input', (e) => {
    latencyVal.textContent = e.target.value + 'ms';
});
threadInput.addEventListener('input', (e) => {
    threadVal.textContent = e.target.value;
});
attemptsInput.addEventListener('input', (e) => {
    attemptsVal.textContent = e.target.value;
});
startBtn.addEventListener('click', startSimulation);
resetBtn.addEventListener('click', reset);
function reset() { isRunning = false; successCount = 0; collisionCount = 0; successEl.textContent = '0'; collisionEl.textContent = '0'; logContent.innerHTML = ''; initGrid(); }

initGrid();
