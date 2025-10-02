from geoalchemy2 import Geometry
from sqlalchemy import Column, Enum, Float, ForeignKey, Integer, Text

from api.choices import ObjectStatus
from api.orm.base import Base


class Itp(Base):
    name = Column(Text, nullable=False)
    district = Column(Text, nullable=False, doc="Округ")
    region = Column(Text, nullable=False, doc="Район")
    dispatcher = Column(Text, nullable=False)
    geometry = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)


class Mkd(Base):
    district = Column(Text, nullable=False)
    region = Column(Text, nullable=False, doc="Район")
    street = Column(Text, nullable=False)
    house_number = Column(Text, nullable=False)
    geometry = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)


class ItpMkd(Base):
    id_itp = Column(Text, ForeignKey("itp.id"), nullable=False)
    id_mkd = Column(Text, ForeignKey("mkd.id"), nullable=False)
    status_itp = Column(Enum(ObjectStatus, native_enum=False), nullable=False)
    status_mkd = Column(Enum(ObjectStatus, native_enum=False), nullable=False)
    season = Column(Text, nullable=False)
    week_number = Column(Integer, nullable=False)
    confidence_interval_feature_1 = Column(Float, nullable=True)
    confidence_interval_feature_2 = Column(Float, nullable=True)

    # itp = relationship("itp", back_populates="itp_mkd", uselist=False)
    # mkd = relationship("mkd", back_populates="itp_mkd", uselist=False)
