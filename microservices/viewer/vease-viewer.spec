# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import collect_data_files
from PyInstaller.utils.hooks import collect_all

datas = []
binaries = []
hiddenimports = []
datas += collect_data_files('opengeodeweb_viewer')
datas += collect_data_files('vease_viewer')
tmp_ret = collect_all('vtkmodules')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]


a = Analysis(
    ['venv\\Lib\\site-packages\\vease_viewer\\app.py'],
    pathex=[],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)

to_exclude = [
    'opengl32.dll',
    'opengl32sw.dll',
    'libEGL.dll',
    'libGLESv2.dll'
]
excluded_norm = {os.path.normcase(x) for x in to_exclude}
a.binaries = TOC([
    entry for entry in a.binaries
    if os.path.normcase(entry[0]) not in excluded_norm
])

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
