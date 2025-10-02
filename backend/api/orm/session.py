from contextlib import contextmanager

from sqlalchemy.orm import Session

from api.orm.base import Base, session_factory


@contextmanager
def get_session():
    session = session_factory()
    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def save_to_session(session: Session, objects: list[Base]) -> None:
    session.add_all(objects)
    session.flush()
