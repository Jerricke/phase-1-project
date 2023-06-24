function mainFunction() {
    const bagScreen = document.getElementById("bagScreen");
    const mainScreen = document.getElementById("mainScreen");
    const combatScreen = document.getElementById("combatScreen");
    const mainMenuScreen = document.getElementById("mainMenuScreen");
    const eventHistory = document.querySelector("#eventHistory");
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
                        } else return
        
                        break;
                    case "ArrowLeft":
                        
                        if (currentPosition[0] > 1) {
                            coordinateRemover(currentPosition)
                            currentPosition = [currentPosition[0] - 1, currentPosition[1]]
                            coordinateSetter(currentPosition)
                        } else return
        
                        break;
                    case "ArrowDown":
                        
                        if (currentPosition[1] < 3) {
                            coordinateRemover(currentPosition)
                            currentPosition = [currentPosition[0], currentPosition[1] + 1]
                            coordinateSetter(currentPosition)
                        } else return
                        
                        break;
                    case "ArrowUp":
        
                        if (currentPosition[1] > 1) {
                            coordinateRemover(currentPosition)
                            currentPosition = [currentPosition[0], currentPosition[1] - 1]
                            coordinateSetter(currentPosition)
                        } else return
                    
                        break;
                    default:
                }
            } else return 
        }
    
        //intilialize first position at [1,1]
        coordinateSetter([1,1])
        
        function coordinateSetter(coords) {
            const coordsDiv = document.getElementById(`${coords}`);
            coordsDiv.classList.add("currentPosition")
            currentPosition = coords;
            probabilityMachine();
        }
    
        function coordinateRemover(coords){
            const coordsDiv = document.getElementById(`${coords}`);
            coordsDiv.classList.remove("currentPosition")
        }
    
    }
    
    //Encounter Probability Section
    function probabilityMachine() {
        let token = Math.floor(Math.random() * 100);
        if (token > 85) {
            // const eventHistory = document.querySelector("#eventHistory")
            const newEvent = document.createElement("p");
            newEvent.textContent = "You just encountered a Pokemon!, combat will start in 3 seconds";
            eventHistory.appendChild(newEvent);
            mockCombatStarter();
        } else return
    }
    
    
    // function pokeFetcher() {
    //     fetch(`https://pokeapi.co/api/v2/pokemon/${Math.ceil(Math.random() * 350)}`)
    //         .then(res => res.json())
    //         // .then(data => pokeEncounter(data))
    //         .catch(e => console.log(e))
    // }

    function mockCombatStarter() {
        setTimeout( () => {
            mainScreen.style.display = "none";
            combatScreen.style.display = "block";
        }, 3000)
        combatStatus = true;
        
        fetch("http://localhost:3000/pokemon/")
            .then(res => res.json())
            .then(data => combatFunction(data))
            .catch(e => console.log(e))
    }
    //POKEMON COMBAT FUNCTION
    function combatFunction(data) {

        const opponentPokemon = document.querySelector("#opponentPokemon")
        const opponentHP = document.querySelector("#opponentHP")
        const allyPokemon = document.querySelector("#allyPokemon")
        const allyHP = document.querySelector("#allyHP")

        opponentPokemon.src = data[0].front_sprite;
        opponentHP.textContent = data[0].health;
        
        allyPokemon.src = data[1].back_sprite;
        allyHP.textContent = data[1].health;

        skillLoader(data[1])
    }


    const bagBtn = document.querySelector("#bagBtn")
    const escape = document.querySelector("#escapeBtn")
    const movesList = document.querySelector("#movesList")

    bagBtn.addEventListener('click', () => {
        combatScreen.style.display = "none";
        bagScreen.style.display = "block"
    })

    escape.addEventListener('click', () => {
        combatScreen.style.display = "none";
        mainScreen.style.display = "block"
        const newEvent = document.createElement("p");
        newEvent.textContent = "You escaped the Pokemon! Retreating is always an option";
        eventHistory.appendChild(newEvent);
        combatStatus = false;
        skillDeloader();
    })

    //skill functions
    function skillLoader(data){
        data.moves.forEach( (skill) => {
            const newSkill = document.createElement("button");
            newSkill.textContent = skill.name 
            movesList.appendChild(newSkill)
        }) 
    }

    function skillDeloader() {
        while (movesList.firstChild){
            movesList.removeChild(movesList.firstChild);
        }
    }

}

document.addEventListener("DOMContentLoaded", mainFunction())