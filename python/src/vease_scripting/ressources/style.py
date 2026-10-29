from __future__ import annotations

from collections.abc import Sequence
from typing import Any, Literal

from . import Resource, id_list
from ..client import VeaseClient

Target = Literal[
    "points",
    "edges",
    "cells",
    "polygons",
    "polyhedra",
    "corners",
    "lines",
    "surfaces",
    "blocks",
]
Location = Literal["vertex", "edge", "cell", "polygon", "polyhedron"]


class StyleResource(Resource):
    def __init__(self, client: VeaseClient):
        super().__init__(client, "/style")

    def set(
        self,
        ids: str | Sequence[str],
        target: Target | None = None,
        component_ids: Sequence[str] | None = None,
        visibility: bool | None = None,
        color: str | None = None,
        size: float | None = None,
        width: float | None = None,
        coloring: Literal["constant", "random", "textures"] | None = None,
    ) -> dict[str, Any]:
        """Style one or several data; coloring="random" gives each mesh its own color.

        Without target the whole data is styled. component_ids (geode ids) restricts a model
        corners, lines, surfaces or blocks target and needs a single id. Colors are hex strings.
        """
        return self._post(
            "set",
            ids=id_list(ids),
            target=target,
            component_ids=component_ids,
            visibility=visibility,
            color=color,
            size=size,
            width=width,
            coloring=coloring,
        )

    def color_by_attribute(
        self,
        ids: str | Sequence[str],
        attribute: str,
        target: Target | None = None,
        component_ids: Sequence[str] | None = None,
        location: Location | None = None,
        item: int | None = None,
        colormap: str | None = None,
        minimum: float | None = None,
        maximum: float | None = None,
        time_step: float | None = None,
        no_data_color: str | None = None,
    ) -> dict[str, Any]:
        """Color one or several data by an attribute through a colormap.

        Each data uses its own attribute range unless both minimum and maximum are given.
        """
        return self._post(
            "set",
            ids=id_list(ids),
            attribute=attribute,
            target=target,
            component_ids=component_ids,
            location=location,
            item=item,
            colormap=colormap,
            minimum=minimum,
            maximum=maximum,
            time_step=time_step,
            no_data_color=no_data_color,
        )

    def colormaps(self) -> dict[str, list[str]]:
        """Colormap names color_by_attribute accepts, by category."""
        return self.client.get("/colormaps")["categories"]
