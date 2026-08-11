# Runbook AK-12

Єдиний операційний довідник для команди розробки та операторів проєкту.

## 1. Профілі запуску

| Профіль | База даних | Сховище/інфраструктура | Команда |
| --- | --- | --- | --- |
| `dev` | Supabase | Cloudinary | `npm run dev` або `podman compose --profile dev up dev` |
| `prod` | PostgreSQL 17 | MinIO | `podman compose up --build prod` |

Production-ціль — PostgreSQL + MinIO. На момент написання поточний upload-код ще використовує Cloudinary; перехід на MinIO є запланованою зміною. До її злиття не видаляйте Cloudinary-змінні.

## 2. Вимоги

- Node.js 24 LTS;
- npm;
- Podman Desktop або Docker Desktop для контейнерного запуску;
- доступ до Supabase, Cloudinary і PostgreSQL-реквізитів.

Перевірка:

```bash
node --version
npm --version
podman --version
podman compose version
```

Docker Compose використовується аналогічно: замініть `podman compose` на `docker compose`.

## 3. Отримання проєкту та залежності

```bash
git clone <repository-url>
cd ak12
npm ci
```

`npm ci` використовує `package-lock.json` і призначений для відтворюваного встановлення. `npm install` використовуйте під час оновлення залежностей.

## 4. Налаштування `.env`

Створіть локальний файл на основі шаблону:

```bash
cp .env.example .env
```

У Windows скопіюйте `.env.example` у `.env` через Провідник або PowerShell.

Файл `.env` не можна комітити. У production Compose читає його через `env_file` і передає значення контейнеру; сам файл не копіюється в production-образ. Сервіс `database` отримує лише PostgreSQL-змінні.

### PostgreSQL

| Змінна | Призначення |
| --- | --- |
| `POSTGRES_HOST` | `localhost` для локальної БД; у `prod` Compose встановлює `database`. |
| `POSTGRES_PORT` | Порт, зазвичай `5432`. |
| `POSTGRES_USER` | Користувач БД. |
| `POSTGRES_PASSWORD` | Пароль користувача БД. |
| `POSTGRES_DB` | Назва БД, зазвичай `ak12`. |
| `DB_CLIENT` | `supabase` для dev або `postgres` для prod. |

### Supabase — dev

| Змінна | Призначення |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase-проєкту. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Публічний ключ. |
| `SUPABASE_SERVICE_ROLE_KEY` | Серверний service-role ключ; не публікувати. |

### Cloudinary — dev-середовище

| Змінна | Призначення |
| --- | --- |
| `CLOUDINARY_CLOUD_NAME` | Cloud name. |
| `CLOUDINARY_API_KEY` | API key. |
| `CLOUDINARY_API_SECRET` | API secret. |
| `CLOUDINARY_MEDIA_FOLDER` | Папка для зображень. |

### MinIO — production Compose

| Змінна | Призначення |
| --- | --- |
| `MINIO_ROOT_USER` | Користувач MinIO. |
| `MINIO_ROOT_PASSWORD` | Пароль MinIO. |
| `MINIO_BUCKET_NAME` | Назва bucket. |

`.env.example` містить конфігурацію Cloudinary для dev. Production-конфігурація має містити MinIO-змінні; після злиття MinIO-адаптера саме він буде використовуватися для production-завантажень.

### Адмін-панель

| Змінна | Призначення |
| --- | --- |
| `ADMIN_EMAIL` | Email адміністратора. |
| `ADMIN_PASSWORD_HASH` | bcrypt-хеш пароля. |
| `ADMIN_2FA_SECRET` | TOTP-секрет. |
| `SESSION_SECRET_KEY` | HMAC-ключ сесій, мінімум 32 символи. |

Bcrypt-хеш із `$` записуйте як literal у single quotes:

```env
ADMIN_PASSWORD_HASH='$2b$10$...'
```

Генерація ключа сесій:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Генерація bcrypt-хешу:

```bash
node -e "require('bcryptjs').hash('ВСТАВТЕ_ПАРОЛЬ', 10).then(console.log)"
```

## 5. Локальна розробка

Для dev у `.env` встановіть:

```env
DB_CLIENT=supabase
```

Запуск:

```bash
npm run dev
```

Сайт буде доступний на <http://localhost:3000>.

