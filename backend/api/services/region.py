from api.orm import models
from api.repo.region import ITPMKDRepo, ITPRepo, MKDRepo
from api.services.base import BaseService
from api.services.schemas import region as schemas


class ITPService(BaseService[models.Itp, schemas.Itp, ITPRepo]):
    model = models.Itp
    service_schema = schemas.Itp
    repo = ITPRepo

    def get_districts(self) -> list[str]:
        return self.repo(session=self.session).get_districts()

    def get_regions(self) -> list[str]:
        return self.repo(session=self.session).get_regions()

    def get_dispatchers(self) -> list[str]:
        return self.repo(session=self.session).get_dispatchers()


class MKDService(BaseService[models.Mkd, schemas.Mkd, MKDRepo]):
    model = models.Mkd
    service_schema = schemas.Mkd
    repo = MKDRepo


class ITPMKDService(BaseService[models.ItpMkd, schemas.ItpMkd, ITPMKDRepo]):
    model = models.ItpMkd
    service_schema = schemas.ItpMkd
    repo = ITPMKDRepo
