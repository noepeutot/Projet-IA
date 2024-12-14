import { dfs } from '../algorithms/dfs.js';
import { bfs } from '../algorithms/bfs.js';
import { Maze } from '../classes/Maze.js';
import { Player } from '../classes/Player.js';

const mazeContainer = document.getElementById('maze-container');
const algoSelect = document.getElementById('algo-select');
const generateButton = document.getElementById('generate-maze');
const applyAlgoButton = document.getElementById('apply-algo');
const mazeSizeInput = document.getElementById('maze-size');
const timerElement = document.getElementById('timer');
const restartButton = document.getElementById('restart-timer');
const bestTimesContainer = document.getElementById('best-times');


let maze;
let player;
let startTime;
let timerStarted = false;
let timerInterval;

/**
 * Initialisation du labyrinthe et du joueur au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    generateNewMaze();
});

/**
 * Met à jour l'affichage du timer
 */
function updateTimer() {
    // Vérifier si le timer est en cours
    if (!timerStarted) {
        return;
    }

    // Calculer le temps écoulé
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);

    // Mettre à jour l'affichage du timer
    timerElement.textContent = `Temps: ${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
}

/**
 * Réinitialise le timer
 */
function resetTimer() {
    // Vérifier si le timer est en cours
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Réinitialiser le timer
    timerStarted = false;
    timerElement.textContent = 'Temps: 0:00:00';
}

/**
 * Générer un nouveau labyrinthe
 */
function generateNewMaze() {
    // Réinitialiser le timer
    resetTimer();

    // Vérifier la taille du labyrinthe
    const size = parseInt(mazeSizeInput.value);
    if (size < 5 || size > 30) {
        alert('La taille doit être comprise entre 5 et 30');
        return;
    }

    // Afficher les meilleurs temps pour cette taille
    displayBestTimes(size);

    // Créer le joueur et le labyrinthe
    player = new Player('Joueur 1');
    maze = new Maze(size, size);

    // Ajouter le joueur au labyrinthe
    maze.addPlayer(player, maze.getStartCell());

    // Afficher le labyrinthe
    maze.renderMaze(mazeContainer);
}

/**
 * Appliquer l'algorithme de recherche
 */
function applyAlgorithm() {
    console.log('applyAlgorithm');
    // Vérifier si le labyrinthe existe
    if (!maze) {
        alert('Veuillez d\'abord générer un labyrinthe');
        return;
    }
    
    // Vérifier l'algorithme sélectionné
    const selectedAlgo = algoSelect.value;
    if (selectedAlgo === 'dfs') {
        dfs(maze);
        console.log('dfs');
    } else {
        bfs(maze);
        console.log('bfs');
    }
    
    // Afficher le labyrinthe
    maze.renderMaze(mazeContainer);
}

/**
 * Recommencer le labyrinthe
 */
function restartGame() {
    // Réinitialiser le timer
    resetTimer();

    // Réinitialiser la position du joueur au début du labyrinthe et enlever le chemin
    maze.resetMaze();

    // Réafficher le labyrinthe
    maze.renderMaze(mazeContainer);
}

/** 
 * Écouter les événements clavier pour les mouvements du joueur
 */
document.addEventListener('keydown', (event) => {
    let moved = false;

    // Si touche échap, retourner à la page d'accueil
    if (event.key === 'Escape') {
        window.location.href = 'home.html';
    }

    // Si touche espace, recommencer le labyrinthe
    if (event.key === ' ') {
        restartGame();
        return;
    }

    // Si touche haut, déplacer le joueur vers le haut
    if (event.key === 'ArrowUp' || event.key === 'z') {
        moved = maze.movePlayer(player, 'up');
    }
    // Si touche droite, déplacer le joueur vers la droite
    else if (event.key === 'ArrowRight' || event.key === 'd') {
        moved = maze.movePlayer(player, 'right');
    }
    // Si touche bas, déplacer le joueur vers le bas
    else if (event.key === 'ArrowDown' || event.key === 's') {
        moved = maze.movePlayer(player, 'down');
    }
    // Si touche gauche, déplacer le joueur vers la gauche
    else if (event.key === 'ArrowLeft' || event.key === 'q') {
        moved = maze.movePlayer(player, 'left');
    }

    // Vérifier si le joueur a bougé
    if (moved) {
        // Démarrer le timer si ce n'est pas déjà fait
        if (!timerStarted) {
            startTime = Date.now();
            timerStarted = true;
            timerInterval = setInterval(updateTimer, 10);
        }
        maze.renderMaze(mazeContainer);

        // Vérifier si le labyrinthe est terminé
        if (maze.isFinished()) {
            // Arrêter le timer
            clearInterval(timerInterval);

            // Calculer le temps écoulé
            const endTime = Date.now();
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
            
            // Sauvegarder le temps
            saveBestTime(timeTaken, maze.width);
            
            // Afficher le message de succès
            const successMessage = document.getElementById('success-message');
            const successTime = document.getElementById('success-time');
            successTime.textContent = `Temps: ${timeTaken} secondes`;
            successMessage.classList.remove('hidden');
            
            // Faire disparaître le message après 3 secondes
            setTimeout(() => {
                successMessage.classList.add('hidden');
                restartGame();
            }, 3000);
        }
    }
});

/**
 * Écouter les événements du menu et du bouton "Recommencer"
 */
generateButton.addEventListener('click', generateNewMaze);
applyAlgoButton.addEventListener('click', applyAlgorithm);
restartButton.addEventListener('click', restartGame);

/**
 * Sauvegarder le meilleur temps
 */
function saveBestTime(time, mazeSize) {
    // Récupérer les meilleurs temps dans le localStorage
    const bestTimes = JSON.parse(localStorage.getItem('bestTimes') || '{}');

    // Récupérer la taille du labyrinthe
    const sizeKey = `size${mazeSize}`;
    
    // Vérifier si la taille existe déjà dans les meilleurs temps
    if (!bestTimes[sizeKey]) {
        bestTimes[sizeKey] = [];
    }
    
    // Ajouter le temps à la taille
    bestTimes[sizeKey].push(time);

    // Trier les temps pour garder les 3 meilleurs
    bestTimes[sizeKey].sort((a, b) => a - b);
    bestTimes[sizeKey] = bestTimes[sizeKey].slice(0, 3);
    
    localStorage.setItem('bestTimes', JSON.stringify(bestTimes));
    displayBestTimes(mazeSize);
}

/**
 * Afficher les meilleurs temps
 */
function displayBestTimes(mazeSize) {
    // Récupérer les meilleurs temps dans le localStorage
    const bestTimes = JSON.parse(localStorage.getItem('bestTimes') || '{}');

    // Récupérer la taille du labyrinthe
    const sizeKey = `size${mazeSize}`;
    
    // Créer le HTML pour afficher les meilleurs temps
    let html = `<h4>Taille ${mazeSize}x${mazeSize}</h4>`;
    
    // Vérifier si la taille existe dans les meilleurs temps
    if (bestTimes[sizeKey] && bestTimes[sizeKey].length > 0) {
        // Afficher les meilleurs temps
        bestTimes[sizeKey].forEach((time, index) => {
            html += `<div class="best-time-entry">${index + 1}. <span>${time}s</span></div>`;
        });
    } else {
        html += '<div id="empty-best-times">Aucun temps enregistré</div>';
    }
    
    // Afficher les meilleurs temps
    bestTimesContainer.innerHTML = html;
}
