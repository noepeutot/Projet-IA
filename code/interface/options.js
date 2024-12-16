document.addEventListener('DOMContentLoaded', () => {
    const playerColorInput = document.getElementById('player-color');
    const startColorInput = document.getElementById('start-color');
    const endColorInput = document.getElementById('end-color');
    const saveButton = document.getElementById('save-options');
    const resetButton = document.getElementById('reset-options');

    // Couleurs par défaut
    const defaultColors = {
        player: '#f1c40f',
        start: '#27ae60',
        end: '#c0392b'
    };

    // Charger les couleurs sauvegardées
    const loadColors = () => {
        const savedColors = JSON.parse(localStorage.getItem('mazeColors')) || defaultColors;
        playerColorInput.value = savedColors.player;
        startColorInput.value = savedColors.start;
        endColorInput.value = savedColors.end;
        updatePreviews();
    };

    // Mettre à jour les aperçus
    const updatePreviews = () => {
        document.querySelector('.preview-box.player').style.backgroundColor = playerColorInput.value;
        document.querySelector('.preview-box.start').style.backgroundColor = startColorInput.value;
        document.querySelector('.preview-box.end').style.backgroundColor = endColorInput.value;
    };

    // Sauvegarder les couleurs
    saveButton.addEventListener('click', () => {
        const colors = {
            player: playerColorInput.value,
            start: startColorInput.value,
            end: endColorInput.value
        };
        localStorage.setItem('mazeColors', JSON.stringify(colors));
        alert('Options sauvegardées !');
    });

    // Réinitialiser les couleurs à leurs valeurs par défaut dans le localStorage
    resetButton.addEventListener('click', () => {
        localStorage.setItem('mazeColors', JSON.stringify(defaultColors));
        loadColors();
    });

    // Mettre à jour les aperçus lors des changements
    [playerColorInput, startColorInput, endColorInput].forEach(input => {
        input.addEventListener('input', updatePreviews);
    });

    // Charger les couleurs au démarrage
    loadColors();
});
