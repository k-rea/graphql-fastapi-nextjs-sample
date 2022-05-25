from typing import Optional

import strawberry
from pydantic import BaseModel

from src.schemas.status import Status


class TaskBase(BaseModel):
    id: int
    index: int
    title: str
    status: Status
    is_archive: bool


class TaskCreate(BaseModel):
    index: int
    title: str
    status: Optional[Status] = Status.not_started
    is_archive: Optional[bool] = False


@strawberry.type
class TaskType:
    id: int
    index: int
    title: str
    status: Status
    is_archive: bool


@strawberry.input
class TaskQuery:
    id: Optional[int] = None
    title: Optional[str] = None
    status: Optional[Status] = None
    is_archive: Optional[bool] = None


@strawberry.experimental.pydantic.input(model=TaskCreate, all_fields=True)
class TaskInput:
    status: Optional[Status] = Status.not_started
