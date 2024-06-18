#!/bin/bash
echo "TEST"
rm -rf ./electron-server/venv_back ./electron-server/dist_back ./electron-server/build ./electron-server/requirements_back.txt
echo "Remove"
folder=./electron-server/venv_back
python3 -m venv $folder
echo "Activate venv"
bin_folder=$folder/bin
$bin_folder/pip install pip-tools
echo "Activate venv"
$bin_folder/pip-compile ./electron-server/requirements_back.in
echo "Compile requirements"
$bin_folder/pip install -r ./electron-server/requirements_back.txt
echo "Install requirements"
$bin_folder/pip install pyinstaller
echo "Install PyInstaller"
$bin_folder/pyinstaller --onefile --collect-data opengeodeweb_back $bin_folder/geodeapp_back --distpath ./electron-server/dist_back
echo "Generate bundle"