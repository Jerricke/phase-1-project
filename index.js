function mainFunction() {
     //SiwtchingScreens
    const bagScreen = document.getElementById("bagScreen");
    const mainScreen = document.getElementById("mainScreen");
    const combatScreen = document.getElementById("combatScreen");
    const mainMenuScreen = document.getElementById("mainMenuScreen");
    const eventHistory = document.querySelector("#eventHistory");
    const movesList = document.querySelector("#movesList")
    let combatStatus = false;
    let isPlayStatus = false;
    bagScreenChange();

    combatScreen.style.display = "none";
    bagScreen.style.display = "none";
    mainScreen.style.display = "none";
    mainMenuScreen.style.display = "block";

    document.getElementById("gameStart").addEventListener('click', () => {
        mainMenuScreen.style.display = "none"
        mainScreen.style.display = "block";
        isPlayStatus = true;
    })

    document.getElementById("bag").addEventListener('click', () => {
        mainScreen.style.display = "none";
        bagScreen.style.display = "block";
        isPlayStatus = false;
    })

    document.getElementById("main-menu").addEventListener('click', () =>{
        mainScreen.style.display = "none";
        mainMenuScreen.style.display = "block";
    })

    document.getElementById("returnToMain").addEventListener('click', () => {
        if (!combatStatus){
            bagScreen.style.display = "none"
            mainScreen.style.display = "block";
            isPlayStatus = true;
        } else {
            bagScreen.style.display = "none"
            combatScreen.style.display = "block";
        }
    })
 
    document.querySelector("#bagBtn").addEventListener('click', () => {
         combatScreen.style.display = "none";
         bagScreen.style.display = "block"
    })
 
    document.querySelector("#escapeBtn").addEventListener('click', () => {
         combatLeave("You escaped the Pokemon!");
    })

    //Generating the play area
    serverCoordinateSystem();
    function serverCoordinateSystem() {
        //position array
        let currentPosition = [];
    
        //Coordinate Setup Starts Here
        const coordinateArray = [[1,1], [2,1], [3,1], [4,1], [5,1], 
                                 [1,2], [2,2], [3,2], [4,2], [5,2],
                                 [1,3], [2,3], [3,3], [4,3], [5,3]];
    
        coordinateArray.forEach( coordinate => {
            const playArea = document.querySelector("#play-area");
            const coordinatePoint = document.createElement("div");
    
            // coordinatePoint.textContent = coordinate;
            coordinatePoint.id = coordinate;
    
            playArea.appendChild(coordinatePoint)
        })
        //Coordinate Setup Ends Here
        
        //Add keydown even listener to allow user to move character
        document.addEventListener('keydown', (e)=> movement(e, currentPosition));
    
        function movement(e, currentPosition) {
            if (isPlayStatus) {
                switch (e.key) {
                    case "ArrowRight":
        
                        if (currentPosition[0] < 5) {
                            coordinateRemover(currentPosition)
                            currentPosition = [currentPosition[0] + 1, currentPosition[1]]
                            coordinateSetter(currentPosition)
                            probabilityMachine();
                        } else return
        
                        break;
                    case "ArrowLeft":
                        
                        if (currentPosition[0] > 1) {
                            coordinateRemover(currentPosition)
                            currentPosition = [currentPosition[0] - 1, currentPosition[1]]
                            coordinateSetter(currentPosition)
                            probabilityMachine();
                        } else return
        
                        break;
                    case "ArrowDown":
                        
                        if (currentPosition[1] < 3) {
                            coordinateRemover(currentPosition)
                            currentPosition = [currentPosition[0], currentPosition[1] + 1]
                            coordinateSetter(currentPosition)
                            probabilityMachine();
                        } else return
                        
                        break;
                    case "ArrowUp":
        
                        if (currentPosition[1] > 1) {
                            coordinateRemover(currentPosition)
                            currentPosition = [currentPosition[0], currentPosition[1] - 1]
                            coordinateSetter(currentPosition)
                            probabilityMachine();
                        } else return
                    
                        break;
                    default:
                }
            } else return console.error("NOT IN PLAY SCREEN");
        }
    
        //intilialize first position at [1,1]
        coordinateSetter([1,1])
        function coordinateSetter(coords) {
            const coordsDiv = document.getElementById(`${coords}`);
            coordsDiv.classList.add("currentPosition")
            currentPosition = coords;
        }
    
        function coordinateRemover(coords){
            const coordsDiv = document.getElementById(`${coords}`);
            coordsDiv.classList.remove("currentPosition")
        }
    }
    
    //Encounter Probability Section
    function probabilityMachine() {
        let token = RNG(100)
        if (token < 6) { //6 % chance 
            //get pokeball
            const pokeballCount = document.querySelector("#pokeballCount");
            let newPokeballCount = parseInt(pokeballCount.textContent) + 1;
            pokeballCount.textContent = newPokeballCount;
            eventHistoryLogger("You found a pokeball!");
            inventoryDataPatcher({pokeball: newPokeballCount})
        } else if (token >= 8 && token < 10) { //2% chance
            //get masterball
            const masterballCount = document.querySelector("#masterballCount");
            let newMasterballCount = parseInt(masterballCount.textContent) + 1;
            masterballCount.textContent = newMasterballCount;
            eventHistoryLogger("You found a masterball!");
            inventoryDataPatcher({masterball: newMasterballCount})
        } else if (token >= 10 && token < 20) { //10% chance
            //get potion
            const potionCount = document.querySelector("#potionCount");
            let newPotionCount = parseInt(potionCount.textContent) + 1;
            potionCount.textContent = newPotionCount;
            eventHistoryLogger("You found a potion!");
            inventoryDataPatcher({potion: newPotionCount})
        } else if (token >= 20 && token < 24) { //4% chance
            //get great potion
            const gPotionCount = document.querySelector("#gPotionCount");
            let newGPotionCount = parseInt(gPotionCount.textContent) + 1;
            gPotionCount.textContent = newGPotionCount;
            eventHistoryLogger("You found a great potion!");
            inventoryDataPatcher({great_potion: newGPotionCount})
        } else if (token > 75) {
            eventHistoryLogger("You just encountered a Pokemon!, combat will start in 3 seconds");
            mockCombatStarter();
            isPlayStatus = false;
        } else return;
    }
    

    

    //RandomNumberGenerator
    function RNG(range) {
        let RNGval = Math.round(Math.random() * range) 
        return RNGval
    }

    //CombatLoader
    function mockCombatStarter() {
        setTimeout( () => {
            mainScreen.style.display = "none";
            combatScreen.style.display = "block";
        }, 3000)
        combatStatus = true;
        bagScreenChange();
        
        //Load encounter pokemon
        fetch("http://localhost:3000/pokemon/")
            .then(res => res.json())
            .then(data => opponentLoader(data))
            .catch(e => console.log(e))

        //Load player pokemon 
        fetch("http://localhost:3000/capturedPokemon/")
            .then(res => res.json())
            .then(data => {
                let i = 0;
                function ifLooper() {
                    if (data[i].is_fainted === true) {      //ensures that we don't load a fainted pokemon
                        i = i + 1;
                        ifLooper();
                    } else return i
                }
                if (data[i].is_fainted === true) {      //ensures that we don't load a fainted pokemon
                    i = i + 1;
                    allyLoader(data, i);
                } else {
                    allyLoader(data, i)
                }
            })
            .catch(e => console.log(e))
    }
    //POKEMON COMBAT FUNCTION

    let currentAlly = {};
    function allyLoader(data, i) {
        currentAlly = data[i];

        const allyPokemon = document.querySelector("#allyPokemon")
        const allyHP = document.querySelector("#allyHP")

        allyPokemon.src = data[i].back_sprite;
        allyHP.textContent = data[i].health;

        skillLoader(data[i])
    }

    let currentOpponent = {};
    function opponentLoader(data) {
        data = data[RNG(data.length - 1 )]
        currentOpponent = data;
        const opponentPokemon = document.querySelector("#opponentPokemon")
        const opponentHP = document.querySelector("#opponentHP")
    
        opponentPokemon.src = data.front_sprite;
        opponentHP.textContent = data.health;

        combatEventLogger(`A wild ${data.name} appears!`);
    }

    //skill functions
    function skillLoader(data){
        data.moves.forEach( (skill) => {
            const newSkill = document.createElement("button");
            newSkill.textContent = skill.name 
            newSkill.addEventListener("click", (e) => useSkill(e, data))
            movesList.appendChild(newSkill)
        }) 
    }

    //Depopulates the movesList 
    function skillDeloader() {
        while (movesList.firstChild){
            movesList.removeChild(movesList.firstChild);
        }
    }
    
    const combatHistory = document.querySelector("#combatHistory");

    function combatHistoryClear() {
        while (combatHistory.firstChild){
            combatHistory.removeChild(combatHistory.firstChild);
        }
    }

    //when player clicks on a skill, run useSkill function
    function useSkill(e, data) {
        const skillUsed = e.target.textContent;
        const skill = data.moves.find(skill => skill.name === skillUsed)
        if (RNG(100) < skill.chance) { //RNG of skill hitting/missing
            let damageDealt = skill.damage;
            if (RNG(100) < 15) { //RNG of skill landing a critical 2x multiplier
                damageDealt = damageDealt * 2;
                combatEventLogger(`Ally ${currentAlly.name}'s attack was CRITICAL!`);
            } else {
                damageDealt = damageDealt;  //if RNG misses, return normal damage 
            }
            allyDealing(damageDealt, data, skill)
        }   else {
            combatEventLogger(`Ally ${currentAlly.name}'s attack missed!`);

            isPlayerTurn = false; //on skill use, change the turn to the opponent's turn
            turnBaseSystem(); //Pass the turn to the enemy
        }

    }

    //Allowing opponent to use attacks
    let isPlayerTurn = true;
    function turnBaseSystem() {
        if (!isPlayerTurn) {

            const moveUsed = currentOpponent.moves[RNG(currentOpponent.moves.length-1)];
            if (RNG(100) < moveUsed.chance) {
                let damageDealt = moveUsed.damage;
                if (RNG(100) < 15 ) {
                    damageDealt = damageDealt * 2;
                    combatEventLogger(`Enemy's attack was CRITICAL!`);
                } else {
                    damageDealt = damageDealt;  //if RNG misses, return normal damage 
                }
                enemyDealing(damageDealt, moveUsed)
            } else {
                combatEventLogger(`Enemy's attack missed!`);
            }

            setTimeout(() => {isPlayerTurn = true}, 1500 )
        } else return
    }

    //Function to actually inflict the damage onto ally pokemon
    function enemyDealing(damage, skill) {
        const allyHP = document.querySelector("#allyHP");
        let HPval = parseInt(allyHP.textContent);

        if (HPval > 0 ){ //if ally HP is greater than 0 (aka not dead) deal the damage number
            HPval = HPval - damage;
            if (HPval > 0) { //if ally HP after taking damage is not 0 or less, return the attack event
                allyHP.textContent = HPval

                //PATCHING HP DATA
                allyDataPatcher({health: HPval})

                combatEventLogger(`Enemy ${currentOpponent.name} used ${skill.name} and dealt ${damage} damage`);

            }   else { //if ally is dead, indicate death, and also return back to the main play screen
                const allyPokemon = document.querySelector("#allyPokemon")
                allyPokemon.style.animation = "shake 0.5s";
                allyHP.textContent = 0;

                //PATCHING FAINT STATUS
                allyDataPatcher({health: 0})
                allyDataPatcher({is_fainted: true})

                setTimeout(() => {
                    allyPokemon.src = " ";
                    document.querySelector("#allyHP").textContent = "fainted";
                    allyPokemon.style.animation = "none"
                }, 1500)
                setTimeout(()=> {
                    combatScreen.style.display = "none";
                    mainScreen.style.display = "block";
                    // document.querySelector("#allyPokemon").src = " ";
                    // document.querySelector("#allyHP").textContent = " ";
                    skillDeloader();
                    combatHistoryClear();
                    
                    combatStatus = false; //exits combat status so that you can move the character again
                    bagScreenChange();
                }, 3000)
                eventHistoryLogger(`Your pokemon was defeated by the enemy ${currentOpponent.name}`)
                combatEventLogger(`${currentAlly.name} has fainted`);
            }
        }   else return
    }


    //Function to actually inflict the damage onto the enemy
    function allyDealing(damage, data, skill) {
        const opponentHP = document.querySelector("#opponentHP");
        let HPval = parseInt(opponentHP.textContent);

        if (HPval > 0 ){ //if enemy HP is greater than 0 (aka not dead) deal the damage number
            HPval = HPval - damage;
            if (HPval > 0) { //if enemy HP after taking damage is not 0 or less, return the attack event
                opponentHP.textContent = HPval
                currentOpponent.health = HPval
                combatEventLogger(`Ally ${data.name} used ${skill.name} and dealt ${damage} damage`);

                isPlayerTurn = false; //on skill use, change the turn to the opponent's turn
                turnBaseSystem(); //Pass the turn to the enemy
            }   else { //if enemy is dead, indicate death, and also return back to the main play screen
                const opponentPokemon = document.querySelector("#opponentPokemon")
                opponentPokemon.style.animation = "shake 0.5s";
                setTimeout(() => {
                    opponentPokemon.src = " ";
                    document.querySelector("#opponentHP").textContent = "fainted";
                    opponentPokemon.style.animation = "none"
                }, 1500)
                setTimeout(()=> {
                    combatScreen.style.display = "none";
                    mainScreen.style.display = "block";
                    // document.querySelector("#allyPokemon").src = " ";
                    // document.querySelector("#allyHP").textContent = " ";
                    skillDeloader();
                    combatHistoryClear();
                    bagScreenChange();
                    allyDataPatcher({health: parseInt(document.querySelector("#allyHP").textContent)});
                    combatStatus = false; 
                    isPlayStatus = true;
                }, 3000)
                eventHistoryLogger(`You defeated the enemy ${currentOpponent.name}`);
                combatEventLogger(`${currentOpponent.name} has fainted`);
            }
        }   else return
    }

    //Bag Screen function codes

    //Load pokemon list
    pokemonListLoader();
    function pokemonListLoader() {
        fetch("http://localhost:3000/capturedPokemon/")
        .then(res => res.json())
        .then(data => {
            data.forEach(poke => {
                const pokeList = document.querySelector("#pokemonList");
                const newDiv = document.createElement("div");
                const newDet = document.createElement("div");
                const newTag = document.createElement("p");
                const newImg = document.createElement("img");

                newDet.textContent = poke.name;
                pokeList.appendChild(newDet);

                newDet.appendChild(newDiv);

                newImg.src = poke.front_sprite;
                newDiv.appendChild(newImg)

                newTag.textContent = `Hp: ${poke.health}`;
                newDiv.appendChild(newTag);

                newDiv.style.display = "none"
                newDet.addEventListener("click", () => {
                    let toggle = newDiv.style.display;
                    if (toggle === "none"){
                        newDiv.style.display = "block";
                        toggle = "block";
                    } else {
                        newDiv.style.display = "none";
                        toggle = "none"
                    }
                })
            })
        })
        .catch(e => console.log(e))
    }

    //Load items count
    itemsCountLoader();
    function itemsCountLoader() {
        let itemCountArray = [];
        fetch("http://localhost:3000/bagItems/")
        .then(res => res.json())
        .then(data => {
            data = data[0];
            for (let item in data) {
                itemCountArray.push(data[item])
            }
            document.querySelector("#pokeballCount").textContent = itemCountArray[1];
            document.querySelector("#masterballCount").textContent = itemCountArray[2];
            document.querySelector("#potionCount").textContent = itemCountArray[3];
            document.querySelector("#gPotionCount").textContent = itemCountArray[4];
        })
        .catch(e => console.log(e))
    }


    //very repetitive code below, Toggle for each item description
    const pokeball = document.querySelector("#pokeball")
    const pokeballDetails = document.querySelector("#pokeballDetails")
    pokeballDetails.style.display = "none"
    pokeball.addEventListener("click", () => {
        let toggle = pokeballDetails.style.display;
        if (toggle === "none"){
            pokeballDetails.style.display = "block";
            toggle = "block";
        } else {
            pokeballDetails.style.display = "none";
            toggle = "none"
        }
    })
    const masterball = document.querySelector("#masterball")
    const masterballDetails = document.querySelector("#masterballDetails")
    masterballDetails.style.display = "none"
    masterball.addEventListener("click", () => {
        let toggle = masterballDetails.style.display;
        if (toggle === "none"){
            masterballDetails.style.display = "block";
            toggle = "block";
        } else {
            masterballDetails.style.display = "none";
            toggle = "none"
        }
    })
    const potion = document.querySelector("#potion")
    const potionDetails = document.querySelector("#potionDetails")
    potionDetails.style.display = "none"
    potion.addEventListener("click", () => {
        let toggle = potionDetails.style.display;
        if (toggle === "none"){
            potionDetails.style.display = "block";
            toggle = "block";
        } else {
            potionDetails.style.display = "none";
            toggle = "none"
        }
    })
    const gPotion = document.querySelector("#gPotion")
    const gPotionDetails = document.querySelector("#gPotionDetails")
    gPotionDetails.style.display = "none"
    gPotion.addEventListener("click", () => {
        let toggle = gPotionDetails.style.display;
        if (toggle === "none"){
            gPotionDetails.style.display = "block";
            toggle = "block";
        } else {
            gPotionDetails.style.display = "none";
            toggle = "none"
        }
    })

    //Potion Function
    //Disabling use buttons when not in combat
    function bagScreenChange() {
        if (!combatStatus) {
            document.querySelector("#usePotion").disabled = true;
            document.querySelector("#useGPotion").disabled = true;
            document.querySelector("#usePokeball").disabled = true;
            document.querySelector("#useMasterball").disabled = true;
        } else {
            document.querySelector("#usePotion").disabled = false;
            document.querySelector("#useGPotion").disabled = false;
            document.querySelector("#usePokeball").disabled = false;
            document.querySelector("#useMasterball").disabled = false;
        }
    }

    document.querySelector("#usePotion").addEventListener("click", () =>{
        const potionCount = document.querySelector("#potionCount");

        if (parseInt(potionCount.textContent) > 0) {
            heal(10);

            combatEventLogger(`You used a potion on ${currentAlly.name}`);

            let newPotionCount = (parseInt(potionCount.textContent) - 1);
            potionCount.textContent = newPotionCount        
            inventoryDataPatcher({potion: newPotionCount})

            bagScreen.style.display = "none"
            combatScreen.style.display = "block";
        } else return
    })

    document.querySelector("#useGPotion").addEventListener("click", () => {
        const gPotionCount = document.querySelector("#gPotionCount");
        
        if (parseInt(gPotionCount.textContent) > 0 ) {
            heal(20);

            combatEventLogger(`You used a great potion on ${currentAlly.name}`);

            let newGPotionCount = (parseInt(gPotionCount.textContent) - 1);
            gPotionCount.textContent = newGPotionCount        
            inventoryDataPatcher({potion: newGPotionCount})

            bagScreen.style.display = "none"
            combatScreen.style.display = "block";
        } else return
        
    })

    function heal(healing) {
        let newHP;
        const allyHP = document.querySelector("#allyHP");
        newHP = parseInt(allyHP.textContent) + healing;
        if (newHP > currentAlly.max_health) {
            allyHP.textContent = currentAlly.max_health;
            console.log("regular heal");
        } else {
            allyHP.textContent = newHP;   
            console.log("healed to max");
        }

        //PATCHING HP DATA
        allyDataPatcher({health: newHP})
    }

    //Pokemon Capturing 
    document.querySelector("#usePokeball").addEventListener("click", () => {
        let pokeballCount = document.querySelector("#pokeballCount")
        if (parseInt(pokeballCount.textContent) > 0) {
            let newPokeballCount = (parseInt(pokeballCount.textContent) - 1);
            pokeballCount.textContent = newPokeballCount        
            inventoryDataPatcher({pokeball: newPokeballCount})

            pokemonCapture(50)
        }
    })
    document.querySelector("#useMasterball").addEventListener("click", () => {
        let masterballCount = document.querySelector("#masterballCount")

        if (parseInt(masterballCount.textContent) > 0) {
            let newMasterballCount = (parseInt(masterballCount.textContent) - 1);
            masterballCount.textContent = newMasterballCount        
            inventoryDataPatcher({masterball: newMasterballCount})

            pokemonCapture(75)
        }
    })

    function pokemonCapture(rate) {
            if (currentOpponent.health > 5 ) {
                if (RNG(100) < rate) {
                    pokemonCaptureSucess(currentOpponent)
                } else pokemonCaptureFail()
            } else {
                if (RNG(100) < rate*2) {
                    pokemonCaptureSucess(currentOpponent)
                } else pokemonCaptureFail()
            }
        } 


    function inventoryDataPatcher(item) {
        fetch(`http://localhost:3000/bagItems/1`, {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(item)
        })
        .catch(e => console.log(e));
    }

    function pokemonCaptureSucess(poke) {
        bagScreen.style.display = "none";
        combatScreen.style.display = "block";
        opponentPokemon.style.animation = "shake 0.5s";
        setTimeout(() => {
            combatLeave(`Successfully captured the ${poke.name}!`);
            opponentPokemon.style.animation = "none";
        }, 2000)

        //update pokemonlist
        console.log(poke);
        const pokeList = document.querySelector("#pokemonList");
        const newDiv = document.createElement("div");
        const newDet = document.createElement("div");
        const newTag = document.createElement("p");
        const newImg = document.createElement("img");

        newDet.textContent = poke.name;
        pokeList.appendChild(newDet);

        newDet.appendChild(newDiv);

        newImg.src = poke.front_sprite;
        newDiv.appendChild(newImg)

        newTag.textContent = `Hp: ${poke.health}`;
        newDiv.appendChild(newTag);

        newDiv.style.display = "none"
        newDet.addEventListener("click", () => {
            let toggle = newDiv.style.display;
            if (toggle === "none"){
                newDiv.style.display = "block";
                toggle = "block";
            } else {
                newDiv.style.display = "none";
                toggle = "none"
            }
        })

        newPokemonAdder(currentOpponent);
    }

    function pokemonCaptureFail() {
        combatEventLogger(`Failed to capture the ${currentOpponent.name}`)
    }

    //implementing persistency 
    function allyDataPatcher(data) { //input an object with the data to update
        fetch(`http://localhost:3000/capturedPokemon/${currentAlly.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        })
        .catch(e => console.log(e))
    }

    function newPokemonAdder(data) {
        currentOpponent = delete currentOpponent.id;
        fetch(`http://localhost:3000/capturedPokemon/`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        })
        .catch(e => console.log(e))
    }

    //creating Re-Usable functions
    function combatLeave(message) {
        combatScreen.style.display = "none";
        mainScreen.style.display = "block"
        const newEvent = document.createElement("p");
        newEvent.textContent = message;
        eventHistory.appendChild(newEvent);
        eventHistory.scrollTop = eventHistory.scrollHeight;
        combatStatus = false;
        bagScreenChange();
        skillDeloader();
        combatHistoryClear();
        isPlayStatus = true;
    }

    function combatEventLogger(message) {
        const combatEvent = document.createElement("p");
        combatEvent.textContent = message;
        combatHistory.appendChild(combatEvent);
        combatHistory.scrollTop = combatHistory.scrollHeight;
    }

    function eventHistoryLogger(message) {
        const addEvent = document.createElement("p");
        addEvent.textContent = message;
        eventHistory.appendChild(addEvent);
        eventHistory.scrollTop = eventHistory.scrollHeight;
    }
}

document.addEventListener("DOMContentLoaded", mainFunction())