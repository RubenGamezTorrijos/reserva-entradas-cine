# CineSync Setup Script for Windows

Write-Host "--- Iniciando Instalación de CineSync Pro ---" -ForegroundColor Cyan

# 1. Comprobar GCC
Write-Host "[1/3] Comprobando compilador GCC..." -ForegroundColor Yellow
$gccCheck = Get-Command gcc -ErrorAction SilentlyContinue
if (!$gccCheck) {
    Write-Host "ERROR: GCC no encontrado. Por favor, instala MinGW-w64." -ForegroundColor Red
    exit
}
Write-Host "OK: GCC detectado." -ForegroundColor Green

# 2. Compilar C
Write-Host "[2/3] Compilando backend en C (reserva_cine.c)..." -ForegroundColor Yellow
gcc -Wall -Wextra -pthread reserva_cine.c -o reserva_cine.exe
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Compilación exitosa. Ejecutable: reserva_cine.exe" -ForegroundColor Green
} else {
    Write-Host "ERROR: Falló la compilación." -ForegroundColor Red
    exit
}

# 3. Lanzar Frontend (Opcional)
Write-Host "[3/3] Preparando visualización..." -ForegroundColor Yellow
$htmlPath = Join-Path (Get-Location) "index.html"
Write-Host "Puedes abrir el frontend manualmente en: $htmlPath" -ForegroundColor Cyan

Write-Host "`n--- Instalación Completada con Éxito ---" -ForegroundColor Green
Write-Host "Para ejecutar la simulación en terminal: .\reserva_cine.exe"
