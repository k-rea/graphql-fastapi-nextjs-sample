from typing import List, Optional

import strawberry
from fastapi import Depends
from sqlalchemy.orm import Session
from strawberry.fastapi import GraphQLRouter

from src.config import Settings, get_settings
from src.db import get_db
from src.graphql.resolver.tasks import create_task, get_tasks
from src.schemas.tasks import TaskType


async def get_context(
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    return {"db": db, "settings": settings}


@strawberry.type
class Query:
    tasks: List[Optional[TaskType]] = strawberry.field(resolver=get_tasks)


@strawberry.type
class Mutation:
    add_task: TaskType = strawberry.field(resolver=create_task)


schema = strawberry.Schema(query=Query, mutation=Mutation)

graphql_route = GraphQLRouter(schema, context_getter=get_context)
