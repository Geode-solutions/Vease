from __future__ import annotations

from typing import Any

from . import Resource
from ..client import VeaseClient


class DataResource(Resource):
    def __init__(self, client: VeaseClient):
        super().__init__(client, "/data")

    def load(self) -> None:
        self.client.post(self.route("load"))
