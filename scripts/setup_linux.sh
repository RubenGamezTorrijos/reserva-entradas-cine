#!/bin/bash

# CineSync Pro - Master Setup & Launcher (Linux)

clear
echo -e "\033[0;36m===============================================\033[0m"
echo -e "\033[0;36m   CineSync Pro: Sistema de Reserva de Cine    \033[0m"
echo -e "\033[0;36m   Gestion de Concurrencia y Sincronizacion    \033[0m"
echo -e "\033[0;36m===============================================\033[0m"

# 1. Compilacion Automatica
echo -e "\n\033[0;33m[1/2] Preparando Backend en C...\033[0m"
if ! command -v gcc &> /dev/null; then
    echo -e "\033[0;31mERROR: GCC no instalado. Instalando build-essential...\033[0m"
    sudo apt update && sudo apt install -y build-essential
fi

gcc -Wall -Wextra -pthread src/reserva_cine.c -o src/reserva_cine
if [ $? -eq 0 ]; then
    echo -e "\033[0;32mOK: Backend compilado correctamente.\033[0m"
else
    echo -e "\033[0;31mERROR: Fallo la compilacion del codigo C.\033[0m"
    exit 1
fi

# 2. Menu Interactivo
echo -e "\n\033[0;33m[2/2] Instalacion lista. ¿Que deseas ejecutar?\033[0m"

while true; do
    echo -e "\n\033[0;36mElija una opcion:\033[0m"
    echo "1. Ejecutar simulacion en Terminal (Codigo C - Hilos reales)"
    echo "2. Abrir Aplicacion Web (Simulador Visual Pro)"
    echo "3. Salir"
    
    read -p "Seleccione [1-3]: " choice
    
    case $choice in
        1)
            echo -e "\n\033[0;33m--- CONFIGURACION DE ESTRESS ---\033[0m"
            read -p "Numero de usuarios [Default 100]: " u
            read -p "Intentos por usuario [Default 2]: " i
            
            u=${u:-100}
            i=${i:-2}

            echo -e "\n\033[0;32mLanzando simulacion con $u usuarios y $i intentos...\033[0m\n"
            ./src/reserva_cine $u $i
            echo -e "\nPresione Enter para volver al menu..."
            read
            ;;
        2)
            echo -e "\n\033[0;32mAbrimiento Dashboard... Si no abre automaticamente, usa web/index.html\033[0m"
            xdg-open web/index.html || open web/index.html || echo "Por favor, abre manualmente: web/index.html"
            ;;
        3)
            echo -e "\n\033[0;33mSaliendo... Gracias por usar CineSync Pro.\033[0m"
            break
            ;;
        *)
            echo -e "\033[0;31mOpcion no valida.\033[0m"
            ;;
    esac
done
