#ifndef CINEMA_MODEL_H
#define CINEMA_MODEL_H

#include <stdbool.h>
#include <pthread.h>

#define FILAS 10
#define COLUMNAS 15

typedef struct {
    int fila;
    int columna;
    bool estaReservado;
    int usuarioID;
    pthread_mutex_t mutex;
} Asiento;

typedef struct {
    int id;
} UsuarioData;

// Datos globales del modelo
extern Asiento sala[FILAS][COLUMNAS];
extern int reservas_exitosas;
extern int colisiones_detectadas;
extern int num_usuarios;
extern int intentos_por_usuario;
extern pthread_mutex_t stats_mutex;

// Funciones del modelo
void inicializar_sala();
void limpiar_sala();
bool intentar_reservar_asiento(int id_usuario, int f, int c, int* ocupado_por);

#endif
