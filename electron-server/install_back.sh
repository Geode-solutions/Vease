rm -rf venv_back
python3 -m venv venv_back
./venv_back/bin/pip install pip-tools
./venv_back/bin/python -m pip-compile ./electron-server/requirements_back.in
./venv_back/bin/pip install -r ./electron-server/requirements_back.txt