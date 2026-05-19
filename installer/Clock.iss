#define AppName "Clock"
#define AppVersion GetEnv("CLOCK_APP_VERSION")
#if AppVersion == ""
  #define AppVersion "1.0.0"
#endif

#define SourceDir GetEnv("CLOCK_SOURCE_DIR")
#if SourceDir == ""
  #define SourceDir "..\release\win-unpacked"
#endif

#define OutputDir GetEnv("CLOCK_INSTALLER_OUTPUT_DIR")
#if OutputDir == ""
  #define OutputDir "..\installer-release"
#endif

[Setup]
AppId={{8C40534A-A02B-41D1-BFB6-1E4F86BD4F72}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher=Clock
DefaultDirName={autopf}\{#AppName}
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
OutputDir={#OutputDir}
OutputBaseFilename=Clock-Setup-{#AppVersion}
SetupIconFile=..\assets\app-icon\icon.ico
UninstallDisplayIcon={app}\Clock.exe
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog

[Files]
Source: "{#SourceDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Clock"; Filename: "{app}\Clock.exe"; IconFilename: "{app}\Clock.exe"
Name: "{autodesktop}\Clock"; Filename: "{app}\Clock.exe"; IconFilename: "{app}\Clock.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional icons:"; Flags: unchecked

[Run]
Filename: "{app}\Clock.exe"; Description: "Launch Clock"; Flags: nowait postinstall skipifsilent
