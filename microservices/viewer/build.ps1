echo "Building viewer microservice"
$viewer_path=".\microservices\viewer"
$dist_path="$viewer_path\dist"
$venv_path="$viewer_path\venv"
. "$venv_path\Scripts\activate"
$site_packages_path="$venv_path\Lib\site-packages"
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_viewer --collect-data vease_viewer --collect-all vtkmodules "$site_packages_path\vease_viewer\app.py" --distpath $dist_path -n vease-viewer --clean
Copy-Item $dist_path\vease-viewer.exe .\