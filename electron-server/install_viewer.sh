rm -rf venv_viewer dist_viewer build
python3 -m venv venv_viewer
./venv_viewer/bin/pip install pip-tools
./venv_viewer/bin/python -m pip-compile ./electron-server/requirements_viewer.in
./venv_viewer/bin/pip install -r ./electron-server/requirements_viewer.txt
./venv_viewer/bin/pip install pyinstaller
source ./venv_viewer/bin/activate
./venv_viewer/bin/pyinstaller --onefile --collect-all opengeodeweb_viewer --collect-all vtkmodules ./venv_viewer/bin/geodeapp_viewer --distpath ./dist_viewer


