# AK-12 Runbook

Operational guide for developers and operators who configure, run, and maintain the project.

## Runtime profiles

| Profile | Database | Storage / infrastructure | Command |
| --- | --- | --- | --- |
| `dev` | Supabase | Cloudinary | `npm run dev` or `podman compose --profile dev up dev` |
| `prod` | PostgreSQL 17 | MinIO | `podman compose up --build prod` |

The target production architecture is PostgreSQL + MinIO, but the current upload path still defaults to Cloudinary. MinIO is provisioned in production and the storage layer is being migrated, yet the application still keeps the Cloudinary variables until the storage switch is merged and verified.

## Requirements and setup

- Node.js 24 LTS;
- npm;
- Podman Desktop or Docker Desktop;
- access to Supabase, Cloudinary, MinIO, and PostgreSQL credentials.

```bash
git clone <repository-url>
cd ak12
cp .env.example .env
npm ci
```

On Windows, copy `.env.example` to `.env` manually. Docker Compose can be used by replacing `podman compose` with `docker compose`.

## Environment variables

The `.env` file is local-only. Compose reads it through `env_file` and passes values to the application container; it is not copied into the production image. The `database` service receives only PostgreSQL variables.

### Database

| Variable | Purpose |
| --- | --- |
| `POSTGRES_HOST` | `localhost` locally; Compose overrides it to `database` for `prod`. |
| `POSTGRES_PORT` | PostgreSQL port, normally `5432`. |
| `POSTGRES_USER` | Database user. |
| `POSTGRES_PASSWORD` | Database password. |
| `POSTGRES_DB` | Database name, normally `ak12`. |
| `DB_CLIENT` | `supabase` for dev or `postgres` for prod. |

### Supabase — dev

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, and the server-only `SUPABASE_SERVICE_ROLE_KEY`.

### Cloudinary — dev

`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `CLOUDINARY_MEDIA_FOLDER`.

### MinIO — prod

`STORAGE_ENDPOINT`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY`, `STORAGE_BUCKET`, `STORAGE_MEDIA_FOLDER`, and `STORAGE_CLIENT`.

The current `.env.example` still contains the Cloudinary settings for dev, while the storage variables for MinIO are also defined for production. The active upload implementation still defaults to Cloudinary until the MinIO switch is merged and verified.

### SMTP email service

| Variable | Purpose |
| --- | --- |
| `SMTP_HOST` | SMTP server host (e.g., `smtp.example.com`). |
| `SMTP_PORT` | SMTP port, normally `587` (STARTTLS) or `465` (TLS). |
| `SMTP_USER` | SMTP username / account for authentication. |
| `SMTP_PASSWORD` | SMTP password / app password for authentication. |
| `SMTP_TO` | Recipient email address for feedback form submissions. |
| `SMTP_SECURE` | Set to `true` for TLS (port 465) or `false` for STARTTLS / non-SSL (port 587). |

### Admin panel

`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_2FA_SECRET`, and `SESSION_SECRET_KEY`.

Bcrypt hashes contain `$`; keep them literal in single quotes:

```env
ADMIN_PASSWORD_HASH='$2b$10$...'
```

Generate a session key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Generate a bcrypt hash:

```bash
node -e "require('bcryptjs').hash('PUT_PASSWORD_HERE', 10).then(console.log)"
```

## Local development

For the dev profile:

```env
DB_CLIENT=supabase
```

```bash
npm run dev
```

Open <http://localhost:3000>. To use local PostgreSQL instead:

```env
DB_CLIENT=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

## Production with Podman or Docker

```bash
podman compose up --build prod
podman compose up -d --build prod
podman compose ps
```

Compose starts `database`, `prod`, and MinIO. View logs with:

```bash
podman compose logs -f prod
podman compose logs -f database
podman compose logs -f minio
```

After changing `.env`, recreate the application container:

```bash
podman compose up -d --force-recreate prod
```

Stop without deleting data:

```bash
podman compose down
```

Do not use `down -v` without approval: it removes volumes, including `postgres_data`.

Check a secret without printing it:

```bash
podman compose exec prod sh -c 'test -n "$ADMIN_PASSWORD_HASH" && echo "hash is set" || echo "hash is missing"'
```

## Database operations

PostgreSQL uses the `postgres_data` volume. Scripts in `postgres-init/` run automatically only when an empty data directory is initialized.

```bash
podman compose ps database
podman compose logs database
```

Important files:

- `postgres-init/01-init.sql` — main schema;
- `postgres-init/02-examples.sql.template` — example data template;
- `postgres-init/02-examples.sh` — helper example.

Changing an initialization SQL file does not migrate an existing database. Use an approved migration or explicitly reviewed SQL operation.

For local PostgreSQL:

```bash
psql -h localhost -U <user> -d <database> -f postgres-init/01-init.sql
```

## Admin panel and 2FA

The admin panel is available at `/management-console-12ak/`. Authentication uses the admin email/password followed by a six-digit TOTP code.

Generate a TOTP secret:

```bash
node -e "console.log(require('otplib').generateSecret())"
```

Store it as `ADMIN_2FA_SECRET` in `.env`. A QR code contains the same secret and must be protected like `.env`.

Never commit or log passwords, hashes, TOTP codes, tokens, cookies, API keys, service-role keys, QR codes, or form payloads. Rotate a secret immediately after compromise.

## Validation commands

```bash
npm run lint
npm test -- --runInBand
npm run build
```

Run production without containers:

```bash
npm run build
npm run start:prod
```

## Troubleshooting

### An environment variable is empty

1. Confirm that it is active in `.env`, not commented out.
2. Use `ADMIN_PASSWORD_HASH='$2b$10$...'` for bcrypt hashes.
3. Inspect `prod`, not `database`.
4. Recreate the container with `--force-recreate`.
5. Keep server secrets in runtime environment lookups, not build-time configuration.

### PostgreSQL is unavailable

Inside Compose, the host must be `database`, not `localhost`. Check `podman compose ps`, the database healthcheck, and `podman compose logs database`.

### Admin login fails

Verify `ADMIN_EMAIL`, the bcrypt hash, a 32-character minimum `SESSION_SECRET_KEY`, and clock synchronization for TOTP.

### Image upload fails

For dev, verify the Cloudinary variables. For prod, verify the MinIO container, bucket, and credentials, but keep the Cloudinary settings in place until the upload adapter switch is merged and validated.

### Email delivery fails

Verify that `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_TO` are configured in `.env`. Check that `SMTP_SECURE` matches the port (`true` for 465, `false` for 587) and that the SMTP provider allows connections with the provided credentials.
