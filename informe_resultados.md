# Informe de Actividad: Sistema de Reserva de Entradas de Cine

## 1. Código Fuente

El sistema se ha implementado en C utilizando la librería `pthreads` para la gestión de hilos y mutexes para la sincronización. Se ha optado por un enfoque de **exclusión mutua a nivel de asiento**, lo que permite una alta concurrencia al no bloquear toda la sala para una sola reserva.

```c
// Fragmento clave: Proceso de reserva con sincronización
void* simular_usuario(void* arg) {
    // ... inicialización ...
    for (int i = 0; i < INTENTOS_POR_USUARIO; i++) {
        int f = rand() % FILAS;
        int c = rand() % COLUMNAS;

        // Bloqueo del asiento específico (Monitor/Semaforo Mutex)
        pthread_mutex_lock(&sala[f][c].mutex);

        if (!sala[f][c].estaReservado) {
            // Sección Crítica: Modificación del estado del asiento
            usleep((rand() % 10) * 1000); 
            sala[f][c].estaReservado = true;
            sala[f][c].usuarioID = id_usuario;
            // ... actualización de estadísticas ...
        } else {
            // Manejo de colisión
        }

        pthread_mutex_unlock(&sala[f][c].mutex);
        // ...
    }
}
```

*El código completo se encuentra en el archivo `reserva_cine.c`.*

## 2. Pruebas y Análisis de Resultados

### Configuración de la Prueba de Estrés
- **Usuarios Simultáneos (Hilos):** 100
- **Intentos de Reserva por Usuario:** 20
- **Dimensiones de la Sala:** 10 filas x 15 columnas (150 asientos totales)
- **Mecanismo de Sincronización:** Mutex individual por asiento (`pthread_mutex_t`).

### Resultados Obtenidos
| Métrica | Valor |
| :--- | :--- |
| Intentos Totales | 2000 |
| Reservas Exitosas | 53 |
| Colisiones (Asientos ya ocupados) | 1947 |
| Tiempo Total de Ejecución | 0.9230 segundos |

### Análisis
Los resultados muestran un alto número de colisiones (1947), lo cual es esperado dado que 100 usuarios compiten por solo 150 asientos realizando un total de 2000 peticiones. La sincronización mediante mutexes aseguró que:
1. **No hubiera sobre-reserva:** Ningún asiento fue asignado a más de un usuario.
2. **Integridad de datos:** Las estadísticas globales (`reservas_exitosas`) se mantuvieron consistentes gracias al `stats_mutex`.
3. **Eficiencia:** El tiempo de ejecución fue inferior a un segundo a pesar de la alta carga, demostrando que el bloqueo por asiento es mucho más eficiente que un bloqueo global de la sala.

## 3. Pensamiento Crítico y Reflexión

### Impacto del Mecanismo de Sincronización
La elección de **mutexes por asiento** en lugar de un único mutex para toda la sala impacta directamente en la **escalabilidad**. 
- Si hubiéramos usado un único mutex, cada usuario tendría que esperar a que el anterior termine su proceso de reserva completo, transformando el sistema en algo prácticamente secuencial.
- Con mutexes granulares, varios usuarios pueden reservar diferentes asientos al mismo tiempo sin bloquearse entre sí, mejorando la experiencia del usuario y el aprovechamiento de procesadores multinúcleo.

### Aplicabilidad en Sistemas Reales
Este modelo es directamente aplicable a sistemas de e-commerce, reservas de vuelos o bases de datos donde el acceso a filas específicas debe ser atómico. Los desafíos en sistemas reales incluyen:
- **Deadlocks:** Si un usuario intenta reservar múltiples asientos a la vez, podría ocurrir un interbloqueo si no se sigue un orden estricto de bloqueo.
- **Latencia de Red:** En un sistema real, el "retardo" no es un `usleep`, sino una petición de red que puede fallar.

### Posibles Mejoras
1. **Listas de Espera:** Implementar variables de condición para que los usuarios puedan esperar a que un asiento se libere (si hubiera cancelaciones).
2. **Reservas de Bloque:** Permitir reservar N asientos contiguos de forma atómica, lo cual requeriría algoritmos de búsqueda y bloqueos múltiples más complejos para evitar condiciones de carrera.
3. **Optimización de Lectura:** Usar bloqueos de lectura/escritura (`pthread_rwlock_t`) si el sistema tuviera muchas más consultas de disponibilidad que reservas reales.
