/**
 * VISTA: Manipulación del DOM
 */
class SimulationView {
    constructor() {
        this.dom = {
            grid: document.getElementById('seatGrid'),
            log: document.getElementById('logContent'),
            success: document.getElementById('successCount'),
            collision: document.getElementById('collisionCount'),
            time: document.getElementById('executionTime'),
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
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
    }

    renderGrid(filas, columnas) {
        if (!this.dom.grid) return [];
        this.dom.grid.innerHTML = '';
        const seatElements = [];

        for (let r = 0; r < filas; r++) {
            seatElements[r] = [];
            for (let c = 0; c < columnas; c++) {
                const el = document.createElement('div');
                el.className = 'seat';
                this.dom.grid.appendChild(el);
                seatElements[r][c] = el;
            }
        }
        return seatElements;
    }

    updateStats(success, collisions, time) {
        this.dom.success.textContent = success;
        this.dom.collision.textContent = collisions;
        this.dom.time.textContent = time + " ms";
    }

    addLog(msg, type = '') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        this.dom.log.prepend(entry);
        if (this.dom.log.children.length > 20) this.dom.log.lastChild.remove();
    }

    clearLog() {
        this.dom.log.innerHTML = '';
    }

    setLoading(loading) {
        this.dom.startBtn.disabled = loading;
        this.dom.startBtn.textContent = loading ? "Simulando..." : "Lanzar Simulación";
    }
}

window.SimulationView = SimulationView;
