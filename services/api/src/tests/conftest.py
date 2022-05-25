import os

import pytest
from fastapi.testclient import TestClient
from pydantic import PostgresDsn
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import create_database, database_exists, drop_database

from src.config import Settings, get_settings
from src.db import Base, get_db
from src.main import create_application
from src.models import Task

SQLALCHEMY_DATABASE_URL = PostgresDsn(
    url=os.getenv("DATABASE_TEST_URL"), scheme="postgresql+psycopg2"
)
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

INIT_SQL = """
CREATE SCHEMA tiger AUTHORIZATION postgres;
CREATE SCHEMA tiger_data AUTHORIZATION postgres;
CREATE SCHEMA topology AUTHORIZATION postgres;
COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';
CREATE EXTENSION pgcrypto SCHEMA public VERSION "1.3";
CREATE EXTENSION fuzzystrmatch SCHEMA public VERSION "1.1";
CREATE EXTENSION postgis SCHEMA public ;
CREATE EXTENSION postgis_tiger_geocoder SCHEMA tiger;
CREATE EXTENSION postgis_topology SCHEMA topology ;
"""


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def override_get_settings() -> Settings:
    return Settings(
        environment="dev",
        testing=True,
        database_url=SQLALCHEMY_DATABASE_URL,
    )


@pytest.fixture(scope="session", autouse=True)
def init_db():
    if database_exists(SQLALCHEMY_DATABASE_URL):
        drop_database(SQLALCHEMY_DATABASE_URL)
    create_database(SQLALCHEMY_DATABASE_URL)
    db = TestingSessionLocal()
    db.execute(INIT_SQL)
    db.commit()
    # create table
    Base.metadata.create_all(bind=engine)
    # Insert seed data


@pytest.fixture(scope="module")
def db():
    with TestingSessionLocal() as db:
        yield db


@pytest.fixture(scope="module")
def client(db):
    app = create_application()
    app.dependency_overrides[get_settings] = override_get_settings
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def db_task(db):
    task = Task()
    task.title = "買い物"
    db.add(task)
    db.commit()
    yield
    db.delete(task)
