from __future__ import annotations

from typing import Any
import mimetypes
import os

from . import Resource
from ..client import VeaseClient


class DataResource(Resource):
    def __init__(self, client: VeaseClient):
        super().__init__(client, "/data")

    def load(self, filename: str) -> None:
        mime_type, _ = mimetypes.guess_type(filename)
        with open(filename, "rb") as f:
            files = {
                "file": (
                    os.path.basename(filename),
                    f,
                    mime_type or "application/octet-stream",
                )
            }
            self.client.post(self.route("load"), files=files)
