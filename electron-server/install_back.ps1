Remove-Item -Recurse -Force /electron-server/venv_back/ -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force /electron-server/dist_back/ -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force /electron-server/build/ -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force /electron-server/requirements_back.txt -ErrorAction:SilentlyContinue
$folder="electron-server/venv_back"
python -m venv $folder

$bin_folder = $folder + "/Lib/site-packages/geodeapp_back"
electron-server/venv_back/Scripts/Activate

pip install pip-tools
pip-compile electron-server/requirements_back.in
pip install -r electron-server/requirements_back.txt
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_back --collect-data geodeapp_back $bin_folder/app.py --distpath ./electron-server/dist_back -n geodeapp_back --clean
ls -r ./electron-server/dist_back
Copy-Item ./electron-server/dist_back/geodeapp_back.exe ./resources