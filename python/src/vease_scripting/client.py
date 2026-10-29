from __future__ import annotations

import logging
import time
from typing import Any

import requests

logger = logging.getLogger(__name__)


class VeaseClient:
    def __init__(self, base_url: str):
        logger.info("VeaseClient: %s", base_url)
        self.session = requests.Session()
        self.base_url = base_url.rstrip("/") + "/api"
        while True:
            status = self.get("/microservice/app/get_is_app_ready")
            if status.get("isReady"):
                logger.info("App is ready")
                break
            logger.info("Not ready yet, retrying...")
            time.sleep(1)
        self.base_url += "/controller"

    def _url(self, path: str) -> str:
        return f"{self.base_url}/{path.lstrip('/')}"

    def _request(self, method: str, path: str, **kwargs) -> Any:
        response = self.session.request(method, self._url(path), **kwargs)
        logger.debug("Request: %s %s => %s", method, self._url(path), response)
        try:
            data = response.json()
        except ValueError:
            data = response.text

        if not response.ok:
            message = data.get("message") if isinstance(data, dict) else str(data)
            raise RuntimeError(response.status_code, message or "Vease API error", data)

        # Controller routes wrap their result as {statusCode, response}
        if isinstance(data, dict) and "response" in data and "statusCode" in data:
            return data["response"]
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
