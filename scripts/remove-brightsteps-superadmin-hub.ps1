# Removes Super Admin hub / school security / site-editor feature pack and pushes.
# Usage: .\scripts\remove-brightsteps-superadmin-hub.ps1

$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

$tag = "brightsteps-superadmin-hub"
$sha = git rev-parse "$tag^{commit}" 2>$null
if (-not $sha) {
  Write-Error "Tag '$tag' not found. Nothing to remove."
}

Write-Host "Reverting $tag ($sha) ..."
git revert $sha --no-edit
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

git push origin HEAD
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Done. Super Admin hub pack reverted and pushed."
