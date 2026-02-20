# -*- mode: python ; coding: utf-8 -*-

import sys
import os
from PyInstaller.utils.hooks import collect_data_files, collect_all

# ────────────────────────────────────────────────
# Common parts (used by both platforms)
# ────────────────────────────────────────────────

datas = []
binaries = []
hiddenimports = []

datas += collect_data_files('opengeodeweb_viewer')
datas += collect_data_files('vease_viewer')

tmp_ret = collect_all('vtkmodules')
datas += tmp_ret[0]
binaries += tmp_ret[1]
hiddenimports += tmp_ret[2]

# ────────────────────────────────────────────────
# Platform-specific customizations
# ────────────────────────────────────────────────
print("System is ", sys.platform.system())
is_linux   = sys.platform.system() == "Linux"
is_windows = sys.platform.system() == "Windows"

if is_linux:
    # Linux-specific binaries (Mesa/OpenGL libraries + dri folder)
    binaries += [
        ('/usr/lib/x86_64-linux-gnu/libGL*.so*', '.'),
        ('/usr/lib/x86_64-linux-gnu/dri', 'dri'),
    ]
    runtime_hooks = ['/hook.py'] 
else:
    runtime_hooks = [] 
    # Optional: exclude problematic OpenGL DLLs that cause issues in some frozen apps
    to_exclude = [
        'opengl32.dll',
        'opengl32sw.dll',
        'libEGL.dll',
        'libGLESv2.dll',
    ]
    excluded_norm = {os.path.normcase(x) for x in to_exclude}


# ────────────────────────────────────────────────
# Analysis – common + entry point
# ────────────────────────────────────────────────

if is_windows:
    entry_point = r'venv\Lib\site-packages\vease_viewer\app.py'
else:
    entry_point = 'venv/lib/python3.12/site-packages/vease_viewer/app.py'

a = Analysis(
    [entry_point],
    pathex=[],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=runtime_hooks,
    excludes=[],
    noarchive=False,
    optimize=0,
)

# Windows: exclude unwanted DLLs *after* Analysis (they may have been auto-detected)
if is_windows:
    a.binaries = TOC([
        entry for entry in a.binaries
        if os.path.normcase(entry[0]) not in excluded_norm
    ])

# ────────────────────────────────────────────────
# Build phases (usually the same on both platforms)
# ────────────────────────────────────────────────

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='vease-viewer',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True, 
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)