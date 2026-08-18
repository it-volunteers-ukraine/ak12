# AK-12

## Українська

Багатомовний сайт військового підрозділу з публічною частиною та захищеною адмін-панеллю.

### Можливості

- двомовний сайт українською та англійською;
- редагування контенту, вакансій і підрозділів через адмін-панель;
- Supabase + Cloudinary для dev;
- PostgreSQL 17 + MinIO для production;
- двофакторна автентифікація TOTP;
- запуск через Node.js або Podman/Docker Compose.

### Швидкий старт

```bash
cp .env.example .env
npm ci
npm run dev
```

Для production у контейнері:

```bash
podman compose up --build prod
```

Докладні інструкції: [україномовний Runbook](docs/runbook/README.md).

## English

A bilingual military unit website with a public-facing site and a protected administration panel.

### Features

- Ukrainian and English public site;
- content, vacancy, and subdivision management through the admin panel;
- Supabase + Cloudinary for development;
- PostgreSQL 17 + MinIO for production;
- TOTP two-factor authentication;
- Node.js and Podman/Docker Compose workflows.

### Quick start

```bash
cp .env.example .env
npm ci
npm run dev
```

For production containers:

```bash
podman compose up --build prod
```

See the [English Runbook](docs/runbook/README.en.md) for detailed instructions.

## Technology

Next.js 16, React 19, TypeScript 5.9, Node.js 24, PostgreSQL 17, Supabase, Cloudinary, MinIO, Zod, Pino, and Jest.

## Security

Never commit `.env`, API keys, service-role keys, bcrypt hashes, TOTP secrets, QR codes, or session keys. Compose passes local environment values to the application container without copying `.env` into the production image.
