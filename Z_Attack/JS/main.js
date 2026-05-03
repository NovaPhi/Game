const video = document.getElementById("videoIntro");
const intro = document.getElementById("intro");
const skipBtn = document.getElementById("skipBtn");
const menuMusic = document.getElementById("menuMusic");

// Hides the intro, shows the main menu, and fades in the background music
function showMenu() {
    intro.style.display = "none";
    video.pause();
 
    document.getElementById("title").style.display = "block";
    document.getElementById("mainMenu").style.display = "block";
    document.getElementById("topBar").style.display = "block";
    document.getElementById("footer").style.display = "block";
 
    menuMusic.volume = 0;
    menuMusic.play().then(() => {
        fadeInAudio(menuMusic, 1.0, 1500); 
    }).catch(() => {
        document.addEventListener("click", () => {
            menuMusic.play();
            fadeInAudio(menuMusic, 1.0, 1500);
        }, { once: true });
    });
}

// Gradually increases audio volume from its current level to the target over the given duration
function fadeInAudio(audioEl, targetVolume, durationMs) {
    const steps = 30;
    const interval = durationMs / steps;
    const delta = (targetVolume - audioEl.volume) / steps;
    let current = 0;
 
    const timer = setInterval(() => {
        current++;
        audioEl.volume = Math.min(targetVolume, audioEl.volume + delta);
        if (current >= steps) clearInterval(timer);
    }, interval);
}

// Function so that the intro can replay and the menu audio gets muted while it plays (Logic helped by AI)
function replayIntro() {
    document.getElementById("title").style.display    = "none";
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("topBar").style.display   = "none";
    document.getElementById("footer").style.display   = "none";

    menuMusic.pause();
    menuMusic.currentTime = 0;

    intro.style.display = "flex";
    video.currentTime   = 0;
    video.play();

    const onEnd = () => { // For when the intro ends 
        showMenu();
        skipBtn.removeEventListener("click", onSkip);
    };
    const onSkip = () => { // For when the intro is skipped
        video.pause();
        showMenu();
        video.removeEventListener("ended", onEnd);
    };

    video.addEventListener("ended", onEnd, { once: true }); 
    skipBtn.addEventListener("click", onSkip, { once: true });
}

const alreadySeen = localStorage.getItem("introSeen"); // Local variable so the intro only plays automatically the first time the player enters the web
 
// Skips the intro if already seen, otherwise sets up skip and end listeners to mark it as seen
if (alreadySeen) {
    intro.style.display = "none";
    showMenu();
} else {
    video.addEventListener("ended", () => {
        localStorage.setItem("introSeen", "true");
        showMenu();
    });
 
    skipBtn.addEventListener("click", () => {
        localStorage.setItem("introSeen", "true");
        showMenu();
    });
}

//localStorage.removeItem("introSeen");