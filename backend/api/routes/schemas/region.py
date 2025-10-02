from pydantic import BaseModel, Field

from api.choices import ObjectStatus
from api.routes.schemas.base import (
    BaseApiSchema,
    IdApiSchemaMixin,
)
from api.services.schemas import region as service_schemas


class Itp(BaseApiSchema[service_schemas.Itp], IdApiSchemaMixin):
    district: str
    region: str
    dispatcher: str
    latitude: float
    longitude: float
    status: ObjectStatus


class ItpFilter(BaseModel):
    value: str


class Mkd(BaseApiSchema[service_schemas.Mkd], IdApiSchemaMixin):
    district: str
    region: str
    street: str
    index: str
    house_number: str
    residents_amount: int
    floors_amount: int
    latitude: float
    longitude: float
    status: ObjectStatus
    itp_id: str


class ItpFilters(BaseModel):
    id: str | None = Field(None, serialization_alias="id__eq")
    district: list[str] | None = Field(None, serialization_alias="district__in")
    region: list[str] | None = Field(None, serialization_alias="region__in")
    dispatcher: list[str] | None = Field(None, serialization_alias="dispatcher__in")
    status: list[str] | None = Field(None, serialization_alias="status__in")


class ItpIdFilter(BaseModel):
    itp_id: list[str] | None = Field(None, serialization_alias="itp_id__in")


class Lines(BaseApiSchema[service_schemas.Lines], IdApiSchemaMixin):
    status: ObjectStatus
    itp_id: str
    layout_index: int
    coords: list[list[float]]
