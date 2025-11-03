@echo off
echo ========================================
echo   UNDO Recovery App API Server
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js found
node --version
echo.

REM Check if we're in the right directory
if not exist "src\server.js" (
    echo ERROR: src\server.js not found
    echo Make sure you're running this from the backend directory
    echo.
    echo Current directory: %CD%
    echo.
    pause
    exit /b 1
)

echo ✓ server.js file found
echo.

REM Check if the port is already in use
netstat -an | findstr ":3001" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 3001 is already in use
    echo Trying to stop existing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        echo Stopping process %%a
        taskkill /F /PID %%a >nul 2>&1
    )
    echo.
)

echo 🚀 Starting UNDO Recovery App API Server...
echo.
echo Available endpoints:
echo   • GET  http://localhost:3001/health
echo   • POST http://localhost:3001/api/v1/auth/login
echo   • POST http://localhost:3001/api/v1/coach/chat
echo   • POST http://localhost:3001/api/v1/coach/crisis
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start the server
node src\server.js

echo.
echo Server stopped. Press any key to exit...
pause >nul