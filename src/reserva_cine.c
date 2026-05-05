#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <pthread.h>
#include <unistd.h>
#include <time.h>

#define FILAS 10
#define COLUMNAS 15
#define NUM_USUARIOS 100
#define INTENTOS_POR_USUARIO 20

// Estructura para representar un asiento
typedef struct {
    int fila;
    int columna;
    bool estaReservado;
    int usuarioID;
    pthread_mutex_t mutex; // Mutex individual para cada asiento
} Asiento;

// Estructura para pasar datos a los hilos
typedef struct {
    int id;
} UsuarioData;

// Sala de cine
Asiento sala[FILAS][COLUMNAS];

// Estadisticas globales
int reservas_exitosas = 0;
int colisiones_detectadas = 0;
pthread_mutex_t stats_mutex = PTHREAD_MUTEX_INITIALIZER;

// Funcion para inicializar la sala
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

// Funcion para limpiar recursos
void limpiar_sala() {
    for (int i = 0; i < FILAS; i++) {
        for (int j = 0; j < COLUMNAS; j++) {
            pthread_mutex_destroy(&sala[i][j].mutex);
        }
    }
}

// Funcion que ejecutan los hilos (simulacion de usuario)
void* simular_usuario(void* arg) {
    UsuarioData* data = (UsuarioData*)arg;
    int id_usuario = data->id;
    for (int i = 0; i < INTENTOS_POR_USUARIO; i++) {
        // Seleccionar un asiento aleatorio
        int f = rand() % FILAS;
        int c = rand() % COLUMNAS;

        printf("Usuario %d intentando reservar asiento [%d, %d]...\n", id_usuario, f, c);

        // Bloquear solo el asiento específico para máxima concurrencia
        pthread_mutex_lock(&sala[f][c].mutex);

        if (!sala[f][c].estaReservado) {
            // Simular un pequeno retardo en el proceso de reserva
            usleep((rand() % 10) * 1000); 

            sala[f][c].estaReservado = true;
            sala[f][c].usuarioID = id_usuario;
            
            pthread_mutex_lock(&stats_mutex);
            reservas_exitosas++;
            pthread_mutex_unlock(&stats_mutex);

            printf("Usuario %d RESERVO con exito el asiento [%d, %d]\n", id_usuario, f, c);
        } else {
            pthread_mutex_lock(&stats_mutex);
            colisiones_detectadas++;
            pthread_mutex_unlock(&stats_mutex);
            
            printf("Usuario %d FALLO: El asiento [%d, %d] ya esta ocupado por Usuario %d\n", 
                   id_usuario, f, c, sala[f][c].usuarioID);
        }

        pthread_mutex_unlock(&sala[f][c].mutex);

        // Pequena pausa entre intentos
        usleep((rand() % 50) * 1000);
    }

    free(data);
    return NULL;
}

void mostrar_estado_sala() {
    printf("\n--- ESTADO FINAL DE LA SALA ---\n");
    printf("   ");
    for (int j = 0; j < COLUMNAS; j++) printf("%2d ", j);
    printf("\n");

    for (int i = 0; i < FILAS; i++) {
        printf("%2d ", i);
        for (int j = 0; j < COLUMNAS; j++) {
            if (sala[i][j].estaReservado) {
                printf(" R "); // Reservado
            } else {
                printf(" . "); // Disponible
            }
        }
        printf("\n");
    }
    printf("-------------------------------\n");
}

int main() {
    srand(time(NULL));
    inicializar_sala();

    pthread_t hilos[NUM_USUARIOS];
    clock_t start_time = clock();

    printf("Iniciando simulacion con %d usuarios...\n", NUM_USUARIOS);

    for (int i = 0; i < NUM_USUARIOS; i++) {
        UsuarioData* data = malloc(sizeof(UsuarioData));
        data->id = i;
        if (pthread_create(&hilos[i], NULL, simular_usuario, data) != 0) {
            perror("Error al crear hilo");
            return 1;
        }
    }

    for (int i = 0; i < NUM_USUARIOS; i++) {
        pthread_join(hilos[i], NULL);
    }

    clock_t end_time = clock();
    double time_spent = (double)(end_time - start_time) / CLOCKS_PER_SEC;

    mostrar_estado_sala();

    printf("\n--- RESULTADOS DE LA SIMULACION ---\n");
    printf("Usuarios simulados:    %d\n", NUM_USUARIOS);
    printf("Intentos totales:      %d\n", NUM_USUARIOS * INTENTOS_POR_USUARIO);
    printf("Reservas exitosas:     %d\n", reservas_exitosas);
    printf("Colisiones (fallos):   %d\n", colisiones_detectadas);
    printf("Tiempo total:          %.4f segundos\n", time_spent);
    printf("------------------------------------\n");

    limpiar_sala();
    return 0;
}