Якщо потрібно розробляти з локальним PostgreSQL:

```env
DB_CLIENT=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

## 6. Production у Podman/Docker

Запуск у foreground:

```bash
podman compose up --build prod
```

Фоновий запуск:

```bash
podman compose up -d --build prod
podman compose ps
```

Compose підніме `database`, `prod` і MinIO. Перевірка логів:

```bash
podman compose logs -f prod
podman compose logs -f database
podman compose logs -f minio
```

Після зміни `.env` пересоздайте контейнер:

```bash
podman compose up -d --force-recreate prod
```

Після зміни коду або залежностей використовуйте `--build`.

Перевірка наявності секрету без його виведення:

```bash
podman compose exec prod sh -c 'test -n "$ADMIN_PASSWORD_HASH" && echo "hash is set" || echo "hash is missing"'
```

Перевіряйте саме `prod`, а не `database`.

Зупинка без видалення даних:

```bash
podman compose down
```

Не запускайте `down -v` без погодження: команда видаляє volumes, зокрема `postgres_data`.

## 7. База даних

PostgreSQL у Compose використовує volume `postgres_data`. Скрипти з `postgres-init/` виконуються автоматично лише під час першого створення порожнього data directory.

Перевірка:

```bash
podman compose ps database
podman compose logs database
```

Схема:

- `postgres-init/01-init.sql` — основна схема;
- `postgres-init/02-examples.sql.template` — шаблон прикладових даних;
- `postgres-init/02-examples.sh` — допоміжний приклад.

Зміна SQL-файла не мігрує вже існуючу базу автоматично. Для робочої бази потрібні погоджені міграції або окреме ручне виконання SQL.

Для локального PostgreSQL:

```bash
psql -h localhost -U <user> -d <database> -f postgres-init/01-init.sql
```

## 8. Адмін-панель і 2FA

Адмін-панель: `/management-console-12ak/`.

Вхід має два етапи:

1. `ADMIN_EMAIL` і звичайний пароль, перевірений проти `ADMIN_PASSWORD_HASH`;
2. шестизначний TOTP-код із застосунку-аутентифікатора.

Генерація TOTP-секрету:

```bash
node -e "console.log(require('otplib').generateSecret())"
```

Додайте результат у `.env` як `ADMIN_2FA_SECRET`. QR-код містить цей самий секрет, тому його потрібно зберігати так само захищено, як `.env`.

Правила безпеки:

- не комітити `.env`, QR-коди, API keys, service-role keys і session keys;
- не логувати паролі, хеші, TOTP-коди, токени, cookies або form payload-и;
- після компрометації замінити відповідний секрет;
- не передавати секрети в issue, pull request або командний чат.

## 9. Команди перевірки

```bash
npm run lint
npm test -- --runInBand
npm run build
```

Production-запуск без контейнера:

```bash
npm run build
npm run start:prod
```

## 10. Troubleshooting

### Змінна середовища порожня

1. Переконайтеся, що рядок у `.env` не закоментований.
2. Для bcrypt використовуйте `ADMIN_PASSWORD_HASH='$2b$10$...'`.
3. Перевірте `prod` через `podman compose exec`, а не PostgreSQL-контейнер.
4. Пересоздайте контейнер через `--force-recreate`.
5. Не вбудовуйте server secrets у `next.config` або build-time код: вони читаються Node-процесом під час запуску.

### PostgreSQL недоступний

- у контейнері хост має бути `database`, не `localhost`;
- перевірте `podman compose ps` і healthcheck;
- перегляньте `podman compose logs database`;
- звірте `POSTGRES_USER`, `POSTGRES_PASSWORD` і `POSTGRES_DB`.

### Не працює адмін-вхід

- перевірте `ADMIN_EMAIL`;
- переконайтеся, що bcrypt-хеш створений саме для введеного пароля;
- перевірте `SESSION_SECRET_KEY` довжиною щонайменше 32 символи;
- перевірте час на сервері й телефоні для TOTP;
- перегляньте логи `prod`, не розкриваючи секрети.

### Не працює завантаження зображень

Для dev перевірте Cloudinary-змінні. Для prod перевірте MinIO-контейнер, bucket і доступи. Після злиття MinIO-адаптера перевірте відповідні server-side змінні та сценарії завантаження.
