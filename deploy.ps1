# Azure Function Deployment via VS Code CLI
# This script helps deploy the Azure Function using func CLI

Write-Host "=== Azure Function Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Function App Details
$functionAppName = "fragerwinchatv2"
$resourceGroup = "FragErwin_group"  # Adjust if different

Write-Host "Target Function App: $functionAppName" -ForegroundColor Green
Write-Host ""

# Check if func CLI is available
$funcPath = Get-Command func -ErrorAction SilentlyContinue

if ($funcPath) {
    Write-Host "Azure Functions Core Tools found!" -ForegroundColor Green
    Write-Host "Starting deployment..." -ForegroundColor Yellow
    Write-Host ""
    
    # Navigate to function directory
    Push-Location "azure-function-v3"
    
    # Deploy using func CLI
    func azure functionapp publish $functionAppName --build remote
    
    Pop-Location
    
    Write-Host ""
    Write-Host "Deployment completed!" -ForegroundColor Green
    
} else {
    Write-Host "Azure Functions Core Tools not found in PATH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please use one of these methods:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "METHOD 1: VS Code Azure Extension" -ForegroundColor White
    Write-Host "  1. Press Ctrl+Shift+P" -ForegroundColor Gray
    Write-Host "  2. Type: Azure Functions: Deploy to Function App" -ForegroundColor Gray
    Write-Host "  3. Browse to folder: azure-function-v3" -ForegroundColor Gray
    Write-Host "  4. Select: fragerwinchatv2" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "METHOD 2: Azure Portal (Manual Upload)" -ForegroundColor White
    Write-Host "  1. Go to https://portal.azure.com" -ForegroundColor Gray
    Write-Host "  2. Open Function App 'fragerwinchatv2'" -ForegroundColor Gray
    Write-Host "  3. Click 'Advanced Tools' (Kudu)" -ForegroundColor Gray
    Write-Host "  4. Click 'Go' -> Debug Console -> CMD" -ForegroundColor Gray
    Write-Host "  5. Navigate to: cd site\wwwroot" -ForegroundColor Gray
    Write-Host "  6. Drag & Drop files from azure-function-v3" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "METHOD 3: Install Azure Functions Core Tools" -ForegroundColor White
    Write-Host "  Run: npm install -g azure-functions-core-tools@4 --unsafe-perm true" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Function App URL: https://$functionAppName.azurewebsites.net" -ForegroundColor Cyan

