from __future__ import annotations

from ..client import VeaseClient


class Resource:
    def __init__(self, client: VeaseClient, base_path: str):
        self.client = client
        self.base_path = base_path.rstrip("/")

    def _path(self, suffix: str = "") -> str:
        return f"{self.base_path}/{suffix.lstrip('/')}" if suffix else self.base_path
