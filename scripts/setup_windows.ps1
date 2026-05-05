# CineSync Pro - Master Setup & Launcher (Windows)

# Forzar ejecucion desde la raiz del proyecto para evitar errores de rutas
Set-Location $PSScriptRoot
Set-Location ..

Clear-Host
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   CineSync Pro: Sistema de Reserva de Cine    " -ForegroundColor Cyan
Write-Host "   Gestion de Concurrencia y Sincronizacion    " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# 1. Compilacion Automatica
Write-Host "`n[1/2] Preparando Backend en C..." -ForegroundColor Yellow
if (!(Get-Command gcc -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: No se encontro GCC. Instala MinGW o añade GCC al PATH." -ForegroundColor Red
    pause
    exit
}

# Compilar usando rutas relativas seguras desde la raiz
gcc -Wall -Wextra -pthread src/reserva_cine.c -o src/reserva_cine.exe
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Backend compilado correctamente." -ForegroundColor Green
} else {
    Write-Host "ERROR: Fallo la compilacion del codigo C." -ForegroundColor Red
    pause
    exit
}

# 2. Menú Interactivo
Write-Host "`n[2/2] Instalacion lista. ¿Que deseas ejecutar?" -ForegroundColor Yellow
do {
    Write-Host "`nElija una opcion:" -ForegroundColor Cyan
    Write-Host "1. Ejecutar simulacion en Terminal (Codigo C - Hilos reales)"
    Write-Host "2. Abrir Dashboard Web (Simulador Visual Pro)"
    Write-Host "3. Salir"
    
    $choice = Read-Host "Seleccione [1-3]"
    
    switch ($choice) {
        "1" {
            Write-Host "`nLanzando simulacion en C...`n" -ForegroundColor Green
            # Ejecutar y esperar a que el usuario presione una tecla antes de cerrar la ventana de C
            Start-Process cmd -ArgumentList "/c src\reserva_cine.exe & pause" -Wait
        }
        "2" {
            Write-Host "`nAbrimiento Dashboard en el navegador..." -ForegroundColor Green
            Start-Process "web\index.html"
        }
        "3" {
            Write-Host "`nSaliendo... Gracias por usar CineSync Pro." -ForegroundColor Yellow
            break
        }
        default {
            Write-Host "Opcion no valida. Intente de nuevo." -ForegroundColor Red
        }
    }
} while ($choice -ne "3")
