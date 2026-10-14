# right-click > Run with PowerShell, any time you want the gallery refreshed.
# 1. copies every image from your Pictures folder (and subfolders) into images\fotos
#    (files already copied are skipped)
# 2. rebuilds photos.js so the gallery page shows them all

$source = [Environment]::GetFolderPath("MyPictures")
$dest   = Join-Path $PSScriptRoot "images\fotos"
$exts   = '^\.(jpe?g|png|jfif|webp|gif|avif)$'
$skip   = '\\Screenshots\\'   # folders to leave out, edit or delete this line

New-Item -ItemType Directory -Force $dest | Out-Null

# clean up empty files left behind by earlier failed copies
Get-ChildItem $dest -File | Where-Object { $_.Length -eq 0 } | Remove-Item -Force

$copied = 0
$failed = 0

Get-ChildItem $source -File -Recurse -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -match $exts -and $_.FullName -notlike "$dest*" -and $_.FullName -notmatch $skip } |
  ForEach-Object {
    $file   = $_
    $name   = $file.Name
    $target = Join-Path $dest $name

    # same name but a different file? make the name unique
    if ((Test-Path -LiteralPath $target) -and ((Get-Item -LiteralPath $target).Length -ne $file.Length)) {
      $name   = "{0}_{1}{2}" -f $file.BaseName, $file.Length, $file.Extension
      $target = Join-Path $dest $name
    }

    if (-not (Test-Path -LiteralPath $target)) {
      try {
        Copy-Item -LiteralPath $file.FullName -Destination $target -ErrorAction Stop
        $script:copied++
      } catch {
        $script:failed++
        Remove-Item -LiteralPath $target -Force -ErrorAction SilentlyContinue
      }
    }
  }

$files = Get-ChildItem $dest -File |
         Where-Object { $_.Extension -match $exts } |
         Sort-Object Name |
         ForEach-Object { $_.Name }

$json = ConvertTo-Json -InputObject @($files)
Set-Content -Path (Join-Path $PSScriptRoot "photos.js") -Value "const PHOTOS = $json;" -Encoding UTF8

Write-Host "copied $copied new photos, gallery now has $(@($files).Count)"
if ($failed -gt 0) {
  Write-Host ""
  Write-Host "$failed photos could not be copied (they're probably online-only in OneDrive)."
  Write-Host "open OneDrive from the start menu, right-click your Pictures folder > 'Always keep on this device',"
  Write-Host "wait for it to finish downloading, then run this again."
}
pause
