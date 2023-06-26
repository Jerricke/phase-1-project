function mainFunction() {
     //SiwtchingScreens
    const bagScreen = document.getElementById("bagScreen");
    const mainScreen = document.getElementById("mainScreen");
    const combatScreen = document.getElementById("combatScreen");
    const mainMenuScreen = document.getElementById("mainMenuScreen");
    const eventHistory = document.querySelector("#eventHistory");
    const movesList = document.querySelector("#movesList")
    let combatStatus = false;

    combatScreen.style.display = "none";
    bagScreen.style.display = "none";
    mainScreen.style.display = "none";
    mainMenuScreen.style.display = "block";

    document.getElementById("gameStart").addEventListener('click', () => {
        mainMenuScreen.style.display = "none"
        mainScreen.style.display = "block";
    })

    document.getElementById("bag").addEventListener('click', () => {
        mainScreen.style.display = "none";
        bagScreen.style.display = "block"
    })

    document.getElementById("main-menu").addEventListener('click', () =>{
        mainScreen.style.display = "none";
        mainMenuScreen.style.display = "block";
    })

    document.getElementById("returnToMain").addEventListener('click', () => {
        if (!combatStatus){
            bagScreen.style.display = "none"
            mainScreen.style.display = "block";
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
         combatScreen.style.display = "none";
         mainScreen.style.display = "block"
         const newEvent = document.createElement("p");
         newEvent.textContent = "You escaped the Pokemon!";
         eventHistory.appendChild(newEvent);
         combatStatus = false;
         skillDeloader();
         combatHistoryClear();
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
            if (!combatStatus) {
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
            } else return console.log("still in combat");
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
        if (token) {
            // const eventHistory = document.querySelector("#eventHistory")
            const newEvent = document.createElement("p");
            newEvent.textContent = "You just encountered a Pokemon!, combat will start in 3 seconds";
            eventHistory.appendChild(newEvent);
            mockCombatStarter();
        } else return
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
        
        //Load encounter pokemon
        fetch("http://localhost:3000/pokemon/")
            .then(res => res.json())
            .then(data => opponentLoader(data))
            .catch(e => console.log(e))

        //Load player pokemon 
        fetch("http://localhost:3000/capturedPokemon/")
            .then(res => res.json())
            .then(data => allyLoader(data, 0))
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

        skillLoader(data[0])
    }

    let currentOpponent = {};
    function opponentLoader(data) {
        data = data[RNG(data.length - 1 )]
        currentOpponent = data;
        const opponentPokemon = document.querySelector("#opponentPokemon")
        const opponentHP = document.querySelector("#opponentHP")
    
        opponentPokemon.src = data.front_sprite;
        opponentHP.textContent = data.health;

        const combatEvent = document.createElement("p");
        combatEvent.textContent = `A wild ${data.name} appears!`;
        combatHistory.appendChild(combatEvent);
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
                const combatEvent = document.createElement("p");
                combatEvent.textContent = `Ally ${currentAlly.name}'s attack was CRITICAL!`;
                combatHistory.appendChild(combatEvent)
            } else {
                damageDealt = damageDealt;  //if RNG misses, return normal damage 
            }
            allyDealing(damageDealt, data, skill)
        }   else {
            const combatEvent = document.createElement("p");
            combatEvent.textContent = `Ally ${currentAlly.name}'s attack missed!`;
            combatHistory.appendChild(combatEvent);

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
                    const combatEvent = document.createElement("p");
                    combatEvent.textContent = `Enemy's attack was CRITICAL!`;
                    combatHistory.appendChild(combatEvent)
                } else {
                    damageDealt = damageDealt;  //if RNG misses, return normal damage 
                }
                enemyDealing(damageDealt, moveUsed)
            } else {
                const combatEvent = document.createElement("p");
                combatEvent.textContent = `Enemy's attack missed!`;
                combatHistory.appendChild(combatEvent);
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
                const combatEvent = document.createElement("p");
                combatEvent.textContent = `Enemy ${currentOpponent.name} used ${skill.name} and dealt ${damage} damage`;
                combatHistory.appendChild(combatEvent);

            }   else { //if ally is dead, indicate death, and also return back to the main play screen
                const allyPokemon = document.querySelector("#allyPokemon")
                allyPokemon.style.animation = "shake 0.5s";
                setTimeout(() => {
                    allyPokemon.src = " ";
                    document.querySelector("#allyHP").textContent = "fainted";
                    allyPokemon.style.animation = "none"
                }, 1500)
                setTimeout(()=> {
                    combatScreen.style.display = "none";
                    mainScreen.style.display = "block";
                    document.querySelector("#allyPokemon").src = " ";
                    document.querySelector("#allyHP").textContent = " ";
                    skillDeloader();
                    combatHistoryClear();
                    
                    combatStatus = false; //exits combat status so that you can move the character again
                }, 3000)
                const newEvent = document.createElement("p");
                newEvent.textContent = `Your pokemon was defeated by the enemy ${currentOpponent.name}`
                eventHistory.appendChild(newEvent);
                const combatEvent = document.createElement("p");
                combatEvent.textContent = `${currentAlly.name} has fainted`
                combatHistory.appendChild(combatEvent);
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
                const combatEvent = document.createElement("p");
                combatEvent.textContent = `Ally ${data.name} used ${skill.name} and dealt ${damage} damage`;
                combatHistory.appendChild(combatEvent);

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
                    document.querySelector("#allyPokemon").src = " ";
                    document.querySelector("#allyHP").textContent = " ";
                    skillDeloader();
                    combatHistoryClear();
                    
                    combatStatus = false; //exits combat status so that you can move the character again
                }, 3000)
                const newEvent = document.createElement("p");
                newEvent.textContent = `You defeated the enemy ${currentOpponent.name}`
                eventHistory.appendChild(newEvent);
                const combatEvent = document.createElement("p");
                combatEvent.textContent = `${currentOpponent.name} has fainted`
                combatHistory.appendChild(combatEvent);
            }
        }   else return
    }

    //Bag Screen function codes

    //very repetitive code below
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
    document.querySelector("#usePotion").addEventListener("click", () =>{
        heal(10);

        const combatEvent = document.createElement("p");
        combatEvent.textContent = `You used a potion on ${currentAlly.name}`;
        combatHistory.appendChild(combatEvent);

        bagScreen.style.display = "none"
        combatScreen.style.display = "block";
    })

    document.querySelector("#useGPotion").addEventListener("click", () => {
        heal(20);

        const combatEvent = document.createElement("p");
        combatEvent.textContent = `You used a great potion on ${currentAlly.name}`;
        combatHistory.appendChild(combatEvent);

        bagScreen.style.display = "none"
        combatScreen.style.display = "block";
    })

    function heal(healing) {
        let newHP;
        const allyHP = document.querySelector("#allyHP");
        newHP = parseInt(allyHP.textContent) + healing;
        if (newHP > currentAlly.max_health) {
            allyHP.textContent = currentAlly.max_health;
        } else {
            allyHP.textContent = newHP;   
        }
    }
}

document.addEventListener("DOMContentLoaded", mainFunction())