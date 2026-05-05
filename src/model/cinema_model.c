#include "cinema_model.h"
#include <stdlib.h>
#include <unistd.h>

Asiento sala[FILAS][COLUMNAS];
int reservas_exitosas = 0;
int colisiones_detectadas = 0;
int num_usuarios = 100;
int intentos_por_usuario = 2;
pthread_mutex_t stats_mutex = PTHREAD_MUTEX_INITIALIZER;

void inicializar_sala() {
    for (int i = 0; i < FILAS; i++) {
        for (int j = 0; j < COLUMNAS; j++) {
            sala[i][j].fila = i;
            sala[i][j].columna = j;
            sala[i][j].estaReservado = false;
            sala[i][j].usuarioID = -1;
            pthread_mutex_init(&sala[i][j].mutex, NULL);
        }
    }
}

void limpiar_sala() {
    for (int i = 0; i < FILAS; i++) {
        for (int j = 0; j < COLUMNAS; j++) {
            pthread_mutex_destroy(&sala[i][j].mutex);
        }
    }
}

bool intentar_reservar_asiento(int id_usuario, int f, int c, int* ocupado_por) {
    bool exito = false;
    pthread_mutex_lock(&sala[f][c].mutex);

    if (!sala[f][c].estaReservado) {
        // Simular un pequeno retardo en el proceso de reserva
        usleep((rand() % 10) * 1000); 

        sala[f][c].estaReservado = true;
        sala[f][c].usuarioID = id_usuario;
        
        pthread_mutex_lock(&stats_mutex);
        reservas_exitosas++;
        pthread_mutex_unlock(&stats_mutex);
        exito = true;
    } else {
        pthread_mutex_lock(&stats_mutex);
        colisiones_detectadas++;
        pthread_mutex_unlock(&stats_mutex);
        *ocupado_por = sala[f][c].usuarioID;
        exito = false;
    }

    pthread_mutex_unlock(&sala[f][c].mutex);
    return exito;
}
