[CmdletBinding()]
param(
  [string] $Configuration = 'installer\Clock.iss'
)

$ErrorActionPreference = 'Stop'

function Resolve-Iscc {
  $command = Get-Command 'ISCC.exe' -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  $candidates = @(
    "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe",
    "$env:ProgramFiles\Inno Setup 6\ISCC.exe"
  )

  foreach ($candidate in $candidates) {
    if ($candidate -and (Test-Path -LiteralPath $candidate)) {
      return $candidate
    }
  }

  throw 'Inno Setup 6 ISCC.exe was not found. Install Inno Setup 6 or add ISCC.exe to PATH.'
}

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$configurationPath = Join-Path $root $Configuration
$releaseDir = Join-Path $root 'release'
$installerReleaseDir = Join-Path $root 'installer-release'

if (-not (Test-Path -LiteralPath $configurationPath)) {
  throw "Inno Setup script not found: $configurationPath"
}

Push-Location $root
try {
  Write-Host '[1/4] Installing npm dependencies...'
  npm install

  Write-Host '[2/4] Building portable Electron package...'
  npm run build

  $packageJson = Get-Content -LiteralPath (Join-Path $root 'package.json') -Raw | ConvertFrom-Json
  $version = [string] $packageJson.version
  $sourceExe = Get-ChildItem -LiteralPath $releaseDir -Filter 'Clock-*-x64.exe' -File |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

  if (-not $sourceExe) {
    throw "Portable executable was not found in $releaseDir"
  }

  New-Item -ItemType Directory -Force -Path $installerReleaseDir | Out-Null
  Copy-Item -LiteralPath $sourceExe.FullName -Destination (Join-Path $installerReleaseDir $sourceExe.Name) -Force

  Write-Host '[3/4] Copied portable executable to installer-release.'

  $env:CLOCK_APP_VERSION = $version
  $env:CLOCK_SOURCE_EXE = $sourceExe.FullName
  $env:CLOCK_INSTALLER_OUTPUT_DIR = $installerReleaseDir
  Write-Host '[4/4] Building Inno Setup installer...'
  & (Resolve-Iscc) $configurationPath

  Write-Host ''
  Write-Host "Done. Installer output: $installerReleaseDir"
}
finally {
  Pop-Location
  Remove-Item Env:\CLOCK_APP_VERSION -ErrorAction SilentlyContinue
  Remove-Item Env:\CLOCK_SOURCE_EXE -ErrorAction SilentlyContinue
  Remove-Item Env:\CLOCK_INSTALLER_OUTPUT_DIR -ErrorAction SilentlyContinue
}
