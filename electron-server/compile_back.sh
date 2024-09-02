#!/bin/bash
set -e
rm -rf electron-server/requirements_back.txt
pip install pip-tools
pip-compile electron-server/requirements_back.in