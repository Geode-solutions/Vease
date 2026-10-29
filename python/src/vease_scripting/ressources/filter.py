from __future__ import annotations

from collections.abc import Sequence
from typing import Any, Literal

from . import Resource, body, id_list
from ..client import VeaseClient

Filter = Literal["shrink", "explode", "slice", "clip", "threshold"]


class FilterResource(Resource):
    def __init__(self, client: VeaseClient):
        super().__init__(client, "/filter")

    def apply(
        self,
        filter: Filter,
        ids: str | Sequence[str],
        remove: bool | None = None,
        **params: Any,
    ) -> dict[str, Any]:
        """Apply (or remove=True) a viewer filter on one or several data.

        Filter parameters: factor (shrink, explode), slices ([{"axis", "index"}]), planes
        ([{"origin", "normal"}]) for clip, attribute, location, item, minimum, maximum for
        threshold.
        """
        return self.client.post(
            self.route("apply"),
            json=body(filter=filter, ids=id_list(ids), remove=remove, **params),
        )
