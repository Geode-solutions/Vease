$viewer_path=".\electron-server\viewer"

Remove-Item -Recurse -Force $viewer_path + "\venv\" -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force $viewer_path + "\dist\" -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force $viewer_path + "\build\" -ErrorAction:SilentlyContinue

$venv_path=$viewer_path + "\venv"
python -m venv $venv_path

$bin_folder = $venv_path + "\Lib\site-packages\vease_viewer"
$venv_path\Scripts\Activate

pip install -r $viewer_path + "\requirements.txt
