# Script PowerShell pour remplacer les fichiers i18n

Write-Host "🔄 Remplacement des fichiers i18n..." -ForegroundColor Yellow

# Sauvegarder les anciens fichiers
Copy-Item "lib/i18n/server.ts" "lib/i18n/server.backup.1754666023764.ts"
Copy-Item "lib/i18n/context.tsx" "lib/i18n/context.backup.1754666023764.tsx"

# Remplacer par les nouveaux
Move-Item "lib/i18n/server-new.ts" "lib/i18n/server.ts" -Force
Move-Item "lib/i18n/context-new.tsx" "lib/i18n/context.tsx" -Force

Write-Host "✅ Remplacement terminé!" -ForegroundColor Green
Write-Host "🚀 Redémarrez l'application pour voir les changements" -ForegroundColor Cyan
