from geoalchemy2.shape import to_shape

from api.choices import ObjectStatus
from api.orm import models
from api.services.schemas.base import (
    BaseServiceSchema,
    IdCreatedDeletedServiceSchemaMixin,
)


class Itp(BaseServiceSchema, IdCreatedDeletedServiceSchemaMixin):
    district: str
    region: str
    dispatcher: str
    latitude: float
    longitude: float

    @classmethod
    def from_orm_model(cls, orm_model: models.Itp) -> "Itp":
        coords = to_shape(orm_model.geometry)
        return cls(
            district=orm_model.district,
            region=orm_model.region,
            dispatcher=orm_model.dispatcher,
            latitude=coords.y,
            longitude=coords.x,
            deleted=orm_model.deleted,
            created_at=orm_model.created_at,
            id=orm_model.id,
        )


class Mkd(BaseServiceSchema, IdCreatedDeletedServiceSchemaMixin):
    district: str
    region: str
    street: str
    index: str
    house_number: str
    residents_amount: int
    floors_amount: int
    latitude: float
    longitude: float

    @classmethod
    def from_orm_model(cls, orm_model: models.Mkd) -> "Mkd":
        coords = to_shape(orm_model.geometry)
        return cls(
            district=orm_model.district,
            region=orm_model.region,
            street=orm_model.street,
            index=orm_model.index,
            house_number=orm_model.house_number,
            residents_amount=orm_model.residents_amount,
            floors_amount=orm_model.floors_amount,
            latitude=coords.y,
            longitude=coords.x,
            deleted=orm_model.deleted,
            created_at=orm_model.created_at,
            id=orm_model.id,
        )


class ItpMkd(BaseServiceSchema, IdCreatedDeletedServiceSchemaMixin):
    id_itp: str
    id_mkd: str
    status_itp: ObjectStatus
    status_mkd: ObjectStatus
    season: str
    week_number: int
    confidence_interval_feature_1: float
    confidence_interval_feature_2: float
