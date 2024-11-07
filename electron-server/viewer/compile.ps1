$viewer_path=".\electron-server\viewer"

Remove-Item -Recurse -Force $viewer_path + "\requirements.txt" -ErrorAction:SilentlyContinue
pip install pip-tools
pip-compile $viewer_path + "\requirements.in"