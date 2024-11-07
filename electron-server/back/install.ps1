Remove-Item -Recurse -Force .\electron-server\back\venv\ -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force .\electron-server\back\dist\ -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force .\electron-server\build\ -ErrorAction:SilentlyContinue
$folder=".\electron-server\back\venv"
python -m venv $folder

$bin_folder = $folder + "\Lib\site-packages\vease_back"
$folder\Scripts\Activate

pip install -r .\electron-server\back\requirements.txt
