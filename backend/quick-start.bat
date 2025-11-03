@echo off
echo ========================================
   UNDO Recovery App - Quick Start (Windows Compatible)
   ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1 2>&1 | findstr /v /c "Microsoft Node.js" >nul') do (
    echo ✓ Node.js found: $(node --version)
) else (
      echo ✗ Node.js not found
      echo.
      echo Please install Node.js from: https://nodejs.org/
      pause
      exit /b 1
    )
  )

echo ✓ Node.js version: $(node --version)
echo.

REM Check if we're in the correct directory
if not exist "src\server-complete.ts" (
    echo ERROR: server-complete.ts not found
    echo.
    echo Current directory: %CD%
    echo.
    echo PLEASE NAVIGATE TO: C:\Users\dahbi\Pictures\UndoV3-main\backend
    pause
    exit /b 1
  )

echo ✓ Found server-complete.ts
echo.

REM Check if environment file exists
if not exist ".env" (
    echo Creating environment file...
    (
      echo NODE_ENV=development
      PORT=3001
      JWT_SECRET=your-super-secret-jwt-key-change-in-production-32-characters
      JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-also-32-characters
      OPENROUTER_API_KEY=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
      OPENROUTER_MODEL=openai/gpt-5
      OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
      CORS_ORIGIN=http://localhost:3000
      FRONTEND_URL=http://localhost:3000
    ) > .env
    echo ✓ Environment file created
  )

echo.
echo 🚀 Starting UNDO Recovery App (Windows Compatible)
echo Server will run on: http://localhost:3001
echo Frontend should run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server.
echo.

REM Starting server...
echo.

node src\server-complete.ts

pause >nul