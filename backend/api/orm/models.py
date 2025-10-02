from geoalchemy2 import Geometry
from sqlalchemy import Column, Enum, Integer, Text

from api.choices import ObjectStatus
from api.orm.base import Base


class Itp(Base):
    district = Column(Text, nullable=False, doc="Округ")
    region = Column(Text, nullable=False, doc="Район")
    dispatcher = Column(Text, nullable=False)
    geometry = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)
    status = Column(Enum(ObjectStatus, native_enum=False), nullable=False)


class Lines(Base):
    itp_id = Column(Text, nullable=False)
    geometry = Column(Geometry(geometry_type="LINESTRING", srid=4326), nullable=False)
    status = Column(Enum(ObjectStatus, native_enum=False), nullable=False)
    layout_index = Column(Integer, nullable=False)


class Mkd(Base):
    itp_id = Column(Text, nullable=False)
    district = Column(Text, nullable=False, doc="Округ")
    region = Column(Text, nullable=False, doc="Район")
    street = Column(Text, nullable=False)
    index = Column(Text, nullable=False)
    house_number = Column(Text, nullable=False)
    residents_amount = Column(Integer, nullable=False)
    floors_amount = Column(Integer, nullable=False)
    geometry = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)
    status = Column(Enum(ObjectStatus, native_enum=False), nullable=False)
