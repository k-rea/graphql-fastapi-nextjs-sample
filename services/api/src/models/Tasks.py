from sqlalchemy import Boolean, Column, Enum, Integer, String

from src.db import Base
from src.schemas.status import Status


class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, autoincrement=True)
    index = Column(Integer, nullable=False, default=0)
    title = Column(String(128), nullable=False, server_default="")
    status = Column(
        Enum(Status),
        nullable=False,
        default=Status.not_started,
        server_default=Status.not_started,
    )
    is_archive = Column(Boolean, nullable=False, default=False)
