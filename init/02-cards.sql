USE Z_ATTACK;

INSERT INTO Cards (name, description, rarity, card_type, targeting, is_ability, modifier_value, modifier, cooldown_sec, buff_value, duration_sec, is_immortal) VALUES
('Iron Skin',        '+2 flat damage reduction',                     'common',    'powerup', FALSE, FALSE, 2.00,  'dmgReduction',   NULL, NULL, NULL, FALSE),
('Quick Feet',       '+0.1 movement speed',                          'common',    'powerup', FALSE, FALSE, 0.10,  'speedMod',       NULL, NULL, NULL, FALSE),
('Adrenaline',       'Reduces attack cooldown by 3 frames',          'common',    'powerup', FALSE, FALSE, 3.00,  'attackCooldown', NULL, NULL, NULL, FALSE),
('Field Medic',      '+15 max HP',                                   'common',    'powerup', FALSE, FALSE, 15.00, 'maxHp',          NULL, NULL, NULL, FALSE),
('Steady Hands',     '+0.1 melee damage multiplier',                 'common',    'powerup', FALSE, FALSE, 0.10,  'dmgMult',        NULL, NULL, NULL, FALSE),
('Reinforced Boots', '+0.15 movement speed',                         'common',    'powerup', FALSE, FALSE, 0.15,  'speedMod',       NULL, NULL, NULL, FALSE),
('Bandage',          '+20 max HP',                                   'common',    'powerup', FALSE, FALSE, 20.00, 'maxHp',          NULL, NULL, NULL, FALSE),
('Sharpened Blade',  '+0.2 melee damage multiplier',                 'common',    'powerup', FALSE, FALSE, 0.20,  'dmgMult',        NULL, NULL, NULL, FALSE),
('Padding',          '+1 flat damage reduction',                     'common',    'powerup', FALSE, FALSE, 1.00,  'dmgReduction',   NULL, NULL, NULL, FALSE),
('Stimpack',         '+25 max HP',                                   'common',    'powerup', FALSE, FALSE, 25.00, 'maxHp',          NULL, NULL, NULL, FALSE),
('Battle Hardened',  '+20 max HP and +3 damage reduction',           'uncommon',  'powerup', FALSE, FALSE, 20.00, 'maxHp',          NULL, 3.00, NULL, FALSE),
('Overclock',        '+0.25 movement speed',                         'uncommon',  'powerup', FALSE, FALSE, 0.25,  'speedMod',       NULL, NULL, NULL, FALSE),
('Combat Veteran',   '+0.3 melee damage multiplier',                 'uncommon',  'powerup', FALSE, FALSE, 0.30,  'dmgMult',        NULL, NULL, NULL, FALSE),
('Bulwark',          '+4 flat damage reduction',                     'uncommon',  'powerup', FALSE, FALSE, 4.00,  'dmgReduction',   NULL, NULL, NULL, FALSE),
('Surge',            'Reduces attack cooldown by 6 frames',          'uncommon',  'powerup', FALSE, FALSE, 6.00,  'attackCooldown', NULL, NULL, NULL, FALSE),
('Orbital Strike',   'Instantly destroys one outpost of your choice','uncommon',  'ability', TRUE,  TRUE,  NULL,  'destroy_outpost',NULL, NULL, NULL, FALSE),
('Supply Drop',      'Restores 30 HP instantly',                     'uncommon',  'ability', FALSE, TRUE,  30.00, 'healHp',         NULL, NULL, NULL, FALSE),
('Titan Core',       '+50 max HP and +5 damage reduction',           'rare',      'powerup', FALSE, FALSE, 50.00, 'maxHp',          NULL, 5.00, NULL, FALSE),
('Berserker',        '+0.5 melee damage multiplier',                 'rare',      'powerup', FALSE, FALSE, 0.50,  'dmgMult',        NULL, NULL, NULL, FALSE),
('Phase Stride',     '+0.4 movement speed',                          'rare',      'powerup', FALSE, FALSE, 0.40,  'speedMod',       NULL, NULL, NULL, FALSE),
('Fortified',        '+6 flat damage reduction',                     'rare',      'powerup', FALSE, FALSE, 6.00,  'dmgReduction',   NULL, NULL, NULL, FALSE),
('Lightning Reflex', 'Reduces attack cooldown by 10 frames',         'rare',      'powerup', FALSE, FALSE, 10.00, 'attackCooldown', NULL, NULL, NULL, FALSE),
('EMP Blast',        'Destroys 2 random outposts instantly',         'rare',      'ability', FALSE, TRUE,  2.00,  'destroy_random', NULL, NULL, NULL, FALSE),
('Full Restore',     'Restores HP to full',                          'rare',      'ability', FALSE, TRUE,  NULL,  'healFull',       NULL, NULL, NULL, FALSE),
('Immortal Coil',    'You cannot die for 5 seconds',                 'legendary', 'ability', FALSE, TRUE,  NULL,  'isImmortal',     NULL, NULL, 5.00, TRUE),
('God Mode',         '+1.0 dmg, +0.5 speed, +10 DR, +100 HP',       'legendary', 'powerup', FALSE, FALSE, 1.00,  'all',            NULL, NULL, NULL, FALSE),
('Nuke',             'Instantly destroys all outposts on the map',   'legendary', 'ability', FALSE, TRUE,  NULL,  'destroy_all',    NULL, NULL, NULL, FALSE);

INSERT INTO Hero (hero_name, description, asset, cardColor, speedMod, maxHp, dmgMult, dmgReduction) VALUES
('Warrior', 'Tough frontliner. High HP and damage, but slow', '../Assets/warrior_idle.png', '#c55', 0.80, 180, 1.50, 2),
('Scout',   'Fast and fragile. Low HP but hard to hit',       '../Assets/scout_idle.png',   '#2a2', 1.60,  60, 0.70, 0),
('Tank',    'Resistance to the top but moves really slow',    '../Assets/tank_idle.png',    '#b70', 0.50, 260, 0.80, 5);