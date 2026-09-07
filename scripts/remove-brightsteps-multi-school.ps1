# Removes the multi-school Super Admin / public campus feature and pushes.
# Usage (from repo root):  .\scripts\remove-brightsteps-multi-school.ps1

$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

$tag = "brightsteps-multi-school"
$sha = git rev-parse "$tag^{commit}" 2>$null
if (-not $sha) {
  Write-Error "Tag '$tag' not found. Nothing to remove."
}

Write-Host "Reverting $tag ($sha) ..."
git revert $sha --no-edit
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

git push origin HEAD
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Done. Multi-school Super Admin feature reverted and pushed. Render will redeploy."
