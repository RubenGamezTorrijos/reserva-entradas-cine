export class SimulationView {
    constructor() {
        this.grid = document.getElementById('seatGrid');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.logContent = document.getElementById('logContent');
        this.successEl = document.getElementById('successCount');
        this.collisionEl = document.getElementById('collisionCount');
        this.timeEl = document.getElementById('executionTime');
        
        this.threadInput = document.getElementById('threadCount');
        this.threadVal = document.getElementById('threadCountVal');
        this.latencyInput = document.getElementById('latency');
        this.latencyVal = document.getElementById('latencyVal');
        this.attemptsInput = document.getElementById('attemptsCount');
        this.attemptsVal = document.getElementById('attemptsVal');
        this.lockStrategy = document.getElementById('lockStrategy');
        this.usePriority = document.getElementById('usePriority');
    }

    renderGrid(filas, columnas) {
        this.grid.innerHTML = '';
        const seatElements = [];
        for (let i = 0; i < filas; i++) {
            seatElements[i] = [];
            for (let j = 0; j < columnas; j++) {
                const el = document.createElement('div');
                el.className = 'seat';
                this.grid.appendChild(el);
                seatElements[i][j] = el;
            }
        }
        return seatElements;
    }

    addLog(msg, type = '') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        this.logContent.prepend(entry);
        if (this.logContent.children.length > 30) this.logContent.lastChild.remove();
    }

    updateStats(success, collisions, time) {
        this.successEl.textContent = success;
        this.collisionEl.textContent = collisions;
        if (this.timeEl) this.timeEl.textContent = time + 's';
    }

    setRunningState(running) {
        this.startBtn.disabled = running;
        if (running) {
            this.startBtn.classList.add('running');
            this.startBtn.textContent = 'Simulacion en curso...';
        } else {
            this.startBtn.classList.remove('running');
            this.startBtn.textContent = 'Lanzar Simulacion';
        }
    }
}
