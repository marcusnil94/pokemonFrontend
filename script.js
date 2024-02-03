let allPokemonContainer = document.getElementById('poke-container');

console.log("Hej");

function fetchBasePokemon() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then(response => response.json())
        .then(function (allpokemon) {
            appendHeader(); 
            allpokemon.results.forEach(function (pokemon) {
                fetchPokemonData(pokemon);
            })
        })
}

function appendHeader() {
    let caughtPokemonContainer = document.getElementById('poke-container');
    caughtPokemonContainer.innerHTML = "";
    let indexHeader = document.createElement("h1");
    indexHeader.innerText = "151 Original Pokémon!";
    let indexH2 = document.createElement("h2");
    indexH2.innerText = "Klicka på en Pokémon för att gå in och fånga den.";
    
    let showMyPokemonBtn = document.createElement("button");
    showMyPokemonBtn.innerText = "Mina Pokemon!";

    showMyPokemonBtn.addEventListener("click", () => {
        fetchCaughtPokemons();
    })

    showMyPokemonBtn.classList.add("showMyPokemonBtn");
    allPokemonContainer.appendChild(indexHeader);
    allPokemonContainer.appendChild(indexH2);
    allPokemonContainer.appendChild(showMyPokemonBtn);
}

function renderPokemon(pokeData) {
    if (!pokeData) {
        console.error('Error: Ingen data finns.');
        return;
    }

    let pokeContainer = document.createElement("div");
    pokeContainer.classList.add("pokemon-container");
    let pokeName = document.createElement('h4');
    pokeName.innerText = pokeData.name
    let pokeNumber = document.createElement('p');
    pokeNumber.innerText = `#${pokeData.id}`
    let pokeTypes = document.createElement('ul');
    pokeTypes.innerText ="Type: "
    let pokemonId = pokeData.id;

    let pokemonImg = document.createElement("img");
    pokemonImg.style.width = "400px";
    pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`;

    pokeContainer.addEventListener("click", () => {
        printPokemonInfo(pokeData);
    });

    createTypes(pokeData.types, pokeTypes);

    pokeContainer.append(pokeName, pokeNumber, pokeTypes, pokemonImg);
    allPokemonContainer.appendChild(pokeContainer);
}

        function fetchPokemonData(pokemon) {
            let url = pokemon.url;
        
            fetch(url)
                .then(response => response.json())
                .then(function (pokeData) {
                    console.log(pokeData);
                    renderPokemon(pokeData); 
                });
        }
        

function createTypes(types, ul){
    types.forEach(function(type){
    let typeLi = document.createElement('li');
    typeLi.innerText = type['type']['name'];
    ul.append(typeLi)
    })
  }

  

  function printPokemonInfo(pokeData) {
    let pokemonBox = document.getElementById("poke-container");
    let pokemonInfoContainer = document.getElementById("pokemonInfoContainer");
    
    if (!pokemonBox) {
        console.error('Element with ID "pokemonBox" not found.');
        return;
    }

    pokemonBox.innerHTML = "";
    pokemonInfoContainer.innerHTML = "";

    let pokemonHeadline = document.createElement("h2");
    pokemonHeadline.innerText = pokeData.name;

    let pokemonTypeHeader = document.createElement("h2");
    pokemonTypeHeader = "Type: "
    let pokemonType = document.createElement("ul");
    createTypes(pokeData.types, pokemonType);  

    let pokemonId = pokeData.id;

    let pokemonImg = document.createElement("img");
    pokemonImg.style.width = "400px";
    pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`;

    let descriptionInput = document.createElement("input");
    descriptionInput.type = "text";
    descriptionInput.placeholder = "Ange beskrivning";

    let catchBtn = document.createElement('button');
    catchBtn.innerText = "Fånga!";

    let showMyPokemonBtn = document.createElement("button");
    showMyPokemonBtn.innerText = "Mina Pokemon!";

    let homeBtn = document.createElement("button");
    homeBtn.innerText = "Till startsidan";

    homeBtn.addEventListener("click", () => {
        fetchBasePokemon();
    })

    showMyPokemonBtn.addEventListener("click", () => {
        fetchCaughtPokemons();
    })

    
    catchBtn.addEventListener("click", () => {
        catchPokemon(pokeData, descriptionInput.value);  
    });

    pokemonInfoContainer.append(pokemonHeadline, pokemonImg, pokemonTypeHeader, pokemonType, descriptionInput, catchBtn, showMyPokemonBtn, homeBtn);
}

