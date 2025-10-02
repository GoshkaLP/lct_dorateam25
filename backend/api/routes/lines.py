from typing import Annotated

from fastapi import APIRouter, Query, status

from api.orm.session import get_session
from api.routes.schemas import region as api_schemas
from api.services.region import LinesService

router = APIRouter(prefix="/api/region", tags=["lines"])


@router.get(
    "/lines",
    response_model=list[api_schemas.Lines],
    status_code=status.HTTP_200_OK,
    summary="Get lines between MKD and ITP",
)
def get_lines(filters: Annotated[api_schemas.ItpIdFilter, Query()]):
    with get_session() as session:
        result = LinesService(session).get_resources(
            deleted=False, **filters.model_dump(exclude_none=True, by_alias=True)
        )
        return [api_schemas.Lines.from_service_schema(row) for row in result]
