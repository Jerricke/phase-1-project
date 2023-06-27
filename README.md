# phase-1-project
Hello! this is my phase-1-project for flatiron school's SWE program. I set out to create a pokemon game using only HTML/CSS/JS (one html file). 

# Timeline of Codes 
1. Focused on the creation of the main play screen .
2. Created of the coordinate system and the addition of the encounter mechanism based on RNG.
3. Added the console menu at the bottom of the play screen.
4. Created the Main Menu Screen and Bag Screens.
5. Created a CombatScreen for when an encounter occurs.
6. Added global settings to disable coordinate movement while in combat.
7. Implemented combat system: 
    -> Player will be able to use one of the skills and inflict damage to the opponent pokemon.
    -> There is a %chance the skill will hit/miss, and there is also a base crit rate of 15% at 2x crit dmg.
    -> When either pokemon faints, they will shake and disappear.
8. Implemented the battle turn base system.
    -> Basically allows the enemy pokemon to attack currnet ally pokemon after each player move.
9. Implemented the items functionalities in the bag screen.
10. Implemented the use function for the potions .
11. Implemented fetch patch for the hp updates on ally pokemon, hp now persists through combats.
12. Capturing pokemon is now functional, and the captured pokemon will exist in captured pokemons' database.
13. Updated gamewide statuses, no longer able to move/encounter pokemons while in bag or combat.
14. Updated bag items buttons, now no longer able to use items unless engaged in combat, items are only usable on the currently active pokemon.
15. Added a tracker for player items count.
16. Playeres can now only use items when the count is greater than 0.
17. Implemented a working display list for captured pokemons, toggle-able to display hp and image.
18. Updated probability machine to drop items by chance.
19. Event and Combat loggers will automatically scroll to the bottom when a new event is added.
20. Patched the pokemon list to auto load the new captured pokemons.
21. Patched healing function.
22. Health points of pokemons are now actively updated during combat and when healed.
23. Implemented the pokemon swapping system, as well as disabling the swaps when not in combat.
24. Updated combat system/pokemon list to allow swapping active pokemon during combat.
25. Update combat system to prompt user to select other pokemons when active pokemon faints.
26. Updated the combat system: when no more current pokemon faints, and no other pokemon is available, prompt the user that they lost.
27. Created game over screen with a button to start over. Starting over resets all user data to initial data.

# Deliverables to work on
1. Add music for different screens.

# Deliverabl that may be added
1. Add a button to remove pokemons from your list

# Stertch Deliverables
1. Create a game start feature where player gets to pick which pokemon to start with.
2. Create an exp/levling system for the captured pokemons.
3. Create an evolution system for the captured pokemons.
4. Create a skill learn/unlearn system for the captured pokemons.


# patch bugs
1. swap not showing up after pokemon faints
2. after pokemon faints, the hp in pokemon list is not updating properly
3. clear pokemon list when reseting