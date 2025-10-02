from typing import Generic, TypeVar

from sqlalchemy.orm import Session

from api.repo import exceptions as repo_exc
from api.repo.base import BaseRepo
from api.services import exceptions as service_exc
from api.services.schemas.base import BaseServiceSchema

ModelType = TypeVar("ModelType")
ServiceSchema = TypeVar("ServiceSchema", bound=BaseServiceSchema)
Repo = TypeVar("Repo", bound=BaseRepo)


class BaseService(Generic[ModelType, ServiceSchema, Repo]):
    model: type[ModelType]
    service_schema: type[ServiceSchema]
    repo: type[Repo]

    def __init__(self, session: Session):
        self.session = session

    def get_resource_by_filters(self, **filters) -> ServiceSchema:
        try:
            result = self.repo(self.session).get_resource_by_filters(**filters)
        except repo_exc.NotFoundError as e:
            raise service_exc.NotFoundError(detail=e.detail) from e
        except repo_exc.MultipleFoundError as e:
            raise service_exc.MultipleFoundError(detail=e.detail) from e
        return self.service_schema.from_orm_model(orm_model=result)

    def get_resources(self, **filters) -> list[ServiceSchema]:
        result = self.repo(self.session).get_resources(**filters)
        return [self.service_schema.from_orm_model(orm_model=row) for row in result]
