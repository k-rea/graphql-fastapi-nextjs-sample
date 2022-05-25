ARG PYTHON_ENV=python:3.9.6-slim-buster

FROM $PYTHON_ENV as builder

WORKDIR /usr/src/app
RUN pip install poetry
COPY pyproject.toml poetry.lock ./

RUN poetry export --without-hashes --dev -f requirements.txt > requirements.txt

FROM $PYTHON_ENV

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNVUFFERED 1

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get -y install netcat gcc postgresql\
    && apt-get clean

RUN ls /usr/src/app
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .
RUN chmod +x /usr/src/app/scripts/entrypoint.local.sh

CMD ["/usr/src/app/scripts/entrypoint.local.sh"]
