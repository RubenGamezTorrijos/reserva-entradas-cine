const FILAS = 10;
const COLUMNAS = 15;
let seats = [];
let isRunning = false;
let successCount = 0;
let collisionCount = 0;

const grid = document.getElementById('seatGrid');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const logContent = document.getElementById('logContent');
const successEl = document.getElementById('successCount');
const collisionEl = document.getElementById('collisionCount');
const threadInput = document.getElementById('threadCount');
const threadVal = document.getElementById('threadCountVal');

// Initialize grid
function initGrid() {
    grid.innerHTML = '';
    seats = [];
    for (let i = 0; i < FILAS; i++) {
        seats[i] = [];
        for (let j = 0; j < COLUMNAS; j++) {
            const el = document.createElement('div');
            el.className = 'seat';
            el.dataset.row = i;
            el.dataset.col = j;
            grid.appendChild(el);
            seats[i][j] = {
                el: el,
                isReserved: false,
                isLocked: false
            };
        }
    }
}

function addLog(msg, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logContent.prepend(entry);
    if (logContent.children.length > 50) logContent.lastChild.remove();
}

async function simulateUser(id) {
    const attempts = 5;
    const speed = 11 - document.getElementById('speed').value;
    
    for (let i = 0; i < attempts && isRunning; i++) {
        const r = Math.floor(Math.random() * FILAS);
        const c = Math.floor(Math.random() * COLUMNAS);
        const seat = seats[r][c];

        addLog(`Usuario ${id} intentando asiento [${r}, ${c}]`);
        
        // Simular intento (parpadeo rojo si hay competencia)
        if (seat.isLocked) {
            seat.el.classList.add('contested');
            await new Promise(r => setTimeout(r, 200 * speed));
        }

        // --- SECCIÓN CRÍTICA (Simulada) ---
        if (!seat.isLocked) {
            seat.isLocked = true; // Simula pthread_mutex_lock
            
            if (!seat.isReserved) {
                await new Promise(r => setTimeout(r, 100 * speed)); // Simular procesamiento
                seat.isReserved = true;
                seat.el.classList.add('reserved');
                successCount++;
                successEl.textContent = successCount;
                addLog(`Usuario ${id} RESERVÓ [${r}, ${c}]`, 'success');
            } else {
                collisionCount++;
                collisionEl.textContent = collisionCount;
                addLog(`Usuario ${id} FALLÓ [${r}, ${c}]: Ocupado`, 'fail');
            }
            
            seat.isLocked = false; // Simula pthread_mutex_unlock
            seat.el.classList.remove('contested');
        } else {
            collisionCount++;
            collisionEl.textContent = collisionCount;
            addLog(`Usuario ${id} BLOQUEADO [${r}, ${c}]`, 'fail');
        }
        
        await new Promise(r => setTimeout(r, Math.random() * 1000 * speed));
    }
}

async function startSimulation() {
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    startBtn.textContent = 'Simulando...';
    
    const count = parseInt(threadInput.value);
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push(simulateUser(i));
    }
    
    await Promise.all(users);
    
    isRunning = false;
    startBtn.disabled = false;
    startBtn.textContent = 'Simulación Completada';
    addLog('--- Simulación Finalizada ---', 'success');
}

function reset() {
    isRunning = false;
    successCount = 0;
    collisionCount = 0;
    successEl.textContent = '0';
    collisionEl.textContent = '0';
    logContent.innerHTML = '';
    startBtn.disabled = false;
    startBtn.textContent = 'Iniciar Simulación';
    initGrid();
}

threadInput.addEventListener('input', (e) => {
    threadVal.textContent = e.target.value;
});

startBtn.addEventListener('click', startSimulation);
resetBtn.addEventListener('click', reset);

initGrid();
addLog('Sistema listo. Configure parámetros e inicie.');
