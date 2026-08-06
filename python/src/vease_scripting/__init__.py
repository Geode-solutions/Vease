from .client import VeaseClient
from .ressources.data import DataResource


class VeaseScripting:
    def __init__(
        self,
        base_url: str,
    ):
        self.client = VeaseClient(base_url)
        self.data = DataResource(self.client)
