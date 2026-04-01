CREATE DATABASE Z_ATTACK;
USE Z_ATTACK;

-- TABLE: Role

CREATE TABLE Role (
    id_role INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(40) NOT NULL,
    description VARCHAR(100)
);


-- TABLE: Status

CREATE TABLE Status (
    id_status INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(40) NOT NULL,
    description VARCHAR(100)
);


-- TABLE: Rarity

CREATE TABLE Rarity (
    id_rarity INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(40)
);


-- TABLE: Types

CREATE TABLE Types (
    id_types INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(40)
);


-- TABLE: Cards

CREATE TABLE Cards (
    id_card INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(40) NOT NULL,
    cost INT,
    attack INT,
    defense INT,
    effect VARCHAR(100),
    description VARCHAR(100),
    artwork_url VARCHAR(100),
    power_level INT,
    id_rarity INT,
    id_type INT,
    FOREIGN KEY (id_rarity) REFERENCES Rarity(id_rarity),
    FOREIGN KEY (id_type) REFERENCES Types(id_types)
);


-- TABLE: Player_cards

CREATE TABLE Player_cards (
    id_player_cards INT PRIMARY KEY AUTO_INCREMENT,
    unlocked BOOLEAN,
    level INT,
    id_cards INT,
    FOREIGN KEY (id_cards) REFERENCES Cards(id_card)
);


-- TABLE: Hero

CREATE TABLE Hero (
    id_hero INT PRIMARY KEY AUTO_INCREMENT,
    level INT,
    defense INT,
    hp INT,
    attack INT,
    attack_range INT,
    velocity INT
);


-- TABLE: Stats

CREATE TABLE Stats (
    id_stats INT PRIMARY KEY AUTO_INCREMENT,
    playtime INT,
    wins INT,
    loses INT,
    id_player_cards INT,
    id_hero INT,
    FOREIGN KEY (id_player_cards) REFERENCES Player_cards(id_player_cards),
    FOREIGN KEY (id_hero) REFERENCES Hero(id_hero)
);


-- TABLE: User

CREATE TABLE User (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(40) NOT NULL,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(40),
    created_at DATETIME,
    updated_at DATETIME,
    id_role INT,
    id_status INT,
    id_player_cards INT,
    id_stats INT,
    FOREIGN KEY (id_role) REFERENCES Role(id_role),
    FOREIGN KEY (id_status) REFERENCES Status(id_status),
    FOREIGN KEY (id_player_cards) REFERENCES Player_cards(id_player_cards),
    FOREIGN KEY (id_stats) REFERENCES Stats(id_stats)
);