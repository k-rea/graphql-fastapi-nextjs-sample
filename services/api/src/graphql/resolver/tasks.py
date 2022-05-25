import logging
from typing import List, Optional

from strawberry.types import Info

from src.models.Tasks import Task
from src.schemas.tasks import TaskBase, TaskInput, TaskQuery, TaskType

log = logging.getLogger("uvicorn")


class NoData(Exception):
    def __init__(self, obj: str):
        message = "No Data." f"There is No {obj}."

        super().__init__(message)


async def get_tasks(
    task: Optional[TaskQuery] = None, info: Info = None
) -> List[TaskType]:
    db = info.context["db"]
    fil = (
        [f"{d[0]}='{d[1]}'" for d in task.__dict__.items() if d[1] is not None]
        if task is not None
        else []
    )

    where = "1=1" if len(fil) == 0 else " and ".join(fil)
    q = f"""
    SELECT row_to_json(t) as result
    from (
        select 
            id,
            title,
            index,
            status,
            is_archive
        from tasks
        where {where} 
        ) as t
    ;
    """  # noqa:  w291
    result = db.execute(q)
    tasks = [d["result"] for d in result]

    return [TaskType(**TaskBase(**t).dict()) for t in tasks]


async def create_task(task: TaskInput, info: Info) -> TaskType:
    db = info.context["db"]
    task = Task(**task.__dict__)
    db.add(task)
    db.commit()
    db.refresh(task)
    return TaskType(**TaskBase(**task.__dict__).dict())
