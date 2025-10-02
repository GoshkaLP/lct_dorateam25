from api.orm import models
from api.repo.base import BaseRepo


class ITPRepo(BaseRepo[models.Itp]):
    model = models.Itp


class MKDRepo(BaseRepo[models.Mkd]):
    model = models.Mkd


class ITPMKDRepo(BaseRepo[models.ItpMkd]):
    model = models.ItpMkd
