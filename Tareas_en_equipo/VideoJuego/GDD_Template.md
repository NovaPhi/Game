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

A rogue-like base assault game where you control a zombie hero and you must destroy all the enemy outposts in order to unlock the main base and you be able to attack it You can also use cards such as power ups, change stats, abilities, etc.

### **Gameplay**

The gameplay will start with the player choosing a hero and getting a random set of cards the can include power ups and abilities. Once in the run the player will have to attack all the enemy outpost trying to dutch all the bullets and attacks they deploy. Once they are all destroyed, he will be able to destroy the main base to beat the level and enter the next one. 
The player can also use his cards to power up the hero or use a special ability in order to achieve his objective. Once the run is over, the player will be able that with the xp earned, level up the cards he has or unlock new cards to add to his inventory.

### **Mindset**

The player adopts an aggressive survival mindset, constantly balancing offense and evasion while making fast real-time decisions. At the same time, they engage in strategic planning through card selection and progression systems, embracing a roguelite loop of experimentation, failure, and improvement.

## _Technical_

---

### **Screens**

1. Title Screen
    1. Start Game
    2. Tutorial
    3. Story
    4. Settings
2. Loadout
    1. Hero Selection
    2. Cards Selected Overview
    3. Store(Power ups, Environment cards)
    4. Stats Improve
    5. Start Raid
3. Pause Screen
    1. Resume
    2. End Run
    3. Settings
    4. Leave to Menu
4. Game Over Screen
    1. Final Score
    2. Rewards(Total XP you got)
    3. Retry
    4. Return to Hub
6. Credits
    1. Dev Team
    2. Music/Art credits

### **Controls**

1. Input Type
    1. Mouse + keyboard

2. Mouse Controls
    1. Left Click
        1. Select card in between levels
        2. Destroy outposts with special card
    2. Keyboard
        1. WASD
            1. Move Hero
        2. Space
            1. Attack(Hero)
        3. Esc
            1. Pause Game


### **Mechanics**

The game features a top-down movement and combat system where the player controls a hero with free directional movement and engages enemies through direct contact. The player deals continuous damage when colliding with enemy structures, regulated by an attack cooldown that prevents constant damage. This creates a dynamic where positioning and timing are essential to both survival and efficiency in combat.

The enemy system is composed of multiple outposts distributed across the map, each with independent health and type, depending on the type, the outpost will attack one way or other. These outposts will automatically detect the player within a certain range and fire bullets. The player must destroy all active outposts before gaining access to the main base, creating a clear objective for the player to move around the map to destroy all outposts.

The main base is protected by a series of wall segments that function both as defensive barriers and offensive units. Each segment has its own health and can shoot projectiles at the player when in range. These segments block movement and must be destroyed individually once the outposts are all destoyed. The level is completed when the player successfully enters the inner zone of the base.

The projectile system is based on simple physics where enemy bullets travel in straight lines toward the player’s position at the time of firing. Each projectile deals damage upon collision and is removed either when it hits the player or leaves the stage.

The game incorporates a card-based ability system where the player has access to a deck of cards that can be activated during gameplay. These cards can modify player stats, provide temporary boosts, or trigger special abilities. 

## _Level Design_

---

