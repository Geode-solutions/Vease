#!/bin/bash
set -e
rm -rf electron-server/venv_back electron-server/dist_back electron-server/build electron-server/requirements_back.txt
folder=electron-server/venv_back
python3 -m venv $folder
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    bin_folder=$folder/bin
    source $bin_folder/activate
elif [[ "$OSTYPE" == "msys" ]]; then
    bin_folder=$folder/Scripts
    $bin_folder\activate
fi
pip install pip-tools
pip-compile electron-server/requirements_back.in
pip install -r electron-server/requirements_back.txt
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_back $bin_folder/geodeapp_back --distpath electron-server/dist_back