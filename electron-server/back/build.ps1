pip install pyinstaller
pyinstaller --onefile --collect-data opengeodeweb_back --collect-data vease_back $bin_folder\app.py --distpath .\electron-server\back\dist -n vease-back --clean
Copy-Item .\electron-server\back\dist\vease-back.exe .\