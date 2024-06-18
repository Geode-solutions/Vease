#! /bin/bash
rm -rf ./electron-server/venv_back ./electron-server/dist_back ./electron-server/build ./electron-server/requirements_back.txt
python3 -m venv ./electron-server/venv_back
source ./electron-server/venv_back/bin/activate
pip install pip-tools
pip-compile ./electron-server/requirements_back.in
pip install -r ./electron-server/requirements_back.txt
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_back ./electron-server/venv_back/bin/geodeapp_back --distpath ./electron-server/dist_back
