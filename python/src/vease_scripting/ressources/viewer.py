from __future__ import annotations

from typing import Any

from . import Resource
from ..client import VeaseClient


class ViewerResource(Resource):
    def __init__(self, client: VeaseClient):
        super().__init__(client, "/viewer")

    def state(self) -> dict[str, Any]:
        """Camera, saved camera positions and scene settings."""
        return self.client.get(self.route("state"))
