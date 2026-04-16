
--crear tabla de bitacora
--merge rarity to cards
--guardar basado en el xp el nivel de avance de los ussuarios Ej xp300 mal, 600 med , 900 bien
--especificar dato a usar
--keys de optimizacion


CREATE DATABASE IF NOT EXISTS Z_ATTACK;
USE Z_ATTACK;


CREATE TABLE Rarity (
    id_rarity INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(40) NOT NULL,
    PRIMARY KEY (id_rarity)
);


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
    id_user INT NOT NULL,
    level INT NOT NULL DEFAULT 1,
    hp INT NOT NULL DEFAULT 100,
    attack INT NOT NULL DEFAULT 10,
    defense INT NOT NULL DEFAULT 10,
    attack_range INT NOT NULL DEFAULT 1,
    velocity INT NOT NULL DEFAULT 5,
    PRIMARY KEY (id_hero),
    FOREIGN KEY (id_user) REFERENCES User (id_user)
);

CREATE TABLE Stats (
    id_stats INT NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    total_runs INT NOT NULL DEFAULT 0,
    best_score INT NOT NULL DEFAULT 0,
    best_level INT NOT NULL DEFAULT 0,
    playtime INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id_stats),
    UNIQUE KEY uq_stats_user (id_user),
    FOREIGN KEY (id_user) REFERENCES User (id_user)
);

CREATE TABLE Cards (
    id_card INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(40) NOT NULL,
    description VARCHAR(200),
    artwork_url VARCHAR(100),
    id_rarity INT NOT NULL,
    card_type ENUM('powerup','ability','temporal_buff') NOT NULL,
    target_stat ENUM('hp','attack','defense','velocity','attack_range'),
    modifier_value DECIMAL(5,2),
    modifier_type ENUM('percent','flat'),
    combat_range ENUM('ranged','melee','both'),
    combat_role ENUM('offensive','defensive','heal'),
    cooldown_sec DECIMAL(5,2),
    buff_target ENUM('hp','attack','defense','velocity','attack_range','attack_speed','damage_reduction'),
    buff_value DECIMAL(5,2),
    duration_sec DECIMAL(5,2),
    trigger_type ENUM('on_kill','on_hit','on_damage_taken','on_low_hp','manual'),
    is_immortal BOOLEAN NOT NULL DEFAULT FALSE,
    unlimited_range BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id_card),
    FOREIGN KEY (id_rarity) REFERENCES Rarity (id_rarity)
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
    FOREIGN KEY (id_user) REFERENCES User (id_user),
    FOREIGN KEY (id_hero) REFERENCES Hero (id_hero)
);

CREATE TABLE User_Collection (
    id_collection INT NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    id_card INT NOT NULL,
    unlocked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_collection),
    UNIQUE  KEY uq_collection (id_user, id_card),
    FOREIGN KEY (id_user) REFERENCES User  (id_user),
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
    FOREIGN KEY (id_hero) REFERENCES Hero  (id_hero),
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
    FOREIGN KEY (id_user) REFERENCES User (id_user)
);

CREATE INDEX idx_hero_user ON Hero (id_user);
CREATE INDEX idx_run_user ON Run (id_user);
CREATE INDEX idx_run_active ON Run (id_user, ended_at);
CREATE INDEX idx_cards_type ON Cards (card_type);
CREATE INDEX idx_cards_rarity ON Cards (id_rarity);
CREATE INDEX idx_collection_user ON User_Collection (id_user);
CREATE INDEX idx_run_cards_run ON Run_Cards (id_run);
CREATE INDEX idx_active_buffs_run ON Active_Buffs (id_run);
CREATE INDEX idx_active_buffs_exp ON Active_Buffs (expires_at);
CREATE INDEX idx_stats_leaderboard ON Stats (best_score DESC, best_level DESC);
CREATE INDEX idx_user_connection_log ON Connection_logs (id_user);


--INFORMACION TEMPORAL

--Merge Rol & User

INSERT INTO Role (name) VALUES
    ('admin'),
    ('player'),
    ('guest');

INSERT INTO Status (name) VALUES
    ('active'),
    ('banned'),
    ('inactive');

INSERT INTO Rarity (name) VALUES
    ('common'),
    ('uncommon'),
    ('rare'),
    ('legendary');

