import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.db import init_db
from src.domain import ping
from src.graphql.route import graphql_route

log = logging.getLogger("uvicorn")

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]


def create_application() -> FastAPI:
    application = FastAPI()
    application.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(ping.router, prefix="/ping", tags=["Ping"])
    application.include_router(graphql_route, prefix="/graphql")

    return application


app = create_application()


@app.on_event("startup")
async def startup_event():
    log.info("start up...")
    # Base.metadata.create_all(bind=engine) # alembic
    init_db()
