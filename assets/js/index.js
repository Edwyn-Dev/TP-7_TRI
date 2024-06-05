document.addEventListener('DOMContentLoaded', () => {
    // Déclare les variables nécessaires
    let trashItems = []; // Tableau pour stocker les objets de déchets
    let assignedTrashItems = {}; // Objet pour stocker les associations entre les déchets et les bacs
    const trashItemsContainer = document.getElementById('trash-items-container'); // Conteneur pour les éléments de déchets
    const resultsContainer = document.getElementById('results'); // Conteneur pour afficher les résultats
    const gameContainer = document.getElementById('game-container'); // Conteneur du jeu
    const resultsSection = document.getElementById('results-container'); // Section des résultats

    // Charge les objets de déchets depuis un fichier JSON
    fetch('assets/json/dechets.json')
        .then(response => response.json())
        .then(data => {
            trashItems = data; // Assigne les données chargées à la variable trashItems
            startGame(); // Démarre le jeu
        });

    // Fonction pour démarrer le jeu
    function startGame() {
        // Mélange et sélectionne 10 objets de déchets au hasard
        trashItems = trashItems.sort(() => 0.5 - Math.random()).slice(0, 10);
        trashItemsContainer.innerHTML = ''; // Vide le conteneur des objets de déchets
        assignedTrashItems = {}; // Réinitialise les associations
        trashItems.forEach(trash => {
            // Crée les éléments de déchets et définit leurs propriétés
            const trashElement = document.createElement('div');
            trashElement.className = 'trash-item';
            trashElement.dataset.name = trash.nom;
            trashElement.innerHTML = `<i class="fas"><img src="assets/icon/${trash.icone}.png" class="icon" draggable="false"><hr><span class="trash-name">${trash.nom}</span></i>`;
            trashElement.draggable = true; // Rend l'élément draggable
            trashElement.ondragstart = dragStart; // Définit l'événement ondragstart
            trashItemsContainer.appendChild(trashElement); // Ajoute l'élément au conteneur
        });

        // Configure les événements de glisser-déposer pour les bacs
        document.querySelectorAll('.bin').forEach(bin => {
            bin.ondragover = dragOver; // Définit l'événement ondragover
            bin.ondrop = drop; // Définit l'événement ondrop
        });

        // Configure les événements de clic des boutons
        document.getElementById('verify').onclick = verifyResults; // Vérifie les résultats
        document.getElementById('restart').onclick = () => location.reload(); // Redémarre le jeu
        document.getElementById('return').onclick = returnToGame; // Retourne au jeu
    }

    // Fonction déclenchée lorsque le glisser commence
    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.name); // Stocke le nom de l'objet glissé
        setTimeout(() => event.target.style.visibility = 'hidden', 0); // Rend l'objet invisible temporairement
    }

    // Fonction pour permettre le dépôt
    function dragOver(event) {
        event.preventDefault(); // Empêche le comportement par défaut pour permettre le dépôt
    }

    // Fonction pour gérer le dépôt d'un élément dans un bac
    function drop(event) {
        event.preventDefault();
        const trashName = event.dataTransfer.getData('text/plain'); // Récupère le nom de l'objet déposé
        assignedTrashItems[trashName] = event.target.dataset.type; // Associe l'objet au type de bac

        const trashElement = Array.from(document.querySelectorAll('.trash-item')).find(el => el.dataset.name === trashName);
        if (trashElement) {
            trashElement.style.visibility = 'visible'; // Rend l'objet visible
            trashElement.style.display = 'none'; // Cache l'objet de la vue
        }
    }

    // Fonction pour vérifier les résultats
    function verifyResults() {
        resultsContainer.innerHTML = ''; // Vide le conteneur des résultats
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

        gameContainer.classList.add('hidden'); // Cache le conteneur du jeu
        resultsSection.classList.remove('hidden'); // Affiche la section des résultats
    }

    // Fonction pour retourner au jeu et redémarrer
    function returnToGame() {
        gameContainer.classList.remove('hidden'); // Affiche le conteneur du jeu
        resultsSection.classList.add('hidden'); // Cache la section des résultats
        startGame(); // Redémarre le jeu
    }
});
