@echo off
echo Starting UNDO Recovery App API...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if we're in the right directory
if not exist "src\server.js" (
    echo ERROR: server.js not found in src directory
    echo Make sure you're in the backend directory
    pause
    exit /b 1
)

echo Starting server...
echo.
node src/server.js

pause