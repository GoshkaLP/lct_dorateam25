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
    status: ObjectStatus

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
            status=orm_model.status,
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
    itp_id: str
    status: ObjectStatus

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
            itp_id=orm_model.itp_id,
            status=orm_model.status,
        )


class Lines(BaseServiceSchema, IdCreatedDeletedServiceSchemaMixin):
    itp_id: str
    coords: list[list[float]]
    status: ObjectStatus
    layout_index: int

    @classmethod
    def from_orm_model(cls, orm_model: models.Lines) -> "Lines":
        line = to_shape(orm_model.geometry)
        return cls(
            coords=list(line.coords),
            layout_index=orm_model.layout_index,
            deleted=orm_model.deleted,
            created_at=orm_model.created_at,
            id=orm_model.id,
            itp_id=orm_model.itp_id,
            status=orm_model.status,
        )
