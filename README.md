# Sistema de Reserva de Entradas de Cine - Concurrencia y Sincronización

![Status](https://img.shields.io/badge/Status-Version%201.3.0-blue)
![Language](https://img.shields.io/badge/Language-C%20%2F%20JavaScript-orange)
![Platform](https://img.shields.io/badge/Platform-Linux%20%2F%20Windows-green)

Este proyecto simula un sistema de reserva de entradas de cine de alta concurrencia, implementando mecanismos de sincronización (Semáforos/Mutex) para asegurar la exclusión mutua en el acceso a recursos compartidos (asientos).

## 🚀 Características
- **Backend en C**: Implementación nativa utilizando `pthreads` y mutexes individuales por asiento.
- **Frontend Pro**: Dashboard interactivo para visualizar colisiones, latencia de red y estrategias de bloqueo.
- **Simulación Multi-estrategia**: Compara la eficiencia de un Mutex Global frente a Mutexes Granulares.
- **Gestión de Prioridades**: Simulación de hilos con prioridades (Usuarios VIP).

## 📂 Estructura del Proyecto (MVC Pattern)
- **`src/`**: Lógica de negocio y backend en C.
- **`web/`**: Interfaz de usuario (Vista/Controlador) en HTML/JS.
- **`scripts/`**: Automatización de compilación y despliegue.
- **`README.md`**: Documentación principal.

## 🛠️ Requisitos e Instalación

### Requisitos Previos
- **C**: Compilador GCC (MinGW en Windows o Build-essential en Linux).
- **Web**: Un navegador moderno (Chrome, Firefox, Edge).

### Implementación Rápida (Scripts)

#### Windows (PowerShell)
1. Abre PowerShell como administrador en la raíz del proyecto.
2. Ejecuta:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process; .\scripts\setup_windows.ps1
   ```

#### Linux (Ubuntu 24.04+)
1. Abre la terminal en la raíz del proyecto.
2. Ejecuta:
   ```bash
   chmod +x scripts/setup_linux.sh
   ./scripts/setup_linux.sh
   ```

## 📖 Análisis de la Práctica (SSOO)
El objetivo es demostrar cómo la granularidad del bloqueo afecta al rendimiento:
- **Mutex por Asiento**: Permite que múltiples hilos reserven diferentes asientos simultáneamente.
- **Mutex Global**: Convierte el sistema en secuencial, aumentando drásticamente los tiempos de espera y fallos.

## 👥 Créditos y Autoría
- **Desarrollador**: Rubén Gámez Torrijos
- **Asignatura**: Sistemas Operativos (SS.OO.)
- **Profesor**: Diego Ramírez
- **Curso**: 2025/2026
- **Grado**: Ingeniería Informática
- **Universidad**: Universidad Europea de Madrid (UEM)

---
*Este proyecto es parte de una actividad académica para el estudio de hilos, secciones críticas y exclusión mutua.*
