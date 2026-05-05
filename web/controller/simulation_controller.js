/**
 * CONTROLADOR: Coordinación
 */
class SimulationController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.seatElements = [];
        this.init();
    }

    init() {
        this.seatElements = this.view.renderGrid(window.CONFIG.FILAS, window.CONFIG.COLUMNAS);
        this.setupEvents();
    }

    setupEvents() {
        this.view.dom.startBtn.onclick = () => this.startSimulation();
        this.view.dom.resetBtn.onclick = () => this.reset();

        const { inputs } = this.view.dom;
        inputs.threads.oninput = (e) => inputs.valThreads.textContent = e.target.value;
        inputs.latency.oninput = (e) => inputs.valLatency.textContent = e.target.value + 'ms';
        inputs.attempts.oninput = (e) => inputs.valAttempts.textContent = e.target.value;
    }

    async startSimulation() {
        if (this.model.isRunning) return;
        this.model.isRunning = true;
        this.model.startTime = Date.now();
        this.view.setLoading(true);

        const threadCount = parseInt(this.view.dom.inputs.threads.value);
        const priorityEnabled = this.view.dom.inputs.priority.checked;
        const tasks = [];

        for (let i = 0; i < threadCount; i++) {
            const isVIP = priorityEnabled && (i % 5 === 0);
            tasks.push(this.simulateUser(i, isVIP));
        }

        const timer = setInterval(() => {
            if (!this.model.isRunning) {
                clearInterval(timer);
                return;
            }
            this.updateUIStats();
        }, 50);

        await Promise.all(tasks);
        this.model.isRunning = false;
        this.view.setLoading(false);
        this.view.addLog("--- SIMULACIÓN FINALIZADA ---", "success");
        this.updateUIStats();
    }

    async simulateUser(id, isVIP) {
        const attempts = parseInt(this.view.dom.inputs.attempts.value);
        const latency = parseInt(this.view.dom.inputs.latency.value);
        const strategy = this.view.dom.inputs.strategy.value;

        await new Promise(r => setTimeout(r, Math.random() * 1000 + (isVIP ? 0 : 1000)));

        for (let i = 0; i < attempts && this.model.isRunning; i++) {
            const r = Math.floor(Math.random() * window.CONFIG.FILAS);
            const c = Math.floor(Math.random() * window.CONFIG.COLUMNAS);
            const seat = this.model.seats[r][c];
            const el = this.seatElements[r][c];

            this.view.addLog(`${isVIP ? '🌟 VIP' : 'User'} ${id} intentando [${r},${c}]`);

            let canEnter = false;
            if (strategy === 'global') {
                if (!this.model.globalLock) {
                    this.model.globalLock = true;
                    canEnter = true;
                }
            } else {
                if (!seat.isLocked) {
                    seat.isLocked = true;
                    canEnter = true;
                }
            }

            if (canEnter) {
                el.classList.add('contested');
                await new Promise(r => setTimeout(r, latency));

                if (!seat.isReserved) {
                    seat.isReserved = true;
                    el.classList.replace('contested', 'reserved');
                    this.model.successCount++;
                    this.view.addLog(`User ${id} RESERVÓ [${r},${c}]`, 'success');
                } else {
                    this.model.collisionCount++;
                    el.classList.remove('contested');
                    this.view.addLog(`User ${id} FALLÓ: Ocupado`, 'fail');
                }

                if (strategy === 'global') this.model.globalLock = false;
                else seat.isLocked = false;
            } else {
                this.model.collisionCount++;
                this.view.addLog(`User ${id} BLOQUEADO (Mutex Busy)`, 'fail');
            }

            this.updateUIStats();
            await new Promise(r => setTimeout(r, Math.random() * 500));
        }
    }

    updateUIStats() {
        const elapsed = this.model.startTime ? Date.now() - this.model.startTime : 0;
        this.view.updateStats(this.model.successCount, this.model.collisionCount, elapsed);
    }

    reset() {
        this.model.reset();
        this.seatElements = this.view.renderGrid(window.CONFIG.FILAS, window.CONFIG.COLUMNAS);
        this.view.updateStats(0, 0, 0);
        this.view.clearLog();
        this.view.setLoading(false);
    }
}

window.SimulationController = SimulationController;
