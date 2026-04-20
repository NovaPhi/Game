
--crear tabla de bitacora
--merge rarity to cards
--guardar basado en el xp el nivel de avance de los ussuarios Ej xp300 mal, 600 med , 900 bien
--especificar dato a usar
--keys de optimizacion


CREATE DATABASE IF NOT EXISTS Z_ATTACK;
USE Z_ATTACK;

--Status 1:Active, 2: Banned, 3: Disabled;
--Role 1: Admin, 2: User
CREATE TABLE User (
    id_user INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(40)  NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role SMALLINT NOT NULL,
    status SMALLINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user),
    UNIQUE KEY uq_user_username (username),
    UNIQUE KEY uq_user_email (email)
);

CREATE TABLE Hero (
    id_hero INT NOT NULL AUTO_INCREMENT,
    hero_name VARCHAR(50) NOT NULL,
    description VARCHAR(200), 
    asset VARCHAR(200),
    cardColor VARCHAR(20),
    speedMod DECIMAL(4,2) NOT NULL DEFAULT 1,
    maxHp INT NOT NULL DEFAULT 100,
    dmgMult DECIMAL(4,2) NOT NULL DEFAULT 1, 
    dmgReduction INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id_hero)
);

CREATE TABLE Stats (
    id_user INT NOT NULL,
    total_runs INT NOT NULL DEFAULT 0,
    best_score INT NOT NULL DEFAULT 0,
    best_level INT NOT NULL DEFAULT 0,
    total_xp INT NOT NULL DEFAULT 0,
    playtime INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id_user),
    FOREIGN KEY (id_user) REFERENCES User (id_user) ON DELETE CASCADE
);

CREATE TABLE Cards (
    id_card INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    artwork_url VARCHAR(100),
    rarity ENUM('common','uncommon','rare','legendary') NOT NULL,
    card_type ENUM('powerup','ability','map_change') NOT NULL,
    targeting BOOLEAN,
    is_ability BOOLEAN NOT NULL,
    modifier_value DECIMAL(5,2),
    modifier varchar(50),
    cooldown_sec DECIMAL(5,2),
    buff_value DECIMAL(5,2),
    duration_sec DECIMAL(5,2),
    is_immortal BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id_card)
);

CREATE TABLE Run (
    id_run INT NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    id_hero INT NOT NULL,
    status ENUM('active','game_over','abandoned') NOT NULL DEFAULT 'active',
    level INT NOT NULL DEFAULT 1,
    wave INT NOT NULL DEFAULT 1,
    score INT NOT NULL DEFAULT 0,
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    PRIMARY KEY (id_run),
    FOREIGN KEY (id_user) REFERENCES User (id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_hero) REFERENCES Hero (id_hero)
);

CREATE TABLE User_Collection (
    id_collection INT NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    id_card INT NOT NULL,
    unlocked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_collection),
    UNIQUE  KEY uq_collection (id_user, id_card),
    FOREIGN KEY (id_user) REFERENCES User  (id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_card) REFERENCES Cards (id_card)
);

CREATE TABLE Run_Cards (
    id_run_card INT NOT NULL AUTO_INCREMENT,
    id_run INT NOT NULL,
    id_card INT NOT NULL,
    acquired_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_run_card),
    FOREIGN KEY (id_run)  REFERENCES Run   (id_run),
    FOREIGN KEY (id_card) REFERENCES Cards (id_card)
);

CREATE TABLE Active_Buffs (
    id_buff INT NOT NULL AUTO_INCREMENT,
    id_run INT NOT NULL,
    id_hero INT NOT NULL,
    id_card INT NOT NULL,
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    PRIMARY KEY (id_buff),
    FOREIGN KEY (id_run)  REFERENCES Run   (id_run),
    FOREIGN KEY (id_card) REFERENCES Cards (id_card)
);

CREATE TABLE Connection_logs(
	id_log INT NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    connection_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    disconnection_timestamp TIMESTAMP NULL,
    ip_address VARCHAR(45),
    location VARCHAR(100),
    device_browser_info VARCHAR(255),
    PRIMARY KEY (id_log),
    FOREIGN KEY (id_user) REFERENCES User (id_user) ON DELETE CASCADE  
);

