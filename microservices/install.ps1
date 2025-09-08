$microservice_name=$args[0]
echo "Installing $args requirements"
$microservice_path=".\microservices\$microservice_name"
$venv_path="$microservice_path\venv"
echo "Installing in $venv_path"
Remove-Item -Recurse -Force $venv_path -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force "$microservice_path\dist\" -ErrorAction:SilentlyContinue
Remove-Item -Recurse -Force "$microservice_path\build\" -ErrorAction:SilentlyContinue
python -m venv $venv_path
. "$venv_path\Scripts\activate"
pip install -r "$microservice_path\requirements.txt"