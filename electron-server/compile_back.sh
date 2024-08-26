#!/bin/bash
set -e
rm -rf electron-server/requirements_back.txt
pip install pip-tools
pip-compile --pre electron-server/requirements_back.in