# Direct Deployment via REST API (No Browser needed!)
# This uses your Azure Function App Publish Profile

param(
    [Parameter(Mandatory=$false)]
    [string]$ZipPath = "function-deployment.zip"
)

$functionAppName = "fragerwinchatv2"
$kuduUrl = "https://$functionAppName.scm.azurewebsites.net/api/zipdeploy"

Write-Host "=== Azure Function Deployment via REST API ===" -ForegroundColor Cyan
Write-Host ""

# Check if ZIP exists
if (-not (Test-Path $ZipPath)) {
    Write-Host "ERROR: ZIP file not found: $ZipPath" -ForegroundColor Red
    Write-Host "Creating ZIP now..." -ForegroundColor Yellow
    Compress-Archive -Path "azure-function-v3\*" -DestinationPath $ZipPath -Force
    Write-Host "ZIP created!" -ForegroundColor Green
}

Write-Host "ZIP file: $ZipPath" -ForegroundColor Green
Write-Host "Size: $([math]::Round((Get-Item $ZipPath).Length / 1KB, 2)) KB" -ForegroundColor Cyan
Write-Host ""

# Get Publish Profile credentials
Write-Host "To deploy, you need your Publish Profile credentials." -ForegroundColor Yellow
Write-Host ""
Write-Host "Get them from Azure Portal:" -ForegroundColor Cyan
Write-Host "1. Go to Function App 'fragerwinchatv2'" -ForegroundColor White
Write-Host "2. Click 'Download publish profile' (top menu)" -ForegroundColor White
Write-Host "3. Open the .PublishSettings file in Notepad" -ForegroundColor White
Write-Host "4. Find: userName='...' and userPWD='...'" -ForegroundColor White
Write-Host ""

$username = Read-Host "Enter userName (starts with $)"
$password = Read-Host "Enter userPWD" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# Create Basic Auth header
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${passwordPlain}"))

Write-Host ""
Write-Host "Uploading to Azure..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $kuduUrl -Method POST -InFile $ZipPath -Headers @{
        Authorization = "Basic $base64AuthInfo"
    } -ContentType "application/zip"
    
    Write-Host "Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Wait 2-3 minutes for deployment to complete" -ForegroundColor White
    Write-Host "2. Function App will auto-restart" -ForegroundColor White
    Write-Host "3. Test at: https://frag-erwin.info/admin/" -ForegroundColor White
    
} catch {
    Write-Host "Deployment failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
