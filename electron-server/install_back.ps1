Remove-Item -Recurse -Force .\electron-server\venv_back\ -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force .\electron-server\dist_back\ -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force .\electron-server\build\ -ErrorAction:SilentlyContinue
$folder=".\electron-server\venv_back"
python -m venv $folder

$bin_folder = $folder + "\Lib\site-packages\vease_back"
.\electron-server\venv_back\Scripts\Activate

pip install -r .\electron-server\requirements_back.txt
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_back --collect-data vease_back $bin_folder\app.py --distpath .\electron-server\dist_back -n vease-back --clean
Copy-Item .\electron-server\dist_back\vease-back.exe .\
