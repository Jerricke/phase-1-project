function mainFunction() {
     //SiwtchingScreens
    const bagScreen = document.getElementById("bagScreen");
    const mainScreen = document.getElementById("mainScreen");
    const combatScreen = document.getElementById("combatScreen");
    const mainMenuScreen = document.getElementById("mainMenuScreen");
    const gameOverScreen = document.getElementById("gameOverScreen");
    const eventHistory = document.querySelector("#eventHistory");
    const movesList = document.querySelector("#movesList")
    const starterDiv = document.querySelector("#starterPokemons");
    let combatStatus = false;
    let isPlayStatus = false;
    const MMAudio = new Audio("./src/audio_files/Opening.mp3");
    MMAudio.loop = true;
    const gameAudio = new Audio("./src/audio_files/Road.mp3");
    gameAudio.loop = true;
    const combatAudio = new Audio("./src/audio_files/Battle.mp3");
    combatAudio.loop = true;
    const victoryAudio = new Audio("./src/audio_files/Victory.mp3");
    const endingAudio = new Audio("./src/audio_files/Ending.mp3");

    pokemonListLoader();
    bagScreenChange();
    swapperButtonUpdater();

    MMAudio.currentTime = 13;
    MMAudio.play();

    combatScreen.style.display = "none";
    bagScreen.style.display = "none";
    mainScreen.style.display = "none";
    mainMenuScreen.style.display = "block";
    gameOverScreen.style.display = "none";
    starterDiv.style.display = "none";

    document.getElementById("gameContinue").addEventListener('click', () => {
        fetch("http://localhost:3000/capturedPokemon")
            .then(res => res.json())
            .then(data => {
                if (data.length !== 0) {
                    loadGameScreen();
                } else alert("Please start new game!")
            })
    })

    document.getElementById("resetGame").addEventListener("dblclick", () => {
        const length = document.querySelectorAll("#pokemonList > div").length;
        for (let i = 1; i <= length; i ++) {  //changed from 2->1
            fetch(`http://localhost:3000/capturedPokemon/${i}`, {method: "DELETE"}) 
        }
        alert("Your game has been reset!")
    })

    document.getElementById("gameStart").addEventListener('click', () => {
        fetch("http://localhost:3000/capturedPokemon")
            .then(res => res.json())
            .then(data => {
                if (data.length == 0) {
                    let cond = starterDiv.style.display;
                    if (cond === "none") {
                        starterDiv.style.display = "block";
                    } else {
                        starterDiv.style.display = "none";
                    }
                } else alert("Please reset the game first")
            })
    })

    document.getElementById("bag").addEventListener('click', () => {
        mainScreen.style.display = "none";
        bagScreen.style.display = "block";
        isPlayStatus = false;
    })

    document.getElementById("main-menu").addEventListener('click', () =>{
        mainScreen.style.display = "none";
        mainMenuScreen.style.display = "block";

        gameAudio.pause();
        MMAudio.currentTime = 13;
        MMAudio.play();
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
        pokemonListDeLoader();
        pokemonListLoader();
        swapperButtonUpdater();
        
        //currentpokemon selector
        setTimeout( () => {
            combatScreen.style.display = "none";
            bagScreen.style.display = "block"
            let arrayOfPokemon = document.querySelectorAll("#pokemonList > div")
            arrayOfPokemon[`${currentAlly.id-1}`].classList.add("currentPokemon")
        }, 75)
    })
 
    document.querySelector("#escapeBtn").addEventListener('click', () => {
         combatLeave("You escaped the Pokemon!");

         combatAudio.pause();
         gameAudio.currentTime = 0;
         gameAudio.play();
    })

    //Selecting starter pokemon
    document.querySelector("#charmanderStart").addEventListener('click', () => {
        fetch("http://localhost:3000/pokemon/1")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                starterPokemonPost(data)
            })
            .catch(e => console.log(e))
            starterDiv.style.display = "none"
    })
    document.querySelector("#squirtleStart").addEventListener('click', () => {
        fetch("http://localhost:3000/pokemon/7")
            .then(res => res.json())
            .then(data => {
                starterPokemonPost(data)
            })
            .catch(e => console.log(e))
            starterDiv.style.display = "none"
    })
    document.querySelector("#bulbasaurStart").addEventListener('click', () => {
        fetch("http://localhost:3000/pokemon/3")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                starterPokemonPost(data)
            })
            .catch(e => console.log(e))
            starterDiv.style.display = "none"
    })

    function starterPokemonPost(data) {
        delete data.id;
        fetch("http://localhost:3000/capturedPokemon", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        }).catch(e => console.log(e))

        setTimeout(()=> {loadGameScreen()}, 300);
    }

    function loadGameScreen(){
    mainMenuScreen.style.display = "none"
    mainScreen.style.display = "block";
    isPlayStatus = true;
    MMAudio.pause();
    gameAudio.currentTime = 0;
    gameAudio.play();

    pokemonListDeLoader();
    pokemonListLoader();
    bagScreenChange();
    swapperButtonUpdater();
    }
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
        } else if (token > 75) { //25% chance to encounter
            eventHistoryLogger("You just encountered a Pokemon!, combat will start in 3 seconds");
            mockCombatStarter();
            isPlayStatus = false;

            combatAudio.currentTime = 1;
            combatAudio.play();
            gameAudio.pause();

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
        swapperButtonUpdater()
        
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
                ifLooper();
                function ifLooper() {
                    if (data[i].is_fainted) {      //ensures that we don't load a fainted pokemon
                        i = i + 1;
                        ifLooper();
                    } else return i
                }

                allyLoader(data, i)
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

        setTimeout(()=>activePokemonSwapperBtn(), 1000); //deactivates the swapper button
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

    function eventHistoryClear() {
        while (eventHistory.firstChild){
            eventHistory.removeChild(eventHistory.firstChild);
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
                // allyHP.textContent = 0;
                //PATCHING FAINT STATUS
                allyDataPatcher({health: 0})
                allyDataPatcher({is_fainted: true})

                const newTag = document.getElementById(`${currentAlly.id}_hp`);
                const newBtn = document.createElement("button");
                const newdiv = document.createElement("div");
                newBtn.textContent = "Swap";
                newBtn.id = `${currentAlly.id}`;
                newdiv.appendChild(newBtn)
                newTag.appendChild(newdiv);
                newBtn.addEventListener('click', (e) => {
                    pokemonSwapper(e);
                })

                let available = false;
                setTimeout(() => {
                    allyPokemon.src = " ";
                    document.querySelector("#allyHP").textContent = "fainted";
                    allyPokemon.style.animation = "none"
                    combatEventLogger(`${currentAlly.name} has fainted`);
                    
                    //check for any alive pokemons
                    fetch("http://localhost:3000/capturedPokemon/")
                        .then(res => res.json())
                        .then(data => {
                            try {
                            data.forEach( pokemon => {
                                if (!pokemon.is_fainted) {
                                    throw new Error("found a pokemon, exiting forEach")
                                }
                            })
                        }
                        catch {
                            return available = true
                        }
                    })
                    setTimeout(()=> {
                        if (available) {
                            combatScreen.style.display = "none";
                            bagScreen.style.display = "block";
                            pokemonListDeLoader();
                            pokemonListLoader();
                            swapperButtonUpdater();
                        } else {
                            endingAudio.currentTime = 0;
                            endingAudio.play();
                            combatAudio.pause();

                            combatScreen.style.display = "none";
                            gameOverScreen.style.display = "block";
                            // document.querySelector("#allyPokemon").src = " ";
                            // document.querySelector("#allyHP").textContent = " ";
                            skillDeloader();
                            combatHistoryClear();
                            
                            combatStatus = false; //exits combat status so that you can move the character again
                            isPlayStatus = false;
                            bagScreenChange();
                            swapperButtonUpdater()
                        }
                    }, 2400)
                }, 600)

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
                }, 600)
                setTimeout(()=> {
                    combatScreen.style.display = "none";
                    mainScreen.style.display = "block";
                    // document.querySelector("#allyPokemon").src = " ";
                    // document.querySelector("#allyHP").textContent = " ";
                    skillDeloader();
                    combatHistoryClear();
                    bagScreenChange();
                    swapperButtonUpdater()
                    allyDataPatcher({health: parseInt(document.querySelector("#allyHP").textContent)});
                    combatStatus = false; 
                    isPlayStatus = true;

                    victoryAudio.pause();
                    gameAudio.currentTime = 0;
                    gameAudio.play();
                }, 3000)
                eventHistoryLogger(`You defeated the enemy ${currentOpponent.name}`);
                combatEventLogger(`${currentOpponent.name} has fainted`);

                victoryAudio.currentTime = 1;
                victoryAudio.play();
                combatAudio.pause();
            }
        }   else return
    }

    //Bag Screen function codes

    //Load pokemon list
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
                const newBtn = document.createElement("button");
                const newdiv = document.createElement("div");

                newDet.textContent = poke.name;
                newDet.classList.add(`${poke.is_fainted}_boxer`)
                pokeList.appendChild(newDet);

                newDet.appendChild(newDiv);

                newImg.src = poke.front_sprite;
                newDiv.appendChild(newImg)

                newTag.textContent = `Hp: ${poke.health}    `;
                newTag.id = `${poke.id}_hp`
                newDiv.appendChild(newTag);

                newBtn.textContent = "Swap";
                newBtn.id = `${poke.id}`;
                newdiv.appendChild(newBtn)
                newTag.appendChild(newdiv);
                newBtn.addEventListener('click', (e) => {
                    pokemonSwapper(e);
                })

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

    function pokemonListDeLoader() {   
        const pokemonList = document.querySelector("#pokemonList")
        while (pokemonList.firstChild){
            pokemonList.removeChild(pokemonList.firstChild);
        }
    }

    //Pokemon Swapper via List buttons
    function pokemonSwapper(e) {

        fetch(`http://localhost:3000/capturedPokemon/${e.target.id}`)
        .then(res => res.json())
        .then(data => {
            deActivePokemonSwapperBtn();
            if (!data.is_fainted) {
                skillDeloader();
                let arrayOfPokemon = document.querySelectorAll("#pokemonList > div")
                arrayOfPokemon[`${currentAlly.id-1}`].classList.remove("currentPokemon")
                currentAlly = data;
                const allyPokemon = document.querySelector("#allyPokemon")
                const allyHP = document.querySelector("#allyHP")
    
                allyPokemon.src = data.back_sprite;
                allyHP.textContent = data.health;
    
                skillLoader(data)
                activePokemonSwapperBtn();

                bagScreen.style.display = "none"
                combatScreen.style.display = "block";
            } else {
                alert(`That ${data.name} has fainted`)
                activePokemonSwapperBtn();
            }
        })

    }

    //Updates the buttons to disabled/not disabled depending if you player is in combat
    function swapperButtonUpdater() {
        setTimeout( () => {
            const swapperBtn = document.querySelectorAll("p div button");
            if (!combatStatus) {
                for (let index = 0; index < swapperBtn.length; index++) {
                    swapperBtn[index].disabled = true; 
                } 
            } else {
                for (let index = 0; index < swapperBtn.length; index++) {
                    swapperBtn[index].disabled = false; 
                } 
            }
        }, 1000) //add timeout so that fetch finishes before grabbing elements 
    }

    //Aditional condition for the swapperbutton 
    function activePokemonSwapperBtn() {
        const currentBtn = document.getElementById(`${currentAlly.id}`);
        currentBtn.disabled = true;
    }

    function deActivePokemonSwapperBtn() {
        const currentBtn = document.getElementById(`${currentAlly.id}`);
        currentBtn.disabled = false;
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
            newHP = currentAlly.max_health;
            allyHP.textContent = newHP;
        } else {
            allyHP.textContent = newHP;   
        }

        //PATCHING HP DATA
        allyDataPatcher({health: newHP})
        document.getElementById(`${currentAlly.id}_hp`).textContent = `Hp: ${newHP}    `;
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
        const pokeList = document.querySelector("#pokemonList");
        const newDiv = document.createElement("div");
        const newDet = document.createElement("div");
        const newTag = document.createElement("p");
        const newImg = document.createElement("img");
        const newBtn = document.createElement("button");
        const newdiv = document.createElement("div")

        newDet.textContent = poke.name;
        newDet.classList.add(`${poke.is_fainted}_boxer`)
        pokeList.appendChild(newDet);

        newDet.appendChild(newDiv);

        newImg.src = poke.front_sprite;
        newDiv.appendChild(newImg)

        newTag.textContent = `Hp: ${poke.health}    `;
        newTag.id = `${poke.id}_hp`
        newDiv.appendChild(newTag);

        newBtn.textContent = "Swap";
        newBtn.id = `${poke.id}`;
        newdiv.appendChild(newBtn)
        newTag.appendChild(newdiv);
        newBtn.addEventListener('click', (e) => {
            pokemonSwapper(e);
        })
 

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

    //Game Over! time to start over and reset all data
    const startOver = document.querySelector("#startOver");
    startOver.addEventListener("click", () => {
        const length = document.querySelectorAll("#pokemonList > div").length;
        for (let i = 1; i <= length; i ++) {  //changed from 2->1
            fetch(`http://localhost:3000/capturedPokemon/${i}`, {method: "DELETE"}) 
        }

        fetch("http://localhost:3000/bagItems/1", {
            method : "PATCH",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                "pokeball": 4,
                "masterball": 1,
                "potion": 5,
                "great_potion": 2
            })
        })

        // fetch("http://localhost:3000/capturedPokemon/1", {
        //     method : "PATCH",
        //     headers: {
        //         "Content-Type" : "application/json"
        //     },
        //     body: JSON.stringify({
        //         "health" : 24,
        //         "is_fainted" : false,
        //     })
        // })

        setTimeout( () => {
            pokemonListDeLoader();
            pokemonListLoader();
            fetch("http://localhost:3000/bagItems/1")
                .then(res => res.json())
                .then(data => {
                    document.querySelector("#potionCount").textContent = data.potion;
                    document.querySelector("#gPotionCount").textContent = data.great_potion;
                    document.querySelector("#pokeballCount").textContent = data.pokeball;
                    document.querySelector("#masterballCount").textContent = data.masterball;
                })
        }, 500)

        MMAudio.currentTime = 13;
        MMAudio.play();
        endingAudio.pause();
        
        combatHistoryClear();
        eventHistoryClear();

        gameOverScreen.style.display = "none";
        mainMenuScreen.style.display = "block";

    })




    //creating Re-Usable functions
    function combatLeave(message) {
        combatScreen.style.display = "none";
        mainScreen.style.display = "block"
        eventHistoryLogger(message)
        bagScreenChange();
        swapperButtonUpdater()
        skillDeloader();
        combatHistoryClear();
        combatStatus = false;
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

document.addEventListener("DOMContentLoaded", mainFunction());