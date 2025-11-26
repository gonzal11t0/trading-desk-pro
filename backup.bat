@echo off
chcp 65001 > nul
echo 🔄 Iniciando respaldo a GitHub...
echo.

cd /d "C:\ruta\TRADING-DISK"

:: Verificar si hay cambios
git status | findstr "nothing to commit" > nul
if %errorlevel% equ 0 (
    echo ℹ️  No hay cambios para respaldar
    pause
    exit /b
)

:: Proceso de respaldo
git add .
git commit -m "backup: %date% %time%"
git push origin main

if %errorlevel% equ 0 (
    echo ✅ Respaldo exitoso: %date% %time%
) else (
    echo ❌ Error en el respaldo
    echo Revisa la conexión o credenciales
)

pause