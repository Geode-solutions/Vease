#!/bin/bash
set -euxo pipefail
microservice_name=$1
echo "Compiling $microservice_name requirements"
microservice_path="./microservices/$microservice_name"
venv_path=$microservice_path/venv
python3 -m venv $venv_path
rm -rf $microservice_path/requirements.txt
source $venv_path/bin/activate
pip install pip-tools
pip-compile -U --pre $microservice_path/requirements.in