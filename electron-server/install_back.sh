rm -rf venv_back dist build
python3 -m venv venv_back
./venv_back/bin/pip install pip-tools
./venv_back/bin/python -m pip-compile ./electron-server/requirements_back.in
./venv_back/bin/pip install -r ./electron-server/requirements_back.txt
./venv_back/bin/pip install pyinstaller
source ./venv_back/bin/activate
pyinstaller --onedir --collect-datas opengeodeweb_back --paths ./venv_back/lib/python3.10/site-packages ./venv_back/bin/geodeapp_server
