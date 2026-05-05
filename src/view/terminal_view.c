#include "terminal_view.h"
#include <stdio.h>

void mostrar_estado_sala() {
    printf("\n--- ESTADO FINAL DE LA SALA ---\n");
    printf("    ");
    for (int j = 0; j < COLUMNAS; j++) printf("%2d ", j);
    printf("\n");

    for (int i = 0; i < FILAS; i++) {
        printf("%2d ", i);
        for (int j = 0; j < COLUMNAS; j++) {
            if (sala[i][j].estaReservado) {
                printf(" R ");
            } else {
                printf(" . ");
            }
        }
        printf("\n");
    }
    printf("-------------------------------\n");
}

void imprimir_resultados(double tiempo_total) {
    printf("\n--- RESULTADOS DE LA SIMULACION ---\n");
    printf("Usuarios simulados:    %d\n", num_usuarios);
    printf("Intentos totales:      %d\n", num_usuarios * intentos_por_usuario);
    printf("Reservas exitosas:     %d\n", reservas_exitosas);
    printf("Colisiones (fallos):   %d\n", colisiones_detectadas);
    printf("Tiempo total:          %.4f segundos\n", tiempo_total);
    printf("------------------------------------\n");
}

void imprimir_inicio(int usuarios, int intentos) {
    printf("Iniciando simulacion con %d usuarios y %d intentos c/u...\n", usuarios, intentos);
}

void imprimir_reserva_exitosa(int id_usuario, int f, int c) {
    printf("Usuario %d RESERVO con exito el asiento [%d, %d]\n", id_usuario, f, c);
}

void imprimir_reserva_fallida(int id_usuario, int f, int c, int ocupado_por) {
    printf("Usuario %d FALLO: El asiento [%d, %d] ya esta ocupado por Usuario %d\n", id_usuario, f, c, ocupado_por);
}

void imprimir_mensaje(const char* mensaje) {
    printf("%s\n", mensaje);
}
