from fastapi import APIRouter, status

from api.orm.session import get_session
from api.routes.schemas import region as api_schemas
from api.services.region import ITPService

router = APIRouter(prefix="/api/region", tags=["region"])


# def get_itp(filters: Annotated[api_schemas.AdmissionFilters, Depends()]):
# result = ITPService(session).get_resources(deleted=False, **filters.model_dump(exclude_none=True))
@router.get(
    "/",
    response_model=list[api_schemas.Itp],
    status_code=status.HTTP_200_OK,
    summary="Get ITP",
)
def get_itp():
    with get_session() as session:
        result = ITPService(session).get_resources(deleted=False)
        return [api_schemas.Itp.from_service_schema(row) for row in result]
