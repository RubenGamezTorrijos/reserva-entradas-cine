#ifndef TERMINAL_VIEW_H
#define TERMINAL_VIEW_H

#include "../model/cinema_model.h"

void mostrar_estado_sala();
void imprimir_resultados(double tiempo_total);
void imprimir_inicio(int usuarios, int intentos);
void imprimir_reserva_exitosa(int id_usuario, int f, int c);
void imprimir_reserva_fallida(int id_usuario, int f, int c, int ocupado_por);
void imprimir_mensaje(const char* mensaje);

#endif
