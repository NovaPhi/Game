CREATE DATABASE IF NOT EXISTS Z_ATTACK;
USE Z_ATTACK;

-- Status 1:Active, 2: Banned, 3: Disabled;
--  1: Admin, 2: User
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
    performance_tier VARCHAR(10)  NOT NULL DEFAULT 'poor',
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

CREATE TABLE User_Deck (
    id_user INT NOT NULL,
    id_card INT NOT NULL,
    slot    INT NOT NULL,
    PRIMARY KEY (id_user, slot),
    FOREIGN KEY (id_user) REFERENCES User (id_user) ON DELETE CASCADE,
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
CREATE INDEX idx_cards_rarity ON Cards (rarity);
CREATE INDEX idx_run_status ON Run (status);

DELIMITER $$

-- Actualiza performance_tier en Stats cuando cambia total_xp
CREATE TRIGGER trg_update_tier
BEFORE UPDATE ON Stats
FOR EACH ROW
BEGIN
    SET NEW.performance_tier =
        CASE
            WHEN NEW.total_xp < 300  THEN 'poor'
            WHEN NEW.total_xp < 600  THEN 'average'
            WHEN NEW.total_xp < 1500 THEN 'good'
            ELSE 'elite'
        END;
END$$

-- Al insertar un Run, actualiza total_runs en Stats del usuario
CREATE TRIGGER trg_run_insert_stats
AFTER INSERT ON Run
FOR EACH ROW
BEGIN
    UPDATE Stats
    SET total_runs = total_runs + 1
    WHERE id_user = NEW.id_user;
END$$


-- Cuando un Run termina, actualiza best_score y best_level en Stats si corresponde
CREATE TRIGGER trg_run_end_stats
AFTER UPDATE ON Run
FOR EACH ROW
BEGIN
    IF NEW.status IN ('game_over','abandoned') AND OLD.status = 'active' THEN
        UPDATE Stats
        SET best_score = GREATEST(best_score, NEW.score),
            best_level = GREATEST(best_level, NEW.level)
        WHERE id_user = NEW.id_user;
    END IF;
END$$

-- Previene insertar una carta en User_Deck si el usuario no la tiene en su User_Collection
CREATE TRIGGER trg_deck_validate_collection
BEFORE INSERT ON User_Deck
FOR EACH ROW
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM User_Collection
        WHERE id_user = NEW.id_user AND id_card = NEW.id_card
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La carta no está desbloqueada en la colección del usuario.';
    END IF;
END$$

-- Procedures

-- Registrar fin de partida y actualizar estadísticas
CREATE PROCEDURE sp_end_run(
    IN p_id_run INT,
    IN p_status ENUM('game_over','abandoned'),
    IN p_score INT,
    IN p_level INT,
    IN p_wave INT,
    IN p_xp_gained INT
)
BEGIN
    DECLARE v_id_user INT;
    SELECT id_user INTO v_id_user FROM Run WHERE id_run = p_id_run;
    UPDATE Run
    SET status = p_status,
        score = p_score,
        level = p_level,
        wave = p_wave,
        ended_at = NOW()
    WHERE id_run = p_id_run;
 
    UPDATE Stats
    SET total_xp = total_xp + p_xp_gained,
        playtime = playtime  + TIMESTAMPDIFF(SECOND,
                        (SELECT started_at FROM Run WHERE id_run = p_id_run),
                        NOW())
    WHERE id_user = v_id_user;
END$$

-- Obtener leaderboard global (top N jugadores)
CREATE PROCEDURE sp_leaderboard(IN p_limit INT)
BEGIN
    SELECT u.username,
           s.best_score,
           s.best_level,
           s.total_runs,
           s.performance_tier
    FROM Stats AS s
    JOIN User AS u ON u.id_user = s.id_user
    WHERE u.status = 1
    ORDER BY s.best_score DESC, s.best_level DESC
    LIMIT p_limit;
END$$

-- Registrar conexión de usuario (login)
CREATE PROCEDURE sp_login(
    IN p_id_user INT,
    IN p_ip_address VARCHAR(45),
    IN p_location VARCHAR(100),
    IN p_device_browser_info VARCHAR(255)
)
BEGIN
    INSERT INTO Connection_logs (id_user, ip_address, location, device_browser_info)
    VALUES (p_id_user, p_ip_address, p_location, p_device_browser_info);
    SELECT LAST_INSERT_ID() AS id_log;
END$$

-- Agregar carta al mazo del usuario (con validación)
CREATE PROCEDURE sp_add_card_to_deck(
    IN p_id_user INT,
    IN p_id_card INT,
    IN p_slot INT
)
BEGIN
    IF p_slot NOT BETWEEN 1 AND 8 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El slot debe ser entre 1 y 8.';
    END IF;
    INSERT INTO User_Deck (id_user, id_card, slot)
    VALUES (p_id_user, p_id_card, p_slot)
    ON DUPLICATE KEY UPDATE id_card = p_id_card;
END$$
 
DELIMITER ;

-- Vistas

-- Leaderboard público
CREATE VIEW vw_leaderboard AS
SELECT u.username,
       s.best_score,
       s.best_level,
       s.total_runs,
       s.total_xp,
       s.performance_tier
FROM Stats AS s
JOIN User AS u ON u.id_user = s.id_user
WHERE u.status = 1
ORDER BY s.best_score DESC, s.best_level DESC;

-- Partidas actualmente en curso
CREATE VIEW vw_active_runs AS
SELECT r.id_run,
       u.username,
       h.hero_name,
       r.level,
       r.wave,
       r.score,
       r.started_at
FROM Run AS r
JOIN User AS u ON u.id_user = r.id_user
JOIN Hero AS h ON h.id_hero = r.id_hero
WHERE r.status = 'active';

-- Estadísticas por héroe (cuántas veces se usó, score promedio)
CREATE VIEW vw_hero_stats AS
SELECT h.hero_name,
       COUNT(r.id_run) AS total_runs,
       AVG(r.score) AS avg_score,
       MAX(r.score) AS best_score,
       AVG(r.level) AS avg_level
FROM Hero AS h
LEFT JOIN Run AS r ON r.id_hero = h.id_hero
GROUP BY h.id_hero, h.hero_name;

-- Colección completa de cada usuario con detalles de carta
CREATE VIEW vw_user_collection AS
SELECT u.username,
       c.name AS card_name,
       c.rarity,
       c.card_type,
       uc.unlocked_at
FROM User_Collection AS uc
JOIN User AS u ON u.id_user = uc.id_user
JOIN Cards AS c ON c.id_card = uc.id_card
ORDER BY u.username, c.rarity, c.name;

-- Buffs activos en este momento
CREATE VIEW vw_active_buffs_now AS
SELECT ab.id_buff,
       r.id_user,
       h.hero_name,
       c.name AS buff_card,
       ab.started_at,
       ab.expires_at,
       TIMESTAMPDIFF(SECOND, NOW(), ab.expires_at) AS seconds_remaining
FROM Active_Buffs AS ab
JOIN Run AS r ON r.id_run = ab.id_run
JOIN Hero AS h ON h.id_hero = ab.id_hero
JOIN Cards AS c ON c.id_card = ab.id_card
WHERE ab.expires_at > NOW();

-- Distribución de cartas por rareza (cuántas existen de cada tipo)
CREATE VIEW vw_cards_by_rarity AS
SELECT rarity,
       card_type,
       COUNT(*) AS total_cards
FROM Cards
GROUP BY rarity, card_type
ORDER BY FIELD(rarity,'common','uncommon','rare','legendary'), card_type;

-- Ultima conexión y duración por usuario
CREATE VIEW vw_session_summary AS
SELECT u.username,
       cl.connection_timestamp,
       cl.disconnection_timestamp,
       TIMESTAMPDIFF(MINUTE,cl.connection_timestamp, COALESCE(cl.disconnection_timestamp, NOW())) AS duration_min,
       cl.ip_address,
       cl.location
FROM Connection_logs AS cl
JOIN User AS u ON u.id_user = cl.id_user
ORDER BY cl.connection_timestamp DESC;

-- Cartas más populares en runs
CREATE VIEW vw_popular_run_cards AS
SELECT c.name,
       c.rarity,
       COUNT(rc.id_run_card) AS times_picked
FROM Run_Cards AS rc
JOIN Cards AS c ON c.id_card = rc.id_card
GROUP BY c.id_card, c.name, c.rarity
ORDER BY times_picked DESC;

-- Usuarios sin ninguna partida registrada
CREATE VIEW vw_users_no_runs AS
SELECT u.id_user,
       u.username,
       u.email,
       u.created_at
FROM User AS u
LEFT JOIN Run AS r ON r.id_user = u.id_user
WHERE r.id_run IS NULL;

-- Resumen de rendimiento por usuario
CREATE VIEW vw_user_performance AS
SELECT u.id_user,
       u.username,
       s.total_runs,
       s.best_score,
       s.best_level,
       s.total_xp,
       s.performance_tier,
       ROUND(s.playtime / 3600.0, 2) AS playtime_hours,
       ROUND(s.best_score / NULLIF(s.total_runs, 0), 0) AS avg_score_per_run
FROM User AS u
JOIN Stats AS s ON s.id_user = u.id_user
WHERE u.status = 1;