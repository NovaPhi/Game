const COLORBLIND_MODES = [
    { id: 'none',         label: 'NONE' },
    { id: 'deuteranopia', label: 'DEUTERANOPIA (Red/Green)' },
    { id: 'protanopia',   label: 'PROTANOPIA (Red Blind)' },
    { id: 'tritanopia',   label: 'TRITANOPIA (Blue/Yellow)' },
];

let currentModeIdx = 0;

// Loads saved settings and wires up the volume, brightness, and colorblind mode controls
document.addEventListener('DOMContentLoaded', () => {
    console.log('saved brightness:', localStorage.getItem('brightness'));
    const volumeSlider     = document.getElementById('volumeSlider');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const colorblindLabel  = document.getElementById('colorblindLabel');
    const colorblindPrev   = document.getElementById('colorblindPrev');
    const colorblindNext   = document.getElementById('colorblindNext');
    const music            = document.getElementById('bgMusic');

    // Load saved settings
    const savedVolume     = localStorage.getItem('volume')     ?? 50;
    const savedBrightness = localStorage.getItem('brightness') ?? 100;
    const savedMode       = localStorage.getItem('colorblind') || 'none';
    currentModeIdx        = COLORBLIND_MODES.findIndex(m => m.id === savedMode);
    if (currentModeIdx < 0) currentModeIdx = 0;

    // Apply on load
    volumeSlider.value     = savedVolume;
    brightnessSlider.value = savedBrightness;
    if (music) music.volume = savedVolume / 100;

    // Apply brightness via overlay div, NOT body filter (so colorblind filter works separately)
    applyBrightness(savedBrightness);
    applyColorblind(COLORBLIND_MODES[currentModeIdx], colorblindLabel);

    // Volume
    volumeSlider.addEventListener('input', () => {
        if (music) music.volume = volumeSlider.value / 100;
        localStorage.setItem('volume', volumeSlider.value);
    });

    // Brightness
    brightnessSlider.addEventListener('input', () => {
        applyBrightness(brightnessSlider.value);
        localStorage.setItem('brightness', brightnessSlider.value);
    });

    // Colorblind next
    colorblindNext.addEventListener('click', () => {
        currentModeIdx = (currentModeIdx + 1) % COLORBLIND_MODES.length;
        applyColorblind(COLORBLIND_MODES[currentModeIdx], colorblindLabel);
    });

    // Colorblind prev
    colorblindPrev.addEventListener('click', () => {
        currentModeIdx = (currentModeIdx - 1 + COLORBLIND_MODES.length) % COLORBLIND_MODES.length;
        applyColorblind(COLORBLIND_MODES[currentModeIdx], colorblindLabel);
    });
});

// Applies the selected colorblind mode to the body and saves it to localStorage
function applyColorblind(mode, labelEl) {
    document.body.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (mode.id !== 'none') document.body.classList.add(mode.id);
    if (labelEl) labelEl.textContent = mode.label;
    localStorage.setItem('colorblind', mode.id);
    console.log('Applying colorblind mode:', mode.id); // debug
}

// Creates or updates a fixed overlay div to simulate brightness adjustment
function applyBrightness(value) {
    value = Math.min(120, Math.max(50, parseInt(value) || 100));
    
    let overlay = document.getElementById('brightnessOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'brightnessOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 9999;
            transition: background 0.2s;
        `;
        document.body.appendChild(overlay);
    }

    if (value < 100) {
        const darkness = (100 - value) / 100;
        overlay.style.background = `rgba(0,0,0,${darkness})`;
    } else if (value > 100) {
        const lightness = (value - 100) / 100;
        overlay.style.background = `rgba(255,255,255,${lightness * 0.3})`;
    } else {
        overlay.style.background = 'transparent'; // exactly 100 = no overlay
    }
}