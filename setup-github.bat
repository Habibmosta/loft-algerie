@echo off
echo Configuration GitHub pour Loft Manager
echo ========================================

echo 1. Initialisation du repository Git...
git init

echo 2. Ajout de tous les fichiers...
git add .

echo 3. Premier commit...
git commit -m "Initial commit: Loft Manager - Property Management System

Features:
- Multi-language support (French, Arabic, English)
- Categories management with improved UI
- Currencies management with exchange rates
- Geographic zones management
- Modern responsive design with animations
- Dark/Light theme support
- Settings pages with premium design
- Translation system with i18next"

echo 4. Configuration de la branche principale...
git branch -M main

echo.
echo ✅ Repository Git initialisé !
echo.
echo PROCHAINES ÉTAPES :
echo 1. Créez un nouveau repository sur GitHub.com
echo 2. Copiez l'URL du repository (ex: https://github.com/username/loft-manager.git)
echo 3. Exécutez : git remote add origin [URL_DU_REPO]
echo 4. Exécutez : git push -u origin main
echo.
echo Ou utilisez le script setup-github-remote.bat après avoir créé le repo
pause