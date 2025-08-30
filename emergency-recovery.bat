@echo off
echo 🚨 RÉCUPÉRATION D'URGENCE - Next.js
echo ===================================

echo.
echo 1. Arrêt de tous les processus Node.js...
taskkill /f /im node.exe >nul 2>&1
echo ✅ Processus arrêtés

echo.
echo 2. Suppression complète du cache Next.js...
rmdir /s /q .next >nul 2>&1
echo ✅ Cache .next supprimé

echo.
echo 3. Nettoyage du cache npm...
npm cache clean --force >nul 2>&1
echo ✅ Cache npm nettoyé

echo.
echo 4. Suppression des fichiers temporaires...
del /q *.tsbuildinfo >nul 2>&1
rmdir /s /q .turbo >nul 2>&1
echo ✅ Fichiers temporaires supprimés

echo.
echo 5. Vérification des dépendances...
npm install
echo ✅ Dépendances vérifiées

echo.
echo 6. Reconstruction complète...
npm run build
if errorlevel 1 (
    echo ❌ Erreur de build - tentative de correction...
    echo.
    echo 7. Nettoyage approfondi...
    rmdir /s /q .next >nul 2>&1
    npm run dev
) else (
    echo ✅ Build réussi
    echo.
    echo 8. Démarrage du serveur de développement...
    npm run dev
)