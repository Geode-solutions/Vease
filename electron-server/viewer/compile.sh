#!/bin/bash
set -e
viewer_path="electron-server/viewer"
rm -rf $viewer_path/requirements.txt
pip install pip-tools
pip-compile $viewer_path + "/requirements.in"