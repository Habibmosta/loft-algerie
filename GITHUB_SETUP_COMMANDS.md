# 🚀 Commandes pour Setup GitHub

## Après avoir créé le repository sur GitHub.com

```bash
# 1. Ajouter l'origine remote (remplacez YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/loft-algeria.git

# 2. Vérifier que la branche est bien 'main'
git branch -M main

# 3. Pousser vers GitHub
git push -u origin main
```

## Commandes futures pour les commits

```bash
# Ajouter les fichiers modifiés
git add .

# Créer un commit avec un message descriptif
git commit -m "Description des changements"

# Pousser vers GitHub
git push
```

## Exemple de workflow

```bash
# Après avoir fait des modifications
git add .
git commit -m "Fix: Correction des traductions du composant lofts"
git push

# Ou pour des nouvelles fonctionnalités
git add .
git commit -m "Feature: Ajout du système de notifications en temps réel"
git push
```

## Branches pour les fonctionnalités

```bash
# Créer une nouvelle branche pour une fonctionnalité
git checkout -b feature/nouvelle-fonctionnalite

# Travailler sur la fonctionnalité...
git add .
git commit -m "Work in progress: nouvelle fonctionnalité"

# Pousser la branche
git push -u origin feature/nouvelle-fonctionnalite

# Fusionner dans main (après review)
git checkout main
git merge feature/nouvelle-fonctionnalite
git push
```