from fastapi import APIRouter, status

from api.choices import ObjectStatus
from api.orm.session import get_session
from api.routes.schemas import region as api_schemas
from api.services.region import ITPService

router = APIRouter(prefix="/api/region", tags=["itp_filters"])


@router.get(
    "/districts",
    response_model=list[api_schemas.ItpFilter],
    status_code=status.HTTP_200_OK,
    summary="Get district filters",
)
def get_districts():
    with get_session() as session:
        result = ITPService(session).get_districts()
        return [api_schemas.ItpFilter(value=row) for row in result]


@router.get(
    "/regions",
    response_model=list[api_schemas.ItpFilter],
    status_code=status.HTTP_200_OK,
    summary="Get regions filters",
)
def get_regions():
    with get_session() as session:
        result = ITPService(session).get_regions()
        return [api_schemas.ItpFilter(value=row) for row in result]


@router.get(
    "/dispatchers",
    response_model=list[api_schemas.ItpFilter],
    status_code=status.HTTP_200_OK,
    summary="Get dispatchers filters",
)
def get_dispatchers():
    with get_session() as session:
        result = ITPService(session).get_dispatchers()
        return [api_schemas.ItpFilter(value=row) for row in result]


@router.get(
    "/statuses",
    response_model=list[api_schemas.ItpFilter],
    status_code=status.HTTP_200_OK,
    summary="Get statuses filters",
)
def get_statuses():
    return [api_schemas.ItpFilter(value=row) for row in list(ObjectStatus)]
