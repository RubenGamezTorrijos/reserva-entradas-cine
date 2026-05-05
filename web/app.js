/**
 * CineSync Pro - Aplicación Unificada
 * Lógica de simulación de concurrencia
 */

const CONFIG = {
    FILAS: 10,
    COLUMNAS: 15,
    DEFAULT_THREADS: 100,
    DEFAULT_ATTEMPTS: 5,
    DEFAULT_LATENCY: 100
};

class CineSyncApp {
    constructor() {
        // Estado del Modelo
        this.seats = [];
        this.isRunning = false;
        this.successCount = 0;
        this.collisionCount = 0;
        this.startTime = 0;
        this.globalLock = false;

        // Referencias al DOM
        this.dom = {
            grid: document.getElementById('seatGrid'),
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            log: document.getElementById('logContent'),
            success: document.getElementById('successCount'),
            collision: document.getElementById('collisionCount'),
            time: document.getElementById('executionTime'),
            inputs: {
                threads: document.getElementById('threadCount'),
                latency: document.getElementById('latency'),
                attempts: document.getElementById('attemptsCount'),
                strategy: document.getElementById('lockStrategy'),
                priority: document.getElementById('usePriority'),
                valThreads: document.getElementById('threadCountVal'),
                valLatency: document.getElementById('latencyVal'),
                valAttempts: document.getElementById('attemptsVal')
            }
        };

        this.init();
    }

    init() {
        console.log("Iniciando CineSync Pro...");
        this.renderSeats();
        this.setupListeners();
        this.updateStats();
    }

    renderSeats() {
        if (!this.dom.grid) {
            console.error("Error: No se encontró el contenedor 'seatGrid'");
            return;
        }

        this.dom.grid.innerHTML = '';
        this.seats = [];

        for (let r = 0; r < CONFIG.FILAS; r++) {
            this.seats[r] = [];
            for (let c = 0; c < CONFIG.COLUMNAS; c++) {
                const seatEl = document.createElement('div');
                seatEl.className = 'seat';
                this.dom.grid.appendChild(seatEl);
                
                this.seats[r][c] = {
                    element: seatEl,
                    isReserved: false,
                    isLocked: false
                };
            }
        }
        console.log(`Sala de cine lista: ${CONFIG.FILAS * CONFIG.COLUMNAS} asientos.`);
    }

    setupListeners() {
        this.dom.startBtn.onclick = () => this.startSimulation();
        this.dom.resetBtn.onclick = () => this.reset();

        // Actualización dinámica de etiquetas de sliders
        this.dom.inputs.threads.oninput = (e) => this.dom.inputs.valThreads.textContent = e.target.value;
        this.dom.inputs.latency.oninput = (e) => this.dom.inputs.valLatency.textContent = e.target.value + 'ms';
        this.dom.inputs.attempts.oninput = (e) => this.dom.inputs.valAttempts.textContent = e.target.value;
    }

    async simulateUser(id, isVIP) {
        const attempts = parseInt(this.dom.inputs.attempts.value);
        const latency = parseInt(this.dom.inputs.latency.value);
        const strategy = this.dom.inputs.strategy.value;

        // Retraso inicial aleatorio para simular llegada de usuarios
        await new Promise(r => setTimeout(r, Math.random() * 1000 + (isVIP ? 0 : 1000)));

        for (let i = 0; i < attempts && this.isRunning; i++) {
            const r = Math.floor(Math.random() * CONFIG.FILAS);
            const c = Math.floor(Math.random() * CONFIG.COLUMNAS);
            const seat = this.seats[r][c];

            this.addLog(`${isVIP ? '🌟 VIP' : 'User'} ${id} intentando [${r},${c}]`);

            let canEnter = false;
            if (strategy === 'global') {
                if (!this.globalLock) {
                    this.globalLock = true;
                    canEnter = true;
                }
            } else {
                if (!seat.isLocked) {
                    seat.isLocked = true;
                    canEnter = true;
                }
            }

            if (canEnter) {
                seat.element.classList.add('contested');
                await new Promise(r => setTimeout(r, latency));

                if (!seat.isReserved) {
                    seat.isReserved = true;
                    seat.element.classList.remove('contested');
                    seat.element.classList.add('reserved');
                    this.successCount++;
                    this.addLog(`User ${id} RESERVÓ [${r},${c}]`, 'success');
                } else {
                    this.collisionCount++;
                    this.addLog(`User ${id} FALLÓ: Ocupado`, 'fail');
                    seat.element.classList.remove('contested');
                }

                if (strategy === 'global') this.globalLock = false;
                else seat.isLocked = false;
            } else {
                this.collisionCount++;
                this.addLog(`User ${id} BLOQUEADO (Mutex Busy)`, 'fail');
            }

            this.updateStats();
            await new Promise(r => setTimeout(r, Math.random() * 500));
        }
    }

    async startSimulation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startTime = Date.now();
        this.successCount = 0;
        this.collisionCount = 0;
        this.dom.startBtn.disabled = true;
        this.dom.startBtn.textContent = "Simulando...";

        const threadCount = parseInt(this.dom.inputs.threads.value);
        const priorityEnabled = this.dom.inputs.priority.checked;
        const tasks = [];

        for (let i = 0; i < threadCount; i++) {
            const isVIP = priorityEnabled && (i % 5 === 0);
            tasks.push(this.simulateUser(i, isVIP));
        }

        // Timer para el contador de tiempo real
        const timer = setInterval(() => {
            if (!this.isRunning) {
                clearInterval(timer);
                return;
            }
            this.updateStats();
        }, 50);

        await Promise.all(tasks);

        this.isRunning = false;
        this.dom.startBtn.disabled = false;
        this.dom.startBtn.textContent = "Lanzar Simulación";
        this.addLog("--- SIMULACIÓN FINALIZADA ---", "success");
        this.updateStats();
    }

    updateStats() {
        this.dom.success.textContent = this.successCount;
        this.dom.collision.textContent = this.collisionCount;
        
        const time = this.startTime ? (Date.now() - this.startTime) : 0;
        this.dom.time.textContent = time + " ms";
    }

    addLog(msg, type = '') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        this.dom.log.prepend(entry);
        if (this.dom.log.children.length > 20) this.dom.log.lastChild.remove();
    }

    reset() {
        this.isRunning = false;
        this.successCount = 0;
        this.collisionCount = 0;
        this.startTime = 0;
        this.renderSeats();
        this.updateStats();
        this.dom.log.innerHTML = '';
        this.dom.startBtn.disabled = false;
        this.dom.startBtn.textContent = "Lanzar Simulación";
    }
}

// Inicialización segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CineSyncApp());
} else {
    new CineSyncApp();
}
