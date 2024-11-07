dist_path=./electron-server/viewer/dist
pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_viewer --collect-all vtkmodules $packages_path/vease_viewer/app.py --distpath $dist_path -n vease-viewer --clean
cp $dist_path/vease-viewer ./