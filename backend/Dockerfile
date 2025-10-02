FROM sunpeek/poetry:py3.11-slim
WORKDIR /opt/app

COPY pyproject.toml poetry.lock ./

RUN poetry install --no-root --verbose --no-interaction --no-ansi

COPY api/ ./api
COPY alembic ./alembic
COPY alembic.ini ./alembic.ini

ENTRYPOINT ["poetry", "run", "python", "-m", "api"]
