#!/usr/bin/env pwsh

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Golden Championship - Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Fonction pour afficher les messages de statut
function Write-Status {
    param([string]$Message, [string]$Color = "Green")
    Write-Host "[INFO] $Message" -ForegroundColor $Color
}

# Fonction pour vérifier si npm est installé
function Test-NpmInstalled {
    try {
        $null = Get-Command npm -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Vérification de npm
Write-Status "Vérification de npm..." "Yellow"
if (-not (Test-NpmInstalled)) {
    Write-Host "[ERREUR] npm n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    exit 1
}

# Installation des dépendances si nécessaire
if (-not (Test-Path "node_modules")) {
    Write-Status "Installation des dépendances..." "Yellow"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERREUR] Échec de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Status "Démarrage du frontend..." "Yellow"
Write-Status "Le navigateur s'ouvrira automatiquement dans 3 secondes..." "Yellow"
Write-Host ""

# Ouvrir le navigateur après un délai
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:5173/"
} | Out-Null

# Lancement du frontend (Ctrl+C pour quitter)
npm run dev

# Note: À l'avenir, on ajoutera ici le démarrage du backend
# Par exemple:
# Write-Status "Démarrage du backend..." "Yellow"
# Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "start:backend"
