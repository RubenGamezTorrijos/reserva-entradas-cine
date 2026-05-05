/**
 * MODELO: Gestión de datos y estado
 */
const CONFIG = {
    FILAS: 10,
    COLUMNAS: 15
};

class SimulationModel {
    constructor() {
        this.seats = [];
        this.successCount = 0;
        this.collisionCount = 0;
        this.startTime = 0;
        this.isRunning = false;
        this.globalLock = false;
        this.reset();
    }

    reset() {
        this.seats = Array.from({ length: CONFIG.FILAS }, () => 
            Array.from({ length: CONFIG.COLUMNAS }, () => ({
                isReserved: false,
                isLocked: false
            }))
        );
        this.successCount = 0;
        this.collisionCount = 0;
        this.startTime = 0;
        this.isRunning = false;
        this.globalLock = false;
    }
}

// Lo hacemos global para que otros archivos lo vean
window.SimulationModel = SimulationModel;
window.CONFIG = CONFIG;
