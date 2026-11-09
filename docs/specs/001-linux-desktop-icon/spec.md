# Feature 001: Vease desktop icon on Linux

**Status:** Approved
**Created:** 2026-11-09
**Branch:** `fix/linux_window_icon`

---

## Problem Statement

When Vease desktop runs on Linux, the window, the taskbar/dock and the app switcher show a generic icon instead of the Vease logo. There are two causes. The window icon is looked up relative to the directory the user launched Vease from, so packaged builds never find it. Windows has the same defect, and the file it asks for doesn't exist. On Wayland sessions, the shell ignores window icons and takes the icon from an installed desktop entry, which the portable Linux packages (AppImage, zip) never install. Users find Vease harder to spot among their open apps, and the app looks unfinished.

## Goals

- The Vease logo shows on the Vease window and its taskbar/dock entry on Linux, in both X11 and Wayland sessions, for the AppImage and zip packages.
- The Vease logo shows on the Vease window on Windows.
- After launching the portable Linux package once, Vease appears in the user's application launcher under its own name with its logo.

## Non-Goals

- Changing the logo artwork itself.
- System-wide (all users, root-owned) installation on Linux.
- macOS packaging.
- Replacing third-party AppImage integration tools.

## Users and Context

**Primary users:** Geoscientists running Vease desktop from the downloaded Linux AppImage or zip.
**Secondary users:** Windows desktop users (window icon defect).
**Usage context:** The user launches Vease from a file manager, a terminal in any directory, or the application launcher.
**User mental model:** "An installed app has its own icon in the dock and the app menu."

## User Stories

### Story 1: Recognisable window on Linux

**As a** Linux desktop user
**I want** the Vease window and its taskbar/dock entry to show the Vease logo
**So that** I can find Vease among my open applications

**Acceptance criteria:**

- [ ] **AC-1.1** Given a packaged Linux build When Vease opens its window, wherever it was launched from Then the window icon given to the OS is the Vease logo file, and that file exists on disk
- [ ] **AC-1.2** Given Vease runs in development mode from the repository When the window opens Then the window icon given to the OS is the Vease logo file from the project sources, and that file exists on disk
- [ ] **AC-1.3** Given a Wayland session and a packaged Linux build that has been launched at least once When the Vease window is open Then the dock/taskbar shows the Vease logo (manual check)

### Story 2: Recognisable window on Windows

**As a** Windows desktop user
**I want** the Vease window to show the Vease logo
**So that** the app looks like Vease in the taskbar

**Acceptance criteria:**

- [ ] **AC-2.1** Given a packaged Windows build When Vease opens its window Then the window icon given to the OS is an existing Vease logo file

### Story 3: Launcher entry for portable Linux packages

**As a** Linux user who downloaded the AppImage or zip
**I want** Vease to register itself in my application launcher
**So that** I can start it like any installed app and the dock shows its logo

**Acceptance criteria:**

- [ ] **AC-3.1** Given a packaged Linux build and no existing Vease launcher entry for the user When Vease starts Then a per-user launcher entry named "Vease" exists, it launches the running package, it shows the Vease logo, and it is associated with the Vease window
- [ ] **AC-3.2** Given a Vease launcher entry that points at an older location of the package When Vease starts from a new location Then the entry is updated to launch the new location
- [ ] **AC-3.3** Given a Vease launcher entry already identical to the one Vease would write When Vease starts Then the entry and icon files are not rewritten
- [ ] **AC-3.4** Given Vease runs in development mode, or on a platform other than Linux When Vease starts Then no launcher entry or icon is written

## Functional Requirements

### FR-1: Window icon resolution

The window icon is resolved to an absolute location inside the running application, independent of the working directory.

**Must:**

- Use the logo shipped inside the packaged application when packaged.
- Use the logo in the project sources when running in development mode.
- Use a logo file that exists for each supported platform (Linux, Windows).

**Must not:**

- Depend on the process working directory.

### FR-2: Per-user launcher entry on Linux

On startup, a packaged Linux Vease makes sure a per-user launcher entry and icon exist and point at the running package.

**Must:**

- Write only inside the user's own data directory, honouring the user's configured data-home location when set.
- Launch the AppImage itself when running from an AppImage, otherwise the running executable.
- Pass through files given on the command line, consistent with the existing file-launch feature.
- Associate the entry with the Vease window so the shell matches them.
- Leave existing files alone when their content is already correct.

**Must not:**

- Block or delay window creation.
- Prevent Vease from starting if writing fails.
- Touch launcher entries Vease did not create (for example entries made by third-party AppImage integration tools).

## Non-Functional Requirements

### Performance

- Launcher registration adds no perceptible delay to window display (runs alongside startup, not before it).

### Security

- Files are written with the user's default permissions, only under the user's data directory. No elevated privileges are requested.

### Reliability

- Any failure during launcher registration is logged and ignored.

## Error Scenarios

| Scenario                              | Expected Behavior                                              |
| ------------------------------------- | -------------------------------------------------------------- |
| User data directory not writable      | Warning logged; Vease starts normally with the window icon set |
| Launcher database refresh tool absent | Entry still written; shell picks it up on its own refresh      |
| Packaged logo file missing            | Window still opens (OS default icon); warning logged           |

## Open Questions

None.

## Out of Scope (Future Considerations)

- Removing the launcher entry when Vease is deleted (portable packages have no uninstall step).
- Registering file-type associations (MIME types) for geoscience file formats.
- An opt-out setting for launcher registration.
