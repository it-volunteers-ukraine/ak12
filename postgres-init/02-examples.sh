#!/bin/sh
# Seeds example content from 02-examples.sql.template.
#
# The Cloudinary cloud name is injected from the CLOUDINARY_CLOUD_NAME environment
# variable at init time (loaded into this container via compose `env_file: .env`),
# instead of being hardcoded in committed SQL. Cloudinary is a dev-only asset host,
# so when the variable is absent (e.g. production on MinIO) we skip seeding rather
# than aborting database initialization.
#
# Postgres only auto-runs *.sql files, so the data lives in a *.sql.template file
# that this script substitutes and pipes into psql. No `exit` is used so the script
# behaves correctly whether the entrypoint executes or sources it.

template="/docker-entrypoint-initdb.d/02-examples.sql.template"

if [ -z "${CLOUDINARY_CLOUD_NAME:-}" ]; then
  echo "02-examples.sh: CLOUDINARY_CLOUD_NAME is not set — skipping example content seed."
else
  echo "02-examples.sh: seeding example content (cloud name: ${CLOUDINARY_CLOUD_NAME})."
  sed "s|__CLOUDINARY_CLOUD_NAME__|${CLOUDINARY_CLOUD_NAME}|g" "$template" \
    | psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB"
fi
