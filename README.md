<h1 align="center">Vease<sup><i>by Geode-solutions</i></sup></h1>
<h3 align="center">Open-source geoscience viewer built to ease subsurface data visualization.</h3>

![App Screenshot](./.github/screenshots/model_from_implicitation.png)

# What is Vease?

- **Desktop**: Easily installable on your computer
- **Web-native**: Built with modern web technologies for accessibility
- **Simple**: Light UI focusing on usability
- **Extensible**: Designed for easy integration and customization

🔧 Vease is powered by a combination of:

- [OpenGeode](https://github.com/Geode-solutions/OpenGeode): for structured geoscience data handling
- [VTK](https://vtk.org/): for high-performance 3D rendering

# ⚡ Features

Here is a list of what to expect inside Vease. Click on each title to see a demo.

<details>
  <summary>Import file using drag&drog or import dialog</summary>
  <img src="./docs/import.gif" width="500">
</details>
<details>
  <summary>Mesh graphics options with points/edges visibility, constant and variable coloring</summary>
  <img src="./docs/mesh_graphics.gif" width="500">
</details>
<details>
  <summary>Smart 3D Grid for Spatial Awareness</summary>
  <img src="./docs/grid.gif" width="500">
</details>

# 📀 Installation

Get the [latest](https://github.com/Geode-solutions/Vease/releases/latest) version

> [!NOTE]
> The app comes with auto updates with the windows exe & linux AppImage versions

## 🪟 Windows

### Option 1: Using executable

- Run the executable version
  ```powershell
  vease_win32.exe
  ```

### Option 2: Using zip archive

1. Unzip the vease_win32.zip archive
2. Run the app
   ```powershell
   vease.exe
   ```

## 🐧 Linux

### Option 1: Using AppImage

1. Install <a href="https://github.com/appimage/appimagekit/wiki/fuse">fuse</a>
2. Make the AppImage executable
   ```shell
   chmod +x vease_linux.AppImage
   ```
3. Run the AppImage version
   ```shell
   ./vease_linux.AppImage --no-sandbox
   ```

### Option 2: Using zip archive

1. Unzip the vease_linux.zip archive
2. Run the app
   ```shell
   ./vease
   ```

# ⚖️ License

[LGPL-2.1](https://opensource.org/license/lgpl-2-1)

Copyright (c) 2019 - 2025, Geode-solutions
