#!/bin/bash
viewer_path=./microservices/viewer
dist_path=$viewer_path/dist
venv_path=$viewer_path/venv
source $venv_path/bin/activate
site_packages_path=$venv_path/lib/python3.12/site-packages
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_viewer --collect-data vease_viewer --collect-all vtkmodules $site_packages_path/vease_viewer/app.py --distpath $dist_path -n vease-viewer --clean
cp $dist_path/vease-viewer ./