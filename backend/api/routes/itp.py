import random
from typing import Annotated

from fastapi import APIRouter, Query, status

from api.choices import ObjectStatus
from api.orm.session import get_session
from api.routes.schemas import region as api_schemas
from api.services.region import ITPService

router = APIRouter(prefix="/api/region", tags=["itp"])


@router.get(
    "/itp",
    response_model=list[api_schemas.Itp],
    status_code=status.HTTP_200_OK,
    summary="Get ITP",
)
def get_itp(filters: Annotated[api_schemas.ItpFilters, Query()]):
    with get_session() as session:
        status_values: list[ObjectStatus] = []
        if filters.status:
            status_values = filters.status
            filters.status = None
        result = ITPService(session).get_resources(
            deleted=False, **filters.model_dump(exclude_none=True, by_alias=True)
        )
        response = [
            api_schemas.Itp.from_service_schema(row, status=random.choice(list(ObjectStatus))) for row in result
        ]
        response = filter(lambda row: row.status in status_values if status_values else True, response)
        return response
