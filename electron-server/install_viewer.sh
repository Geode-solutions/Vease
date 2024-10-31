#!/bin/bash
set -e
# rm -rf electron-server/venv_viewer electron-server/dist_viewer electron-server/build
folder=electron-server/venv_viewer
# python3 -m venv $folder
bin_folder=$folder/bin
source $bin_folder/activate
packages_path=$folder/lib/python3.10/site-packages
pip install -r electron-server/requirements_viewer.txt
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_viewer --collect-all vtkmodules $packages_path/vease_viewer/app.py --distpath ./electron-server/dist_viewer -n vease-viewer --clean
cp ./electron-server/dist_viewer/vease-viewer ./
