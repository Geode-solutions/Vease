#!/bin/bash
viewer_path=./microservices/viewer
dist_path=$viewer_path/dist
venv_path=$viewer_path/venv
source $venv_path/bin/activate
site_packages_path=$venv_path/lib/python3.12/site-packages
pip install pyinstaller
ls /usr/lib/x86_64-linux-gnu/
pyinstaller --onefile --collect-data opengeodeweb_viewer --collect-data vease_viewer --collect-all vtkmodules $site_packages_path/vease_viewer/app.py --distpath $dist_path -n vease-viewer --clean --add-binary="/usr/lib/x86_64-linux-gnu/libGL*:." --add-binary="/usr/lib/x86_64-linux-gnu/dri:dri"  --add-binary="/usr/lib/x86_64-linux-gnu/libstdc++.*:." --add-binary="/usr/lib/x86_64-linux-gnu/libc.*.:." --add-binary="/usr/lib/x86_64-linux-gnu/libm.*.:." --runtime-hook=$viewer_path/hook.py
cp $dist_path/vease-viewer ./