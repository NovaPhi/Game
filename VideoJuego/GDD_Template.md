# **Z attack**

## _Game Design Document_

---

##### **Copyright notice / author information / boring legal stuff nobody likes**

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

A tower offense game with raid mechanics where you control a hero with subtroops that defend a hero and try to destroy the enemy emplacements, you can also use cards such as power ups, change stats, change the environment, etc.

### **Gameplay**

The gameplay will start with the player choosing a hero and getting a random set of cards the can include subtroops, power ups and stage changes. Once in the run the player will be able to display his subtroops on the field as he pleases and they will attack nearby enemies or camps, including the main one. The player can also use his cards to power up a subtroop for that stage or his main hero or use one of the stage changing cards to make it so that the terrain affect the enemies or helps the player. Every three stages the player will be able to with the money earned, he can improve a hero stat for the rest of the run, get more powerups or more stage changing cards. Then the player will start again for other three stages but with higher difficulty.

### **Mindset**

The player will have a psychological reward in our progression based system where at the start they will be relatively weak so that as gameplay time advances they get stronger and manage to advance in power. We aim to make the player feel hurried with the game as time passes in a "raid" difficulty will increase but good players will be rewarded by staying calm. The main resource for that will be difficulty progression.

## _Technical_

---

### **Screens**

1. Title Screen
    1. Start Game
    2. Options
    3. Credits
    4. Exit
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
    2. High Score
    3. Rewards(Total money you end up with)
    4. Retry
    5. Return to Hub
6. Credits
    1. Dev Team
    2. Music/Art credits

### **Controls**

1. Input Type
    1. Mouse + keyboard

2. Mouse Controls
    1. Left Click
        1. Place Hero on the map
        2. Place Subtroops on the map
        3. Drag power up card to hero/subtroop to apply it
    2. Right Click
        1. Cancel Drop
    3. Keyboard
        1. WASD
            1. Move Hero after Placement
        2. Space
            1. Attack(Hero)
        3. Esc
            1. Pause Game


### **Mechanics**

The game will have an automatic targeting system for enemies and subtroops where the enemies attack will be based on distance and troop type for example subtroops will draw the attacks to them even if they are farther away from the emplacement but in range and the subtroops auto-attack will work in a similar principle but if the hero recieves damage from an emplacement while in an effective "detection range" they will switch to a defend behaviour where they will attack the emplacement that is targeting the hero which also has automatic damaga selection but it will be purely based on distance and aggro to a hero can drop if a subtroop is actively attacking the emplacement and the emplacement looses a percentage of health.

The difficulty progression works similar to other rougelite systems where it is based on time so that the player is incentivised to act recklessly but rewarded for acting calm. When completing a run the player will be rewarded with a selection of randomized upgrade cards drawn from a predefined pool. The player chooses a card that will modify their stats for the remainder of the run. The cards can enchance Hero stats, improve subtroops, be power ups for use in the remaining of the run and be stage modifiers that benefits the player or affects the enemy on a stage. These upgrades do not persist between runs encouraging replayability. 

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
