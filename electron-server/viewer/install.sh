#!/bin/bash
set -e
viewer_path="electron-server/viewer"
rm -rf $viewer_path + "/venv" $viewer_path + "/dist" $viewer_path + "/build"
venv_path=$viewer_path + "/venv"
python3 -m venv $venv_path
bin_folder=$venv_path/bin
source $bin_folder/activate
packages_path=$folder/lib/python3.10/site-packages
pip install -r $viewer_path + "/requirements.txt"
