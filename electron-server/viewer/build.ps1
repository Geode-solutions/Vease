echo "Building viewer microservice"
$back_path=".\electron-server\viewer"
$dist_path="$back_path\dist"
$venv_path="$back_path\venv"
"$venv_path\Scripts\Activate.ps1"
$site_packages_path="$venv_path\Lib\site-packages"
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_viewer --collect-all vtkmodules $site_packages_path/vease_viewer/app.py --distpath $dist_path -n vease-viewer --clean
Copy-Item $dist_path\vease-back.exe .\