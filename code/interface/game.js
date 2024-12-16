import { dfs } from '../algorithms/dfs.js';
import { bfs } from '../algorithms/bfs.js';
import { aStar } from '../algorithms/aStar.js';
import { Maze } from '../classes/Maze.js';
import { Player } from '../classes/Player.js';

const mazeContainer = document.getElementById('maze-container');
const algoSelect = document.getElementById('algo-select');
const generateButton = document.getElementById('generate-maze');
const applyAlgoButton = document.getElementById('apply-algo');
const mazeSizeInput = document.getElementById('maze-size');
const timerElement = document.getElementById('timer');
const restartButton = document.getElementById('restart-timer');
const ranking = document.getElementById('ranking');
const bestTimesContainer = document.getElementById('best-times');
const difficultySelector = document.getElementById('difficulty-selector');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');

// Messages de succès et de défaite
const successMessage = document.getElementById('success-message');
const successTime = document.getElementById('success-time');
const defeatMessage = document.getElementById('defeat-message');

let gameMode; // 'speedrun' ou 'vsai'

// Variables pour l'IA
let aiInterval; // Pour stocker l'intervalle de déplacement de l'IA
let aiPlayer; // Le joueur IA
let aiStarted = false; // Indicateur pour savoir si l'IA a commencé à bouger
let aiDifficulty = 'easy'; // Difficulté de l'IA
let aiDifficultyInterval; // Temps entre chaque déplacement de l'IA

let maze; // Le labyrinthe
let player; // Le joueur
let startTime; // Le temps de début
let timerStarted = false; // Indicateur pour savoir si le timer est en cours
let timerInterval; // L'intervalle du timer

/**
 * Initialisation du labyrinthe et du joueur au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    applyCustomColors();
    generateNewMaze();
});

/**
 * Initialisation du jeu
 */
function initGame() {
    // Récupérer le mode et la difficulté depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    gameMode = urlParams.get('mode') || 'speedrun';

    // Cacher/afficher les éléments selon le mode
    if (gameMode === 'speedrun') {
        timerElement.style.display = 'block';
        restartButton.style.display = 'block';
        ranking.style.display = 'block';
        difficultySelector.classList.add('hidden');
    } else {
        timerElement.style.display = 'none';
        restartButton.style.display = 'none';
        ranking.style.display = 'none';
        difficultySelector.classList.remove('hidden');

        // Sélectionner le bouton de difficulté actuel
        difficultyBtns.forEach(btn => {
            if (btn.dataset.difficulty === aiDifficulty) {
                btn.classList.add('selected');
            }
        });

        setAiDifficulty(aiDifficulty);
    }
}

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

    // Si mode vsai, ajouter un joueur IA
    if (gameMode === 'vsai') {
        aiPlayer = new Player('IA');
        maze.addAIPlayer(aiPlayer, maze.getStartCell());
    }

    // Afficher le labyrinthe
    maze.renderMaze(mazeContainer);
}

/**
 * Appliquer l'algorithme de recherche
 */
function applyAlgorithm() {
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
    } if (selectedAlgo === 'aStar') {
        aStar(maze);
        console.log('aStar');
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
    // Arrêter le mouvement de l'IA
    if (aiInterval) {
        stopAIMovement();
    }

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
        // Démarrer l'IA si c'est le premier mouvement
        if (gameMode === 'vsai' && !aiStarted) {
            startAIMovement();
            aiStarted = true;
        }

        // Démarrer le timer si ce n'est pas déjà fait
        if (!timerStarted) {
            startTime = Date.now();
            timerStarted = true;
            timerInterval = setInterval(updateTimer, 10);
        }
        maze.renderMaze(mazeContainer);

        // Vérifier si le labyrinthe est terminé
        if (maze.isFinished()) {
            // Arrêter le mouvement de l'IA
            stopAIMovement();

            // Arrêter le timer
            clearInterval(timerInterval);

            // Calculer le temps écoulé
            const endTime = Date.now();
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

            // Sauvegarder le temps
            saveBestTime(timeTaken, maze.width);

            // Afficher le message de succès
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

/**
 * Appliquer les couleurs personnalisées
 */
function applyCustomColors() {
    // Récupérer les couleurs personnalisées dans le localStorage
    const colors = JSON.parse(localStorage.getItem('mazeColors')) || {
        player: '#f1c40f',
        start: '#27ae60',
        end: '#c0392b'
    };

    // Créer un style pour appliquer les couleurs
    const style = document.createElement('style');
    style.textContent = `
        .player::after { background-color: ${colors.player} !important; }
        .start { background-color: ${colors.start} !important; }
        .end { background-color: ${colors.end} !important; }
    `;
    document.head.appendChild(style);
}

/**
 * Démarre le mouvement automatique de l'IA
 */
function startAIMovement() {
    if (!maze.aiPlayer) return;

    // Calculer le chemin initial vers la sortie
    const aiPath = bfs(maze);
    maze.hidePath();
    let pathIndex = 0;

    // Calculer les directions à l'avance
    const directions = aiPath.slice(0, -1).map((current, i) => {
        const next = aiPath[i + 1];
        if (next.row < current.row) return 'up';
        if (next.row > current.row) return 'down';
        if (next.col < current.col) return 'left';
        return 'right';
    });

    // Déplacer l'IA tous les x temps
    aiInterval = setInterval(() => {
        if (pathIndex < directions.length) {
            maze.movePlayer(maze.aiPlayer, directions[pathIndex]);
            maze.renderMaze(mazeContainer);
            pathIndex++;

            // Vérifier si l'IA a gagné
            if (maze.isAIFinished()) {
                // Arrêter le jeu
                stopAIMovement();
                clearInterval(timerInterval);

                // Afficher le message de défaite
                defeatMessage.classList.remove('hidden');

                // Faire disparaître le message après 3 secondes
                setTimeout(() => {
                    defeatMessage.classList.add('hidden');
                    restartGame();
                }, 3000);
            }
        }
    }, aiDifficultyInterval);
}

/**
 * Arrêter le mouvement de l'IA
 */
function stopAIMovement() {
    clearInterval(aiInterval);
    aiStarted = false;
}

/**
 * Définir la difficulté de l'IA
 */
function setAiDifficulty(difficulty = 'easy') {
    const intervals = {
        easy: 1000,
        medium: 500,
        hard: 200
    };
    aiDifficultyInterval = intervals[difficulty];
}

// Ajouter l'écouteur d'événements pour les boutons de difficulté
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Enlever la classe selected de tous les boutons
        document.querySelectorAll('.difficulty-btn').forEach(b =>
            b.classList.remove('selected'));

        // Ajouter la classe selected au bouton cliqué
        e.target.classList.add('selected');

        // Mettre à jour la difficulté
        aiDifficulty = e.target.dataset.difficulty;
        setAiDifficulty(aiDifficulty);

        // Redémarrer le jeu avec la nouvelle difficulté
        restartGame();
    });
});

/**
 * Écouter les événements du menu et du bouton "Recommencer"
 */
generateButton.addEventListener('click', generateNewMaze);
applyAlgoButton.addEventListener('click', applyAlgorithm);
restartButton.addEventListener('click', restartGame);
