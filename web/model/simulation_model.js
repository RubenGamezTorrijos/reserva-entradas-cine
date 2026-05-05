export const FILAS = 10;
export const COLUMNAS = 15;

export class SimulationModel {
    constructor() {
        this.seats = [];
        this.isRunning = false;
        this.successCount = 0;
        this.collisionCount = 0;
        this.globalLock = false;
        this.startTime = 0;
        this.endTime = 0;
    }

    initGrid() {
        this.seats = [];
        for (let i = 0; i < FILAS; i++) {
            this.seats[i] = [];
            for (let j = 0; j < COLUMNAS; j++) {
                this.seats[i][j] = { isReserved: false, isLocked: false };
            }
        }
    }

    reset() {
        this.isRunning = false;
        this.successCount = 0;
        this.collisionCount = 0;
        this.globalLock = false;
        this.initGrid();
    }

    getExecutionTime() {
        if (!this.startTime) return 0;
        const end = this.endTime || Date.now();
        return ((end - this.startTime) / 1000).toFixed(2);
    }
}
