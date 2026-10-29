from __future__ import annotations

from collections.abc import Sequence
from typing import Any, Literal

from . import Resource, body
from ..client import VeaseClient

Orientation = Literal["xplus", "xminus", "yplus", "yminus", "zplus", "zminus"]


class ViewResource(Resource):
    def __init__(self, client: VeaseClient):
        super().__init__(client, "/view")

    def reset(self) -> dict[str, Any]:
        """Fit the camera on everything."""
        return self._set(action="reset")

    def focus(self, id: str, component_ids: Sequence[str] | None = None) -> dict[str, Any]:
        return self._set(action="focus", id=id, component_ids=component_ids)

    def orient(self, orientation: Orientation) -> dict[str, Any]:
        """Look along an axis."""
        return self._set(action="orient", orientation=orientation)

    def save(self, name: str) -> dict[str, Any]:
        """Save the current camera; returns the saved positions."""
        return self._set(action="save", name=name)

    def restore(self, position_id: int) -> dict[str, Any]:
        return self._set(action="restore", position_id=position_id)

    def scene(
        self,
        z_scaling: float | None = None,
        background_color: str | None = None,
        axes: bool | None = None,
        grid: bool | None = None,
    ) -> dict[str, Any]:
        return self._set(
            action="scene",
            z_scaling=z_scaling,
            background_color=background_color,
            axes=axes,
            grid=grid,
        )

    def _set(self, **params: Any) -> dict[str, Any]:
        return self.client.post(self.route("set"), json=body(**params))