CREATE INDEX idx_run_user ON Run (id_user);
CREATE INDEX idx_run_active ON Run (id_user, ended_at);
CREATE INDEX idx_collection_user ON User_Collection (id_user);
CREATE INDEX idx_run_cards_run ON Run_Cards (id_run);
CREATE INDEX idx_active_buffs_run ON Active_Buffs (id_run);
CREATE INDEX idx_active_buffs_exp ON Active_Buffs (expires_at);
CREATE INDEX idx_stats_leaderboard ON Stats (best_score DESC, best_level DESC);
CREATE INDEX idx_user_connection_log ON Connection_logs (id_user);
CREATE INDEX idx_connection_time ON Connection_logs (connection_timestamp);

CREATE TRIGGER trg_update_tier
BEFORE UPDATE ON Stats
FOR EACH ROW
SET NEW.performance_tier =
  CASE 
    WHEN NEW.total_xp < 300 THEN 'poor'
    WHEN NEW.total_xp < 600 THEN 'average'
    ELSE 'good'
  END; 

--INFORMACION TEMPORAL

--Merge Rol & User

INSERT INTO User (username, password, email, role, status) VALUES
    ('shadowbyte',  '$2b$10$abc123hashedpassword1', 'shadow@zattack.io',  2, 1),
    ('ironclad',    '$2b$10$abc123hashedpassword2', 'iron@zattack.io',    2, 1),
    ('voidrunner',  '$2b$10$abc123hashedpassword3', 'void@zattack.io',    2, 1),
    ('adminuser',   '$2b$10$abc123hashedpassword4', 'admin@zattack.io',   1, 1),
    ('ghostpulse',  '$2b$10$abc123hashedpassword5', 'ghost@zattack.io',   2, 2);


INSERT INTO Hero (hero_name, description, asset, cardColor, speedMod, maxHp, dmgMult, dmgReduction) VALUES
    ('Warrior','Tough frontliner. High HP and damage, but slow on their feet',  NULL, '#c55', 0.8, 180, 1.5, 2),
    ('Scout', 'Fast and fragile. Low HP but moves like a bullet — hard to hit',  NULL, '#2a2', 1.6, 60, 0.7, 0),
    ('Tank', 'Resistence to the top but moves really slow',  NULL, '#b70', 0.5, 180, 0.8, 2);

INSERT INTO Stats (id_user, total_runs, best_score, best_level, playtime) VALUES
    (1, 23, 8400,  4, 72400),
    (2, 20, 2800,  2, 43200),
    (3, 38, 14200, 6, 98100),
    (4, 0,  0,     0, 0),
    (5, 12, 3100,  2, 21600);


INSERT INTO Cards (name, description, artwork_url, rarity, card_type, targeting, is_ability, modifier_value, cooldown_sec, buff_value, duration_sec, is_immortal) VALUES
('Vital Surge', '+25 max HP and full heal', NULL, 'common', 'powerup', FALSE, 0, 25.00, NULL, NULL, NULL, FALSE),
('Swift Feet', '+15% movement speed', NULL, 'common', 'powerup', FALSE, 0, 0.15, NULL, NULL, NULL, FALSE),
('Iron Skin', '+10 flat damage reduction', NULL, 'common', 'powerup', FALSE, 0, 10.00, NULL, NULL, NULL, FALSE),
('Demolish Outpost', 'Click an outpost to destroy it', NULL, 'uncommon', 'map_change', TRUE, 1, NULL, NULL, NULL, NULL, FALSE);

INSERT INTO Run (id_user, id_hero, status, level, wave, score, started_at, ended_at) VALUES
    (1, 1, 'game_over', 4,  12, 8400,  '2024-11-01 10:00:00', '2024-11-01 10:42:00'),
    (1, 1, 'game_over', 2,  5,  2100,  '2024-11-02 14:00:00', '2024-11-02 14:18:00'),
    (2, 2, 'game_over', 1,  3,  900,   '2024-11-01 18:00:00', '2024-11-01 18:10:00'),
    (3, 3, 'game_over', 6,  15, 14200, '2024-11-03 09:00:00', '2024-11-03 10:05:00'),
    (3, 3, 'active',    1,  2,  300,   '2024-11-04 11:00:00', NULL);

