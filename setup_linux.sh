#!/bin/bash

# CineSync Setup Script for Ubuntu 24.04+

echo -e "\033[0;36m--- Iniciando Instalación de CineSync Pro (Linux) ---\033[0m"

# 1. Instalar dependencias si faltan
echo -e "\033[0;33m[1/3] Comprobando dependencias...\033[0m"
if ! command -v gcc &> /dev/null
then
    echo "Instalando build-essential..."
    sudo apt update && sudo apt install -y build-essential
else
    echo "OK: GCC ya instalado."
fi

# 2. Compilar C
echo -e "\033[0;33m[2/3] Compilando backend en C...\033[0m"
gcc -Wall -Wextra -pthread reserva_cine.c -o reserva_cine
if [ $? -eq 0 ]; then
    echo -e "\033[0;32mOK: Compilación exitosa. Ejecutable: ./reserva_cine\033[0m"
else
    echo -e "\033[0;31mERROR: Falló la compilación.\033[0m"
    exit 1
fi

# 3. Instrucciones Frontend
echo -e "\033[0;33m[3/3] Frontend listo.\033[0m"
echo "Para visualizar el dashboard, abre 'frontend/index.html' en tu navegador."

echo -e "\n\033[0;32m--- Instalación Completada ---\033[0m"
echo "Ejecuta './reserva_cine' para iniciar la simulación en terminal."
