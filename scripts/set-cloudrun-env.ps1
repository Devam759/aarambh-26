#!/usr/bin/env pwsh
# ==============================================================================
# set-cloudrun-env.ps1
# Sets all required runtime environment variables on the Firebase/Cloud Run
# backend so the hosted site does not return 500 errors.
#
# PREREQUISITES: Google Cloud SDK (gcloud) must be installed.
# Download: https://cloud.google.com/sdk/docs/install
#
# USAGE: .\scripts\set-cloudrun-env.ps1
# ==============================================================================

$PROJECT_ID = "aarambh-26"
$REGION = "us-central1"

# --- Load secrets from .env.local dynamically ---
$envLocalPath = Join-Path $PSScriptRoot "..\.env.local"
if (Test-Path $envLocalPath) {
    Write-Host "Loading secret variables from .env.local..." -ForegroundColor Yellow
    Get-Content $envLocalPath | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith('#') -and $line -match '^([^=]+)=(.*)$') {
            $key = $Matches[1].Trim()
            $val = $Matches[2].Trim()
            # Strip outer single or double quotes
            if ($val -match '^"(.*)"$') { $val = $Matches[1] }
            elseif ($val -match "^'(.*)'$") { $val = $Matches[1] }
            Set-Content -Path "env:$key" -Value $val
        }
    }
}

$CASHFREE_APP_ID = $env:CASHFREE_APP_ID
$CASHFREE_SECRET_KEY = $env:CASHFREE_SECRET_KEY
$SMTP_PASS = $env:SMTP_PASS
$EXCEL_SYNC_WEBHOOK_URL = $env:EXCEL_SYNC_WEBHOOK_URL

if (-not $CASHFREE_APP_ID -or -not $CASHFREE_SECRET_KEY -or -not $SMTP_PASS -or -not $EXCEL_SYNC_WEBHOOK_URL) {
    Write-Host "`nError: Missing secrets (CASHFREE_APP_ID, CASHFREE_SECRET_KEY, SMTP_PASS, or EXCEL_SYNC_WEBHOOK_URL) in environment or .env.local." -ForegroundColor Red
    Write-Host "Please ensure they are defined in your local .env.local file." -ForegroundColor Yellow
    exit 1
}

# --- Find the Cloud Run service name (created by firebase deploy) ---
Write-Host "`nFetching Cloud Run services in project '$PROJECT_ID'..." -ForegroundColor Cyan
$SERVICE_NAME = gcloud run services list `
    --project=$PROJECT_ID `
    --region=$REGION `
    --format="value(name)" `
    --limit=1 2>&1

if (-not $SERVICE_NAME -or $SERVICE_NAME -match "ERROR") {
    Write-Host "Could not find a Cloud Run service. Make sure you have run 'firebase deploy' at least once." -ForegroundColor Red
    Write-Host "Also ensure gcloud is authenticated: run 'gcloud auth login'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found service: $SERVICE_NAME" -ForegroundColor Green

# --- Set runtime environment variables ---
Write-Host "`nSetting environment variables on Cloud Run service '$SERVICE_NAME'..." -ForegroundColor Cyan

gcloud run services update $SERVICE_NAME `
    --project=$PROJECT_ID `
    --region=$REGION `
    --set-env-vars="CASHFREE_APP_ID=$CASHFREE_APP_ID" `
    --set-env-vars="CASHFREE_SECRET_KEY=$CASHFREE_SECRET_KEY" `
    --set-env-vars="SMTP_PASS=$SMTP_PASS" `
    --set-env-vars="EXCEL_SYNC_WEBHOOK_URL=$EXCEL_SYNC_WEBHOOK_URL" `
    --set-env-vars="NEXT_PUBLIC_CASHFREE_ENV=PRODUCTION" `
    --set-env-vars="SMTP_HOST=smtp.office365.com" `
    --set-env-vars="SMTP_PORT=587" `
    --set-env-vars="SMTP_USER=aarambh@jklu.edu.in" `
    --set-env-vars="SMTP_FROM=aarambh@jklu.edu.in" `
    --set-env-vars="NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBs809r1V3eDKO0uuHkzO06GOpYFM6tewQ" `
    --set-env-vars="NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aarambh-26.firebaseapp.com" `
    --set-env-vars="NEXT_PUBLIC_FIREBASE_PROJECT_ID=aarambh-26" `
    --set-env-vars="NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aarambh-26.firebasestorage.app" `
    --set-env-vars="NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1029001746243" `
    --set-env-vars="NEXT_PUBLIC_FIREBASE_APP_ID=1:1029001746243:web:9e8dcafed191c4210c01f6"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nAll environment variables set successfully!" -ForegroundColor Green
    Write-Host "The Cloud Run service '$SERVICE_NAME' has been updated." -ForegroundColor Green
    Write-Host "The /api/register endpoint should now work correctly." -ForegroundColor Green
} else {
    Write-Host "`nFailed to set environment variables. Check the error above." -ForegroundColor Red
}
