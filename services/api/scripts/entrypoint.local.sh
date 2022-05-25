#!/bin/sh

export PGHOST=${PGHOST}
export PGPORT=${PGPORT}
export PGUSER=${PGUSER}
export PGPASSWORD=${PGPASSWORD}
export PGDATABASE=${PGDATABASE}
export DATABASE_URL=postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}

echo "Waiting for postgres..."
while ! nc -z ${PGHOST} ${PGPORT}; do
  sleep 0.1
done
echo "PostgreSQL started"

psql -v ON_ERROR_STOP=1 -h ${PGHOST} -U ${PGUSER} -p ${PGPORT} -d postgres << EOF
CREATE DATABASE ${PGDATABASE};
EOF
psql -v ON_ERROR_STOP=1 -h ${PGHOST} -U ${PGUSER} -p ${PGPORT} -d ${PGDATABASE} << EOF
CREATE SCHEMA tiger AUTHORIZATION postgres;
CREATE SCHEMA tiger_data AUTHORIZATION postgres;
CREATE SCHEMA topology AUTHORIZATION postgres;
COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';
ALTER DATABASE ${PGDATABASE} SET search_path=public, tiger, topology;
CREATE EXTENSION pgcrypto SCHEMA public VERSION "1.3";
CREATE EXTENSION fuzzystrmatch SCHEMA public VERSION "1.1";
CREATE EXTENSION postgis SCHEMA public;
CREATE EXTENSION postgis_tiger_geocoder SCHEMA tiger;
CREATE EXTENSION postgis_topology SCHEMA topology;
EOF

alembic upgrade head

uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

exec "$@"