function catchPokemon(pokeData, descriptionInput) {
    
    fetch('http://localhost:8080/caught-pokemon-ids')
        .then(response => response.json())
        .then(function(caughtPokemonIds) {
            
            if (caughtPokemonIds.includes(pokeData.id)) {
                displayMessage(`Du har redan fångat en ${pokeData.name}!`);
                console.error(`Pokemon with ID ${pokeData.id} is already caught.`);
            } else {
                
                let caughtPokemon = {
                    id: pokeData.id,
                    name: pokeData.name,
                    type: pokeData.types.map(type => type.type.name),
                    description: descriptionInput,
                    caught: true
                };

                
                fetch('http://localhost:8080/pokemon', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(caughtPokemon), 
                })
                .then(response => response.json())
                .then(data => {
                    displayMessage(`Du fångade ${pokeData.name}!`);
                    console.log('Pokemon caught and saved:', data);
                })
                .catch(error => console.error('Error catching Pokemon:', error));
            }
        })
        .catch(error => console.error('Error fetching caught Pokemon IDs:', error));
}

function fetchCaughtPokemons() {
    fetch('http://localhost:8080/pokemons') 
        .then(response => response.json())
        .then(function(caughtPokemons) {
            
            renderCaughtPokemons(caughtPokemons);
        })
        .catch(error => console.error('Error fetching pokemons:', error));
}

function renderCaughtPokemons(caughtPokemons) {
    let caughtPokemonContainer = document.getElementById('poke-container');
    let pokemonInfoContainer = document.getElementById("pokemonInfoContainer");

    if (!caughtPokemonContainer) {
        console.error('Element with ID "poke-container" not found.');
        return;
    }
    pokemonInfoContainer.innerHTML = "";
    caughtPokemonContainer.innerHTML = ""; 

    let pokedexHeader = document.createElement("h1");
    pokedexHeader.innerText = "Min Pokédex";

    let homeBtn = document.createElement("button");
    homeBtn.classList.add =("homeBtn");
    homeBtn.innerText = "Till startsidan";
    

    homeBtn.addEventListener("click", () => {
        fetchBasePokemon();
    })

    caughtPokemonContainer.appendChild(pokedexHeader);
    caughtPokemonContainer.appendChild(homeBtn);


    caughtPokemons.forEach(function (pokemon) {
        let caughtPokemonDiv = document.createElement("div");
        let caughtPokemonName = document.createElement('h4');
        let caughtPokemonImg = document.createElement("img");
        let caughtPokemonDescription = document.createElement('p');
        let caughtPokemonTypes = document.createElement('ul');
        let caughtPokemonNr = document.createElement("p");
        let releasePokemonBtn = document.createElement("button");
        let editPokemonBtn = document.createElement("button"); 
        
        caughtPokemonDiv.classList.add("pokemon-container");
        

        releasePokemonBtn.innerText = "Släpp fri!";
        releasePokemonBtn.addEventListener("click", () => {
            deletePokemon(pokemon.id);  
        });

        editPokemonBtn.innerText = "Redigera beskrivning";
        editPokemonBtn.addEventListener("click", () => {
            let newDescription = prompt("Ange ny beskrivning:");
            if (newDescription !== null) {
                updatePokemonDescription(pokemon.id, newDescription);
                displayMessage(`Beskrivning ändrad!`);
            }
        });

        caughtPokemonName.innerText = pokemon.name;
        caughtPokemonNr.innerText = "#" + pokemon.id;
        caughtPokemonImg.style.width = "400px";
        caughtPokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`;
        caughtPokemonDescription.innerText = `Beskrivning: ${pokemon.description}`;
        caughtPokemonTypes.innerText = `Type: ${pokemon.type.join(', ')}`; 

        caughtPokemonDiv.append(caughtPokemonName, caughtPokemonNr, caughtPokemonImg, caughtPokemonDescription, caughtPokemonTypes, releasePokemonBtn, editPokemonBtn); // Add Edit button
        caughtPokemonContainer.appendChild(caughtPokemonDiv);
    });
}

function deletePokemon(pokemonId) {
    console.log(`Deleting Pokemon with ID: ${pokemonId}`);
    fetch(`http://localhost:8080/pokemon?id=${pokemonId}`, {
    method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log(`Pokemon with ID ${pokemonId} deleted successfully.`);
            displayMessage(`Pokemon med id ${pokemonId} släpptes fri!`);
            fetchCaughtPokemons(); 
        } else {
            console.error('Error deleting Pokemon:', response.statusText);
        }
    })
    .catch(error => console.error('Error deleting Pokemon:', error));
}

function updatePokemonDescription(pokemonId, newDescription) {
    fetch(`http://localhost:8080/pokemon/${pokemonId}?description=${newDescription}`, {
        method: 'PATCH',
    })
    .then(response => {
        if (response.ok) {
            console.log(`Pokemon with ID ${pokemonId} description updated successfully.`);
            
            fetchCaughtPokemons(); 
        } else {
            console.error(`Error updating Pokemon with ID ${pokemonId} description:`, response.statusText);
        }
    })
    .catch(error => console.error(`Error updating Pokemon with ID ${pokemonId} description:`, error));
}

function displayMessage(message) {

    alert(message); 
}

fetchBasePokemon();

