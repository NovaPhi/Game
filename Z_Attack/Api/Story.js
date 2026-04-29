(function applySettings() {
    const brightness = localStorage.getItem('brightness') ?? 100;
    const colorblind = localStorage.getItem('colorblind') || 'none';

    document.body.style.filter = `brightness(${brightness}%)`;

    document.body.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (colorblind !== 'none') document.body.classList.add(colorblind);
})();

document.addEventListener("DOMContentLoaded", () => {
    checkUnlocks();
});

async function checkUnlocks() {
    try {
        const stored = localStorage.getItem('sessionUser');
        const user = stored ? JSON.parse(stored) : null;

        if (!user) return;

        const res = await fetch(`http://localhost:8081/UserStats?user_ID=${user.user_ID}`);
        const data = await res.json();

        if (!data.success) return;

        const bestLevel = data.best_level;

        const parts = document.querySelectorAll('.storyPart');

        parts.forEach(part => {
            const required = parseInt(part.dataset.requiredLevel);

            if (bestLevel < required) {
                part.classList.add('locked');
                part.title = `Unlocks at level ${required}`;
            } else {
                part.classList.remove('locked');
            }
        });

    } catch (err) {
        console.error("Story unlock error:", err);
    }
}