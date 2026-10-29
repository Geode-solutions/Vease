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


def test_style_set_accepts_one_id_or_several():
    client = FakeClient()
    style = StyleResource(client)

    style.set(DATA_ID, target="polygons", color="#ff8800")
    style.set([DATA_ID, OTHER_ID], target="polygons", coloring="random")

    assert {call[1] for call in client.calls} == {"/style/set"}
    assert [call[2]["json"] for call in client.calls] == [
        {"ids": [DATA_ID], "target": "polygons", "color": "#ff8800"},
        {"ids": [DATA_ID, OTHER_ID], "target": "polygons", "coloring": "random"},
    ]


def test_style_color_by_attribute_posts_to_set_style():
    client = FakeClient()

    StyleResource(client).color_by_attribute([DATA_ID], "depth", colormap="batlow", time_step=2)

    assert client.calls[0][1] == "/style/set"
    assert client.calls[0][2]["json"] == {
        "ids": [DATA_ID],
        "attribute": "depth",
        "colormap": "batlow",
        "timeStep": 2,
    }


def test_data_manage_actions():
    client = FakeClient()
    data = DataResource(client)

    data.create("curve", "loop", [(0, 0, 0), (1, 0, 0), (1, 1, 0)], closed=True)
    data.rename(DATA_ID, "renamed")
    data.delete([DATA_ID, OTHER_ID])

    assert [call[2]["json"] for call in client.calls] == [
        {
            "action": "create",
            "name": "loop",
            "kind": "curve",
            "points": [[0, 0, 0], [1, 0, 0], [1, 1, 0]],
            "closed": True,
        },
        {"action": "rename", "ids": [DATA_ID], "name": "renamed"},
        {"action": "delete", "ids": [DATA_ID, OTHER_ID]},
    ]
    assert {call[1] for call in client.calls} == {"/data/manage"}


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

    assert [call[2]["json"] for call in client.calls] == [
        {"action": "orient", "orientation": "zplus"},
        {"action": "focus", "id": DATA_ID, "componentIds": ["s1"]},
        {"action": "scene", "zScaling": 2, "axes": True},
    ]


def test_filter_apply_forwards_filter_params():
    client = FakeClient()

    FilterResource(client).apply("threshold", DATA_ID, attribute="depth", minimum=0, maximum=10)

    assert client.calls[0][2]["json"] == {
        "filter": "threshold",
        "ids": [DATA_ID],
        "attribute": "depth",
        "minimum": 0,
        "maximum": 10,
    }


def test_filter_apply_rejects_an_unknown_parameter():
    with pytest.raises(TypeError):
        filter_resource = FilterResource(FakeClient())
        filter_resource.apply("threshold", DATA_ID, minimun=0)  # type: ignore[call-arg]


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
        "/export",
        {
            "json": {
                "kind": "screenshot",
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

    assert client.post("/style/set", json={}) == {"ids": [DATA_ID]}


def test_client_raises_the_controller_error():
    client = client_answering(FakeResponse(500, {"message": "No data with id"}))

    with pytest.raises(RuntimeError, match="No data with id"):
        client.post("/style/set", json={})
