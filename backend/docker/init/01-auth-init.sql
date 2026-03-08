-- ═══════════════════════════════════════════════════
--   FitTech — auth_db initialization & seed data
-- ═══════════════════════════════════════════════════

-- ─── Create table ────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_credentials (
                                                id          VARCHAR(36) PRIMARY KEY,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20) NOT NULL CHECK (role IN ('MEMBRE', 'COACH', 'ADMIN')),
    suspended   BOOLEAN NOT NULL DEFAULT false,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP
    );

-- ─── Seed data ────────────────────────────────────────
-- Passwords are bcrypt hashed:
--   admin123  → $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
--   coach123  → $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.
--   member123 → $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.

INSERT INTO user_credentials (id, email, password, role, suspended) VALUES
-- ─── Admin ───────────────────────────────────────────
(
    'a1b2c3d4-0000-0000-0000-000000000001',
    'admin@gym.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    false
),
-- ─── Coaches ─────────────────────────────────────────
(
    'c0ac11aa-0000-0000-0000-000000000001',
    'karim.mansouri@gym.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'COACH',
    false
),
(
    'c0ac11aa-0000-0000-0000-000000000002',
    'sara.coach@gym.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'COACH',
    false
),
-- ─── Members ─────────────────────────────────────────
(
    'mem00000-0000-0000-0000-000000000001',
    'ahmed.benali@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'MEMBRE',
    false
),
(
    'mem00000-0000-0000-0000-000000000002',
    'fatima.zahra@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'MEMBRE',
    false
),
(
    'mem00000-0000-0000-0000-000000000003',
    'youcef.mansouri@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'MEMBRE',
    false
),
(
    'mem00000-0000-0000-0000-000000000004',
    'suspended.user@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'MEMBRE',
    true   -- ← suspended account for testing
)
    ON CONFLICT (id) DO NOTHING;