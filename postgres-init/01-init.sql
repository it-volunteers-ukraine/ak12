CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE vacancy_type AS ENUM ('frontline', 'backline');

CREATE TABLE IF NOT EXISTS language (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(2) NOT NULL UNIQUE
);

COMMENT ON TABLE language IS 'Supported content languages.';
COMMENT ON COLUMN language.code IS 'Language code, for example uk or en.';

CREATE TABLE IF NOT EXISTS site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT NOT NULL,
    content JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    language_id UUID NOT NULL REFERENCES language(id) ON DELETE RESTRICT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_site_content_section_language UNIQUE (section_key, language_id)
);

COMMENT ON TABLE site_content IS 'Stores dynamic localized content sections for the landing page.';
COMMENT ON COLUMN site_content.section_key IS 'Unique identifier of a content section within a language.';
COMMENT ON COLUMN site_content.content IS 'JSON payload containing the localized section content.';
COMMENT ON COLUMN site_content.is_active IS 'Soft-deletion flag; use WHERE is_active = true to fetch content.';
COMMENT ON COLUMN site_content.language_id IS 'Reference to the content language.';

CREATE OR REPLACE VIEW active_site_content AS
SELECT id, section_key, content, language_id, updated_at
FROM site_content
WHERE is_active = true;

CREATE TABLE IF NOT EXISTS vacancy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    position VARCHAR(50) NOT NULL,
    slug VARCHAR(100),
    description VARCHAR(255) NOT NULL,
    type vacancy_type NOT NULL,
    salary NUMERIC(10,2),
    image_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    language_id UUID NOT NULL REFERENCES language(id) ON DELETE RESTRICT,
    CONSTRAINT uq_vacancy_slug_language UNIQUE (slug, language_id)
);

COMMENT ON TABLE vacancy IS 'Military vacancies displayed on the site.';
COMMENT ON COLUMN vacancy.position IS 'Vacancy position title.';
COMMENT ON COLUMN vacancy.slug IS 'Optional URL-friendly identifier unique within a language.';
COMMENT ON COLUMN vacancy.description IS 'Short vacancy description.';
COMMENT ON COLUMN vacancy.type IS 'Vacancy type: frontline or backline.';
COMMENT ON COLUMN vacancy.salary IS 'Salary value if published. Clarify whether it is stored as a full amount or in thousands.';
COMMENT ON COLUMN vacancy.image_url IS 'Image URL for vacancy presentation.';
COMMENT ON COLUMN vacancy.is_active IS 'Controls whether the vacancy is visible on the site.';
COMMENT ON COLUMN vacancy.sort_order IS 'Manual display order. Lower values appear first.';
COMMENT ON COLUMN vacancy.language_id IS 'Reference to the content language.';

CREATE TABLE IF NOT EXISTS subdivision (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(100),
    description VARCHAR(255) NOT NULL,
    site_url VARCHAR(255),
    image_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    language_id UUID NOT NULL REFERENCES language(id) ON DELETE RESTRICT,
    CONSTRAINT uq_subdivision_slug_language UNIQUE (slug, language_id)
);

COMMENT ON TABLE subdivision IS 'Military subdivisions displayed on the site.';
COMMENT ON COLUMN subdivision.name IS 'Subdivision name.';
COMMENT ON COLUMN subdivision.slug IS 'Optional URL-friendly identifier unique within a language.';
COMMENT ON COLUMN subdivision.description IS 'Short subdivision description.';
COMMENT ON COLUMN subdivision.site_url IS 'Optional subdivision website URL.';
COMMENT ON COLUMN subdivision.image_url IS 'Image URL for subdivision presentation.';
COMMENT ON COLUMN subdivision.is_active IS 'Controls whether the subdivision is visible on the site.';
COMMENT ON COLUMN subdivision.sort_order IS 'Manual display order. Lower values appear first.';
COMMENT ON COLUMN subdivision.language_id IS 'Reference to the content language.';

CREATE INDEX IF NOT EXISTS idx_site_content_language_id ON site_content(language_id);
CREATE INDEX IF NOT EXISTS idx_site_content_section_key ON site_content(section_key);
CREATE INDEX IF NOT EXISTS idx_vacancy_language_id ON vacancy(language_id);
CREATE INDEX IF NOT EXISTS idx_vacancy_type ON vacancy(type);
CREATE INDEX IF NOT EXISTS idx_vacancy_is_active_sort_order ON vacancy(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_vacancy_active_type_order ON vacancy(is_active, type, sort_order);
CREATE INDEX IF NOT EXISTS idx_subdivision_language_id ON subdivision(language_id);
CREATE INDEX IF NOT EXISTS idx_subdivision_is_active_sort_order ON subdivision(is_active, sort_order);

INSERT INTO language (code)
VALUES ('uk'), ('en')
ON CONFLICT (code) DO NOTHING;
