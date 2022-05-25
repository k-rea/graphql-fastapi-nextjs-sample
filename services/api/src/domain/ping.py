from fastapi import APIRouter, Depends

from src.config import Settings, get_settings

router = APIRouter()


@router.get("/")
def read_root(settings: Settings = Depends(get_settings)):
    ret = {
        "ping": "pong",
        "environment": settings.environment,
        "testing": settings.testing,
    }
    if settings.testing:
        ret["database_url"] = settings.database_url

    return ret
