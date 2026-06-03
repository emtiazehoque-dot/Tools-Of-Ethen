@echo off
:: Navigate to the parent directory where index.html is located
cd /d "%~dp0.."

:: Start Python's built-in simple server in the background (available on most Windows systems with Python)
start /b python -m http.server 8080 >nul 2>&1

:: Wait 1 second for the server to spin up, then open the browser
timeout /t 1 >nul
start http://localhost:8080/index.html
exit
