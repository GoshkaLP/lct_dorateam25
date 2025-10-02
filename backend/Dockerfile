FROM sunpeek/poetry:py3.11-slim
WORKDIR /opt/app

COPY pyproject.toml poetry.lock ./

RUN poetry install --no-root --verbose --no-interaction --no-ansi

COPY api/ ./api

ENTRYPOINT ["poetry", "run", "python", "-m", "api"]