_(Note : These sections can safely be skipped if they&#39;re not relevant, or you&#39;d rather go about it another way. For most games, at least one of them should be useful. But I&#39;ll understand if you don&#39;t want to use them. It&#39;ll only hurt my feelings a little bit.)_

### **Themes**

1. Forest
    1. Mood
        1. Dark, calm, foreboding
    2. Objects
        1. _Ambient_
            1. Fireflies
            2. Beams of moonlight
            3. Tall grass
        2. _Interactive_
            1. Wolves
            2. Goblins
            3. Rocks
2. Castle
    1. Mood
        1. Dangerous, tense, active
    2. Objects
        1. _Ambient_
            1. Rodents
            2. Torches
            3. Suits of armor
        2. _Interactive_
            1. Guards
            2. Giant rats
            3. Chests

_(example)_

### **Game Flow**

1. Player starts in forest
2. Pond to the left, must move right
3. To the right is a hill, player jumps to traverse it (&quot;jump&quot; taught)
4. Player encounters castle - door&#39;s shut and locked
5. There&#39;s a window within jump height, and a rock on the ground
6. Player picks up rock and throws at glass (&quot;throw&quot; taught)
7. … etc.

_(example)_

## _Development_

---

### **Abstract Classes / Components**

1. Entity
    1. Character
        1. Player
        2. Troop
        3. Enemy
            1. Guard
2. Physics
    1. Movement
    2. Collision
3. Combat
    1. Weapon
    2. Projectile
    3. Hitbox
4. AI
    1. Aggro
    3. Troop
5. Card
    1. BuffCard
        1. AbilityCard
        2. StatCard
    2. TroopCard
    3. MinMaxCard
    4. EnemyEventCard
6. CardSystem
    1. PlayerCardDraft
    2. EnemyCardTrigger
7. Outpost
    1. SpawnPoint
    2. CaptureZone
    3. Base
8. Obstacle
    1. Cover
    2. Gate
9. Interactable
    1. Pickup
    2. Trigger
10. UI
    1. HUD
    2. Minimap
    3. CardDraftScreen


### **Derived Classes / Component Compositions**

1. Character
    1. Player
        1. PlayerHero (base controllable hero)
        2. PlayerHeroUnlockable (unlocked via store)
    2. Troop
        1. TroopMelee (absorbs damage, close range attack)
        2. TroopRanged (absorbs damage, ranged attack)
        3. TroopUnlockable (unlocked via store)
    3. Enemy
        1. Guard (Aggro, ranged attack)
        2. Commander (EnemyCardTrigger)

    1. BuffCard
        1. AbilityCard (grants/upgrades hero ability)
        2. StatCard (modifies hero/troop stats)
    2. TroopCard (spawns additional subtroops)
    3. MinMaxCard (high risk/reward trade-off)
    4. EnemyEventCard (triggered on Base damage)

3. Outpost
    1. OutpostHouse (House theme, Civilian enemies)
    2. OutpostMilitary (Military theme, Guard/soldier enemies)
    3. Base (takes damage, triggers EnemyEventCard)
    4. CaptureZone (clear condition trigger)
    5. SpawnPoint (enemy + troop spawn location)

4. Obstacle
    1. ObstacleWall (static, blocks movement)
    2. ObstacleGate (opened via Trigger)
    3. ObstacleCover (reduces incoming damage)

5. Interactable
    1. InteractablePickup (on-field loot, applies BuffCard)
    2. InteractableTrigger (activates Gates, CaptureZones)

6. UI
    1. HUDHero (hero HP, ability cooldowns)
    2. HUDTroops (troop count, status)
    3. MinimapOutpost (outpost layout, enemy positions)
    4. CardDraftScreen (post-stage 3-card selection)
    5. CardDraftEnemyAlert (enemy card activation notice)


## _Graphics_

---

### **Style Attributes**

2D Pixel art game, taking inspiration from different zombie games such as Project Zomboid. An above-view camera angle during the gameplay, similar to a Clash of Clans attack. Heroes will be larger in size than subtroops, and will have more complex designs, making them easy to identify and diferentiate form NPCs. Enemies will have a red outline, making them easy to identify and clasify as the target to be attacked. Make sure to check out the picture found in the Game Presentation (also in this GitHub repository) for a more visual representation of our vision.


### **Graphics Needed**

1. Characters
    1. Zombies
        1. Base heroe
        2. Hero type 2 - Tank
        3. Hero type 3 - Long range
        4. Regular subtroop
        5. Brute subtroop
        6. Long range subtroop
    2. Humans
        1. Soldiers
        2. Strong soldiers
2. Bases
    1. Center base (main)
    2. Center base walls
    3. Outposts
3. Ambient
    1. Grass
    2. Trees
    3. Rocks
    4. Barricades
    5. TCG terrain elements
4. Other
    1. Blood
    2. Weapons
    3. TCG Cards illustrations

_(example)_


## _Sounds/Music_

---

### **Style Attributes**

The Game will feature dark, militaristic, tension driven sound that blends tactical military atmosphere with the zombie element combined with the semi tactical nature of the game pressure our players and introduce stress through sound forcing errors and increasing tension

The music is influenced by other games with similar scores like ready or not, modern war movie scores and subtle horror textures

The instruments we are using are Drums, Snares, brass, war horns, bass strings sub bass pulses and electronic elements,

some elements will be metalic hits, industrial ambiance and synth drones


### **Sounds Needed**

1. Effects
    1. Hero Sounds
        1. Wet heavy footsteps
        2. low growls
        3. impact sounds during attack
    2. Enemy Sounds
        1. Boots hitting ground
        2. Reload clicks
        3. Radio Chatter
        4. gunfire

2. Feedback
    1. rising tone (health)
    2. muffled hit (attacked)
    3. Harmonica (Upgrade Selected)
    4. Low Brass Drop + music cut(died)

_(example)_

### **Music Needed**

1. Main Menu Theme - Luis Arias
    1.5 Loadout Theme
2. Early Game Track
    2.5 Mid Game Track
3. Late Game Track
4. Game Over Theme
5. Credits Theme

(All the music is made in house and the 5 themes will be our minimum target with possibility to raising it to 7 if time is available)

## _Schedule_

---

_(define the main activities and the expected dates when they should be finished. This is only a reference, and can change as the project is developed)_

1. develop base classes
    1. base entity
        1. base player
        2. base enemy
        3. base block
  2. base app state
        1. game world
        2. menu world
2. develop player and basic block classes
    1. physics / collisions
3. find some smooth controls/physics
4. develop other derived classes
    1. blocks
        1. moving
        2. falling
        3. breaking
        4. cloud
    2. enemies
        1. soldier
        2. rat
        3. etc.
5. design levels
    1. introduce motion/jumping
    2. introduce throwing
    3. mind the pacing, let the player play between lessons
6. design sounds
7. design music

_(example)_
