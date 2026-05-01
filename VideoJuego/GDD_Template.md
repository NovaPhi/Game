# **Z attack**

## _Game Design Document_

---

##### **By Luis Jaime Arias Sarabia, Adolfo Hernández Sánchez and Alonso Arechiga Mendoza**

##
## _Index_

---

1. [Index](#index)
2. [Game Design](#game-design)
    1. [Summary](#summary)
    2. [Gameplay](#gameplay)
    3. [Mindset](#mindset)
3. [Technical](#technical)
    1. [Screens](#screens)
    2. [Controls](#controls)
    3. [Mechanics](#mechanics)
4. [Level Design](#level-design)
    1. [Themes](#themes)
        1. Ambience
        2. Objects
            1. Ambient
            2. Interactive
        3. Challenges
    2. [Game Flow](#game-flow)
5. [Development](#development)
    1. [Abstract Classes](#abstract-classes--components)
    2. [Derived Classes](#derived-classes--component-compositions)
6. [Graphics](#graphics)
    1. [Style Attributes](#style-attributes)
    2. [Graphics Needed](#graphics-needed)
7. [Sounds/Music](#soundsmusic)
    1. [Style Attributes](#style-attributes-1)
    2. [Sounds Needed](#sounds-needed)
    3. [Music Needed](#music-needed)
8. [Schedule](#schedule)

## _Game Design_

---

### **Summary**

Z Attack is a single-player roguelite top-down action game in which the player controls a zombie hero assaulting heavily fortified human bases. Each run is unique thanks to the random outpost layouts and the card system lets players build personalised powerups and stat changes.

### **Gameplay**

The gameplay will start with the player creating his deck, this will be conformed by the cards he has unlocked until then or the initial cards. Then the player will have to choose a hero, each has different abilties and a different mindset of playing. Once in the run the player will have to attack all the enemy outpost trying to dutch all the bullets and attacks they deploy, this can be achieved with the generation of barriers which you can use to protect yourself. The player also need to look out for different obstacles that can be genereated like mines or beartraps. 

Once all the outposts are destroyed, he will be able to destroy the main base to beat the level and enter the next one, the farthest he gets, the more xp he will earn and the more damage the outposts will do. Every time you beat a level, you will be able to select a card from your deck to have it available to you and use it any time you want. Three levels means one stage and each level will feature a different background for it to differentiate itself and feel the progression, this also comes with a different style for the barriers and main base of the level.

The player can also use his cards to power up the hero or have some stat modified in order to get him the farthest possible, these stat changes are just temporal and will reset on the next run.

Each hero also has two special abilities, one defensive and one offensive, he can use this ones in any time of the run as long as they are not in cooldown. This abilities will help him destroy enemies when he is in a rush or proetect himself if he fills vulnerable.

Once the run is over, the player can keep playing or go to the cards section in order to unlock new cards with the xp he has earned in lootboxes that can give you different types of cards and different categories and add them to his deck as he wishes. 


### **Mindset**

The player adopts an aggressive survival mindset, constantly balancing offense and evasion while making fast real-time decisions. At the same time, they engage in strategic planning through card selection and progression systems, embracing a roguelite loop of experimentation, failure, and improvement.

The deck builder system gives the player the ability to have different mindsets depending on which cards he uses or unlocks. For example, he can play in a defensive style, in a full attack style and many other ways that will help for replayability.

## _Technical_

---

### **Screens**

1. Title Screen
    1. Start Game
    2. Cards
        2.1. Deck Builder
        2.2. Cards Unlock
    3. Leaderboard
    4. Tutorial
    5. Story
    6. Settings
    7. Login
        7.1. Create Account
        7.2. User stats / Log off
        7.3. Admin Panel
        7.4. Data Graph
2. Loadout
    1. Hero Selection
    2. Cards Selected Overview
    3. Store(Power ups, Environment cards)
    4. Stats Improve
    5. Start Raid
3. Game Over Screen
    1. Final Score
    2. Rewards(Total XP you got)
    3. Retry
    4. Return to Hub (Z Attack button)


### **Controls**

1. Input Type
    1. Mouse + keyboard

2. Mouse Controls
    1. Left Click
        1. Select hero at the beggining of the run
        2. Damage outposts with special card
        3. Add/Remove cards from deck 
    2. Keyboard
        1. WASD
            1. Move Hero
        2. SPACE
            1. Start/Restart run
        3. 1,2,3 num buttons
            1. Use a card you currently is assigned to that button
        4. R key
            1. Exit targeting mode
        5. E key
            1. Activate Offensive Ability     
        6. F key
            1. Activate Defensive Ability 


### **Mechanics**

The game features a top-down movement and combat system where the player controls a hero with free directional movement and engages enemies through direct contact. The player deals continuous damage when colliding with enemy structures, regulated by an attack cooldown that prevents constant damage. This creates a dynamic where positioning and timing are essential to both survival and efficiency in combat.

The game features three different types of enemies, each with different stats to make the game more dinamic and for the player to have multiple ways of aproaching a run depending on what he wants and the cards he has. This heroes are:
    Warrior - Speed: 0.8, Hp: 180, Attack: 1.5, Armor: 2
    Scout - Speed: 1.6, Hp: 60, Attack: 0.7, Armor: 0
    Tank - Speed: 0.5, Hp: 260, Attack: 0.8, Armor: 5

Each hero also has two special abilities, one defensive and one offensive, he can use this ones in any time of the run as long as they are not in cooldown. The abilities include:
    Warrior: 
        - Offensive: War Cry - Increments Speed and Damage +50% and the Attack Cooldowns reduces 50% for 4s
        - Defensive: Defense Tonic - Gives you Damage Reduction +5 for 5s

    Scout: 
        - Offensive: Sniper Shot - A Piercing Shot Aimed with the mouse that destroys every outpost it touches (not including main base)
        - Defensive: Ghost Step - Turns you invisible until you attack an outpost

    Tank: 
        - Offensive: Hammer Slam - An attack based on area, it slam damages all nearby enemies
        - Defensive: Liberty Shield - Absorbs all damage for 3s

The enemy system is composed of multiple outposts distributed across the map, each with independent health and type, depending on the type, the outpost will attack one way or other. These outposts will automatically detect the player within a certain range and fire bullets. The player must destroy all active outposts before gaining access to the main base, creating a clear objective for the player to move around the map to destroy all outposts.
There are many type of Outposts, including:
    - Normal Outpost: shoots normal
    - Burst Outpost: Takes a little more to shoot but shoots three bullets at the same time
    - Sniper Outpost: Shoots a fastest and more powerfull bullet but it marks you the trayectory it will do and takes more to reload 
    - Omni Outpost: Shoots in every direction every once in a while. 

There is also the possibility of the generation of different obstacles that can either help or complicate the player. This obstacles add to the randomness of the game. This obstacles include:
    Barriers - Random walls that vary in size and that can block bullets from the outposts, this walls can help the player take a break while thinking what to do next and making a strategy, but they can also screw the player if they are in a bad position.
    Mine - A mine that makes a lot of damage to the player if he stands on it, adding a precaution to the player on where to move next.
    Beartrap - A beartrap that if the player steps on, makes him paralyze for 3 seconds, adding an extra thinking to where he moves next and a creation of a strategy for the player on what to do if he steps it.


The main base is protected by a series of wall segments that function both as defensive barriers and offensive units. Each segment has its own health and can shoot projectiles at the player when in range. These segments block movement and must be destroyed individually once the outposts are all destoyed. The level is completed when the player successfully enters the inner zone of the base.

The projectile system is based on simple physics where enemy bullets travel in straight lines toward the player’s position at the time of firing. Each projectile deals damage upon collision and is removed either when it hits the player or leaves the stage.

The game incorporates a card-based ability system where the player has access to a deck of cards that can be activated during gameplay. These cards can modify player stats or have different powerups. Thse cards allow for the player to adapt to multiple playstyles and have multiple mindsets depending on the cards that he ends up unlocking. Each time the player beats a level, he will be able to select one out of the three options of cards presented that are on his deck.

The deck system lets the player build his deck out of the cards he has earned and has available on his collection with a maximum of 10 cards. Once the player builds his deck, it will be able to use them in a run depending of the ones the system returns every time he beats a level. 

Some cards can activate the targeting mode, this mode lets you deal damage by distance to enemy outposts that you click on. This mechanic adds to the different ways a card can act and different strats a player can have.

The card system is composed by 27 different cards, this are conformed by:
    - COMMON
        - Iron Skin: +2 flat damage reduction
        - Quick Feet: +0.1 movement speed
        - Adrenaline: Reduces attack cooldown by 3 frames
        - Field Medic: +15 max HP
        - Steady Hands: +0.1 melee damage multiplier
        - Reinforced Boots: +0.15 movement speed
        - Bandage: +20 max HP
        - Sharpened Blade: +0.2 melee damage multiplier
        - Padding: +1 flat damage reduction
        - Stimpack: +25 max HP
    - UNCOMMON
        - Battle Hardened: +20 max HP and +3 damage reduction
        - Overclock: +0.25 movement speed
        - Combat Veteran: +0.3 melee damage multiplier
        - Bulwark: +4 flat damage reduction
        - Surge: Reduces attack cooldown by 6 frames
        - Orbital Strike: Instantly destroys one outpost of your choice
        - Supply Drop: Restores 30 HP instantly
        - Smoke Screen: Halts all bullets on screen for 3 seconds
    - RARE
        - Titan Core: +50 max HP and +5 damage reduction
        - Berserker: +0.5 melee damage multiplier
        - Phase Stride: +0.4 movement speed
        - Fortified: +6 flat damage reduction
        - Lightning Reflex: Reduces attack cooldown by 10 frames
        - EMP Blast: Destroys 2 random outposts instantly
        - Full Restore: Restores HP to full
    - LEGENDARY
        - Immortal Coil: You cannot die for 5 seconds
        - God Mode: +1.0 dmg, +0.5 speed, +10 DR, +100 HP
        - Nuke: Instantly destroys all outposts on the map


The card unlocking system depends on lootboxes the player can open with the xp he earns on the runs. This card can be obtained more easily or harder depending on the category os the card, there exists Common, Uncommon, Rare and Legendary. Each lootbox includes a different chance for each type of cards. These lootboxes include:
    - Basic Crate: 900xp cost and has a 70% of Common, 25% of Uncommon and 5% of Rare
    - Rare Crate: 1800xp cost and has a 45% of Uncommon, 30% of Common and 20$ of Rare
    - Legendary Crate: 6000xp cost and has a 50% of Rare, 20% of Uncommon and 1$ of Legendary

The game incorporates a difficulty system, the difficulty increases every couple levels and this modifies, the health of the enemies, the velocity of shooting of the Sniper and the damage dealt by all enemies. This way the farthest the player goes, the hardest the game will get so he better prepare himslef with his cards on early levels to get far.


## _Level Design_

---

### **Themes**

1. House
    1. Mood
        1. Disolated, apocaliptic
    2. Objects
        1. _Ambient_
            1. Streets
            2. Patches of grass
            3. Sewers
            4. Craks
        2. _Interactive_
            1. Buses
            2. Trucks
            3. Cars
            4. Fences
            5. Mailposts
            6. Trashcans
            7. Mines
            8. Beartraps
            9. Normal Outposts
            10. Burst Outposts
            11. Sniper Outposts
            12. Omni Outposts
            13. Main base wall house
            14. Main base interior house

2. Mall 
    1. Mood
        1. Apocaliptic, disolated
    2. Objects
        1. _Ambient_
            1. Parking spaces
            2. Parking symbols
        2. _Interactive_
            1. Buses
            2. Trucks
            3. Cars
            4. Vending machines
            5. Bunch of shopping cards
            6. Bunch of boxes
            7. Mines
            8. Beartraps
            9. Normal Outposts
            10. Burst Outposts
            11. Sniper Outposts
            12. Omni Outposts
            13. Main base wall mall
            14. Main base interior mall

3. Hospital 
    1. Mood
        1. Apocaliptic, disolated, ruined, chaos happened here
    2. Objects
        1. _Ambient_
            1. Hospital parking symbols
            2. Heliporter symbol and space
            3. Craks
            4. Stains of blood
        2. _Interactive_
            1. Ambulance
            2. Mobile Medical Unit
            3. Stretcher
            4. Toxic waste trashcans
            5. Tripods with IV bags
            6. Mines
            7. Beartraps
            8. Normal Outposts
            9. Burst Outposts
            10. Sniper Outposts
            11. Omni Outposts
            12. Main base wall hospital
            13. Main base interior hospital

4. Military base 
    1. Mood
        1. Apocaliptic, disolated, ruined, chaos happened here
    2. Objects
        1. _Ambient_
            1. Military parking symbols
            2. Heliporter symbol and space
            3. Craks
            4. Sewers
        2. _Interactive_
            1. Tanks
            2. Military trucks
            3. Military boxes of kits
            4. Sandbag Barricades
            5. Gasoline containers
            6. Mines
            7. Beartraps
            8. Normal Outposts
            9. Burst Outposts
            10. Sniper Outposts
            11. Omni Outposts
            12. Main base wall military
            13. Main base interior military

### **Game Flow**

1. The player builds his deck with the cards he has unlocked
2. Player has to choose a hero to play as
3. He starts in the house level
4. He goes to defeat all enemy outposts
5. He tries to avoid all traps (mines and beartraps) (if generated)
6. He tries to block the bullets with the different barriers (if generated)
7. Player can use his offensive or defensive ability if needed
8. Player destroys all enemy outposts
9. Player attacks main base wall
10. Player gets into the main base and beats the level
11. Player chooses a card from his deck (3 random options)
12. Player starts in the mall level
13. Player can use the card he has any time he wants to help him
14. Repeats steps 4-11
15. Player earns xp and difficulty increases (every 3 levels (1 stage) this happens)
16. Player starts in the hospital level
17. Repeats steps 4-11 and 13
18. Player starts in the military base level
19. Repeats steps 4-11 and 13
20. Player restarts into house level
21. This cycle keeps going until player dies

## _Development_

---

### **Abstract Classes / Components**

1. Entity
    1. Character
        1. Player
        2. Enemy
            1. Outpost
            2. Burst
            3. Sniper
            4. OmniOutpost
2. Physics
    1. Movement
    2. Collision
3. Combat
    1. Projectile bullet
    2. Hitbox
4. AI
    1. Aggro
5. Card
    1. BuffCard
        1. PowerupCard
        2. StatCard
6. CardSystem
    1. PlayerCardDraft
7. Outpost
    1. SpawnPoint
    2. CaptureZone
    3. Base
8. Obstacle
    1. Barrier
    2. Mine
    3. BearTrap
9. Interactable
    1. Trigger
10. UI
    1. HUD
    2. CardDraftScreen


### **Derived Classes / Component Compositions**

1. Character
    1. Player
        1. PlayerHero (base controllable hero)
    2. Enemy
        1. Outpost
        2. Burst
        3. Sniper
        4. OmniOutpost
        5. WallSegment

    1. BuffCard
        1. PowerupCard 
        2. StatCard 

3. Outpost
    1. Base 
    2. CaptureZone 
    3. SpawnPoint 

4. Obstacle
    1. Barrier
    2. Mine
    3. BearTrap

5. Interactable
    1. InteractableTrigger 

6. UI
    1. HUDHero (hero HP, ability cooldowns)
    2. HUDTroops (troop count, status)
    3. CardDraftScreen (post-stage 3-card selection)
    4. HeroSelect
    5. DeathScreen


## _Graphics_

---

### **Style Attributes**

2D Pixel art game, taking inspiration from different zombie games such as Project Zomboid. The art was made with the help of an AI and we tried to do a realistic 2D Pixel art style to reflect the danger and the atmosphere that we imagined in a post-apocaliptic world. 


### **Graphics Needed**

1. Zombies
    1. Warrior Hero
    2. Tank Hero
    3. Scout Hero
2. Bases
    1. House-base
    2. House-base wall
    3. Mall-base
    4. Mall-base wall
    5. Hospital-base
    6. Hospital-base wall
    7. Military-base
    8. Military-base wall
3. Ambient
    1. House level background
    2. Mall level background
    3. Hospital level background
    4. Military level background
4. Enemies
    1. Normal Outpost
    2. Burst Outpost
    3. Sniper Outpost
    4. Omni Outpost
5. Obstacles
    1. House level Buses
    2. House level Trucks
    3. House level Cars
    4. Fences
    5. Mailposts
    6. Trashcans
    7. Mall level Buses
    8. Mall level Trucks
    9. Mall level Cars
    10. Vending machines
    11. Bunch of shopping cards
    12. Bunch of boxes
    13. Ambulance
    14. Mobile Medical Unit
    15. Stretcher
    16. Toxic waste trashcans
    17. Tripods with IV bags
    18. Tanks
    19. Military trucks
    20. Military boxes of kits
    21. Sandbag Barricades
    22. Gasoline containers
    23. Mines
    24. Beartraps


## _Sounds/Music_

---

### **Style Attributes**

The Game will feature dark, militaristic, tension driven sound that blends tactical military atmosphere with the zombie element combined with the semi tactical nature of the game pressure our players and introduce stress through sound forcing errors and increasing tension

### **Music Needed**

1. Title Theme - Luis Arias
2. Early Game Song - Luis Arias

## _Schedule_

---

_(define the main activities and the expected dates when they should be finished. This is only a reference, and can change as the project is developed)_

1. Pre-production
    1. Define Game Ideas and core gameplay
    2. Define core mechanics (cards, deck)
    3. Define game loop and TCG mechanics

2. First prototype
    1. Implement base classes (player, enemy, cards)
    2. Implement card system mechanic (select a card every level)
    3. Implement difficulty progression
    4. Implement bullet logic
    5. Implement randomization in enemy generation
    6. Implement attack logic and collisions

3. Advanced prototype
    1. All different enemies added (burst, sniper, omni)
    2. All cards added with all logic behind them
    3. Implement all different heroes
    4. Implement main base randomized position

4. Deck building
    1. Add lootbox logic
    2. Add unlocking cards mechanics
    3. Add deck building
    4. Add randomized cards picked each level from deck

5. Final prototype
    1. Add obstacles (barriers, mines, beartraps)
    2. Add xp logic
    3. Add hero abilities

6. Testing and Balancing
    1. Gameplay balancing (cards, randomness, progression)
    2. Bug fixing
    3. Performance optimization

7. Finalization
    1. Add assets
    2. Add different level progression

