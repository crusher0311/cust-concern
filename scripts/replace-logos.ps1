# Replace logos script
# Usage: Open PowerShell in the project root and run: .\scripts\replace-logos.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$imagesDir = Join-Path $root 'images'
$source = Join-Path $imagesDir 'logo.png'

$targets = @('icon16.png','icon48.png','icon128.png')

if (-Not (Test-Path $source)) {
    Write-Error "Source logo not found: $source"
    exit 1
}

foreach ($t in $targets) {
    $dest = Join-Path $imagesDir $t
    Copy-Item -Path $source -Destination $dest -Force
    Write-Output "Replaced $dest with $source"
}

Write-Output "All icons replaced with logo.png"
