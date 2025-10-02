from api.choices import ObjectStatus
from api.routes.schemas.base import (
    BaseApiSchema,
    IdApiSchemaMixin,
)
from api.services.schemas import region as service_schemas

# class Admission(BaseApiSchema[service_schemas.Admission], IdApiSchemaMixin):
#     name: str
#     surname: str
#     telegram: str
#     course: str
#     university: str
#     type: AdmissionType
#     status: AdmissionStatus = AdmissionStatus.WAITING_PAYMENT


class Itp(BaseApiSchema[service_schemas.Itp], IdApiSchemaMixin):
    name: str
    district: str
    region: str
    dispatcher: str
    latitude: float
    longitude: float


class Mkd(BaseApiSchema[service_schemas.Mkd], IdApiSchemaMixin):
    district: str
    region: str
    street: str
    house_number: str
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


# class AdmissionFilters(BaseModel):
#     id__eq: str | None = Field(None, alias="id")
#     name__ilike: str | None = Field(None, alias="name")
#     surname__ilike: str | None = Field(None, alias="surname")
#     status__eq: AdmissionStatus | None = Field(None, alias="status")
