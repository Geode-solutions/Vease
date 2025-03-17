$microservice_name=$args[0]
echo "Compiling $args requirements"
$microservice_path=".\electron-server\$microservice_name"
$venv_path="$microservice_path\venv"
python -m venv $venv_path
Remove-Item -Recurse -Force "$microservice_path\requirements.txt" -ErrorAction:SilentlyContinue
. "$venv_path\Scripts\activate"
pip install pip-tools
pip-compile -U "$microservice_path\requirements.in"