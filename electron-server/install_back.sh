#!/bin/bash
set -e
rm -rf electron-server/venv_back electron-server/dist_back electron-server/build
folder=electron-server/venv_back
python3 -m venv $folder
bin_folder=$folder/bin
source $bin_folder/activate
packages_path=$folder/lib/python3.10/site-packages
pip install -r electron-server/requirements_back.txt
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_back $packages_path/geodeapp_back/app.py --distpath ./electron-server/dist_back -n geodeapp_back --clean
cp ./electron-server/dist_back/geodeapp_back ./