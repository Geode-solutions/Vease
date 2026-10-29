from __future__ import annotations

from collections.abc import Sequence
from typing import Any

from ..client import VeaseClient


def _camel_case(name: str) -> str:
    first, *others = name.split("_")
    return first + "".join(word.capitalize() for word in others)


def body(**params: Any) -> dict[str, Any]:
    """Controller payload: camelCase keys, unset (None) parameters left out."""
    return {_camel_case(key): value for key, value in params.items() if value is not None}


def id_list(ids: str | Sequence[str]) -> list[str]:
    return [ids] if isinstance(ids, str) else list(ids)


class Resource:
    def __init__(self, client: VeaseClient, base_path: str):
        self.client = client
        self.base_path = base_path.rstrip("/")

    def route(self, suffix: str = "") -> str:
        return f"{self.base_path}/{suffix.lstrip('/')}" if suffix else self.base_path
