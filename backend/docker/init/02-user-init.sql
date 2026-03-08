-- ═══════════════════════════════════════════════════
--   FitTech — user_db initialization & seed data
-- ═══════════════════════════════════════════════════

-- ─── Create tables ───────────────────────────────────

CREATE TABLE IF NOT EXISTS admins (
                                      id          VARCHAR(36) PRIMARY KEY,
    auth_id     VARCHAR(36) NOT NULL,
    full_name   VARCHAR(255) NOT NULL,
    phone       VARCHAR(20)
    );

CREATE TABLE IF NOT EXISTS coaches (
                                       id          VARCHAR(36) PRIMARY KEY,
    auth_id     VARCHAR(36) NOT NULL,
    full_name   VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    specialties VARCHAR(255),
    biography   TEXT
    );

CREATE TABLE IF NOT EXISTS members (
                                       id                   VARCHAR(36) PRIMARY KEY,
    auth_id              VARCHAR(36) NOT NULL,
    full_name            VARCHAR(255) NOT NULL,
    phone                VARCHAR(20),
    birth_date           VARCHAR(20),
    gender               VARCHAR(10),
    objective            VARCHAR(255),
    medical_restrictions VARCHAR(255),
    nfc_card_id          VARCHAR(100) UNIQUE,
    nfc_active           BOOLEAN NOT NULL DEFAULT false,
    suspended            BOOLEAN NOT NULL DEFAULT false
    );

CREATE TABLE IF NOT EXISTS free_trials (
                                           id          VARCHAR(36) PRIMARY KEY,
    full_name   VARCHAR(255) NOT NULL,
    address     VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL,
    used        BOOLEAN NOT NULL DEFAULT false
    );

-- ─── Seed: Admins ─────────────────────────────────────
INSERT INTO admins (id, auth_id, full_name, phone) VALUES
    (
        'adm00000-0000-0000-0000-000000000001',
        'a1b2c3d4-0000-0000-0000-000000000001',
        'System Admin',
        '0555000000'
    )
    ON CONFLICT (id) DO NOTHING;

-- ─── Seed: Coaches ────────────────────────────────────
INSERT INTO coaches (id, auth_id, full_name, phone, specialties, biography) VALUES
                                                                                (
                                                                                    'coa00000-0000-0000-0000-000000000001',
                                                                                    'c0ac11aa-0000-0000-0000-000000000001',
                                                                                    'Karim Mansouri',
                                                                                    '0661111111',
                                                                                    'Cardio, Strength Training',
                                                                                    '10 years of experience in fitness coaching. Specialized in weight loss and muscle building programs.'
                                                                                ),
                                                                                (
                                                                                    'coa00000-0000-0000-0000-000000000002',
                                                                                    'c0ac11aa-0000-0000-0000-000000000002',
                                                                                    'Sara Benali',
                                                                                    '0662222222',
                                                                                    'Yoga, Pilates, Flexibility',
                                                                                    'Certified yoga instructor with 7 years experience. Passionate about mind-body wellness.'
                                                                                )
    ON CONFLICT (id) DO NOTHING;

-- ─── Seed: Members ────────────────────────────────────
INSERT INTO members (id, auth_id, full_name, phone, birth_date, gender, objective, medical_restrictions, nfc_card_id, nfc_active, suspended) VALUES
                                                                                                                                                 (
                                                                                                                                                     'mem00000-0000-0000-0000-000000000001',
                                                                                                                                                     'mem00000-0000-0000-0000-000000000001',
                                                                                                                                                     'Ahmed Benali',
                                                                                                                                                     '0555111111',
                                                                                                                                                     '1995-03-15',
                                                                                                                                                     'MALE',
                                                                                                                                                     'Lose weight',
                                                                                                                                                     'None',
                                                                                                                                                     'NFC-001',
                                                                                                                                                     true,
                                                                                                                                                     false
                                                                                                                                                 ),
                                                                                                                                                 (
                                                                                                                                                     'mem00000-0000-0000-0000-000000000002',
                                                                                                                                                     'mem00000-0000-0000-0000-000000000002',
                                                                                                                                                     'Fatima Zahra',
                                                                                                                                                     '0555222222',
                                                                                                                                                     '1998-07-22',
                                                                                                                                                     'FEMALE',
                                                                                                                                                     'Stay fit and healthy',
                                                                                                                                                     'Knee injury - avoid high impact',
                                                                                                                                                     'NFC-002',
                                                                                                                                                     true,
                                                                                                                                                     false
                                                                                                                                                 ),
                                                                                                                                                 (
                                                                                                                                                     'mem00000-0000-0000-0000-000000000003',
                                                                                                                                                     'mem00000-0000-0000-0000-000000000003',
                                                                                                                                                     'Youcef Mansouri',
                                                                                                                                                     '0555333333',
                                                                                                                                                     '2000-01-10',
                                                                                                                                                     'MALE',
                                                                                                                                                     'Build muscle',
                                                                                                                                                     'None',
                                                                                                                                                     NULL,
                                                                                                                                                     false,
                                                                                                                                                     false   -- ← no NFC card yet
                                                                                                                                                 ),
                                                                                                                                                 (
                                                                                                                                                     'mem00000-0000-0000-0000-000000000004',
                                                                                                                                                     'mem00000-0000-0000-0000-000000000004',
                                                                                                                                                     'Suspended User',
                                                                                                                                                     '0555444444',
                                                                                                                                                     '1990-05-05',
                                                                                                                                                     'MALE',
                                                                                                                                                     'Test suspended account',
                                                                                                                                                     'None',
                                                                                                                                                     'NFC-004',
                                                                                                                                                     false,
                                                                                                                                                     true    -- ← suspended for testing
                                                                                                                                                 )
    ON CONFLICT (id) DO NOTHING;

-- ─── Seed: Free Trials ────────────────────────────────
INSERT INTO free_trials (id, full_name, address, created_at, used) VALUES
                                                                       (
                                                                           'tri00000-0000-0000-0000-000000000001',
                                                                           'Riad Khelifi',
                                                                           '12 Rue Didouche Mourad, Annaba',
                                                                           NOW(),
                                                                           false
                                                                       ),
                                                                       (
                                                                           'tri00000-0000-0000-0000-000000000002',
                                                                           'Nadia Bouzid',
                                                                           '45 Avenue de l Independance, Annaba',
                                                                           NOW(),
                                                                           true    -- ← already used trial
                                                                       )
    ON CONFLICT (id) DO NOTHING;