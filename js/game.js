import { dfs, bfs, aStar, dijkstra } from '../algorithms/index.js';
import { Maze } from '../classes/Maze.js';
import { Player } from '../classes/Player.js';
import { trail, fireworks, lavaRise, mazeGenerationAnim, diamondHit } from './effects.js';
import { renderMaze } from './render.js';
import { STORAGE_KEYS, MAZE_SIZE, PLAYER_LABELS, TIMINGS, GAME_MODES } from './constants.js';

const SOLVERS = { dfs, bfs, aStar, dijkstra };

const mazeContainer = document.getElementById('maze-container');
const algoSelect = document.getElementById('algo-select');
const generateButton = document.getElementById('generate-maze');
const applyAlgoButton = document.getElementById('apply-algo');
const mazeSizeInput = document.getElementById('maze-size');
const timerElement = document.getElementById('timer');
const restartButton = document.getElementById('restart-game');

const ranking = document.getElementById('ranking');
const bestTimesContainer = document.getElementById('best-times');
const difficultySelector = document.getElementById('difficulty-selector');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const generationTypeSelect = document.getElementById('generation-type');

const successMessage = document.getElementById('success-message');
const successTime = document.getElementById('success-time');
const defeatMessage = document.getElementById('defeat-message');
const noPathMessage = document.getElementById('no-path-message');
const sizeErrorMessage = document.getElementById('size-error-message');
const exploredCountEl = document.getElementById('explored-count');
const pathLengthEl = document.getElementById('path-length');
const pauseMenu = document.getElementById('pause-menu');
const pauseResumeBtn = document.getElementById('pause-resume');
const pauseRestartBtn = document.getElementById('pause-restart');
const pauseNewBtn = document.getElementById('pause-new');
const pauseHomeBtn = document.getElementById('pause-home');

let gameMode;

let aiInterval;
let aiPlayer;
let aiDifficulty = 'easy';
let aiDifficultyInterval;

let maze;
let player;
let startTime;
let timerStarted = false;
let timerInterval;
let searchAnimating = false;
let exploreTimer;
let solTimer;
let successDismissTimer;
let defeatDismissTimer;
let noPathDismissTimer;
let sizeErrorDismissTimer;

let isPaused = false;
let pausedElapsed = 0;
let pausedAiState = false;
let aiVisualSteps = [];
let aiStepIndex = 1;

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    generateNewMaze();
});

function initGame() {
    const urlParams = new URLSearchParams(window.location.search);
    gameMode = urlParams.get('mode') || GAME_MODES.speedrun;

    mazeSizeInput.min = MAZE_SIZE.min;
    mazeSizeInput.max = MAZE_SIZE.max;

    const badge = document.getElementById('mode-badge');
    if (badge) badge.textContent = gameMode === GAME_MODES.vsAi ? 'VS IA' : 'Speedrun';

    if (gameMode === GAME_MODES.speedrun) {
        ranking.classList.remove('hidden');
        difficultySelector.classList.add('hidden');
    } else {
        ranking.classList.add('hidden');
        difficultySelector.classList.remove('hidden');

        difficultyBtns.forEach(btn => {
            if (btn.dataset.difficulty === aiDifficulty) {
                btn.classList.add('selected');
            }
        });

        setAiDifficulty(aiDifficulty);
    }
}

function clearAnimationTimers() {
    clearInterval(exploreTimer);
    clearInterval(solTimer);
    exploreTimer = null;
    solTimer = null;
    searchAnimating = false;
    generateButton.disabled = false;
    applyAlgoButton.disabled = false;
}

function getElapsed() {
    return timerStarted ? Date.now() - startTime : 0;
}

function updateTimer() {
    if (!timerStarted) return;

    const elapsedTime = getElapsed();
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);

    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerStarted = false;
    timerElement.textContent = '0:00:00';
}



