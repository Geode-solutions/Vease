rm -rf venv_back ./electron-server/dist_back ./electron-server/build
wait
echo 'Removing previous bundles'
python3 -m venv ./electron-server/venv_back
echo 'Creating venv'
wait
./electron-server/venv_back/bin/pip install pip-tools
echo 'Installing pip-tools'
wait
./electron-server/venv_back/bin/python -m pip-compile ./electron-server/requirements_back.in
echo 'Compiling requirements'
wait
./electron-server/venv_back/bin/pip install -r ./electron-server/requirements_back.txt
echo 'Installing requirements'
wait
./electron-server/venv_back/bin/pip install pyinstaller
echo 'Installing PyInstaller'
wait
source ./electron-server/venv_back/bin/activate
echo 'Activating venv'
wait
./electron-server/venv_back/bin/pyinstaller --onefile --collect-all opengeodeweb_back ./electron-server/venv_back/bin/geodeapp_back --distpath ./electron-server/dist-back
echo 'Bundling geodeapp_back'
wait


