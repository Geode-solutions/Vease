#! /bin/bash
set -e
rm -rf electron-server/venv_viewer electron-server/dist_back electron-server/build electron-server/requirements_viewer.txt
folder=electron-server/venv_viewer
python3 -m venv $folder
echo $OSTYPE
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    bin_folder=$folder/bin
elif [[ "$OSTYPE" == "msys" ]]; then
    bin_folder=$folder/scripts
fi
ls $folder
ls $bin_folder
$bin_folder/pip install pip-tools
$bin_folder/pip-compile electron-server/requirements_viewer.in
$bin_folder/pip install -r electron-server/requirements_viewer.txt
$bin_folder/pip install pyinstaller
$bin_folder/pyinstaller --onefile --collect-data opengeodeweb_viewer --collect-all vtkmodules $bin_folder/geodeapp_viewer --distpath electron-server/dist_viewer
