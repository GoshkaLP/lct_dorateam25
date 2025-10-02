from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, MetaData, Text, create_engine
from sqlalchemy.orm import as_declarative, declared_attr, sessionmaker

from api.settings import postgres_settings
from api.utils.strings import to_snake_case

metadata = MetaData(schema=postgres_settings.db_schema)


@as_declarative(metadata=metadata)
class Base:
    id = Column(Text, primary_key=True, unique=True, nullable=False, default=uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    deleted = Column(Boolean, default=False)

    @declared_attr
    def __tablename__(cls) -> str:
        return to_snake_case(cls.__name__)


engine = create_engine(postgres_settings.connection_url)
session_factory = sessionmaker(bind=engine, autocommit=False)
