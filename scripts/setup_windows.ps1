# CineSync Pro - Master Setup & Launcher (Windows)

Clear-Host
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   CineSync Pro: Sistema de Reserva de Cine    " -ForegroundColor Cyan
Write-Host "   Gestión de Concurrencia y Sincronización    " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# 1. Compilación Automática
Write-Host "`n[1/2] Preparando Backend en C..." -ForegroundColor Yellow
if (!(Get-Command gcc -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: No se encontró GCC. Instala MinGW o añade GCC al PATH." -ForegroundColor Red
    pause
    exit
}

gcc -Wall -Wextra -pthread src/reserva_cine.c -o src/reserva_cine.exe
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Backend compilado correctamente." -ForegroundColor Green
} else {
    Write-Host "ERROR: Falló la compilación del código C." -ForegroundColor Red
    pause
    exit
}

# 2. Menú Interactivo
Write-Host "`n[2/2] Instalación lista. ¿Qué deseas ejecutar?" -ForegroundColor Yellow
do {
    Write-Host "`nElija una opción:" -ForegroundColor Cyan
    Write-Host "1. Ejecutar simulación en Terminal (Código C - Hilos reales)"
    Write-Host "2. Abrir Dashboard Web (Simulador Visual Pro)"
    Write-Host "3. Salir"
    
    $choice = Read-Host "Seleccione [1-3]"
    
    switch ($choice) {
        "1" {
            Write-Host "`nLanzando simulación en C...`n" -ForegroundColor Green
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
            Write-Host "Opción no válida. Intente de nuevo." -ForegroundColor Red
        }
    }
} while ($choice -ne "3")
