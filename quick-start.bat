@echo off
echo 🚀 DÉMARRAGE RAPIDE - Loft Manager
echo =================================

echo.
echo Vérification de l'état de l'application...

REM Vérifier si .next existe et est valide
if not exist ".next\routes-manifest.json" (
    echo ⚠️  Cache Next.js manquant ou corrompu
    echo 🔧 Reconstruction nécessaire...
    echo.
    
    echo 1. Nettoyage du cache...
    rmdir /s /q .next >nul 2>&1
    
    echo 2. Build rapide...
    npm run build >nul 2>&1
    if errorlevel 1 (
        echo ❌ Erreur de build - utilisation du mode dev
        npm run dev
        exit /b
    )
    echo ✅ Build terminé
)

echo.
echo 🎯 Démarrage du serveur...
echo 📍 URL: http://localhost:3002
echo.
npm run dev