INSERT INTO User_Collection (id_user, id_card, unlocked_at) VALUES
    (1, 1,  '2024-10-01 00:00:00'),
    (1, 2,  '2024-10-05 00:00:00'),
    (1, 9,  '2024-10-10 00:00:00'),
    (2, 1,  '2024-10-02 00:00:00'),
    (2, 5,  '2024-10-08 00:00:00'),
    (3, 1,  '2024-09-15 00:00:00'),
    (3, 2,  '2024-09-20 00:00:00'),
    (3, 4,  '2024-09-25 00:00:00'),
    (3, 8,  '2024-10-01 00:00:00'),
    (3, 10, '2024-10-15 00:00:00'),
    (3, 12, '2024-10-20 00:00:00');

INSERT INTO Run_Cards (id_run, id_card, acquired_at) VALUES
    (1, 2,  '2024-11-01 10:05:00'),
    (1, 5,  '2024-11-01 10:15:00'),
    (1, 9,  '2024-11-01 10:30:00'),
    (2, 1,  '2024-11-02 14:03:00'),
    (2, 3,  '2024-11-02 14:10:00'),
    (3, 5,  '2024-11-01 18:02:00'),
    (4, 2,  '2024-11-03 09:05:00'),
    (4, 4,  '2024-11-03 09:20:00'),
    (4, 8,  '2024-11-03 09:40:00'),
    (4, 12, '2024-11-03 09:55:00'),
    (5, 1,  '2024-11-04 11:02:00');

INSERT INTO Active_Buffs (id_run, id_hero, id_card, started_at, expires_at) VALUES
    (5, 3, 9,  '2024-11-04 11:10:00', '2024-11-04 11:10:05'),
    (5, 3, 11, '2024-11-04 11:12:00', '2024-11-04 11:12:06');



DROP DATABASE IF EXISTS Z_ATTACK

CREATE TABLE User_Deck (
    id_user INT NOT NULL,
    id_card INT NOT NULL,
    slot    INT NOT NULL,
    PRIMARY KEY (id_user, slot),
    FOREIGN KEY (id_user) REFERENCES User (id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_card) REFERENCES Cards (id_card)
);


INSERT INTO User_Collection (id_user, id_card)
SELECT 4, id_card FROM Cards;

