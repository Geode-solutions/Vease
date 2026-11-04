from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import pytest

from vease_scripting.client import VeaseClient
from vease_scripting.ressources import body
from vease_scripting.ressources.data import DataResource
from vease_scripting.ressources.export import ExportResource
from vease_scripting.ressources.filter import FilterResource
from vease_scripting.ressources.style import StyleResource
from vease_scripting.ressources.view import ViewResource

DATA_ID = "0123456789abcdef0123456789abcdef"
OTHER_ID = "fedcba9876543210fedcba9876543210"


class FakeClient:
    def __init__(self, answer: Any = None):
        self.calls: list[tuple[str, str, dict[str, Any]]] = []
        self.answer = answer

    def get(self, path: str, params: dict | None = None) -> Any:
        self.calls.append(("GET", path, {"params": params}))
        return self.answer

    def post(self, path: str, json: dict | None = None, files: dict | None = None) -> Any:
        self.calls.append(("POST", path, {"json": json, "files": files}))
        return self.answer


def test_body_camel_cases_keys_and_drops_unset_ones():
    assert body(component_ids=["s1"], time_step=None, no_data_color="#000000") == {
        "componentIds": ["s1"],
        "noDataColor": "#000000",
    }


def test_style_routes_mirror_the_data_style_store():
    client = FakeClient()
    style = StyleResource(client)

    style.mesh.polygons.color(DATA_ID, "#ff8800")
    style.mesh.points.size([DATA_ID, OTHER_ID], 4)
    style.mesh.edges.width(DATA_ID, 2)
    style.mesh.cells.coloring(DATA_ID, "textures")
    style.model.visibility(DATA_ID, False)
    style.model.surfaces.coloring(DATA_ID, "random", component_ids=["s1"])

    assert [call[1] for call in client.calls] == [
        "/style/mesh/polygons/color",
        "/style/mesh/points/size",
        "/style/mesh/edges/width",
        "/style/mesh/cells/coloring",
        "/style/model/visibility",
        "/style/model/surfaces/coloring",
    ]
    assert [call[2]["json"] for call in client.calls] == [
        {"ids": [DATA_ID], "color": "#ff8800"},
        {"ids": [DATA_ID, OTHER_ID], "size": 4},
        {"ids": [DATA_ID], "width": 2},
        {"ids": [DATA_ID], "coloring": "textures"},
        {"ids": [DATA_ID], "visibility": False},
        {"ids": [DATA_ID], "componentIds": ["s1"], "coloring": "random"},
    ]


def test_style_attribute_posts_to_its_location_route():
    client = FakeClient()
    style = StyleResource(client)

    style.mesh.polygons.vertex.attribute([DATA_ID], "depth", colormap="batlow", time_step=2)
    style.model.blocks.polyhedron.attribute(DATA_ID, "rock", component_ids=["b1"])

    assert [call[1] for call in client.calls] == [
        "/style/mesh/polygons/vertex/attribute",
        "/style/model/blocks/polyhedron/attribute",
    ]
    assert [call[2]["json"] for call in client.calls] == [
        {"ids": [DATA_ID], "name": "depth", "colormap": "batlow", "timeStep": 2},
        {"ids": [DATA_ID], "componentIds": ["b1"], "name": "rock"},
    ]


def test_style_rejects_component_ids_outside_model_components():
    style = StyleResource(FakeClient())

    with pytest.raises(TypeError, match="component_ids"):
        style.mesh.polygons.color(DATA_ID, "#ff8800", component_ids=["s1"])
    with pytest.raises(TypeError, match="component_ids"):
        style.mesh.points.vertex.attribute(DATA_ID, "depth", component_ids=["s1"])


def test_data_actions():
    client = FakeClient()
    data = DataResource(client)

    data.create("curve", "loop", [(0, 0, 0), (1, 0, 0), (1, 1, 0)], closed=True)
    data.rename(DATA_ID, "renamed")
    data.delete([DATA_ID, OTHER_ID])

    assert [call[1] for call in client.calls] == ["/data/create", "/data/rename", "/data/delete"]
    assert [call[2]["json"] for call in client.calls] == [
        {
            "name": "loop",
            "kind": "curve",
            "points": [[0, 0, 0], [1, 0, 0], [1, 1, 0]],
            "closed": True,
        },
        {"id": DATA_ID, "name": "renamed"},
        {"ids": [DATA_ID, OTHER_ID]},
    ]


