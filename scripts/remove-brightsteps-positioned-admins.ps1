# Removes the "positioned school admins" BrightSteps feature and pushes.
# Usage (from repo root):  .\scripts\remove-brightsteps-positioned-admins.ps1

$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

$tag = "brightsteps-positioned-admins"
$sha = git rev-parse "$tag^{commit}" 2>$null
if (-not $sha) {
  Write-Error "Tag '$tag' not found. Nothing to remove."
}

Write-Host "Reverting $tag ($sha) ..."
git revert $sha --no-edit
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

git push origin HEAD
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Done. Positioned admins feature reverted and pushed. Render will redeploy."