function generateNewMaze() {
    clearAnimationTimers();
    resetTimer();
    stopAIMovement();
    resetPauseState();

    let visualSize = parseInt(mazeSizeInput.value, 10);
    if (!Number.isFinite(visualSize) || visualSize < MAZE_SIZE.min || visualSize > MAZE_SIZE.max) {
        showSizeError();
        return;
    }

    exploredCountEl.textContent = '—';
    pathLengthEl.textContent = '—';

    // La grille visuelle est (2N+1)×(2N+1) — sa taille doit donc être impaire.
    if (visualSize % 2 === 0) {
        visualSize += 1;
        mazeSizeInput.value = visualSize;
    }

    let logicalSize = Math.floor((visualSize - 1) / 2);
    if (logicalSize < 2) logicalSize = 2;

    displayBestTimes(visualSize);

    player = new Player(PLAYER_LABELS.human);
    maze = new Maze(logicalSize, logicalSize, generationTypeSelect.value);
    maze.addPlayer(player, maze.getStartCell());

    if (gameMode === GAME_MODES.vsAi) {
        aiPlayer = new Player(PLAYER_LABELS.ai);
        maze.addAIPlayer(aiPlayer, maze.getStartCell());
    }

    renderMaze(maze, mazeContainer);

    const mazeEl = mazeContainer.querySelector('.maze');
    if (mazeEl) mazeGenerationAnim(mazeEl);
}

function applyAlgorithm() {
    if (!maze || searchAnimating) return;

    maze.resetPath();
    maze.resetVisitedCells();
    renderMaze(maze, mazeContainer);

    const exploredOrder = [];
    const algoFn = SOLVERS[algoSelect.value];
    const path = algoFn ? algoFn(maze, exploredOrder, false) : null;

    exploredCountEl.textContent = exploredOrder.length;
    pathLengthEl.textContent = path ? path.length : '—';

    if (!path) {
        showNoPath();
        return;
    }

    animateSearch(exploredOrder, path);
}

