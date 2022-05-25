import logging
import os

from sqlalchemy import create_engine
from sqlalchemy.exc import ProgrammingError
from sqlalchemy.orm import declarative_base, sessionmaker

log = logging.getLogger("uvicorn")

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_engine():
    ret = engine
    if os.getenv("TESTING") == "True":
        ret = create_engine(os.getenv("DATABASE_TEST_URL"))
    return ret


def init_db(engine=engine) -> None:
    sn = sessionmaker(autoflush=False, autocommit=False, bind=engine)
    db = sn()
    log.info("Creating Function and Trigger...")
    try:
        fn = "update_at_timestamp_func()"
        q = f"""
        CREATE FUNCTION {fn}
        RETURNS TRIGGER AS $$
        BEGIN
        NEW.updated_at:= 'now';
        RETURN NEW;
        END; $$ LANGUAGE PLPGSQL;
        """  # noqa:  w291
        db.execute(q)

        for t in Base.metadata.sorted_tables:
            tn = t.name
            tr = tn + "_update_at_timestamp_trigger"
            q = f"""
            CREATE TRIGGER {tr} BEFORE UPDATE ON {tn}
            FOR EACH ROW EXECUTE PROCEDURE {fn};
            """  # noqa:  w291
            db.execute(q)
        db.commit()
    except ProgrammingError as e:
        log.info(e)
    finally:
        db.close()
