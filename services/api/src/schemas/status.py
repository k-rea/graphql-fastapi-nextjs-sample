from enum import Enum

import strawberry


@strawberry.enum()
class Status(str, Enum):
    not_started = "not_started"
    correspondence = "correspondence"
    done = "done"


# @strawberry.enum()
# class StatusEnum(Enum):
#     not_started = 'not_started'
#     correspondence = 'correspondence'
#     done = 'done'
