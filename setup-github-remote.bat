@echo off
echo Configuration du remote GitHub
echo ===============================

set /p REPO_URL="Entrez l'URL de votre repository GitHub: "

echo.
echo Ajout du remote origin...
git remote add origin %REPO_URL%

echo.
echo Push vers GitHub...
git push -u origin main

echo.
echo ✅ Repository poussé vers GitHub !
echo Votre projet est maintenant disponible sur : %REPO_URL%
pause