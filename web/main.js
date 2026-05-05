/**
 * MAIN: Arranque de la aplicación
 */
function initApp() {
    console.log("Iniciando CineSync Pro (Arquitectura MVC Robusta)...");
    const model = new window.SimulationModel();
    const view = new window.SimulationView();
    new window.SimulationController(model, view);
}

// Ejecutamos cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
