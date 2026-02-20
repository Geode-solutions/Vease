#!/bin/bash
viewer_path=./microservices/viewer
dist_path=$viewer_path/dist
source $viewer_path/venv/bin/activate
pip install pyinstaller
pyinstaller $viewer_path/vease_viewer.spec
cp $dist_path/vease-viewer ./