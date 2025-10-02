import datetime
from typing import TypeVar

from pydantic import BaseModel, ConfigDict

ModelType = TypeVar("ModelType")


class BaseServiceSchema(BaseModel):
    @classmethod
    def from_orm_model(cls, orm_model: ModelType) -> "BaseServiceSchema":
        return cls.model_validate(orm_model)

    model_config = ConfigDict(from_attributes=True)


class IdCreatedDeletedServiceSchemaMixin(BaseModel):
    id: str
    created_at: datetime.datetime
    deleted: bool
