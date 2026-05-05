# CineSync Pro v.1.4.0
<img width="1722" height="1276" alt="CineSyncPro_Animado_GI_FHDF_20260505_194200" src="https://github.com/user-attachments/assets/6b7b1432-18a6-4b5b-8e0f-f276fdb323eb" />

## Sistema de Reserva de Entradas de Cine - Concurrencia y Sincronización

![Status](https://img.shields.io/badge/Status-Version%201.4.0-blue)
![Language](https://img.shields.io/badge/Language-C%20%2F%20JavaScript-orange)
![Platform](https://img.shields.io/badge/Platform-Linux%20%2F%20Windows-green)

Este proyecto simula un sistema de reserva de entradas de cine de alta concurrencia, implementando mecanismos de sincronización (Semáforos/Mutex) para asegurar la exclusión mutua en el acceso a recursos compartidos (asientos).

## 🚀 Características (Novedades v.1.4.0)
- **Backend en C Profesional**: Código refactorizado con gestión eficiente de hilos utilizando `pthreads` y mutexes individuales por asiento.
- **Arquitectura Web MVC**: Frontend modularizado siguiendo el patrón Modelo-Vista-Controlador para una lógica robusta y escalable.
- **Interfaz "Ultra Pro"**: Dashboard interactivo con estética moderna (Glassmorphism), pantalla curva con resplandor dinámico y scrollbar personalizada.
- **Simulación Multi-estrategia**: Compara la eficiencia de un Mutex Global frente a Mutexes Granulares en una sala de 150 asientos.
- **Monitor de Actividad Realtime**: Log de actividad con priorización de usuarios VIP y estadísticas de colisiones instantáneas.

## 📂 Estructura del Proyecto (MVC Pattern)
- **`src/`**: Lógica de negocio y backend en C (Estructura modular).
- **`web/`**: Interfaz de usuario profesional:
    - `model/`: Estado y lógica de la simulación.
    - `view/`: Renderizado del DOM y estilos visuales.
    - `controller/`: Orquestación de eventos y concurrencia JS.
- **`scripts/`**: Automatización mejorada de compilación, limpieza y despliegue.
- **`README.md`**: Documentación principal v.1.4.0.

## 🛠️ Requisitos e Instalación

### Requisitos Previos
- **C**: Compilador GCC (MinGW en Windows o Build-essential en Linux).
- **Web**: Un navegador moderno (Chrome, Firefox, Edge).

### Implementación Rápida (Scripts Mejorados)

#### Windows (PowerShell)
1. Abre PowerShell en la raíz del proyecto.
2. Ejecuta:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process; .\scripts\setup_windows.ps1
   ```

#### Linux (Bash)
1. Abre la terminal en la raíz del proyecto.
2. Ejecuta:
   ```bash
   chmod +x scripts/setup_linux.sh
   ./scripts/setup_linux.sh
   ```

### 🖥️ Guía de Uso del Lanzador
Al ejecutar los scripts anteriores, se compilará automáticamente el código C y verás el siguiente menú interactivo:

```text
===============================================
   CineSync Pro: Sistema de Reserva de Cine    
   Gestión de Concurrencia y Sincronización    
===============================================

Elija una opción:
1. Ejecutar simulación en Terminal (Código C - Hilos reales)
2. Abrir Aplicación Web (Simulador Visual Pro MVC)
3. Salir

Seleccione [1-3]:
```

- **Opción 1**: Ejecuta el binario optimizado en C. Utiliza la librería `pthreads` para simular la reserva real con mutexes granulares.
- **Opción 2**: Abre el nuevo Dashboard Web Pro. Permite visualizar colisiones, tiempos de ejecución y comportamiento de hilos en una sala interactiva.

## 📖 Análisis de la Práctica (SSOO)
El objetivo es demostrar cómo la granularidad del bloqueo afecta al rendimiento:
- **Mutex por Asiento (v.1.4.0)**: Permite que múltiples hilos reserven diferentes asientos simultáneamente con mínima latencia.
- **Mutex Global**: Convierte el sistema en secuencial, provocando cuellos de botella y aumentando los fallos de acceso.

## 👥 Créditos y Autoría
- **Desarrollador**: Rubén Gámez Torrijos
- **Asignatura**: Sistemas Operativos (SS.OO.)
- **Profesor**: Diego Ramírez
- **Curso**: 2025/2026
- **Grado**: Ingeniería Informática
- **Universidad**: Universidad Europea de Madrid (UEM)

---
*Este proyecto es parte de una actividad académica para el estudio de hilos, secciones críticas y exclusión mutua.*
