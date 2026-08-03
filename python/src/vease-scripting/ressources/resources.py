from __future__ import annotations

from typing import Any

from . import Resource
from ..client import VeaseClient


class DataResource(Resource):
    def __init__(self, client: VeaseClient):
        super().__init__(client, "/users")

    def list(self) -> list[dict]:
        return self.client.get(self._path())

    def get(self, user_id: str) -> dict:
        return self.client.get(self._path(user_id))

    def create(self, **fields: Any) -> dict:
        return self.client.post(self._path(), json=fields)

    def update(self, user_id: str, **fields: Any) -> dict:
        return self.client.patch(self._path(user_id), json=fields)

    def delete(self, user_id: str) -> Any:
        return self.client.delete(self._path(user_id))