INSERT INTO Cards (name, description, rarity, card_type, targeting, is_ability, modifier_value, modifier, cooldown_sec, buff_value, duration_sec, is_immortal) VALUES
-- COMMON POWERUPS
('Iron Skin',        '+2 flat damage reduction',                    'common',   'powerup',    FALSE, FALSE, 2.00,  'dmgReduction', NULL, NULL, NULL, FALSE),
('Quick Feet',       '+0.1 movement speed',                         'common',   'powerup',    FALSE, FALSE, 0.10,  'speedMod',     NULL, NULL, NULL, FALSE),
('Adrenaline',       'Reduces attack cooldown by 3 frames',         'common',   'powerup',    FALSE, FALSE, 3.00,  'attackCooldown',NULL, NULL, NULL, FALSE),
('Field Medic',      '+15 max HP',                                  'common',   'powerup',    FALSE, FALSE, 15.00, 'maxHp',        NULL, NULL, NULL, FALSE),
('Steady Hands',     '+0.1 melee damage multiplier',                'common',   'powerup',    FALSE, FALSE, 0.10,  'dmgMult',      NULL, NULL, NULL, FALSE),
('Reinforced Boots', '+0.15 movement speed',                        'common',   'powerup',    FALSE, FALSE, 0.15,  'speedMod',     NULL, NULL, NULL, FALSE),
('Bandage',          '+20 max HP',                                  'common',   'powerup',    FALSE, FALSE, 20.00, 'maxHp',        NULL, NULL, NULL, FALSE),
('Sharpened Blade',  '+0.2 melee damage multiplier',                'common',   'powerup',    FALSE, FALSE, 0.20,  'dmgMult',      NULL, NULL, NULL, FALSE),
('Padding',          '+1 flat damage reduction',                    'common',   'powerup',    FALSE, FALSE, 1.00,  'dmgReduction', NULL, NULL, NULL, FALSE),
('Stimpack',         '+25 max HP',                                  'common',   'powerup',    FALSE, FALSE, 25.00, 'maxHp',        NULL, NULL, NULL, FALSE),
-- UNCOMMON POWERUPS
('Battle Hardened',  '+20 max HP and +3 damage reduction',         'uncommon', 'powerup',    FALSE, FALSE, 20.00, 'maxHp',        NULL, 3.00, NULL, FALSE),
('Overclock',        '+0.25 movement speed',                        'uncommon', 'powerup',    FALSE, FALSE, 0.25,  'speedMod',     NULL, NULL, NULL, FALSE),
('Combat Veteran',   '+0.3 melee damage multiplier',                'uncommon', 'powerup',    FALSE, FALSE, 0.30,  'dmgMult',      NULL, NULL, NULL, FALSE),
('Bulwark',          '+4 flat damage reduction',                    'uncommon', 'powerup',    FALSE, FALSE, 4.00,  'dmgReduction', NULL, NULL, NULL, FALSE),
('Surge',            'Reduces attack cooldown by 6 frames',         'uncommon', 'powerup',    FALSE, FALSE, 6.00,  'attackCooldown',NULL, NULL, NULL, FALSE),
-- UNCOMMON ABILITIES
('Orbital Strike',   'Instantly destroys one outpost of your choice','uncommon','ability',    TRUE,  TRUE,  NULL,  'destroy_outpost',NULL,NULL, NULL, FALSE),
('Supply Drop',      'Restores 30 HP instantly',                    'uncommon', 'ability',    FALSE, TRUE,  30.00, 'healHp',       NULL, NULL, NULL, FALSE),
('Smoke Screen',     'Halts all bullets on screen for 3 seconds',   'uncommon', 'ability',    FALSE, TRUE,  NULL,  'clearBullets', NULL, NULL, 3.00, FALSE),
-- RARE POWERUPS
('Titan Core',       '+50 max HP and +5 damage reduction',          'rare',     'powerup',    FALSE, FALSE, 50.00, 'maxHp',        NULL, 5.00, NULL, FALSE),
('Berserker',        '+0.5 melee damage multiplier',                'rare',     'powerup',    FALSE, FALSE, 0.50,  'dmgMult',      NULL, NULL, NULL, FALSE),
('Phase Stride',     '+0.4 movement speed',                         'rare',     'powerup',    FALSE, FALSE, 0.40,  'speedMod',     NULL, NULL, NULL, FALSE),
('Fortified',        '+6 flat damage reduction',                    'rare',     'powerup',    FALSE, FALSE, 6.00,  'dmgReduction', NULL, NULL, NULL, FALSE),
('Lightning Reflex', 'Reduces attack cooldown by 10 frames',        'rare',     'powerup',    FALSE, FALSE, 10.00, 'attackCooldown',NULL,NULL, NULL, FALSE),
-- RARE ABILITIES
('EMP Blast',        'Destroys 2 random outposts instantly',        'rare',     'ability',    FALSE, TRUE,  2.00,  'destroy_random',NULL,NULL, NULL, FALSE),
('Full Restore',     'Restores HP to full',                         'rare',     'ability',    FALSE, TRUE,  NULL,  'healFull',     NULL, NULL, NULL, FALSE),
-- MAP CHANGE
('Minefield',        'Spawns 3 extra outposts but doubles XP gain', 'rare',     'map_change', FALSE, FALSE, 3.00,  'spawnOutposts',NULL, NULL, NULL, FALSE),
('Fortify',          'Restores all wall segments to full HP',       'rare',     'map_change', FALSE, FALSE, NULL,  'restoreWalls', NULL, NULL, NULL, FALSE),
-- LEGENDARY
('Immortal Coil',    'You cannot die for 5 seconds',                'legendary','ability',    FALSE, TRUE,  NULL,  'isImmortal',   NULL, NULL, 5.00, TRUE),
('God Mode',         '+1.0 dmg, +0.5 speed, +10 DR, +100 HP',      'legendary','powerup',    FALSE, FALSE, 1.00,  'all',          NULL, NULL, NULL, FALSE),
('Nuke',             'Instantly destroys all outposts on the map',  'legendary','ability',    FALSE, TRUE,  NULL,  'destroy_all',  NULL, NULL, NULL, FALSE);

SELECT id_card, name, modifier, modifier_value, buff_value FROM Cards;

SELECT c.id_card, c.name, c.rarity, c.card_type, c.modifier, c.modifier_value
FROM User_Collection uc
JOIN Cards c ON uc.id_card = c.id_card
WHERE uc.id_user = 13;


SELECT id_card, name FROM Cards WHERE id_card IN (1, 2, 3);

SELECT id_card, name FROM Cards ORDER BY id_card LIMIT 5;