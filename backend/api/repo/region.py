from api.orm import models
from api.repo.base import BaseRepo


class ITPRepo(BaseRepo[models.Itp]):
    model = models.Itp

    def get_districts(self) -> list[str]:
        return [row[0] for row in self.session.query(self.model.district).distinct()]

    def get_regions(self) -> list[str]:
        return [row[0] for row in self.session.query(self.model.region).distinct()]

    def get_dispatchers(self) -> list[str]:
        return [row[0] for row in self.session.query(self.model.dispatcher).distinct()]


class MKDRepo(BaseRepo[models.Mkd]):
    model = models.Mkd


class ITPMKDRepo(BaseRepo[models.ItpMkd]):
    model = models.ItpMkd
