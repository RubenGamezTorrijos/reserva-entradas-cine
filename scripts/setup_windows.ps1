# CineSync Pro - Master Setup & Launcher (Windows)

Clear-Host
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   CineSync Pro: Sistema de Reserva de Cine    " -ForegroundColor Cyan
Write-Host "   Gestion de Concurrencia y Sincronizacion    " -ForegroundColor Cyan
Write-Host "   Arquitectura MVC - Proyecto Academico       " -ForegroundColor Cyan
Write-Host "   Version: 1.4.0 (Build Estable)              " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Crear carpeta bin si no existe
if (!(Test-Path "bin")) { New-Item -ItemType Directory -Path "bin" | Out-Null }

# 1. Compilacion Automatica
Write-Host "`n[1/2] Preparando Backend en C..." -ForegroundColor Yellow
if (!(Get-Command gcc -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: No se encontro GCC. Instala MinGW o añade GCC al PATH." -ForegroundColor Red
    pause
    exit
}

Write-Host "Compilando modulos MVC..." -ForegroundColor Gray
$gccCmd = "gcc src/main.c src/model/cinema_model.c src/view/terminal_view.c src/controller/simulation_controller.c -o bin/reserva_cine.exe -lpthread"
Invoke-Expression $gccCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "Reintentando con flag -pthread..." -ForegroundColor Gray
    $gccCmd = "gcc src/main.c src/model/cinema_model.c src/view/terminal_view.c src/controller/simulation_controller.c -o bin/reserva_cine.exe -pthread"
    Invoke-Expression $gccCmd
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Backend compilado correctamente en bin/reserva_cine.exe" -ForegroundColor Green
} else {
    Write-Host "ERROR: Fallo la compilacion." -ForegroundColor Red
    pause
    exit
}

# 2. Menu Interactivo
Write-Host "`n[2/2] Instalacion lista. ¿Que deseas ejecutar?" -ForegroundColor Yellow
do {
    Write-Host "`nElija una opcion:" -ForegroundColor Cyan
    Write-Host "1. Ejecutar simulacion en Terminal (Codigo C - Hilos reales)"
    Write-Host "2. Abrir Aplicacion Web (Simulador Visual Pro)"
    Write-Host "3. Salir"
    
    $choice = Read-Host "Seleccione [1-3]"
    
    switch ($choice) {
        "1" {
            if (Test-Path "bin/reserva_cine.exe") {
                Write-Host "`n--- CONFIGURACION DE ESTRESS ---" -ForegroundColor Yellow
                $u = Read-Host "Numero de usuarios [Default 100]"
                $i = Read-Host "Intentos por usuario [Default 2]"
                
                if ([string]::IsNullOrWhiteSpace($u)) { $u = "100" }
                if ([string]::IsNullOrWhiteSpace($i)) { $i = "2" }

                Write-Host "`nLanzando simulacion con $u usuarios y $i intentos...`n" -ForegroundColor Green
                Start-Process cmd -ArgumentList "/c bin\reserva_cine.exe $u $i & pause" -Wait
            } else {
                Write-Host "ERROR: No se encuentra el ejecutable en bin/" -ForegroundColor Red
            }
        }
        "2" {
            Write-Host "`nAbriendo Aplicacion Web en el navegador..." -ForegroundColor Green
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