def test_data_list_and_details():
    client = FakeClient({"data": [{"id": DATA_ID}]})
    data = DataResource(client)

    assert data.list() == [{"id": DATA_ID}]
    data.details(DATA_ID)

    assert client.calls[1] == ("GET", "/data/details", {"params": {"id": DATA_ID}})


def test_data_load_uploads_the_file(tmp_path: Path):
    file = tmp_path / "surface.og_tsf3d"
    file.write_bytes(b"content")
    client = FakeClient({"id": DATA_ID})

    assert DataResource(client).load(str(file)) == {"id": DATA_ID}

    method, path, kwargs = client.calls[0]
    assert (method, path) == ("POST", "/data/load")
    assert kwargs["files"]["file"][0] == "surface.og_tsf3d"


def test_view_actions():
    client = FakeClient()
    view = ViewResource(client)

    view.orient("zplus")
    view.focus(DATA_ID, component_ids=["s1"])
    view.scene(z_scaling=2, axes=True)

    assert [call[1] for call in client.calls] == ["/view/orient", "/view/focus", "/view/scene"]
    assert [call[2]["json"] for call in client.calls] == [
        {"orientation": "zplus"},
        {"id": DATA_ID, "componentIds": ["s1"]},
        {"zScaling": 2, "axes": True},
    ]


def test_filters_post_to_their_own_route():
    client = FakeClient()
    filters = FilterResource(client)

    filters.threshold(DATA_ID, attribute="depth", minimum=0, maximum=10)
    filters.shrink([DATA_ID, OTHER_ID], factor=0.5)
    filters.clip(DATA_ID, remove=True)

    assert [call[1] for call in client.calls] == [
        "/filter/threshold",
        "/filter/shrink",
        "/filter/clip",
    ]
    assert [call[2]["json"] for call in client.calls] == [
        {"ids": [DATA_ID], "attribute": "depth", "minimum": 0, "maximum": 10},
        {"ids": [DATA_ID, OTHER_ID], "factor": 0.5},
        {"ids": [DATA_ID], "remove": True},
    ]


def test_filter_rejects_an_unknown_parameter():
    with pytest.raises(TypeError):
        filter_resource = FilterResource(FakeClient())
        filter_resource.threshold(DATA_ID, minimun=0)  # type: ignore[call-arg]


def test_style_colormaps_reads_the_categories():
    client = FakeClient({"categories": {"Sequential": ["batlow"]}})

    assert StyleResource(client).colormaps() == {"Sequential": ["batlow"]}
    assert client.calls[0][:2] == ("GET", "/colormaps")


def test_export_sends_an_absolute_path():
    client = FakeClient({"filePath": "/abs/shot.png"})

    saved = ExportResource(client).screenshot("shot.png", include_background=False)

    assert saved == "/abs/shot.png"

    assert client.calls[0] == (
        "POST",
        "/export/screenshot",
        {
            "json": {
                "filePath": os.path.abspath("shot.png"),
                "includeBackground": False,
            },
            "files": None,
        },
    )


class FakeResponse:
    def __init__(self, status: int, payload: Any):
        self.status_code = status
        self.ok = status < 400
        self.payload = payload

    def json(self) -> Any:
        return self.payload


class FakeSession:
    def __init__(self, response: FakeResponse):
        self.response = response

    def request(self, method: str, url: str, **kwargs: Any) -> FakeResponse:
        return self.response


def client_answering(response: FakeResponse) -> VeaseClient:
    # Skips __init__, which waits for a running app
    client = VeaseClient.__new__(VeaseClient)
    client.base_url = "http://localhost:3000/api/controller"
    client.session = FakeSession(response)  # type: ignore[assignment]
    return client


def test_client_unwraps_the_controller_response():
    payload = {"statusCode": 200, "response": {"ids": [DATA_ID]}}
    client = client_answering(FakeResponse(200, payload))

    assert client.post("/style/mesh/color", json={}) == {"ids": [DATA_ID]}


def test_client_raises_the_controller_error():
    client = client_answering(FakeResponse(500, {"message": "No data with id"}))

    with pytest.raises(RuntimeError, match="No data with id"):
        client.post("/style/mesh/color", json={})
