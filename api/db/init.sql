CREATE TABLE IF NOT EXISTS projects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255)  NOT NULL,
  description TEXT          NOT NULL,
  tech_stack  JSON          NOT NULL DEFAULT ('[]'),
  github_url  VARCHAR(500),
  live_url    VARCHAR(500),
  sort_order  INT           NOT NULL DEFAULT 0,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experience (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  company     VARCHAR(255)  NOT NULL,
  role        VARCHAR(255)  NOT NULL,
  period      VARCHAR(100)  NOT NULL,
  description TEXT,
  sort_order  INT           NOT NULL DEFAULT 0
);

-- Seed data — remove or replace before going live
INSERT INTO projects (title, description, tech_stack, github_url, sort_order) VALUES
  (
    'Scure Vault',
    'A standalone CLI tool built in Go for secure end-to-end encrypted .env distribution among team members.',
    '["Go", "AES-256-GCM", "GitHub Actions", "GoReleaser"]',
    'https://github.com/Vbroendum/scure-vault',
    1
  ),
  (
    'Portfolio API',
    'This very site — a Node.js/Express REST API self-hosted on a Proxmox VM behind Traefik.',
    '["Node.js", "Express", "MariaDB", "Docker", "Traefik"]',
    NULL,
    2
  );

INSERT INTO experience (company, role, period, description, sort_order) VALUES
  (
    'Social Vibes',
    'Lead Frontend Developer',
    'Jan 2025 – Present',
    'Led complete rewrite of mobile app from Angular/Ionic to React Native. Built central documentation site with MKDocs.',
    1
  );
