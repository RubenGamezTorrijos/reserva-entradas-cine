#!/bin/bash

# CineSync Pro - Master Setup & Launcher (Linux)

clear
echo "==============================================="
echo "   CineSync Pro: Sistema de Reserva de Cine    "
echo "   Gestion de Concurrencia y Sincronizacion    "
echo "   Arquitectura MVC - Proyecto Academico       "
echo "==============================================="

# Crear carpeta bin si no existe
mkdir -p bin

# 1. Compilación
echo -e "\n[1/2] Preparando Backend en C..."
if ! command -v gcc &> /dev/null; then
    echo "ERROR: No se encontró GCC. Instálalo con: sudo apt install build-essential"
    exit 1
fi

echo "Compilando módulos MVC..."
gcc src/main.c src/model/cinema_model.c src/view/terminal_view.c src/controller/simulation_controller.c -o bin/reserva_cine -lpthread

if [ $? -eq 0 ]; then
    echo "OK: Backend compilado correctamente en bin/reserva_cine"
else
    echo "ERROR: Falló la compilación."
    exit 1
fi

# 2. Menú Interactivo
echo -e "\n[2/2] Instalación lista. ¿Qué deseas ejecutar?"

while true; do
    echo -e "\nElija una opción:"
    echo "1. Ejecutar simulación en Terminal (Código C - Hilos reales)"
    echo "2. Abrir Aplicación Web (Simulador Visual Pro)"
    echo "3. Salir"
    
    read -p "Seleccione [1-3]: " choice
    
    case $choice in
        1)
            if [ -f "bin/reserva_cine" ]; then
                echo -e "\n--- CONFIGURACIÓN DE ESTRESS ---"
                read -p "Número de usuarios [Default 100]: " u
                read -p "Intentos por usuario [Default 2]: " i
                
                u=${u:-100}
                i=${i:-2}

                echo -e "\nLanzando simulación con $u usuarios y $i intentos...\n"
                chmod +x bin/reserva_cine
                ./bin/reserva_cine $u $i
                echo -e "\nPresione Enter para volver al menú..."
                read
            else
                echo "ERROR: No se encuentra el ejecutable."
            fi
            ;;
        2)
            echo -e "\nAbriendo Aplicación Web..."
            # Intentar abrir con xdg-open (Linux standard)
            xdg-open web/index.html || echo "No se pudo abrir automáticamente. Abre web/index.html manualmente."
            ;;
        3)
            echo -e "\nSaliendo... Gracias por usar CineSync Pro."
            exit 0
            ;;
        *)
            echo "Opción no válida."
            ;;
    esac
done
