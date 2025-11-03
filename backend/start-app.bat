@echo off
echo ========================================
   UNDO Recovery App - Quick Start
   ========================================
echo.

REM Check Node.js installation
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js found
node --version
echo.

REM Navigate to backend directory
cd /d "%~dp0"
if not exist "src\server-complete.ts" (
    echo ERROR: src\server-complete.ts not found
    echo.
    echo Current directory: %CD%
    echo.
    pause
    exit /b 1
)

echo ✓ Found server-complete.ts
echo.

REM Create environment file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    (
        echo NODE_ENV=development
        PORT=3001
        JWT_SECRET=your-super-secret-jwt-key-change-in-production-32-characters-long
        JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-also-32-characters
        OPENROUTER_API_KEY=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
    ) > .env
    echo ✓ Environment file created
  )

REM Start the server
echo.
echo 🚀 Starting UNDO Recovery App...
echo.
echo.
echo Backend will run on: http://localhost:3001
echo Frontend should run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
echo.

node src\server-complete.ts
pause >nul