Remove-Item -Recurse -Force /electron-server/venv_viewer/ -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force /electron-server/dist_viewer/ -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force /electron-server/build/ -ErrorAction:SilentlyContinue
$folder="electron-server/venv_viewer"
python -m venv $folder

$bin_folder = $folder + "/Lib/site-packages/geodeapp_viewer"
electron-server/venv_viewer/Scripts/Activate

pip install -r electron-server/requirements_viewer.txt
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_viewer --collect-all vtkmodules ./electron-server/venv_viewer/Lib/site-packages/geodeapp_viewer/app.py --distpath ./electron-server/dist_viewer -n geodeapp_viewer --clean
Copy-Item ./electron-server/dist_viewer/geodeapp_viewer.exe ./resources