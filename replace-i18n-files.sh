#!/bin/bash
# Script pour remplacer les anciens fichiers par les nouveaux

echo "🔄 Remplacement des fichiers i18n..."

# Sauvegarder les anciens fichiers
cp lib/i18n/server.ts lib/i18n/server.backup.1754666023764.ts
cp lib/i18n/context.tsx lib/i18n/context.backup.1754666023764.tsx

# Remplacer par les nouveaux
mv lib/i18n/server-new.ts lib/i18n/server.ts
mv lib/i18n/context-new.tsx lib/i18n/context.tsx

echo "✅ Remplacement terminé!"
echo "🚀 Redémarrez l'application pour voir les changements"
