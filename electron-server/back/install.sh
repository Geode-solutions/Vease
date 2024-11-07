#!/bin/bash
set -e
rm -rf electron-server/back/venv electron-server/back/dist electron-server/build
folder=electron-server/back/venv
python3 -m venv $folder
bin_folder=$folder/bin
source $bin_folder/activate
packages_path=$folder/lib/python3.10/site-packages
pip install -r electron-server/back/requirements.txt