#!/bin/bash
set -e
microservice_name=$1
echo "Installing $microservice_name"
microservice_path="./electron-server/$microservice_name"
venv_path=$microservice_path/venv
rm -rf $venv_path $microservice_path/dist $microservice_path/build
python3 -m venv $venv_path
source $venv_path/bin/activate
pip install -r $microservice_path/requirements.txt
