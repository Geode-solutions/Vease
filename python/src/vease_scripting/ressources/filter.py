from __future__ import annotations

from collections.abc import Sequence
from typing import Any, Literal, TypedDict

from . import Resource, id_list
from ..client import VeaseClient

Filter = Literal["shrink", "explode", "slice", "clip", "threshold"]
Location = Literal["vertex", "edge", "cell", "polygon", "polyhedron", "point"]


class Slice(TypedDict):
    axis: Literal[0, 1, 2]
    index: int


class Plane(TypedDict):
    origin: Sequence[float]
    normal: Sequence[float]


class FilterResource(Resource):
    def __init__(self, client: VeaseClient):
        super().__init__(client, "/filter")

    def apply(
        self,
        filter: Filter,
        ids: str | Sequence[str],
        remove: bool | None = None,
        factor: float | None = None,
        slices: Sequence[Slice] | None = None,
        planes: Sequence[Plane] | None = None,
        attribute: str | None = None,
        location: Location | None = None,
        item: int | None = None,
        minimum: float | None = None,
        maximum: float | None = None,
    ) -> dict[str, Any]:
        """Apply (or remove=True) a viewer filter on one or several data.

        factor is for shrink and explode, slices for slice, planes for clip, and attribute,
        location, item, minimum and maximum for threshold.
        """
        return self._post(
            "apply",
            filter=filter,
            ids=id_list(ids),
            remove=remove,
            factor=factor,
            slices=slices,
            planes=planes,
            attribute=attribute,
            location=location,
            item=item,
            minimum=minimum,
            maximum=maximum,
        )
