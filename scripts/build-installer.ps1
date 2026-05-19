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

function Reset-OutputDirectory {
  param(
    [string] $Path,
    [string] $Root
  )

  $fullPath = [System.IO.Path]::GetFullPath($Path)
  $fullRoot = [System.IO.Path]::GetFullPath($Root)
  $rootPrefix = $fullRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar

  if (-not $fullPath.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to reset output directory outside project: $fullPath"
  }

  Remove-Item -LiteralPath $fullPath -Recurse -Force -ErrorAction SilentlyContinue
  New-Item -ItemType Directory -Force -Path $fullPath | Out-Null
}

if (-not (Test-Path -LiteralPath $configurationPath)) {
  throw "Inno Setup script not found: $configurationPath"
}

Push-Location $root
try {
  Write-Host '[1/4] Installing npm dependencies...'
  npm install

  Write-Host '[2/4] Building unpacked Windows Electron package...'
  npm run build:win-unpacked

  $packageJson = Get-Content -LiteralPath (Join-Path $root 'package.json') -Raw | ConvertFrom-Json
  $version = [string] $packageJson.version
  $sourceDir = Join-Path $releaseDir 'win-unpacked'
  $sourceExe = Join-Path $sourceDir 'Clock.exe'

  if (-not (Test-Path -LiteralPath $sourceExe)) {
    throw "Unpacked executable was not found: $sourceExe"
  }

  Reset-OutputDirectory -Path $installerReleaseDir -Root $root

  Write-Host '[3/4] Prepared unpacked app for Inno Setup.'

  $env:CLOCK_APP_VERSION = $version
  $env:CLOCK_SOURCE_DIR = $sourceDir
  $env:CLOCK_INSTALLER_OUTPUT_DIR = $installerReleaseDir
  Write-Host '[4/4] Building Inno Setup installer...'
  & (Resolve-Iscc) $configurationPath

  Write-Host ''
  Write-Host "Done. Installer output: $installerReleaseDir"
}
finally {
  Pop-Location
  Remove-Item Env:\CLOCK_APP_VERSION -ErrorAction SilentlyContinue
  Remove-Item Env:\CLOCK_SOURCE_DIR -ErrorAction SilentlyContinue
  Remove-Item Env:\CLOCK_INSTALLER_OUTPUT_DIR -ErrorAction SilentlyContinue
}
