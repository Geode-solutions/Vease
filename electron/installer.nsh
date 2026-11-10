; Custom NSIS hooks, included by electron-builder (see "nsis.include" in electron-builder.json)

; electron-builder's "keepShortcuts" mechanism skips shortcut creation whenever a previous
; Vease install is found, so reinstalling after the shortcuts were deleted (or after an install
; that never created them) leaves the user without any way to launch the app.
; This hook runs after the default shortcut handling and creates the missing ones.
!macro customInstall
  ${ifNot} ${FileExists} "$newStartMenuLink"
    CreateShortCut "$newStartMenuLink" "$appExe" "" "$appExe" 0 "" "" "${APP_DESCRIPTION}"
    ClearErrors
    WinShell::SetLnkAUMI "$newStartMenuLink" "${APP_ID}"
  ${endIf}

  ; On auto-updates, respect a desktop shortcut the user removed on purpose
  ${ifNot} ${isUpdated}
  ${AndIfNot} ${FileExists} "$newDesktopLink"
    CreateShortCut "$newDesktopLink" "$appExe" "" "$appExe" 0 "" "" "${APP_DESCRIPTION}"
    ClearErrors
    WinShell::SetLnkAUMI "$newDesktopLink" "${APP_ID}"
    System::Call 'Shell32::SHChangeNotify(i 0x8000000, i 0, i 0, i 0)'
  ${endIf}
!macroend
