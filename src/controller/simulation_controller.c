#include "simulation_controller.h"
#include "../model/cinema_model.h"
#include "../view/terminal_view.h"
#include <pthread.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>

void* simular_usuario(void* arg) {
    UsuarioData* data = (UsuarioData*)arg;
    int id = data->id;

    for (int i = 0; i < intentos_por_usuario; i++) {
        int fila = rand() % FILAS;
        int col = rand() % COLUMNAS;
        int ocupado_por = -1;

        if (intentar_reservar_asiento(id, fila, col, &ocupado_por)) {
            imprimir_reserva_exitosa(id, fila, col);
        } else {
            imprimir_reserva_fallida(id, fila, col, ocupado_por);
        }
        
        // Pequena espera entre intentos del mismo usuario
        usleep((rand() % 5) * 1000); 
    }

    free(data);
    return NULL;
}

void iniciar_simulacion() {
    pthread_t hilos[num_usuarios];
    srand(time(NULL));

    inicializar_sala();
    imprimir_inicio(num_usuarios, intentos_por_usuario);

    clock_t inicio = clock();

    for (int i = 0; i < num_usuarios; i++) {
        UsuarioData* data = malloc(sizeof(UsuarioData));
        data->id = i;
        pthread_create(&hilos[i], NULL, simular_usuario, data);
    }

    for (int i = 0; i < num_usuarios; i++) {
        pthread_join(hilos[i], NULL);
    }

    clock_t fin = clock();
    double tiempo_total = (double)(fin - inicio) / CLOCKS_PER_SEC;

    mostrar_estado_sala();
    imprimir_resultados(tiempo_total);
    
    limpiar_sala();
}
