//Setting up the coordinate system for the page
function serverCoordinateSystem() {
    //position array
    let currentPosition = [];

    //Coordinate Setup Starts Here
    const coordinateArray = [[1,1], [2,1], [3,1], [4,1], [5,1], 
                             [1,2], [2,2], [3,2], [4,2], [5,2],
                             [1,3], [2,3], [3,3], [4,3], [5,3]];

    coordinateArray.forEach( coordinate => {
        const playArea = document.querySelector(".play-area");
        const coordinatePoint = document.createElement("div");

        // coordinatePoint.textContent = coordinate;
        coordinatePoint.id = coordinate;

        playArea.appendChild(coordinatePoint)
    })
    //Coordinate Setup Ends Here
    
    //Add keydown even listener to allow user to move character
    document.addEventListener('keydown', (e)=> movement(e, currentPosition));

    function movement(e, currentPosition) {
        switch (e.key) {
            case "ArrowRight":

                if (currentPosition[0] < 5) {
                    coordinateRemover(currentPosition)
                    currentPosition = [currentPosition[0] + 1, currentPosition[1]]
                    console.log(currentPosition)
                    coordinateSetter(currentPosition)
                } else return

                break;
            case "ArrowLeft":
                
                if (currentPosition[0] > 1) {
                    coordinateRemover(currentPosition)
                    currentPosition = [currentPosition[0] - 1, currentPosition[1]]
                    console.log(currentPosition)
                    coordinateSetter(currentPosition)
                } else return

                break;
            case "ArrowDown":
                
                if (currentPosition[1] < 3) {
                    coordinateRemover(currentPosition)
                    currentPosition = [currentPosition[0], currentPosition[1] + 1]
                    console.log(currentPosition)
                    coordinateSetter(currentPosition)
                } else return
                
                break;
            case "ArrowUp":

                if (currentPosition[1] > 1) {
                    coordinateRemover(currentPosition)
                    currentPosition = [currentPosition[0], currentPosition[1] - 1]
                    console.log(currentPosition)
                    coordinateSetter(currentPosition)
                } else return
            
                break;
            default:
        }
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

//Pokemon Section
function probabilityMachine() {
    let token = Math.floor(Math.random() * 100);
    if (token > 75) {
        pokeFetcher()
    } else return
}


function pokeFetcher() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${Math.ceil(Math.random() * 350)}`)
        .then(res => res.json())
        .then(data => pokeEncounter(data))
        .catch(e => console.log(e))
}

function pokeEncounter(data) {
    // console.log(data.species.name);
    // console.log(data.sprites.front_default);
    // console.log(data.types[0].type.name);

    //DOM selectors
    const displayName = document.querySelector("#displayName");
    const displayType = document.querySelector("#displayType");
    const displayImg = document.querySelector("#displayImg");

    displayName.textContent = data.species.name;
    displayType.textContent = data.types[0].type.name;
    displayImg.src = data.sprites.front_default;
}

serverCoordinateSystem();