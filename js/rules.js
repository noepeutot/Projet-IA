/* ============================================================
   Page Règles — onglets + diagramme clavier interactif
   ============================================================ */

(() => {
    const TABS = ['controls', 'modes', 'algos'];
    const tabButtons = TABS.map(id => document.getElementById(`tab-${id}`));
    const tabPanels = TABS.map(id => document.getElementById(`panel-${id}`));

    /* ─── Bascule d'onglet ─── */
    function activateTab(targetId, focusButton = false) {
        TABS.forEach((id, i) => {
            const isActive = id === targetId;
            tabButtons[i].classList.toggle('rules-tab--active', isActive);
            tabButtons[i].setAttribute('aria-selected', String(isActive));
            tabButtons[i].tabIndex = isActive ? 0 : -1;
            tabPanels[i].classList.toggle('rules-tab-panel--active', isActive);
        });
        if (targetId === 'controls') attachKeyboardHandlers();
        else detachKeyboardHandlers();
        if (focusButton) tabButtons[TABS.indexOf(targetId)].focus();
    }

    tabButtons.forEach((btn, i) => {
        btn.addEventListener('click', () => activateTab(TABS[i]));
        btn.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const dir = e.key === 'ArrowRight' ? 1 : -1;
                const next = (i + dir + TABS.length) % TABS.length;
                activateTab(TABS[next], true);
            } else if (e.key === 'Home') {
                e.preventDefault();
                activateTab(TABS[0], true);
            } else if (e.key === 'End') {
                e.preventDefault();
                activateTab(TABS[TABS.length - 1], true);
            }
        });
    });

    /* ─── Mini-maze 7×7 ─── */
    const GRID = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ];
    const playerPos = [1, 1];
    const mazeEl = document.getElementById('mini-maze');
    const cellRefs = [];

    function buildMiniMaze() {
        for (let y = 0; y < GRID.length; y++) {
            const row = document.createElement('div');
            row.className = 'mini-maze__row';
            const rowCells = [];
            for (let x = 0; x < GRID[y].length; x++) {
                const cell = document.createElement('div');
                cell.className = 'mini-maze__cell ' + (GRID[y][x] === 0 ? 'mini-maze__cell--wall' : 'mini-maze__cell--path');
                row.appendChild(cell);
                rowCells.push(cell);
            }
            mazeEl.appendChild(row);
            cellRefs.push(rowCells);
        }
        renderPlayer();
    }

    function renderPlayer() {
        for (let y = 0; y < GRID.length; y++) {
            for (let x = 0; x < GRID[y].length; x++) {
                const isPlayer = playerPos[0] === x && playerPos[1] === y;
                cellRefs[y][x].classList.toggle('mini-maze__cell--player', isPlayer);
            }
        }
    }

    function tryMove(dx, dy) {
        const nx = playerPos[0] + dx;
        const ny = playerPos[1] + dy;
        if (nx < 0 || ny < 0 || nx >= GRID[0].length || ny >= GRID.length) return;
        if (GRID[ny][nx] !== 1) return;
        playerPos[0] = nx;
        playerPos[1] = ny;
        renderPlayer();
    }

    /* ─── Mapping touche → directions + IDs DOM à illuminer ───
       ZQSD illumine UNIQUEMENT les touches AZERTY ;
       les flèches illuminent UNIQUEMENT le pavé directionnel. */
    const KEY_MAP = {
        z:          { dx:  0, dy: -1, keys: ['kbd-z'],      hints: ['hint-up-azerty'] },
        ArrowUp:    { dx:  0, dy: -1, keys: ['kbd-up'],     hints: [] },
        q:          { dx: -1, dy:  0, keys: ['kbd-q'],      hints: [] },
        ArrowLeft:  { dx: -1, dy:  0, keys: ['kbd-left'],   hints: ['hint-left'] },
        s:          { dx:  0, dy:  1, keys: ['kbd-s'],      hints: [] },
        ArrowDown:  { dx:  0, dy:  1, keys: ['kbd-down'],   hints: ['hint-down'] },
        d:          { dx:  1, dy:  0, keys: ['kbd-d'],      hints: [] },
        ArrowRight: { dx:  1, dy:  0, keys: ['kbd-right'],  hints: ['hint-right'] },
        ' ':        {                  keys: ['kbd-space'],  hints: [], decorative: true },
        Escape:     {                  keys: ['kbd-escape'], hints: [], decorative: true },
        r:          {                  keys: ['kbd-r'],      hints: [], decorative: true },
        Enter:      {                  keys: ['kbd-enter'],  hints: [], decorative: true },
    };

    function lookupEntry(e) {
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        return KEY_MAP[key];
    }

    function setActive(entry, on) {
        entry.keys.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('key--active', on);
        });
        entry.hints.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('kbd-hint--active', on);
        });
    }

    function onKeyDown(e) {
        // Ne pas intercepter quand le focus est sur un onglet (les flèches y servent à naviguer entre tabs)
        if (e.target && e.target.matches && e.target.matches('[role="tab"]')) return;
        const entry = lookupEntry(e);
        if (!entry) return;
        if (e.key.startsWith('Arrow') || e.key === ' ') e.preventDefault();
        if (e.repeat) return;
        setActive(entry, true);
        if (!entry.decorative) tryMove(entry.dx, entry.dy);
    }

    function onKeyUp(e) {
        const entry = lookupEntry(e);
        if (!entry) return;
        setActive(entry, false);
    }

    let kbAttached = false;
    function attachKeyboardHandlers() {
        if (kbAttached) return;
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        kbAttached = true;
    }
    function detachKeyboardHandlers() {
        if (!kbAttached) return;
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        // Retire toute classe active résiduelle
        document.querySelectorAll('.key--active').forEach(el => el.classList.remove('key--active'));
        document.querySelectorAll('.kbd-hint--active').forEach(el => el.classList.remove('kbd-hint--active'));
        kbAttached = false;
    }

    /* ─── Init ─── */
    buildMiniMaze();
    attachKeyboardHandlers(); // onglet Contrôles actif par défaut
})();
