from __future__ import annotations

from collections.abc import Sequence
from typing import Any, Literal
import mimetypes
import os

from . import Resource, id_list
from ..client import VeaseClient

Point = Sequence[float]


class DataResource(Resource):
    def __init__(self, client: VeaseClient):
        super().__init__(client, "/data")

    def list(self) -> list[dict[str, Any]]:
        """Loaded data: id, name, Geode object type, viewer type and visibility of each."""
        return self.client.get(self.route("list"))["data"]

    def details(self, id: str) -> dict[str, Any]:
        """Targets, model components, attributes and current style of one data."""
        return self.client.get(self.route("details"), params={"id": id})

    def load(self, filename: str) -> dict[str, Any]:
        """Load a file and return the loaded data, with its id.

        A .vease file imports the whole project instead and returns {"project": filename},
        without id: read the imported data with list().
        """
        mime_type, _ = mimetypes.guess_type(filename)
        with open(filename, "rb") as file:
            files = {
                "file": (
                    os.path.basename(filename),
                    file,
                    mime_type or "application/octet-stream",
                )
            }
            return self.client.post(self.route("load"), files=files)

    def create(
        self,
        kind: Literal["point", "curve", "surface"],
        name: str,
        points: Sequence[Point],
        closed: bool | None = None,
    ) -> dict[str, Any]:
        """Create a point set, a curve or a surface from [x, y, z] coordinates."""
        return self._post(
            "manage",
            action="create",
            name=name,
            kind=kind,
            points=[list(point) for point in points],
            closed=closed,
        )

    def rename(self, id: str, name: str) -> dict[str, Any]:
        return self._post("manage", action="rename", ids=[id], name=name)

    def delete(self, ids: str | Sequence[str]) -> dict[str, Any]:
        """Delete one or several data; the ones that could not be deleted are listed in "failed"."""
        return self._post("manage", action="delete", ids=id_list(ids))
