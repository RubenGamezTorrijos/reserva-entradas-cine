import { FILAS, COLUMNAS, SimulationModel } from '../model/simulation_model.js';
import { SimulationView } from '../view/simulation_view.js';

class SimulationController {
    constructor() {
        this.model = new SimulationModel();
        this.view = new SimulationView();
        this.seatElements = [];
        
        this.init();
    }

    init() {
        this.model.initGrid();
        this.seatElements = this.view.renderGrid(FILAS, COLUMNAS);
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.view.startBtn.addEventListener('click', () => this.startSimulation());
        this.view.resetBtn.addEventListener('click', () => this.reset());
        
        this.view.latencyInput.addEventListener('input', (e) => {
            this.view.latencyVal.textContent = e.target.value + 'ms';
        });
        this.view.threadInput.addEventListener('input', (e) => {
            this.view.threadVal.textContent = e.target.value;
        });
        this.view.attemptsInput.addEventListener('input', (e) => {
            this.view.attemptsVal.textContent = e.target.value;
        });
    }

    async simulateUser(id, isVIP = false) {
        const attempts = parseInt(this.view.attemptsInput.value);
        const latency = parseInt(this.view.latencyInput.value);
        const strategy = this.view.lockStrategy.value;
        
        // Retardo inicial segun prioridad
        await new Promise(r => setTimeout(r, isVIP ? Math.random() * 500 : 1000 + Math.random() * 2000));

        for (let i = 0; i < attempts && this.model.isRunning; i++) {
            const r = Math.floor(Math.random() * FILAS);
            const c = Math.floor(Math.random() * COLUMNAS);
            const seatModel = this.model.seats[r][c];
            const seatUI = this.seatElements[r][c];

            this.view.addLog(`${isVIP ? '🌟 VIP' : 'User'} ${id} intentando [${r}, ${c}]`);
            
            let canAccess = false;
            if (strategy === 'global') {
                if (!this.model.globalLock) {
                    this.model.globalLock = true;
                    canAccess = true;
                }
            } else {
                if (!seatModel.isLocked) {
                    seatModel.isLocked = true;
                    canAccess = true;
                }
            }

            if (canAccess) {
                seatUI.classList.add('contested');
                await new Promise(r => setTimeout(r, latency)); 

                if (!seatModel.isReserved) {
                    seatModel.isReserved = true;
                    seatUI.classList.add('reserved');
                    this.model.successCount++;
                    this.view.addLog(`${isVIP ? '🌟' : ''} User ${id} RESERVO [${r}, ${c}]`, 'success');
                } else {
                    this.model.collisionCount++;
                    this.view.addLog(`User ${id} FALLO: Ocupado`, 'fail');
                }
                
                if (strategy === 'global') this.model.globalLock = false;
                else seatModel.isLocked = false;
                seatUI.classList.remove('contested');
            } else {
                this.model.collisionCount++;
                this.view.addLog(`User ${id} BLOQUEADO (Mutex Busy)`, 'fail');
            }
            
            this.view.updateStats(this.model.successCount, this.model.collisionCount, this.model.getExecutionTime());
            await new Promise(r => setTimeout(r, Math.random() * 1000));
        }
    }

    async startSimulation() {
        if (this.model.isRunning) return;
        this.model.isRunning = true;
        this.model.startTime = Date.now();
        this.model.endTime = 0;
        this.view.setRunningState(true);
        
        const count = parseInt(this.view.threadInput.value);
        const users = [];
        const priorityEnabled = this.view.usePriority.checked;

        for (let i = 0; i < count; i++) {
            const isVIP = priorityEnabled && (i % 5 === 0);
            users.push(this.simulateUser(i, isVIP));
        }
        
        // Timer de actualizacion visual mientras corre
        const timerInterval = setInterval(() => {
            if (!this.model.isRunning) {
                clearInterval(timerInterval);
                return;
            }
            this.view.updateStats(this.model.successCount, this.model.collisionCount, this.model.getExecutionTime());
        }, 100);

        await Promise.all(users);
        
        this.model.isRunning = false;
        this.model.endTime = Date.now();
        this.view.setRunningState(false);
        this.view.updateStats(this.model.successCount, this.model.collisionCount, this.model.getExecutionTime());
        this.view.addLog('--- Simulacion Finalizada ---', 'success');
    }

    reset() {
        this.model.reset();
        this.seatElements = this.view.renderGrid(FILAS, COLUMNAS);
        this.view.updateStats(0, 0, '0.00');
        this.view.logContent.innerHTML = '';
        this.view.setRunningState(false);
    }
}

// Arrancar la aplicacion
new SimulationController();
