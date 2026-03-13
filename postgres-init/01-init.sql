-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Site Content table
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    section_key TEXT UNIQUE NOT NULL, 
    content JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documentation for the table and columns
COMMENT ON TABLE site_content IS 'Stores dynamic content sections for the landing page.';
COMMENT ON COLUMN site_content.section_key IS 'Unique identifier for a content section (e.g., "hero", "vacancies").';
COMMENT ON COLUMN site_content.content IS 'JSON payload containing the section content.';
COMMENT ON COLUMN site_content.is_active IS 'Soft-deletion flag; use "WHERE is_active = true" to fetch content.';

-- Create an optimized view to ensure we always fetch only active content
CREATE OR REPLACE VIEW active_site_content AS
SELECT id, section_key, content, updated_at
FROM site_content
WHERE is_active = true;

-- Create Vacancies table
CREATE TABLE IF NOT EXISTS vacancies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  salary_min INTEGER,
  salary_max INTEGER,
  experience_level VARCHAR(100),
  employment_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy users
INSERT INTO users (email, name, password_hash) VALUES
  ('john.doe@example.com', 'John Doe', 'hashed_password_1'),
  ('jane.smith@example.com', 'Jane Smith', 'hashed_password_2'),
  ('bob.wilson@example.com', 'Bob Wilson', 'hashed_password_3');

-- Insert dummy military vacancies
INSERT INTO vacancies (title, description, company_name, location, salary_min, salary_max, experience_level, employment_type, created_by) VALUES
  ('Infantry Officer', 'Seeking qualified officers to lead infantry platoons and support military operations.', 'Department of Defense', 'Fort Benning, GA', 45000, 65000, 'Senior', 'Full-time', 1),
  ('Combat Medic', 'Train to provide emergency medical care and support in field operations.', 'Army Medical Command', 'Fort Sam Houston, TX', 35000, 50000, 'Mid-level', 'Full-time', 2),
  ('Cybersecurity Specialist - Military', 'Protect military networks and infrastructure from cyber threats.', 'Cyber Command', 'Fort Meade, MD', 80000, 120000, 'Senior', 'Full-time', 1),
  ('Military Pilot', 'Operate fighter jets and transport aircraft for defense missions.', 'Air Force Recruitment', 'Joint Base Andrews, MD', 60000, 90000, 'Junior', 'Full-time', 3),
  ('Naval Engineer', 'Design, maintain, and operate advanced naval vessels and systems.', 'Naval Sea Systems Command', 'Washington Navy Yard, DC', 70000, 110000, 'Mid-level', 'Full-time', 2);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_vacancies_created_by ON vacancies(created_by);
CREATE INDEX IF NOT EXISTS idx_vacancies_status ON vacancies(status);
CREATE INDEX IF NOT EXISTS idx_vacancies_company_name ON vacancies(company_name);

