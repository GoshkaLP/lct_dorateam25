from fastapi import APIRouter, status

from api.orm.session import get_session
from api.routes.schemas import region as api_schemas
from api.services.region import MKDService

router = APIRouter(prefix="/api/region", tags=["mkd"])


@router.get(
    "/mkd",
    response_model=list[api_schemas.Mkd],
    status_code=status.HTTP_200_OK,
    summary="Get MKD",
)
def get_mkd():
    with get_session() as session:
        result = MKDService(session).get_resources(
            deleted=False,
        )
        return [api_schemas.Mkd.from_service_schema(row) for row in result]
