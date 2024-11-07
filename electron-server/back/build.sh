#!/bin/bash
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_back $packages_path/vease_back/app.py --distpath ./electron-server/back/dist -n vease-back --clean
cp ./electron-server/back/dist/vease-back ./