INSERT INTO User (username, password, email, role, status) VALUES
    ('shadowbyte',  '$2b$10$abc123hashedpassword1', 'shadow@zattack.io',  2, 1),
    ('ironclad',    '$2b$10$abc123hashedpassword2', 'iron@zattack.io',    2, 1),
    ('voidrunner',  '$2b$10$abc123hashedpassword3', 'void@zattack.io',    2, 1),
    ('adminuser',   '$2b$10$abc123hashedpassword4', 'admin@zattack.io',   1, 1),
    ('ghostpulse',  '$2b$10$abc123hashedpassword5', 'ghost@zattack.io',   2, 2);

INSERT INTO Hero (id_user, level, hp, attack, defense, attack_range, velocity) VALUES
    (1, 5,  180, 22, 15, 2, 7),
    (2, 3,  130, 15, 20, 1, 5),
    (3, 8,  220, 30, 12, 3, 9),
    (4, 1,  100, 10, 10, 1, 5),
    (5, 2,  110, 12, 11, 1, 6);

INSERT INTO Stats (id_user, total_runs, best_score, best_level, playtime) VALUES
    (1, 23, 8400,  4, 72400),
    (2, 20, 2800,  2, 43200),
    (3, 38, 14200, 6, 98100),
    (4, 0,  0,     0, 0),
    (5, 12, 3100,  2, 21600);

INSERT INTO Cards (name, description, artwork_url, id_rarity, card_type, target_stat, modifier_value, modifier_type, combat_range, combat_role, cooldown_sec, buff_target, buff_value, duration_sec, trigger_type, is_immortal, unlimited_range) VALUES
    ('Iron Skin',      'Boosts defense permanently',          '/art/iron_skin.png',      1, 'powerup',       'defense',      10.00, 'flat',    NULL,     NULL,        NULL,  NULL,            NULL,  NULL,  NULL,           FALSE, FALSE),
    ('Berserker',      'Boosts attack permanently',           '/art/berserker.png',      2, 'powerup',       'attack',       15.00, 'percent', NULL,     NULL,        NULL,  NULL,            NULL,  NULL,  NULL,           FALSE, FALSE),
    ('Swift Feet',     'Increases velocity permanently',      '/art/swift_feet.png',     1, 'powerup',       'velocity',     2.00,  'flat',    NULL,     NULL,        NULL,  NULL,            NULL,  NULL,  NULL,           FALSE, FALSE),
    ('Vital Surge',    'Increases max HP permanently',        '/art/vital_surge.png',    2, 'powerup',       'hp',           25.00, 'flat',    NULL,     NULL,        NULL,  NULL,            NULL,  NULL,  NULL,           FALSE, FALSE),
    ('Long Shot',      'Ranged offensive strike',             '/art/long_shot.png',      2, 'ability',       NULL,           NULL,  NULL,      'ranged', 'offensive', 3.00,  NULL,            NULL,  NULL,  NULL,           FALSE, FALSE),
    ('Shield Bash',    'Melee defensive counter',             '/art/shield_bash.png',    2, 'ability',       NULL,           NULL,  NULL,      'melee',  'defensive', 5.00,  NULL,            NULL,  NULL,  NULL,           FALSE, FALSE),
    ('Mend',           'Melee heal on self',                  '/art/mend.png',           1, 'ability',       NULL,           NULL,  NULL,      'melee',  'heal',      8.00,  NULL,            NULL,  NULL,  NULL,           FALSE, FALSE),
    ('Arc Blast',      'Ranged offensive with short CD',      '/art/arc_blast.png',      3, 'ability',       NULL,           NULL,  NULL,      'ranged', 'offensive', 2.00,  NULL,            NULL,  NULL,  NULL,           FALSE, FALSE),
    ('Ghost Form',     'Immortal for 5 seconds on kill',      '/art/ghost_form.png',     4, 'temporal_buff', NULL,           NULL,  NULL,      NULL,     NULL,        NULL,  'hp',            0.00,  5.00,  'on_kill',      TRUE,  FALSE),
    ('Sniper Mode',    'Unlimited range for 8 seconds',       '/art/sniper_mode.png',    3, 'temporal_buff', NULL,           NULL,  NULL,      NULL,     NULL,        NULL,  'attack_range',  0.00,  8.00,  'manual',       FALSE, TRUE),
    ('Adrenaline',     '+50% attack speed for 6s on hit',     '/art/adrenaline.png',     3, 'temporal_buff', NULL,           NULL,  NULL,      NULL,     NULL,        NULL,  'attack_speed',  50.00, 6.00,  'on_hit',       FALSE, FALSE),
    ('Last Stand',     '+40% damage reduction on low HP',     '/art/last_stand.png',     4, 'temporal_buff', NULL,           NULL,  NULL,      NULL,     NULL,        NULL,  'damage_reduction', 40.00, 10.00, 'on_low_hp',  FALSE, FALSE);

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



