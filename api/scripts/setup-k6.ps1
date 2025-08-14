# PowerShell script to set up k6 for load testing
# Run this script as Administrator

Write-Host "Setting up k6 for load testing..." -ForegroundColor Green

# Check if Chocolatey is installed
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Chocolatey not found. Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
} else {
    Write-Host "Chocolatey is already installed." -ForegroundColor Green
}

# Install k6
Write-Host "Installing k6..." -ForegroundColor Yellow
choco install k6 -y

# Verify installation
Write-Host "Verifying k6 installation..." -ForegroundColor Yellow
try {
    $k6Version = k6 version
    Write-Host "k6 installed successfully!" -ForegroundColor Green
    Write-Host "Version: $k6Version" -ForegroundColor Cyan
} catch {
    Write-Host "Failed to verify k6 installation. Please check the installation." -ForegroundColor Red
    exit 1
}

# Create k6 results directory
$resultsDir = "k6-results"
if (!(Test-Path $resultsDir)) {
    New-Item -ItemType Directory -Path $resultsDir | Out-Null
    Write-Host "Created k6-results directory." -ForegroundColor Green
}

Write-Host "`nk6 setup completed successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Start your API server: npm run dev" -ForegroundColor White
Write-Host "2. Run a smoke test: npm run test:load:smoke" -ForegroundColor White
Write-Host "3. Run load tests: npm run test:load:load" -ForegroundColor White
Write-Host "4. Check the README.md in load-tests/ for more information" -ForegroundColor White