function dismissModal(modal) {
    if (!modal || modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');

    if (modal === successMessage)   clearTimeout(successDismissTimer);
    if (modal === defeatMessage)    clearTimeout(defeatDismissTimer);
    if (modal === noPathMessage)    clearTimeout(noPathDismissTimer);
    if (modal === sizeErrorMessage) clearTimeout(sizeErrorDismissTimer);

    if (modal === noPathMessage || modal === sizeErrorMessage) {
        applyAlgoButton.disabled = false;
        generateButton.disabled = false;
    }
    if (modal === successMessage || modal === defeatMessage) {
        restartGame();
    }
}

function showNoPath() {
    noPathMessage.classList.remove('hidden');
    applyAlgoButton.disabled = true;
    generateButton.disabled = true;
    clearTimeout(noPathDismissTimer);
    noPathDismissTimer = setTimeout(() => dismissModal(noPathMessage), TIMINGS.messageDismiss);
}

function showSizeError() {
    sizeErrorMessage.classList.remove('hidden');
    applyAlgoButton.disabled = true;
    generateButton.disabled = true;
    clearTimeout(sizeErrorDismissTimer);
    sizeErrorDismissTimer = setTimeout(() => dismissModal(sizeErrorMessage), TIMINGS.messageDismiss);
}

function animateSearch(exploredOrder, path) {
    const mazeEl = mazeContainer.querySelector('.maze');
    if (!mazeEl) return;

    searchAnimating = true;
    generateButton.disabled = true;
    applyAlgoButton.disabled = true;

    const cells = mazeEl.querySelectorAll('.cell');
    const visWidth = maze.width * 2 + 1;
    const cellAt = (x, y) => cells[(y * 2 + 1) * visWidth + (x * 2 + 1)];
    const passageAt = (curr, next) => cells[(curr.y + next.y + 1) * visWidth + (curr.x + next.x + 1)];

    let i = 0;
    exploreTimer = setInterval(() => {
        if (i < exploredOrder.length) {
            const pos = exploredOrder[i];
            const el = cellAt(pos.x, pos.y);
            if (el && !el.classList.contains('start') && !el.classList.contains('end')) {
                el.classList.add('path--visited');
            }
            if (pos.parent) {
                const passage = passageAt(pos.parent, pos);
                if (passage) passage.classList.add('path--visited');
            }
            i++;
        }
        if (i >= exploredOrder.length) {
            clearInterval(exploreTimer);
            exploreTimer = null;
            showSolution(path, cells, cellAt, passageAt);
        }
    }, TIMINGS.exploreStep);
}

function showSolution(path, cells, cellAt, passageAt) {
    cells.forEach(c => c.classList.remove('path--visited'));

    let j = 0;
    solTimer = setInterval(() => {
        if (j >= path.length) {
            clearInterval(solTimer);
            solTimer = null;
            searchAnimating = false;
            generateButton.disabled = false;
            applyAlgoButton.disabled = false;
            path.forEach(pos => maze.grid[pos.y][pos.x].setType('path'));
            maze.resetVisitedCells();
            return;
        }

        const pos = path[j];
        const el = cellAt(pos.x, pos.y);
        if (el && !el.classList.contains('start') && !el.classList.contains('end')) {
            el.classList.add('path--solution');
        }

        if (j > 0) {
            const prev = path[j - 1];
            const passage = passageAt(prev, pos);
            if (passage) passage.classList.add('path--solution');
        }

        j++;
    }, TIMINGS.solutionStep);
}

function restartGame() {
    clearAnimationTimers();
    stopAIMovement();
    resetTimer();
    resetPauseState();
    maze.resetMaze();
    renderMaze(maze, mazeContainer);
}

function resetPauseState() {
    isPaused = false;
    pausedElapsed = 0;
    pausedAiState = false;
    pauseMenu.classList.add('hidden');
}

const KEY_DIRS = {
    ArrowUp: 'up',    z: 'up',
    ArrowRight: 'right', d: 'right',
    ArrowDown: 'down',  s: 'down',
    ArrowLeft: 'left',  q: 'left'
};

document.addEventListener('keydown', (event) => {
    const visibleModal = document.querySelector('.modal-mc:not(.hidden)');

    if (visibleModal === pauseMenu) {
        if (event.key === 'Escape') {
            resumeGame();
            event.preventDefault();
        }
        return;
    }

    if (visibleModal && (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ')) {
        dismissModal(visibleModal);
        event.preventDefault();
        return;
    }

    if (event.key === 'Escape') {
        openPause();
        event.preventDefault();
        return;
    }

    if (event.target instanceof HTMLInputElement) return;

    if (searchAnimating) return;

    if (event.key === ' ') {
        restartGame();
        return;
    }

    if (event.key === 'r' || event.key === 'R') {
        generateNewMaze();
        return;
    }

    if (event.key === 'Enter') {
        applyAlgoButton.click();
        return;
    }

    const lookup = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const dir = KEY_DIRS[lookup];
    if (!dir || !maze.movePlayerVisual(player, dir)) return;

    if (gameMode === GAME_MODES.vsAi && !aiInterval) {
        startAIMovement();
    }

    if (!timerStarted) {
        startTime = Date.now();
        timerStarted = true;
        timerInterval = setInterval(updateTimer, 10);
    }
    renderMaze(maze, mazeContainer);

    const playerCell = mazeContainer.querySelector('.player');
    if (playerCell) trail(playerCell);

    if (maze.isFinished()) {
        stopAIMovement();
        clearInterval(timerInterval);

        const timeTaken = (getElapsed() / 1000).toFixed(2);
        saveBestTime(timeTaken, maze.width * 2 + 1);

        const endCell = mazeContainer.querySelector('.end');
        if (endCell) diamondHit(endCell);
        setTimeout(() => fireworks(document.querySelector('.success-content')), TIMINGS.fireworksDelay);

        successTime.textContent = `Temps: ${timeTaken} secondes`;
        successMessage.classList.remove('hidden');

        clearTimeout(successDismissTimer);
        successDismissTimer = setTimeout(() => dismissModal(successMessage), TIMINGS.messageDismiss);
    }
});

function saveBestTime(time, mazeSize) {
    const bestTimes = JSON.parse(localStorage.getItem(STORAGE_KEYS.bestTimes) || '{}');
    const sizeKey = `size${mazeSize}`;

    if (!bestTimes[sizeKey]) bestTimes[sizeKey] = [];
    bestTimes[sizeKey].push(time);
    bestTimes[sizeKey].sort((a, b) => a - b);
    bestTimes[sizeKey] = bestTimes[sizeKey].slice(0, 3);

    localStorage.setItem(STORAGE_KEYS.bestTimes, JSON.stringify(bestTimes));
    displayBestTimes(mazeSize);
}

function displayBestTimes(mazeSize) {
    const bestTimes = JSON.parse(localStorage.getItem(STORAGE_KEYS.bestTimes) || '{}');
    const sizeKey = `size${mazeSize}`;
    const times = bestTimes[sizeKey] || [];

    let html = `<span class="panel-mc__label">Taille ${mazeSize}×${mazeSize}</span>`;

    if (times.length === 0) {
        html += '<div class="best-time-entry--empty">Aucun temps enregistré</div>';
    } else {
        times.forEach((time, index) => {
            const rank = index + 1;
            html += `
                <div class="best-time-entry" data-rank="${rank}">
                    <span class="best-time-entry__rank">${rank}.</span>
                    <span class="best-time-entry__time">${time}s</span>
                </div>`;
        });
    }
    bestTimesContainer.innerHTML = html;
}

function startAIMovement() {
    if (!maze.aiPlayer) return;

    const aiPath = aStar(maze, undefined, false);
    if (!aiPath) {
        showNoPath();
        return;
    }

    aiVisualSteps = [];
    for (let i = 0; i < aiPath.length; i++) {
        if (i > 0) {
            aiVisualSteps.push({
                x: aiPath[i - 1].x + aiPath[i].x + 1,
                y: aiPath[i - 1].y + aiPath[i].y + 1
            });
        }
        aiVisualSteps.push({ x: aiPath[i].x * 2 + 1, y: aiPath[i].y * 2 + 1 });
    }

    aiStepIndex = 1;
    scheduleAITick();
}

function scheduleAITick() {
    clearInterval(aiInterval);
    aiInterval = setInterval(() => {
        if (aiStepIndex >= aiVisualSteps.length) return;

        maze.aiPlayer.setPosition(aiVisualSteps[aiStepIndex].x, aiVisualSteps[aiStepIndex].y);
        renderMaze(maze, mazeContainer);
        aiStepIndex++;

        if (maze.isAIFinished()) {
            stopAIMovement();
            clearInterval(timerInterval);

            lavaRise(defeatMessage);
            defeatMessage.classList.remove('hidden');

            clearTimeout(defeatDismissTimer);
            defeatDismissTimer = setTimeout(() => dismissModal(defeatMessage), TIMINGS.messageDismiss);
        }
    }, aiDifficultyInterval / 2);
}

function stopAIMovement() {
    clearInterval(aiInterval);
    aiInterval = null;
}

function openPause() {
    if (isPaused || !maze) return;
    if (document.querySelector('.modal-mc:not(.hidden)')) return;

    if (searchAnimating) {
        clearAnimationTimers();
        renderMaze(maze, mazeContainer);
    }

    isPaused = true;

    if (timerStarted && timerInterval) {
        pausedElapsed = Date.now() - startTime;
        clearInterval(timerInterval);
        timerInterval = null;
    }

    if (aiInterval) {
        pausedAiState = true;
        stopAIMovement();
    }

    pauseMenu.classList.remove('hidden');
    pauseResumeBtn.focus();
}

function resumeGame() {
    if (!isPaused) return;
    isPaused = false;
    pauseMenu.classList.add('hidden');

    if (timerStarted && pausedElapsed > 0) {
        startTime = Date.now() - pausedElapsed;
        timerInterval = setInterval(updateTimer, 10);
        pausedElapsed = 0;
    }

    if (pausedAiState) {
        scheduleAITick();
        pausedAiState = false;
    }
}

function setAiDifficulty(difficulty = 'easy') {
    aiDifficultyInterval = TIMINGS.aiIntervals[difficulty];
}

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        aiDifficulty = e.target.dataset.difficulty;
        setAiDifficulty(aiDifficulty);
        restartGame();
    });
});

generateButton.addEventListener('click', generateNewMaze);
applyAlgoButton.addEventListener('click', applyAlgorithm);
restartButton.addEventListener('click', restartGame);

noPathMessage.addEventListener('click', () => dismissModal(noPathMessage));
sizeErrorMessage.addEventListener('click', () => dismissModal(sizeErrorMessage));
successMessage.addEventListener('click', () => dismissModal(successMessage));
defeatMessage.addEventListener('click', () => dismissModal(defeatMessage));

pauseResumeBtn.addEventListener('click', resumeGame);
pauseRestartBtn.addEventListener('click', () => restartGame());
pauseNewBtn.addEventListener('click', () => generateNewMaze());
pauseHomeBtn.addEventListener('click', () => { window.location.href = '/'; });
