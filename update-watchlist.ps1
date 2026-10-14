# after exporting your data from letterboxd, run this (right-click > Run with PowerShell).
# it grabs the newest letterboxd zip in Downloads and copies watchlist.csv into this folder.
$zip = Get-ChildItem "$env:USERPROFILE\Downloads\letterboxd-*.zip" -ErrorAction SilentlyContinue |
       Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $zip) {
  Write-Host "no letterboxd zip found in Downloads"
  pause
  exit
}

$tmp = Join-Path $env:TEMP "lb-export"
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
Expand-Archive $zip.FullName $tmp

Copy-Item (Join-Path $tmp "watchlist.csv") (Join-Path $PSScriptRoot "watchlist.csv") -Force
Write-Host "updated watchlist.csv from $($zip.Name)"
pause
