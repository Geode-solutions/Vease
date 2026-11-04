from __future__ import annotations

from collections.abc import Sequence
from typing import Any, Literal, TypedDict

from . import Resource, id_list
from ..client import VeaseClient

Location = Literal["vertex", "edge", "cell", "polygon", "polyhedron", "point"]


class Slice(TypedDict):
    axis: Literal[0, 1, 2]
    index: int


class Plane(TypedDict):
    origin: Sequence[float]
    normal: Sequence[float]


class FilterResource(Resource):
    """Viewer filters on one or several data; remove=True takes the filter off."""

    def __init__(self, client: VeaseClient):
        super().__init__(client, "/filter")

    def shrink(
        self,
        ids: str | Sequence[str],
        factor: float | None = None,
        remove: bool | None = None,
    ) -> dict[str, Any]:
        return self._post("shrink", ids=id_list(ids), factor=factor, remove=remove)

    def explode(
        self,
        ids: str | Sequence[str],
        factor: float | None = None,
        remove: bool | None = None,
    ) -> dict[str, Any]:
        return self._post("explode", ids=id_list(ids), factor=factor, remove=remove)

    def slice(
        self,
        ids: str | Sequence[str],
        slices: Sequence[Slice] | None = None,
        remove: bool | None = None,
    ) -> dict[str, Any]:
        return self._post("slice", ids=id_list(ids), slices=slices, remove=remove)

    def clip(
        self,
        ids: str | Sequence[str],
        planes: Sequence[Plane] | None = None,
        remove: bool | None = None,
    ) -> dict[str, Any]:
        return self._post("clip", ids=id_list(ids), planes=planes, remove=remove)

    def threshold(
        self,
        ids: str | Sequence[str],
        attribute: str | None = None,
        location: Location | None = None,
        item: int | None = None,
        minimum: float | None = None,
        maximum: float | None = None,
        remove: bool | None = None,
    ) -> dict[str, Any]:
        return self._post(
            "threshold",
            ids=id_list(ids),
            attribute=attribute,
            location=location,
            item=item,
            minimum=minimum,
            maximum=maximum,
            remove=remove,
        )
