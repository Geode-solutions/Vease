from __future__ import annotations

import os
from typing import Any

from . import Resource, body
from ..client import VeaseClient


class ExportResource(Resource):
    def __init__(self, client: VeaseClient):
        super().__init__(client, "/export")

    def screenshot(self, file_path: str, include_background: bool | None = None) -> str:
        """Save the viewer to a new .png or .jpg file; returns its absolute path."""
        return self._export("screenshot", file_path, include_background=include_background)

    def project(self, file_path: str) -> str:
        """Save the project to a new .vease file; returns its absolute path."""
        return self._export("project", file_path)

    # Vease runs on this machine and wants an absolute path to a file that does not exist yet
    def _export(self, kind: str, file_path: str, **params: Any) -> str:
        payload = body(kind=kind, file_path=os.path.abspath(file_path), **params)
        return self.client.post(self.route(), json=payload)["filePath"]
