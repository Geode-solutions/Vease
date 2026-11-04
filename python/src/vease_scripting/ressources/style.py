"""Style routes, mirroring the dataStyle store: style.<mesh|model>.<target>[.<location>].<property>.

    vease.style.mesh.polygons.color(ids, "#ff8800")
    vease.style.mesh.polygons.vertex.attribute(ids, "depth", colormap="batlow")
    vease.style.model.surfaces.visibility(model_id, False, component_ids=[surface_id])
"""

from __future__ import annotations

from collections.abc import Sequence
from typing import Any, Literal

from . import Resource, id_list
from ..client import VeaseClient


class _StyleNode(Resource):
    # Model components (corners, lines, surfaces, blocks) can be restricted to some of their
    # components; the other targets style whole data
    has_components = False

    def _set(
        self,
        prop: str,
        ids: str | Sequence[str],
        component_ids: Sequence[str] | None,
        **params: Any,
    ) -> dict[str, Any]:
        if component_ids is not None and not self.has_components:
            raise TypeError(f"{self.base_path} does not take component_ids")
        return self._post(prop, ids=id_list(ids), component_ids=component_ids, **params)


class _Visibility(_StyleNode):
    def visibility(
        self,
        ids: str | Sequence[str],
        visibility: bool,
        component_ids: Sequence[str] | None = None,
    ) -> dict[str, Any]:
        return self._set("visibility", ids, component_ids, visibility=visibility)


class _Color(_StyleNode):
    def color(
        self,
        ids: str | Sequence[str],
        color: str,
        component_ids: Sequence[str] | None = None,
    ) -> dict[str, Any]:
        """Constant color, as a "#rrggbb" hex string."""
        return self._set("color", ids, component_ids, color=color)


class _Size(_StyleNode):
    def size(self, ids: str | Sequence[str], size: float) -> dict[str, Any]:
        return self._set("size", ids, None, size=size)


class _Width(_StyleNode):
    def width(self, ids: str | Sequence[str], width: float) -> dict[str, Any]:
        return self._set("width", ids, None, width=width)


class _MeshColoring(_StyleNode):
    def coloring(
        self, ids: str | Sequence[str], coloring: Literal["constant", "textures"]
    ) -> dict[str, Any]:
        return self._set("coloring", ids, None, coloring=coloring)


class _ComponentsColoring(_StyleNode):
    def coloring(
        self,
        ids: str | Sequence[str],
        coloring: Literal["constant", "random"],
        component_ids: Sequence[str] | None = None,
    ) -> dict[str, Any]:
        """coloring="random" gives each component its own color."""
        return self._set("coloring", ids, component_ids, coloring=coloring)


class AttributeStyle(_StyleNode):
    def attribute(
        self,
        ids: str | Sequence[str],
        name: str,
        item: int | None = None,
        colormap: str | None = None,
        minimum: float | None = None,
        maximum: float | None = None,
        time_step: float | None = None,
        no_data_color: str | None = None,
        component_ids: Sequence[str] | None = None,
    ) -> dict[str, Any]:
        """Color by an attribute through a colormap (see StyleResource.colormaps).

        Each data uses its own attribute range unless both minimum and maximum are given.
        """
        return self._set(
            "attribute",
            ids,
            component_ids,
            name=name,
            item=item,
            colormap=colormap,
            minimum=minimum,
            maximum=maximum,
            time_step=time_step,
            no_data_color=no_data_color,
        )


class _ComponentsAttributeStyle(AttributeStyle):
    has_components = True


def _attribute(node: _StyleNode, location: str) -> AttributeStyle:
    kind = _ComponentsAttributeStyle if node.has_components else AttributeStyle
    return kind(node.client, node.route(location))


class MeshPointsStyle(_Visibility, _Color, _Size):
    def __init__(self, client: VeaseClient, base_path: str):
        super().__init__(client, base_path)
        self.vertex = _attribute(self, "vertex")


class MeshEdgesStyle(_Visibility, _Color, _Width):
    def __init__(self, client: VeaseClient, base_path: str):
        super().__init__(client, base_path)
        self.vertex = _attribute(self, "vertex")
        self.edge = _attribute(self, "edge")


class MeshCellsStyle(_Visibility, _Color, _MeshColoring):
    def __init__(self, client: VeaseClient, base_path: str):
        super().__init__(client, base_path)
        self.vertex = _attribute(self, "vertex")
        self.cell = _attribute(self, "cell")


class MeshPolygonsStyle(_Visibility, _Color, _MeshColoring):
    def __init__(self, client: VeaseClient, base_path: str):
        super().__init__(client, base_path)
        self.vertex = _attribute(self, "vertex")
        self.polygon = _attribute(self, "polygon")


class MeshPolyhedraStyle(_Visibility, _Color):
    def __init__(self, client: VeaseClient, base_path: str):
        super().__init__(client, base_path)
        self.vertex = _attribute(self, "vertex")
        self.polyhedron = _attribute(self, "polyhedron")


class MeshStyle(_Visibility, _Color):
    def __init__(self, client: VeaseClient, base_path: str):
        super().__init__(client, base_path)
        self.points = MeshPointsStyle(client, self.route("points"))
        self.edges = MeshEdgesStyle(client, self.route("edges"))
        self.cells = MeshCellsStyle(client, self.route("cells"))
        self.polygons = MeshPolygonsStyle(client, self.route("polygons"))
        self.polyhedra = MeshPolyhedraStyle(client, self.route("polyhedra"))


class ModelComponentsStyle(_Visibility, _Color, _ComponentsColoring):
    """Corners, lines, surfaces or blocks; component_ids (geode ids) restricts the change."""

    has_components = True

    def __init__(self, client: VeaseClient, base_path: str):
        super().__init__(client, base_path)
        self.vertex = _attribute(self, "vertex")


class ModelLinesStyle(ModelComponentsStyle):
    def __init__(self, client: VeaseClient, base_path: str):
        super().__init__(client, base_path)
        self.edge = _attribute(self, "edge")


class ModelSurfacesStyle(ModelComponentsStyle):
    def __init__(self, client: VeaseClient, base_path: str):
        super().__init__(client, base_path)
        self.polygon = _attribute(self, "polygon")


class ModelBlocksStyle(ModelComponentsStyle):
    def __init__(self, client: VeaseClient, base_path: str):
        super().__init__(client, base_path)
        self.polyhedron = _attribute(self, "polyhedron")


class ModelEdgesStyle(_Visibility):
    pass


class ModelPointsStyle(_Visibility, _Size):
    pass


class ModelStyle(_Visibility):
    def __init__(self, client: VeaseClient, base_path: str):
        super().__init__(client, base_path)
        self.corners = ModelComponentsStyle(client, self.route("corners"))
        self.lines = ModelLinesStyle(client, self.route("lines"))
        self.surfaces = ModelSurfacesStyle(client, self.route("surfaces"))
        self.blocks = ModelBlocksStyle(client, self.route("blocks"))
        self.edges = ModelEdgesStyle(client, self.route("edges"))
        self.points = ModelPointsStyle(client, self.route("points"))


class StyleResource(Resource):
    def __init__(self, client: VeaseClient):
        super().__init__(client, "/style")
        self.mesh = MeshStyle(client, self.route("mesh"))
        self.model = ModelStyle(client, self.route("model"))

    def colormaps(self) -> dict[str, list[str]]:
        """Colormap names attribute() accepts, by category."""
        return self.client.get("/colormaps")["categories"]
