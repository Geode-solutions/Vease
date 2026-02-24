echo "Building viewer microservice"
$viewer_path=".\microservices\viewer"
$dist_path="$viewer_path\dist"
. "$viewer_path\venv\Scripts\activate"
pip install pyinstaller
pyinstaller $viewer_path\vease-viewer.spec --distpath $dist_path --clean
Copy-Item $dist_path\vease-viewer.exe .\