@echo off
setlocal
cd /d "%~dp0"

set "PORT=8078"
if not "%~1"=="" set "PORT=%~1"

echo.
echo ============================================
echo   Bernardo Ramos Portfolio - servidor local
echo ============================================
echo   Pasta: %cd%
echo   URL:   http://localhost:%PORT%
echo.
echo   Para parar o servidor: Ctrl + C
echo.

start "" "http://localhost:%PORT%"

where python >nul 2>nul
if %errorlevel%==0 (
  python servidor.py %PORT%
) else (
  py -3 servidor.py %PORT%
)

pause
