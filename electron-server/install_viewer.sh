#! /bin/bash
set -e
rm -rf electron-server/venv_viewer electron-server/dist_back electron-server/build electron-server/requirements_viewer.txt
folder=electron-server/venv_viewer
python3 -m venv $folder
bin_folder=$folder/bin
source $bin_folder/activate
packages_path=$folder/lib/python3.10/site-packages
pip install pip-tools
pip-compile electron-server/requirements_viewer.in
pip install -r electron-server/requirements_viewer.txt
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_viewer --collect-all vtkmodules $packages_path/geodeapp_viewer/app.py --distpath electron-server/dist_viewer -n geodeapp_viewer
