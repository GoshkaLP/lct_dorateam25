import uuid

from pydantic import BaseModel


class TokenData(BaseModel):
    id: uuid.UUID
    username: str
