from __future__ import annotations

from typing import Any

import requests


class VeaseClient:
    def __init__(self, base_url: str):
        print(f"VeaseClient: {base_url}")
        self.base_url = base_url.rstrip("/") + "/api/controller"
        self.session = requests.Session()

    def _url(self, path: str) -> str:
        return f"{self.base_url}/{path.lstrip('/')}"

    def _request(self, method: str, path: str, **kwargs) -> Any:
        response = self.session.request(method, self._url(path), **kwargs)
        print(f"Request: {method} {self._url(path)} => {response}")
        try:
            data = response.json()
        except ValueError:
            data = response.text

        if not response.ok:
            message = data.get("message") if isinstance(data, dict) else str(data)
            raise RuntimeError(response.status_code, message or "Vease API error", data)

        return data

    def get(self, path: str, params: dict | None = None) -> Any:
        return self._request("GET", path, params=params)

    def post(
        self, path: str, json: dict | None = None, files: dict | None = None
    ) -> Any:
        return self._request("POST", path, json=json, files=files)

    def put(self, path: str, json: dict | None = None) -> Any:
        return self._request("PUT", path, json=json)

    def patch(self, path: str, json: dict | None = None) -> Any:
        return self._request("PATCH", path, json=json)

    def delete(self, path: str, params: dict | None = None) -> Any:
        return self._request("DELETE", path, params=params)
