Remove-Item -Recurse -Force /electron-server/venv_back/ -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force /electron-server/dist_back/ -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force /electron-server/build/ -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force /electron-server/requirements_back.txt -ErrorAction:SilentlyContinue
$folder="electron-server/venv_back"
python -m venv $folder

$bin_folder = $folder + "/Scripts"
electron-server/venv_back/Scripts/Activate

pip install pip-tools
pip-compile electron-server/requirements_back.in
pip install -r electron-server/requirements_back.txt
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_back $bin_folder/geodeapp_back.exe --distpath electron-server/dist_back/