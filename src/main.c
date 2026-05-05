#include "controller/simulation_controller.h"
#include "model/cinema_model.h"
#include "view/terminal_view.h"
#include <stdlib.h>

int main(int argc, char* argv[]) {
    // Procesar argumentos si existen
    if (argc >= 2) {
        num_usuarios = atoi(argv[1]);
    }
    if (argc >= 3) {
        intentos_por_usuario = atoi(argv[2]);
    }

    iniciar_simulacion();

    return 0;
}
