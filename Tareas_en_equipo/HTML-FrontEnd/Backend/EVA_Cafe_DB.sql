CREATE DATABASE IF NOT EXISTS EVA_Cafe;
USE EVA_Cafe;

CREATE TABLE Menu_items(
	id_item INT NOT NULL AUTO_INCREMENT,
    item_name VARCHAR(50),
    imageSrc VARCHAR(50),
    base_price DECIMAL(5,2),
    PRIMARY KEY (id_item)
);

CREATE TABLE Days(
	id_day INT NOT NULL AUTO_INCREMENT,
    day_name VARCHAR(20),
    promotion_type VARCHAR(50),
    PRIMARY KEY (id_day)
);

CREATE TABLE Menu_item_day(
	item_id INT NOT NULL,
    day_id INT NOT NULL,
    price DECIMAL(5,2),
    PRIMARY KEY (item_id, day_id),
    FOREIGN KEY (item_id) REFERENCES Menu_items (id_item),
    FOREIGN KEY (day_id) REFERENCES Days (id_day)
);

CREATE TABLE Mangas (
	id_manga INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(50),
    genre VARCHAR(50),
    author VARCHAR(50),
    volumes INT NOT NULL,
    description TEXT,
    price DECIMAL(5,2),
    coverSrc VARCHAR(50),
    PRIMARY KEY (id_manga)
);

-- Menu_items
INSERT INTO Menu_items (item_name, imageSrc, base_price) VALUES
('Shinji''s Americano', '../Assets/shinji.jpg',  35.00),
('Asuka''s Macchiato',  '../Assets/asuka.jpg',   45.00),
('Misato''s Beer',      '../Assets/misato.jpg',  80.00),
('Angels Espresso',     '../Assets/expreso.jpg', 15.00);

-- Days
INSERT INTO Days (day_name, promotion_type) VALUES
('Lunes',    'Descuento'),
('Martes',   '2x1'),
('Miercoles','Combo'),
('Juebebes', 'DE ALCOHOL'),
('Viernes',  'Premium'),
('Sabado',   'Fin de semana'),
('Domingo',  'Fin de semana');

-- Menu_item_day
-- item_id: 1=Americano, 2=Macchiato, 3=Beer, 4=Espresso
-- day_id:  1=Lunes, 2=Martes, 3=Miercoles, 4=Juebebes, 5=Viernes, 6=Sabado, 7=Domingo

-- Lunes
INSERT INTO Menu_item_day VALUES (1, 1, 35.00);
INSERT INTO Menu_item_day VALUES (2, 1, 45.00);
INSERT INTO Menu_item_day VALUES (3, 1, 80.00);
INSERT INTO Menu_item_day VALUES (4, 1, 15.00);

-- Martes
INSERT INTO Menu_item_day VALUES (1, 2, 45.00);
INSERT INTO Menu_item_day VALUES (2, 2, 55.00);
INSERT INTO Menu_item_day VALUES (3, 2, 90.00);
INSERT INTO Menu_item_day VALUES (4, 2, 20.00);

-- Miercoles
INSERT INTO Menu_item_day VALUES (1, 3, NULL);   -- Americano bundled with Macchiato
INSERT INTO Menu_item_day VALUES (2, 3, 80.00);  -- Macchiato+Americano combo price
INSERT INTO Menu_item_day VALUES (3, 3, NULL);   -- Beer bundled with Espresso
INSERT INTO Menu_item_day VALUES (4, 3, 90.00);  -- Espresso+Beer combo price

-- Juebebes
INSERT INTO Menu_item_day VALUES (3, 4, 60.00);

-- Viernes
INSERT INTO Menu_item_day VALUES (1, 5, 50.00);
INSERT INTO Menu_item_day VALUES (2, 5, 65.00);
INSERT INTO Menu_item_day VALUES (3, 5, 100.00);
INSERT INTO Menu_item_day VALUES (4, 5, 30.00);

-- Sabado
INSERT INTO Menu_item_day VALUES (1, 6, 45.00);
INSERT INTO Menu_item_day VALUES (2, 6, 55.00);
INSERT INTO Menu_item_day VALUES (3, 6, 90.00);
INSERT INTO Menu_item_day VALUES (4, 6, 20.00);

-- Domingo
INSERT INTO Menu_item_day VALUES (1, 7, 45.00);
INSERT INTO Menu_item_day VALUES (2, 7, 55.00);
INSERT INTO Menu_item_day VALUES (3, 7, 90.00);
INSERT INTO Menu_item_day VALUES (4, 7, 20.00);

-- Mangas
INSERT INTO Mangas (title, genre, author, volumes, description, price, coverSrc) VALUES
('One Piece',           'Adventure, Fantasy',   'Eiichiro Oda',      108, 'Monkey D. Luffy sets sail to find the legendary One Piece treasure and become King of the Pirates.', 5.00, '../Assets/one_piece.jpg'),
('Attack on Titan',     'Action, Dark Fantasy', 'Hajime Isayama',     34, 'Humanity fights for survival against giant humanoid creatures called Titans behind massive walls.',   5.00, '../Assets/aot.jpg'),
('One Punch Man',       'Action, Comedy',       'ONE, Yusuke Murata', 30, 'Saitama is a hero who can defeat any enemy with a single punch, but struggles to find a worthy challenge.', 5.00, '../Assets/opm.jpg'),
('Demon Slayer',        'Action, Supernatural', 'Koyoharu Gotouge',   23, 'Tanjiro becomes a demon slayer after his family is slaughtered and his sister is turned into a demon.',  5.00, '../Assets/demon_slayer.jpg'),
('Fullmetal Alchemist', 'Adventure, Fantasy',   'Hiromu Arakawa',     27, 'Two brothers search for the Philosopher''s Stone after a failed alchemical ritual costs them dearly.',  5.00, '../Assets/fmab.jpg');