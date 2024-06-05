document.addEventListener('DOMContentLoaded', () => {
    // Declare necessary variables
    let trashItems = [];
    let assignedTrashItems = {};
    const trashItemsContainer = document.getElementById('trash-items-container');
    const resultsContainer = document.getElementById('results');
    const gameContainer = document.getElementById('game-container');
    const resultsSection = document.getElementById('results-container');

    // Load trash items from the JSON file
    fetch('assets/json/dechets.json')
        .then(response => response.json())
        .then(data => {
            trashItems = data;
            startGame();
        });

    // Function to start the game
    function startGame() {
        // Shuffle and select 10 trash items
        trashItems = trashItems.sort(() => 0.5 - Math.random()).slice(0, 10);
        trashItemsContainer.innerHTML = '';
        assignedTrashItems = {};
        trashItems.forEach(trash => {
            // Create trash item elements and set their properties
            const trashElement = document.createElement('div');
            trashElement.className = 'trash-item';
            trashElement.dataset.name = trash.nom;
            trashElement.innerHTML = `<i class="fas"><img src="assets/icon/${trash.icone}.png" class="icon" draggable="false"><hr><span class="trash-name">${trash.nom}</span></i>`;
            trashElement.draggable = true;
            trashElement.ondragstart = dragStart;
            trashItemsContainer.appendChild(trashElement);
        });

        // Set up drag & drop events for the bins
        document.querySelectorAll('.bin').forEach(bin => {
            bin.ondragover = dragOver;
            bin.ondrop = drop;
        });

        // Set up button click events
        document.getElementById('verify').onclick = verifyResults;
        document.getElementById('restart').onclick = () => location.reload();
        document.getElementById('return').onclick = returnToGame;
    }

    // Function triggered when dragging starts
    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.name);
        setTimeout(() => event.target.style.visibility = 'hidden', 0);
    }

    // Function to allow the drop
    function dragOver(event) {
        event.preventDefault();
    }

    // Function to handle the drop of an item into a bin
    function drop(event) {
        event.preventDefault();
        const trashName = event.dataTransfer.getData('text/plain');
        assignedTrashItems[trashName] = event.target.dataset.type;

        const trashElement = Array.from(document.querySelectorAll('.trash-item')).find(el => el.dataset.name === trashName);
        if (trashElement) {
            trashElement.style.visibility = 'visible';
            trashElement.style.display = 'none';
        }
    }

    // Function to verify the results
    function verifyResults() {
        resultsContainer.innerHTML = '';
        let score = 0;
        trashItems.forEach(trash => {
            const result = document.createElement('div');
            const assignedType = assignedTrashItems[trash.nom];
            if (assignedType === trash.type) {
                score++;
                result.innerHTML = `<i class="fas fa-check"></i> ${trash.nom} - Correct`;
                result.style.color = 'green';
            } else {
                result.innerHTML = `<i class="fas fa-times"></i> ${trash.nom} - Incorrect (Should be in ${trash.type})`;
                result.style.color = 'red';
            }
            resultsContainer.appendChild(result);
        });
        const scoreElement = document.createElement('div');
        scoreElement.innerHTML = `<strong>Score: ${score}/10</strong>`;
        resultsContainer.appendChild(scoreElement);

        gameContainer.classList.add('hidden');
        resultsSection.classList.remove('hidden');
    }

    // Function to return to the game and restart
    function returnToGame() {
        gameContainer.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        startGame();
    }
});
