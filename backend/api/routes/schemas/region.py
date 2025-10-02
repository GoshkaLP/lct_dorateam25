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


class ItpMkd(BaseApiSchema[service_schemas.ItpMkd], IdApiSchemaMixin):
    id_itp: str
    id_mkd: str
    status_itp: ObjectStatus
    status_mkd: ObjectStatus
    season: str
    week_number: int
    confidence_interval_feature_1: float
    confidence_interval_feature_2: float


class ItpFilters(BaseModel):
    id: str | None = Field(None, serialization_alias="id__eq")
    district: list[str] | None = Field(None, serialization_alias="district__in")
    region: list[str] | None = Field(None, serialization_alias="region__in")
    dispatcher: list[str] | None = Field(None, serialization_alias="dispatcher__in")
    status: list[str] | None = Field(None)
