#!/bin/bash
set -e
microservice_name=$1
echo "Compiling $microservice_name requirements"
microservice_path="./electron-server/$microservice_name"
venv_path=$microservice_path/venv
python3 -m venv $venv_path
rm -rf $microservice_path/requirements.txt
source $venv_path/bin/activate
pip install pip-tools
pip-compile -U $microservice_path/requirements.in