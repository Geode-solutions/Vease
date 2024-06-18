#!/bin/bash
set -e
rm -rf electron-server/venv_back electron-server/dist_back electron-server/build electron-server/requirements_back.txt
folder=electron-server/venv_back
python3 -m venv $folder
bin_folder=$folder/bin
$bin_folder/pip install pip-tools
$bin_folder/pip-compile electron-server/requirements_back.in
$bin_folder/pip install -r electron-server/requirements_back.txt
$bin_folder/pip install pyinstaller
$bin_folder/pyinstaller --onefile --collect-data opengeodeweb_back $bin_folder/geodeapp_back --distpath electron-server/dist_back