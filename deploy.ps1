# Azure Function Deployment via PowerShell

Write-Host "Starting Azure Function Deployment..." -ForegroundColor Green

# Schritt 1: Wechsle in den Function-Ordner
Set-Location -Path "azure-function-v3"

# Schritt 2: Erstelle ZIP-Datei für Deployment
Write-Host "Creating deployment package..." -ForegroundColor Yellow

$deploymentZip = "..\deployment.zip"
if (Test-Path $deploymentZip) {
    Remove-Item $deploymentZip
}

# Komprimiere alle Dateien
Compress-Archive -Path * -DestinationPath $deploymentZip -Force

Write-Host "Deployment package created: $deploymentZip" -ForegroundColor Green

# Schritt 3: Upload via Kudu REST API
$functionAppName = "fragerwinchatv2"
$kuduUrl = "https://$functionAppName.scm.azurewebsites.net/api/zipdeploy"

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Go to Azure Portal" -ForegroundColor White
Write-Host "2. Open Function App 'fragerwinchatv2'" -ForegroundColor White
Write-Host "3. Go to 'Deployment Center' > 'Manual Deployment'" -ForegroundColor White
Write-Host "4. Or upload deployment.zip via Kudu Console" -ForegroundColor White
Write-Host "`nOr use VS Code Azure Extension:" -ForegroundColor Cyan
Write-Host "Ctrl+Shift+P > 'Azure Functions: Deploy to Function App'" -ForegroundColor White

Set-Location -Path ".."
