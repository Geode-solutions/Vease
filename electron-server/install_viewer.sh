#! /bin/sh
rm -rf ./electron-server/venv_viewer ./electron-server/dist_viewer ./electron-server/build ./electron-server/requirements_viewer.txt
python3 -m venv ./electron-server/venv_viewer
. ./electron-server/venv_viewer/bin/activate
pip install pip-tools
pip-compile ./electron-server/requirements_viewer.in
pip install -r ./electron-server/requirements_viewer.txt
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_viewer --collect-all vtkmodules ./electron-server/venv_viewer/bin/geodeapp_viewer --distpath ./electron-server/dist_viewer
