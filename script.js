// ==========================================================================
// CartaParaXime - Interactive Logic & Animations
// ==========================================================================

// State Machine
let currentStage = 1;

// DOM Elements
const body = document.body;
const envelopeWrapper = document.getElementById('envelopeWrapper');
const instructionSpan = document.getElementById('instructionSpan');
const letterOverlay = document.getElementById('letterOverlay');
const letterText = document.getElementById('letterText');
const letterContent = document.getElementById('letterContent');
const skipTypingBtn = document.getElementById('skipTypingBtn');
const closeLetterBtn = document.getElementById('closeLetterBtn');
const bgDecorations = document.getElementById('bgDecorations');
const musicBtn = document.getElementById('musicBtn');
const musicIconPlay = document.getElementById('musicIconPlay');
const musicIconMute = document.getElementById('musicIconMute');
const welcomeSplash = document.getElementById('welcomeSplash');
const enterBtn = document.getElementById('enterBtn');
const memoriesSection = document.getElementById('memoriesSection');
const sendHugBtn = document.getElementById('sendHugBtn');
const hugCounterText = document.getElementById('hugCounterText');

// Canvas Elements
const sparkleCanvas = document.getElementById('sparkleCanvas');
const outroRainCanvas = document.getElementById('outroRainCanvas');

// User Provided Exact Letter Content
const letterContentText = `Mi amor, no sé si voy a encontrar las palabras suficientes para responderte algo tan bonito.

Cuando llegué a este verano jamás imaginé que iba a encontrar a alguien que terminaría significando tanto para mí, entre todas las cosas que me llevo de esos días, sin duda tu eres la más importante. Aunque no lo creas, también me da miedo la distancia, me da miedo que los kilómetros cambien cosas que aquí se sintieron tan bonitas y tan reales. Pero no quiero que ese miedo sea más grande que las ganas que tengo de seguir construyendo esto contigo.

Creo que tú ya te viniste conmigo, en todos los recuerdos, sin pedirme permiso. Estás en mis recuerdos de esos días, en cada lugar que conocimos y en todas esas pequeñas cosas que probablemente voy a recordar cuando mire tus fotitos.

Aunque llevamos apenas un mes sin vernos no sé exactamente qué nos espera ni quiero prometerte cosas imposibles. Pero sí puedo prometerte algo, no quiero olvidar lo que encontramos aquí. Quiero cuidarlo, seguir hablando contigo, seguir conociéndote y descubrir hasta dónde podemos llevar esto.

Y si algún día la distancia se siente demasiado grande, espero que recordemos que alguna vez esos mismos kilómetros no pudieron impedir que nos encontráramos.

Gracias por llegar a mi verano y convertirlo en algo que no voy a olvidar. ❤️`;

// Typewriter State
let typingTimer = null;
let typingIndex = 0;
let isTyping = false;

// Audio Management
const bgMusic = new Audio('photograph.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.25;
let isMusicPlaying = false;
let audioCtx = null;
let hugCount = 0;

// Ambient Background Floating Items (Hearts, Hibiscus Flowers, Stars, Airplanes)
const floatTemplates = [
    // Heart
    `<svg class="floating-element" viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: #ff5e7e;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    // Sunset Gold Star
    `<svg class="floating-element" viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: #ffaa5b;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
    // Flower Petal / Hibiscus
    `<svg class="floating-element" viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: #ff7b54;"><circle cx="12" cy="12" r="5"/><circle cx="12" cy="6" r="4"/><circle cx="18" cy="12" r="4"/><circle cx="12" cy="18" r="4"/><circle cx="6" cy="12" r="4"/></svg>`,
    // Yellow Sunflower
    `<svg class="floating-element" viewBox="0 0 24 24" style="width: 26px; height: 26px; fill: #ffca28;"><circle cx="12" cy="12" r="4" fill="#5d4037"/><circle cx="12" cy="5" r="3.5"/><circle cx="17" cy="7" r="3.5"/><circle cx="19" cy="12" r="3.5"/><circle cx="17" cy="17" r="3.5"/><circle cx="12" cy="19" r="3.5"/><circle cx="7" cy="17" r="3.5"/><circle cx="5" cy="12" r="3.5"/><circle cx="7" cy="7" r="3.5"/></svg>`,
    // Cute Airplane Silhouette
    `<svg class="floating-element" viewBox="0 0 24 24" style="width: 28px; height: 28px; fill: #ff8aa3;"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`
];

function createAmbientFloating() {
    for (let i = 0; i < 28; i++) {
        setTimeout(() => {
            const wrapperDiv = document.createElement('div');
            wrapperDiv.innerHTML = floatTemplates[Math.floor(Math.random() * floatTemplates.length)];
            const elem = wrapperDiv.firstElementChild;
            
            elem.style.left = `${Math.random() * 100}vw`;
            const duration = 16 + Math.random() * 22;
            const delay = Math.random() * -20;
            elem.style.animationDuration = `${duration}s`;
            elem.style.animationDelay = `${delay}s`;
            
            elem.style.setProperty('--drift-x', `${-80 + Math.random() * 160}px`);
            elem.style.setProperty('--spin', `${Math.random() > 0.5 ? 360 : -360}deg`);
            
            bgDecorations.appendChild(elem);
        }, i * 250);
    }
}

// --------------------------------------------------------------------------
// Sparkles burst canvas system for envelope stage 3 opening
// --------------------------------------------------------------------------
const sparkleParticles = [];
const sparkleCtx = sparkleCanvas.getContext('2d');

function initCanvasSizes() {
    sparkleCanvas.width = envelopeWrapper.offsetWidth;
    sparkleCanvas.height = envelopeWrapper.offsetHeight;
}

class SparkleParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3 + Math.random() * 6;
        this.speedX = -4 + Math.random() * 8;
        this.speedY = -4 - Math.random() * 6;
        this.color = `hsl(${340 + Math.random() * 40}, 100%, ${65 + Math.random() * 25}%)`;
        this.alpha = 1;
        this.decay = 0.018 + Math.random() * 0.02;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.12; // gravity
        this.alpha -= this.decay;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function burstSparkles() {
    initCanvasSizes();
    const startX = sparkleCanvas.width / 2;
    const startY = sparkleCanvas.height / 3;
    for (let i = 0; i < 70; i++) {
        sparkleParticles.push(new SparkleParticle(startX, startY));
    }
}

function animateSparkles() {
    sparkleCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
    for (let i = sparkleParticles.length - 1; i >= 0; i--) {
        const p = sparkleParticles[i];
        p.update();
        p.draw(sparkleCtx);
        if (p.alpha <= 0) {
            sparkleParticles.splice(i, 1);
        }
    }
    if (sparkleParticles.length > 0) {
        requestAnimationFrame(animateSparkles);
    }
}

// --------------------------------------------------------------------------
// Outro Canvas Rain (Hearts and Stars)
// --------------------------------------------------------------------------
const rainParticles = [];
const rainCtx = outroRainCanvas.getContext('2d');

function resizeRainCanvas() {
    outroRainCanvas.width = window.innerWidth;
    outroRainCanvas.height = window.innerHeight;
}

class RainParticle {
    constructor() {
        this.reset();
        this.y = Math.random() * window.innerHeight;
    }
    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = -20;
        this.size = 8 + Math.random() * 14;
        this.speedY = 1.2 + Math.random() * 2.8;
        this.speedX = -0.5 + Math.random() * 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = -1 + Math.random() * 2;
        this.type = Math.random() > 0.35 ? 'heart' : 'star';
        this.color = this.type === 'heart' 
            ? `hsl(${345 + Math.random() * 25}, 100%, ${70 + Math.random() * 20}%)` 
            : `hsl(${35 + Math.random() * 25}, 100%, ${65 + Math.random() * 20}%)`;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        if (this.y > window.innerHeight + 20) {
            this.reset();
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        
        if (this.type === 'heart') {
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 4);
            ctx.bezierCurveTo(-this.size / 2, -this.size, -this.size, -this.size / 3, 0, this.size);
            ctx.bezierCurveTo(this.size, -this.size / 3, this.size / 2, -this.size, 0, -this.size / 4);
            ctx.fill();
        } else {
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                ctx.lineTo(0, -this.size);
                ctx.lineTo(this.size / 3, -this.size / 3);
                ctx.rotate(Math.PI / 2);
            }
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }
}

function initRain() {
    resizeRainCanvas();
    window.addEventListener('resize', resizeRainCanvas);
    rainParticles.length = 0;
    for (let i = 0; i < 50; i++) {
        rainParticles.push(new RainParticle());
    }
}

let rainAnimationId = null;
function animateRain() {
    rainCtx.clearRect(0, 0, outroRainCanvas.width, outroRainCanvas.height);
    for (let i = 0; i < rainParticles.length; i++) {
        const p = rainParticles[i];
        p.update();
        p.draw(rainCtx);
    }
    rainAnimationId = requestAnimationFrame(animateRain);
}

// --------------------------------------------------------------------------
// Audio Playback Handler
// --------------------------------------------------------------------------
function startBackgroundMusic() {
    if (isMusicPlaying && !bgMusic.paused) return;
    
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isMusicPlaying = true;
            musicBtn.classList.add('playing');
            musicIconPlay.style.display = 'none';
            musicIconMute.style.display = 'block';
        }).catch(err => {
            console.warn("Música de fondo no pudo reproducirse:", err);
            isMusicPlaying = false;
            musicBtn.classList.remove('playing');
            musicIconPlay.style.display = 'block';
            musicIconMute.style.display = 'none';
        });
    }
}

function stopBackgroundMusic() {
    bgMusic.pause();
    isMusicPlaying = false;
    musicBtn.classList.remove('playing');
    musicIconPlay.style.display = 'block';
    musicIconMute.style.display = 'none';
}

musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isMusicPlaying && !bgMusic.paused) {
        stopBackgroundMusic();
    } else {
        startBackgroundMusic();
    }
});

// --------------------------------------------------------------------------
// State Machine Transitions
// --------------------------------------------------------------------------
envelopeWrapper.addEventListener('click', () => {
    if (currentStage === 1) {
        transitionStage2();
    } else if (currentStage === 4) {
        transitionStage5();
    }
});

function transitionStage2() {
    currentStage = 2;
    body.className = 'stage-2';
    instructionSpan.textContent = 'Abriendo con todo mi cariño... 🌸';
    
    setTimeout(transitionStage3, 1200);
}

function transitionStage3() {
    currentStage = 3;
    body.className = 'stage-3';
    
    burstSparkles();
    requestAnimationFrame(animateSparkles);
    
    setTimeout(transitionStage4, 1200);
}

function transitionStage4() {
    currentStage = 4;
    body.className = 'stage-4';
    instructionSpan.textContent = '¡Toca la carta para leer lo que siento por ti! 💖';
}

function transitionStage5() {
    currentStage = 5;
    body.className = 'stage-5';
    instructionSpan.textContent = 'Leyendo carta... 💕';
    
    setTimeout(() => {
        letterOverlay.classList.add('active');
        startLetterTypewriter();
    }, 500);
}

// Typewriter Tick Sound Generator using Web Audio API
function playWritingTick() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110 + Math.random() * 50, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.012, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.025);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
    } catch (e) {
        // Silently handle audio restrictions
    }
}

// --------------------------------------------------------------------------
// Typewriter Animation
// --------------------------------------------------------------------------
function startLetterTypewriter() {
    isTyping = true;
    letterText.innerHTML = '';
    typingIndex = 0;
    
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    
    function typeNextChar() {
        if (typingIndex < letterContentText.length) {
            const char = letterContentText.charAt(typingIndex);
            
            if (char === '\n') {
                const br = document.createElement('br');
                letterText.insertBefore(br, cursor);
            } else {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.style.opacity = '0';
                charSpan.style.transition = 'opacity 0.15s ease';
                letterText.insertBefore(charSpan, cursor);
                setTimeout(() => charSpan.style.opacity = '1', 10);
            }
            
            if (char !== ' ' && char !== '\n' && Math.random() > 0.35) {
                playWritingTick();
            }
            
            typingIndex++;
            
            let delay = 35;
            if (char === '.' || char === '!' || char === '?') {
                delay = 500;
            } else if (char === ',') {
                delay = 220;
            }
            
            letterContent.scrollTop = letterContent.scrollHeight;
            typingTimer = setTimeout(typeNextChar, delay);
        } else {
            finishLetterTyping();
        }
    }
    
    letterText.appendChild(cursor);
    typeNextChar();
}

function finishLetterTyping() {
    clearTimeout(typingTimer);
    isTyping = false;
    
    const cursor = letterText.querySelector('.typing-cursor');
    if (cursor) cursor.remove();
    
    let formattedText = letterContentText.replace(/❤️/g, '❤️');
    formattedText = formattedText.split('\n').join('<br>');
    letterText.innerHTML = formattedText;
    
    skipTypingBtn.style.display = 'none';
    closeLetterBtn.style.display = 'inline-flex';
    
    outroRainCanvas.classList.add('active');
    initRain();
    if (!rainAnimationId) {
        animateRain();
    }
}

skipTypingBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    finishLetterTyping();
});

closeLetterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    letterOverlay.classList.remove('active');
    outroRainCanvas.classList.remove('active');
    setTimeout(() => {
        cancelAnimationFrame(rainAnimationId);
        rainAnimationId = null;
        rainCtx.clearRect(0, 0, outroRainCanvas.width, outroRainCanvas.height);
    }, 1200);
    
    currentStage = 4;
    body.className = 'stage-4';
    instructionSpan.textContent = '¡Guardado en el corazón! Explora nuestros recuerdos abajo 👇';
    
    // Unlock and show memories section
    memoriesSection.classList.add('active');
    memoriesSection.scrollIntoView({ behavior: 'smooth' });
    
    skipTypingBtn.style.display = 'inline-flex';
    closeLetterBtn.style.display = 'none';
});

// --------------------------------------------------------------------------
// Interactive Hug & Burst Hearts Logic
// --------------------------------------------------------------------------
sendHugBtn.addEventListener('click', () => {
    hugCount++;
    hugCounterText.textContent = `¡Has enviado ${hugCount} ${hugCount === 1 ? 'abrazo virtual' : 'abrazos virtuales'} a Xime! 💌💖`;
    
    // Burst floating hearts from button
    const btnRect = sendHugBtn.getBoundingClientRect();
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-element';
            heart.innerHTML = `<svg viewBox="0 0 24 24" style="width: 30px; height: 30px; fill: #ff4b72;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
            heart.style.left = `${btnRect.left + (btnRect.width / 2) + (-80 + Math.random() * 160)}px`;
            heart.style.top = `${btnRect.top}px`;
            heart.style.animation = 'float-around 3.5s forwards ease-out';
            heart.style.setProperty('--drift-x', `${-100 + Math.random() * 200}px`);
            heart.style.setProperty('--spin', `${Math.random() > 0.5 ? 180 : -180}deg`);
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 3500);
        }, i * 80);
    }
});

// Enter Splash Handler: start background music on user click gesture
function handleEnterApp(e) {
    if (e) e.stopPropagation();
    welcomeSplash.classList.add('fade-out');
}

enterBtn.addEventListener('click', handleEnterApp);

welcomeSplash.addEventListener('click', (e) => {
    if (!welcomeSplash.classList.contains('fade-out')) {
        handleEnterApp(e);
    }
});

// Init on window load
window.addEventListener('load', () => {
    createAmbientFloating();
    initCanvasSizes();
    loadGardenState();
});

// ==========================================================================
// Stage 6: Virtual Yellow Bouquet Interactive Logic & Particle Canvas
// ==========================================================================
const quickFlowersBtn = document.getElementById('quickFlowersBtn');
const openBouquetBtn = document.getElementById('openBouquetBtn');
const flowersOverlay = document.getElementById('flowersOverlay');
const closeFlowersBtn = document.getElementById('closeFlowersBtn');
const flowerRainCanvas = document.getElementById('flowerRainCanvas');
const flowerRainCtx = flowerRainCanvas ? flowerRainCanvas.getContext('2d') : null;

const interactiveFlowers = document.querySelectorAll('.interactive-flower');
const flowerNotePopover = document.getElementById('flowerNotePopover');
const popoverCloseBtn = document.getElementById('popoverCloseBtn');
const popoverBadge = document.getElementById('popoverBadge');
const popoverTitle = document.getElementById('popoverTitle');
const popoverBody = document.getElementById('popoverBody');

const flowerProgressText = document.getElementById('flowerProgressText');
const flowerProgressFill = document.getElementById('flowerProgressFill');

const triggerPetalRainBtn = document.getElementById('triggerPetalRainBtn');
const openDedicationCardBtn = document.getElementById('openDedicationCardBtn');
const dedicationModal = document.getElementById('dedicationModal');
const closeDedicationBtn = document.getElementById('closeDedicationBtn');

const discoveredFlowers = new Set();

const flowerMessages = {
    1: {
        title: "Para la Protagonista 🌻",
        badge: "Flor #1 🌻",
        body: "Para que nunca veas pasar las flores amarillas de lejos... hoy tú eres la única y verdadera protagonista de esta historia."
    },
    2: {
        title: "Tu Sonrisa Radiante ☀️",
        badge: "Flor #2 🌼",
        body: "Tu sonrisa tiene el poder de iluminar mis días más oscuros, exactamente igual que el amarillo más brillante."
    },
    3: {
        title: "Un Mes de Magia 💕",
        badge: "Flor #3 🌹",
        body: "Cumplimos un mes juntos y cada día a tu lado (y en nuestras llamadas) me confirma lo increíble que eres."
    },
    4: {
        title: "Cerca en el Corazón ✈️",
        badge: "Flor #4 🌻",
        body: "Sin importar la distancia ni los kilómetros de por medio, te llevo presente en cada uno de mis pensamientos."
    },
    5: {
        title: "Luz en mi Verano 🌅",
        badge: "Flor #5 💛",
        body: "Gracias por llegar a mi verano en México y convertirlo en el capítulo más hermoso e inolvidable de mi vida."
    },
    6: {
        title: "Construyendo Juntos 🧱❤️",
        badge: "Flor #6 ☀️",
        body: "Prometo cuidar lo que tenemos y seguir construyendo esto contigo día tras día, con paciencia y mucho amor."
    },
    7: {
        title: "Te Quiero Infinito 💖",
        badge: "Flor #7 🌼",
        body: "Te quiero con todo mi corazón, hoy, mañana y siempre. ¡Estas flores amarillas son todas para ti!"
    }
};

// Play warm chime frequency sound using Web Audio API
function playFlowerBloomSound(flowerId) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const notes = [440, 554.37, 659.25, 783.99, 880, 1046.50, 1174.66];
        const freq = notes[(flowerId - 1) % notes.length];

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 1.25);
    } catch (e) {
        // Silently handle audio errors
    }
}

// --------------------------------------------------------------------------
// Yellow Petals & Pollen Canvas Animation
// --------------------------------------------------------------------------
const yellowPetalParticles = [];

function resizeFlowerRainCanvas() {
    if (!flowerRainCanvas) return;
    flowerRainCanvas.width = window.innerWidth;
    flowerRainCanvas.height = window.innerHeight;
}

class YellowPetalParticle {
    constructor() {
        this.reset();
        this.y = Math.random() * window.innerHeight;
    }
    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = -30;
        this.size = 6 + Math.random() * 12;
        this.speedY = 1.5 + Math.random() * 2.5;
        this.speedX = -1 + Math.random() * 2;
        this.rotation = Math.random() * 360;
        this.spin = -1.5 + Math.random() * 3;
        this.color = `hsl(${42 + Math.random() * 15}, 100%, ${55 + Math.random() * 25}%)`;
        this.alpha = 0.7 + Math.random() * 0.3;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.02);
        this.rotation += this.spin;
        if (this.y > window.innerHeight + 30) {
            this.reset();
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

let flowerRainAnimationId = null;

function initFlowerRain() {
    resizeFlowerRainCanvas();
    window.addEventListener('resize', resizeFlowerRainCanvas);
    yellowPetalParticles.length = 0;
    for (let i = 0; i < 45; i++) {
        yellowPetalParticles.push(new YellowPetalParticle());
    }
}

function animateFlowerRain() {
    if (!flowerRainCtx) return;
    flowerRainCtx.clearRect(0, 0, flowerRainCanvas.width, flowerRainCanvas.height);
    for (let i = 0; i < yellowPetalParticles.length; i++) {
        yellowPetalParticles[i].update();
        yellowPetalParticles[i].draw(flowerRainCtx);
    }
    flowerRainAnimationId = requestAnimationFrame(animateFlowerRain);
}

function startFlowerRain() {
    initFlowerRain();
    if (!flowerRainAnimationId) {
        animateFlowerRain();
    }
}

function stopFlowerRain() {
    if (flowerRainAnimationId) {
        cancelAnimationFrame(flowerRainAnimationId);
        flowerRainAnimationId = null;
    }
    if (flowerRainCtx) {
        flowerRainCtx.clearRect(0, 0, flowerRainCanvas.width, flowerRainCanvas.height);
    }
}

// --------------------------------------------------------------------------
// Modal Open / Close Triggers
// --------------------------------------------------------------------------
function openBouquetModal() {
    flowersOverlay.classList.add('active');
    startFlowerRain();
}

function closeBouquetModal() {
    flowersOverlay.classList.remove('active');
    flowerNotePopover.classList.remove('active');
    stopFlowerRain();
}

if (quickFlowersBtn) quickFlowersBtn.addEventListener('click', openBouquetModal);
if (openBouquetBtn) openBouquetBtn.addEventListener('click', openBouquetModal);
if (closeFlowersBtn) closeFlowersBtn.addEventListener('click', closeBouquetModal);

// --------------------------------------------------------------------------
// Flower Click & Popover Logic
// --------------------------------------------------------------------------
interactiveFlowers.forEach(flower => {
    flower.addEventListener('click', (e) => {
        e.stopPropagation();
        const flowerId = parseInt(flower.getAttribute('data-id'));

        playFlowerBloomSound(flowerId);
        flower.classList.add('bloomed');

        discoveredFlowers.add(flowerId);
        const count = discoveredFlowers.size;
        flowerProgressText.textContent = `Flores descubiertas: ${count} / 7 🌟`;
        flowerProgressFill.style.width = `${(count / 7) * 100}%`;

        const msg = flowerMessages[flowerId];
        if (msg) {
            popoverBadge.textContent = msg.badge;
            popoverTitle.textContent = msg.title;
            popoverBody.textContent = msg.body;
            flowerNotePopover.classList.add('active');
        }

        burstGoldenPollen(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);

        if (count === 7) {
            setTimeout(() => {
                flowerProgressText.textContent = '¡Felicidades! Has descubierto todas las flores 🌻💛';
            }, 500);
        }
    });
});

if (popoverCloseBtn) {
    popoverCloseBtn.addEventListener('click', () => {
        flowerNotePopover.classList.remove('active');
    });
}

function burstGoldenPollen(x, y) {
    for (let i = 0; i < 16; i++) {
        const particle = new YellowPetalParticle();
        particle.x = x + (-25 + Math.random() * 50);
        particle.y = y + (-25 + Math.random() * 50);
        particle.speedY = -2 - Math.random() * 3;
        particle.speedX = -3 + Math.random() * 6;
        yellowPetalParticles.push(particle);
    }
}

// Lluvia de Flores Button Trigger
if (triggerPetalRainBtn) {
    triggerPetalRainBtn.addEventListener('click', () => {
        for (let i = 0; i < 30; i++) {
            yellowPetalParticles.push(new YellowPetalParticle());
        }
        playFlowerBloomSound(1);
        playFlowerBloomSound(5);
    });
}

// Dedication Card Modal Triggers
if (openDedicationCardBtn) {
    openDedicationCardBtn.addEventListener('click', () => {
        dedicationModal.classList.add('active');
    });
}

if (closeDedicationBtn) {
    closeDedicationBtn.addEventListener('click', () => {
        dedicationModal.classList.remove('active');
    });
}

if (dedicationModal) {
    dedicationModal.addEventListener('click', (e) => {
        if (e.target === dedicationModal) {
            dedicationModal.classList.remove('active');
        }
    });
}

// ==========================================================================
// Stage 7: Interactive Garden Canvas Engine (Procedural Sunflowers & Fireworks)
// ==========================================================================
const openGardenBtn = document.getElementById('openGardenBtn');
const gardenModal = document.getElementById('gardenModal');
const closeGardenBtn = document.getElementById('closeGardenBtn');
const gardenCanvas = document.getElementById('gardenCanvas');
const gardenCtx = gardenCanvas ? gardenCanvas.getContext('2d') : null;

const gardenCountText = document.getElementById('gardenCountText');
const bloomFullGardenBtn = document.getElementById('bloomFullGardenBtn');
const clearGardenBtn = document.getElementById('clearGardenBtn');

let gardenFlowerCount = 0;
const gardenFlowers = [];
const gardenFireflies = [];
const gardenFireworks = [];

let gardenAnimationId = null;
let isGardenActive = false;

function resizeGardenCanvas() {
    if (!gardenCanvas) return;
    gardenCanvas.width = window.innerWidth;
    gardenCanvas.height = window.innerHeight;
}

// Firefly Particle Class
class GardenFirefly {
    constructor() {
        this.reset();
        this.y = Math.random() * window.innerHeight;
    }
    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = 2 + Math.random() * 3.5;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 0.4 + Math.random() * 0.8;
        this.pulseSpeed = 0.02 + Math.random() * 0.04;
        this.pulse = Math.random() * Math.PI * 2;
        this.color = `hsl(${45 + Math.random() * 15}, 100%, ${60 + Math.random() * 30}%)`;
    }
    update() {
        this.angle += -0.05 + Math.random() * 0.1;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.pulse += this.pulseSpeed;

        if (this.x < -20 || this.x > window.innerWidth + 20 || this.y < -20 || this.y > window.innerHeight + 20) {
            this.reset();
        }
    }
    draw(ctx) {
        ctx.save();
        const alpha = 0.4 + Math.sin(this.pulse) * 0.4;
        ctx.globalAlpha = Math.max(0, alpha);

        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Growing Sunflower Class
class GrowingGardenSunflower {
    constructor(targetX, targetY) {
        this.targetX = targetX;
        this.targetY = targetY;
        this.startX = targetX + (-30 + Math.random() * 60);
        this.startY = window.innerHeight + 20;

        this.growth = 0;
        this.growthSpeed = 0.015 + Math.random() * 0.01;
        
        this.bloom = 0;
        this.bloomSpeed = 0.02 + Math.random() * 0.015;
        
        const isMobile = window.innerWidth <= 600;
        this.maxRadius = isMobile ? (13 + Math.random() * 9) : (24 + Math.random() * 20);
        this.petalsCount = 12 + Math.floor(Math.random() * 6);
        this.petalColor = `hsl(${42 + Math.random() * 14}, 100%, ${50 + Math.random() * 25}%)`;
        this.centerColor = `hsl(${25 + Math.random() * 10}, 60%, ${20 + Math.random() * 15}%)`;
        this.curveControlX = (this.startX + this.targetX) / 2 + (-40 + Math.random() * 80);

        this.isWishFlower = false;
        this.soundPlayed = false;
    }
    update() {
        if (this.growth < 1) {
            this.growth += this.growthSpeed;
            if (this.growth > 1) this.growth = 1;
        } else if (this.bloom < 1) {
            this.bloom += this.bloomSpeed;
            if (this.bloom > 1) this.bloom = 1;

            if (!this.soundPlayed) {
                this.soundPlayed = true;
                playFlowerBloomSound(Math.floor(1 + Math.random() * 7));
            }
        }
    }
    draw(ctx) {
        ctx.save();

        // Slightly softer opacity for regular flowers, 100% full opacity for wish flowers
        if (!this.isWishFlower) {
            ctx.globalAlpha = 0.88;
        }

        const t = this.growth;
        const currentX = (1 - t) * (1 - t) * this.startX + 2 * (1 - t) * t * this.curveControlX + t * t * this.targetX;
        const currentY = (1 - t) * (1 - t) * this.startY + 2 * (1 - t) * t * ((this.startY + this.targetY) / 2) + t * t * this.targetY;

        // Stem
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.quadraticCurveTo(this.curveControlX, (this.startY + this.targetY) / 2, currentX, currentY);
        ctx.lineWidth = Math.max(3, (this.maxRadius / 6) * this.growth);
        ctx.strokeStyle = this.isWishFlower ? '#43a047' : '#388e3c';
        ctx.lineCap = 'round';
        ctx.stroke();

        // Side leaf
        if (this.growth > 0.4) {
            const leafT = 0.5;
            const leafX = (1 - leafT) * (1 - leafT) * this.startX + 2 * (1 - leafT) * leafT * this.curveControlX + leafT * leafT * this.targetX;
            const leafY = (1 - leafT) * (1 - leafT) * this.startY + 2 * (1 - leafT) * leafT * ((this.startY + this.targetY) / 2) + leafT * leafT * this.targetY;

            ctx.fillStyle = '#4caf50';
            ctx.beginPath();
            ctx.ellipse(leafX + 12, leafY - 4, 12 * this.growth, 6 * this.growth, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Flower Head when blooming starts
        if (this.bloom > 0) {
            ctx.translate(this.targetX, this.targetY);
            const r = this.maxRadius * this.bloom;

            if (this.isWishFlower) {
                const wishAura = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 2.4);
                wishAura.addColorStop(0, 'rgba(255, 215, 0, 0.75)');
                wishAura.addColorStop(0.5, 'rgba(255, 143, 0, 0.4)');
                wishAura.addColorStop(1, 'transparent');
                ctx.fillStyle = wishAura;
                ctx.beginPath();
                ctx.arc(0, 0, r * 2.4, 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowColor = '#ffb300';
                ctx.shadowBlur = 18;
            } else {
                const auraGrad = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, r * 1.8);
                auraGrad.addColorStop(0, 'rgba(255, 235, 59, 0.35)');
                auraGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = auraGrad;
                ctx.beginPath();
                ctx.arc(0, 0, r * 1.8, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = this.petalColor;
            const angleStep = (Math.PI * 2) / this.petalsCount;
            for (let i = 0; i < this.petalsCount; i++) {
                const angle = i * angleStep;
                ctx.save();
                ctx.rotate(angle);

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(-r * 0.25, -r * 0.75, 0, -r * 1.25);
                ctx.quadraticCurveTo(r * 0.25, -r * 0.75, 0, 0);
                ctx.fill();

                ctx.restore();
            }

            ctx.fillStyle = this.centerColor;
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.48, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = this.isWishFlower ? '#ffffff' : '#ffd54f';
            ctx.lineWidth = this.isWishFlower ? 2.5 : 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.48, 0, Math.PI * 2);
            ctx.stroke();

            if (this.isWishFlower) {
                ctx.fillStyle = '#ff5e7e';
                ctx.font = `${r * 0.42}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('💖', 0, 0);
            }
        }

        ctx.restore();
    }
}

// Firework Stardust Particle
class GardenFireworkParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 2 + Math.random() * 4;
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = `hsl(${45 + Math.random() * 20}, 100%, ${60 + Math.random() * 25}%)`;
        this.alpha = 1;
        this.decay = 0.02 + Math.random() * 0.025;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08;
        this.vx *= 0.98;
        this.alpha -= this.decay;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const GARDEN_STORAGE_KEY = 'carta_xime_garden_saved_v1';

function saveGardenState() {
    try {
        const flowersData = gardenFlowers.map(f => ({
            targetX: f.targetX,
            targetY: f.targetY,
            maxRadius: f.maxRadius,
            petalColor: f.petalColor,
            centerColor: f.centerColor,
            petalsCount: f.petalsCount,
            isWishFlower: !!f.isWishFlower
        }));

        const data = {
            flowers: flowersData,
            wishes: gardenWishes,
            count: gardenFlowerCount
        };

        localStorage.setItem(GARDEN_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn("Could not save garden state:", e);
    }
}

function loadGardenState() {
    try {
        const saved = localStorage.getItem(GARDEN_STORAGE_KEY);
        if (!saved) return;

        const data = JSON.parse(saved);
        if (data && data.flowers && Array.isArray(data.flowers)) {
            gardenFlowers.length = 0;
            data.flowers.forEach(fd => {
                const flower = new GrowingGardenSunflower(fd.targetX, fd.targetY);
                if (fd.maxRadius) flower.maxRadius = fd.maxRadius;
                if (fd.petalColor) flower.petalColor = fd.petalColor;
                if (fd.centerColor) flower.centerColor = fd.centerColor;
                if (fd.petalsCount) flower.petalsCount = fd.petalsCount;
                if (fd.isWishFlower) flower.isWishFlower = true;
                flower.growth = 1;
                flower.bloom = 1;
                flower.soundPlayed = true;
                gardenFlowers.push(flower);
            });
        }

        if (data && data.wishes && Array.isArray(data.wishes)) {
            gardenWishes.length = 0;
            gardenWishes.push(...data.wishes);
        }

        if (data && typeof data.count === 'number') {
            gardenFlowerCount = data.count;
            if (gardenCountText) {
                gardenCountText.textContent = `Girasoles florecidos: ${gardenFlowerCount} 🌻`;
            }
        }
    } catch (e) {
        console.warn("Could not load garden state:", e);
    }
}

function initGardenScene() {
    resizeGardenCanvas();
    window.addEventListener('resize', resizeGardenCanvas);

    gardenFireflies.length = 0;
    for (let i = 0; i < 35; i++) {
        gardenFireflies.push(new GardenFirefly());
    }

    if (gardenFlowers.length === 0) {
        loadGardenState();
    }
}

// Interactive Golden Butterfly Class
class GardenButterfly {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 10 + Math.random() * 8;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 1.2 + Math.random() * 1.5;
        this.wingAngle = 0;
        this.wingSpeed = 0.2 + Math.random() * 0.15;
        this.color = `hsl(${45 + Math.random() * 15}, 100%, 65%)`;
        this.life = 1;
        this.decay = 0.003 + Math.random() * 0.003;
    }
    update() {
        this.angle += -0.1 + Math.random() * 0.2;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed - 0.3;
        this.wingAngle += this.wingSpeed;
        this.life -= this.decay;
    }
    draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = Math.max(0, this.life);

        const wingScale = Math.sin(this.wingAngle);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(-this.size * 0.6 * Math.abs(wingScale), 0, this.size * 0.7, this.size * 0.4, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(this.size * 0.6 * Math.abs(wingScale), 0, this.size * 0.7, this.size * 0.4, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3e2723';
        ctx.beginPath();
        ctx.ellipse(0, 0, 2, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

const gardenButterflies = [];
const gardenWishes = [];

function drawGardenConstellations(ctx) {
    const len = gardenFlowers.length;
    if (len < 2) return;

    ctx.save();
    ctx.lineWidth = 1.2;

    for (let i = 0; i < len; i++) {
        const f1 = gardenFlowers[i];
        if (f1.bloom < 0.2) continue;

        for (let j = i + 1; j < len; j++) {
            const f2 = gardenFlowers[j];
            if (f2.bloom < 0.2) continue;

            const dx = f1.targetX - f2.targetX;
            const dy = f1.targetY - f2.targetY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 180) {
                const alpha = (1 - dist / 180) * 0.35 * Math.min(f1.bloom, f2.bloom);
                ctx.strokeStyle = `rgba(255, 224, 130, ${alpha})`;

                ctx.beginPath();
                ctx.moveTo(f1.targetX, f1.targetY);
                ctx.lineTo(f2.targetX, f2.targetY);
                ctx.stroke();
            }
        }
    }
    ctx.restore();
}

let hoveredWishIndex = -1;
let activeWishIndex = -1;

function drawGardenWishes(ctx) {
    if (!gardenWishes || gardenWishes.length === 0) return;

    ctx.save();
    const isMobile = window.innerWidth <= 600;

    let targetActiveIdx = (hoveredWishIndex >= 0) ? hoveredWishIndex : activeWishIndex;

    // First pass: Draw non-active wish guide lines and compact ribbons
    for (let i = 0; i < gardenWishes.length; i++) {
        if (i === targetActiveIdx) continue; // draw active one last on top

        const w = gardenWishes[i];
        const flowerX = w.flowerX || w.x;
        const flowerY = w.flowerY || (w.y + 50);

        ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(flowerX, flowerY < w.y ? flowerY + 15 : flowerY - 15);
        ctx.lineTo(w.x, w.y < flowerY ? w.y + 10 : w.y - 10);
        ctx.stroke();
        ctx.setLineDash([]);

        let fontPx = isMobile ? 13 : 19;
        ctx.font = `600 ${fontPx}px Caveat, cursive`;
        let textStr = `✨ ${w.text} ✨`;
        let textMetrics = ctx.measureText(textStr);
        const maxW = Math.min(window.innerWidth - 24, isMobile ? 260 : 450);

        while (textMetrics.width > maxW - 20 && fontPx > 10) {
            fontPx -= 1;
            ctx.font = `600 ${fontPx}px Caveat, cursive`;
            textMetrics = ctx.measureText(textStr);
        }

        const textWidth = textMetrics.width + (isMobile ? 14 : 24);
        const textHeight = isMobile ? 22 : 30;

        ctx.shadowColor = 'rgba(255, 143, 0, 0.5)';
        ctx.shadowBlur = 6;

        ctx.fillStyle = 'rgba(20, 10, 30, 0.85)';
        ctx.strokeStyle = 'rgba(255, 224, 130, 0.8)';
        ctx.lineWidth = 1.4;

        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(w.x - textWidth / 2, w.y - textHeight / 2, textWidth, textHeight, 10);
        } else {
            ctx.rect(w.x - textWidth / 2, w.y - textHeight / 2, textWidth, textHeight);
        }
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff59d';
        ctx.shadowColor = '#ff8f00';
        ctx.shadowBlur = 4;
        ctx.fillText(textStr, w.x, w.y);
    }

    // Second pass: Draw active/hovered wish ribbon (PROMINENT ON TOP WITH AUTO-FONT SCALING)
    if (targetActiveIdx >= 0 && targetActiveIdx < gardenWishes.length) {
        const w = gardenWishes[targetActiveIdx];
        const flowerX = w.flowerX || w.x;
        const flowerY = w.flowerY || (w.y + 50);

        const pulse = Math.sin(Date.now() * 0.006) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(255, 215, 0, ${pulse})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ffb300';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(flowerX, flowerY < w.y ? flowerY + 18 : flowerY - 18);
        ctx.lineTo(w.x, w.y < flowerY ? w.y + 14 : w.y - 14);
        ctx.stroke();

        let activeFontPx = isMobile ? 15 : 24;
        ctx.font = `700 ${activeFontPx}px Caveat, cursive`;
        let activeStr = `💖 ${w.text} 💖`;
        let activeMetrics = ctx.measureText(activeStr);
        const maxActiveW = Math.min(window.innerWidth - 18, isMobile ? 290 : 500);

        while (activeMetrics.width > maxActiveW - 24 && activeFontPx > 11) {
            activeFontPx -= 1;
            ctx.font = `700 ${activeFontPx}px Caveat, cursive`;
            activeMetrics = ctx.measureText(activeStr);
        }

        const activeW = activeMetrics.width + (isMobile ? 18 : 36);
        const activeH = isMobile ? 28 : 38;

        ctx.shadowColor = '#ff8f00';
        ctx.shadowBlur = 18;

        ctx.fillStyle = 'rgba(15, 6, 26, 0.95)';
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(w.x - activeW / 2, w.y - activeH / 2, activeW, activeH, 12);
        } else {
            ctx.rect(w.x - activeW / 2, w.y - activeH / 2, activeW, activeH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ff6f00';
        ctx.shadowBlur = 8;
        ctx.fillText(activeStr, w.x, w.y);

        ctx.font = isMobile ? '700 8px sans-serif' : '700 11px sans-serif';
        ctx.fillStyle = '#ffd54f';
        ctx.shadowBlur = 0;
        ctx.fillText('✨ DESEO DE XIME ✨', w.x, w.y - activeH / 2 - (isMobile ? 6 : 9));
    }

    ctx.restore();
}

function animateGarden() {
    if (!gardenCtx || !isGardenActive) return;

    const grad = gardenCtx.createLinearGradient(0, 0, 0, gardenCanvas.height);
    grad.addColorStop(0, '#0d061a');
    grad.addColorStop(0.6, '#180e2d');
    grad.addColorStop(1, '#2c163b');
    gardenCtx.fillStyle = grad;
    gardenCtx.fillRect(0, 0, gardenCanvas.width, gardenCanvas.height);

    for (let i = 0; i < gardenFireflies.length; i++) {
        gardenFireflies[i].update();
        gardenFireflies[i].draw(gardenCtx);
    }

    drawGardenConstellations(gardenCtx);

    for (let i = 0; i < gardenFlowers.length; i++) {
        gardenFlowers[i].update();
        gardenFlowers[i].draw(gardenCtx);
    }

    for (let i = gardenButterflies.length - 1; i >= 0; i--) {
        const b = gardenButterflies[i];
        b.update();
        b.draw(gardenCtx);
        if (b.life <= 0) {
            gardenButterflies.splice(i, 1);
        }
    }

    drawGardenWishes(gardenCtx);

    for (let i = gardenFireworks.length - 1; i >= 0; i--) {
        const fw = gardenFireworks[i];
        fw.update();
        fw.draw(gardenCtx);
        if (fw.alpha <= 0) {
            gardenFireworks.splice(i, 1);
        }
    }

    gardenAnimationId = requestAnimationFrame(animateGarden);
}

const gardenMilestoneToast = document.getElementById('gardenMilestoneToast');
const milestoneTitle = document.getElementById('milestoneTitle');
const milestoneBody = document.getElementById('milestoneBody');
let milestoneTimeout = null;

function checkFlowerMilestone(count) {
    if (count > 0 && count % 50 === 0) {
        showGardenMilestoneToast(count);
    }
}

function showGardenMilestoneToast(count) {
    if (!gardenMilestoneToast) return;

    if (milestoneTitle) {
        milestoneTitle.textContent = `¡${count} Girasoles para Xime! 💛🌻`;
    }
    if (milestoneBody) {
        milestoneBody.textContent = `Cada girasol que florece es un motivo más por el que me encantas... ¡Tu jardín está increíble! ✨`;
    }

    gardenMilestoneToast.classList.add('active');

    // Chime sequence
    playFlowerBloomSound(1);
    setTimeout(() => playFlowerBloomSound(3), 120);
    setTimeout(() => playFlowerBloomSound(5), 240);
    setTimeout(() => playFlowerBloomSound(7), 360);

    // Burst of fireworks & butterflies across canvas
    for (let i = 0; i < 40; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        gardenFireworks.push(new GardenFireworkParticle(x, y));
    }
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        gardenButterflies.push(new GardenButterfly(x, y));
    }

    if (milestoneTimeout) clearTimeout(milestoneTimeout);
    milestoneTimeout = setTimeout(() => {
        gardenMilestoneToast.classList.remove('active');
    }, 4500);
}

function spawnGardenFlower(x, y) {
    gardenFlowers.push(new GrowingGardenSunflower(x, y));
    gardenFlowerCount++;
    if (gardenCountText) {
        gardenCountText.textContent = `Girasoles florecidos: ${gardenFlowerCount} 🌻`;
    }

    checkFlowerMilestone(gardenFlowerCount);

    for (let i = 0; i < 20; i++) {
        gardenFireworks.push(new GardenFireworkParticle(x, y));
    }

    if (Math.random() > 0.5) {
        gardenButterflies.push(new GardenButterfly(x, y));
    }

    saveGardenState();
}

function openGardenModal() {
    isGardenActive = true;
    gardenModal.classList.add('active');
    initGardenScene();

    if (!gardenAnimationId) {
        animateGarden();
    }
}

function closeGardenModal() {
    isGardenActive = false;
    gardenModal.classList.remove('active');
    if (gardenAnimationId) {
        cancelAnimationFrame(gardenAnimationId);
        gardenAnimationId = null;
    }
}

if (openGardenBtn) openGardenBtn.addEventListener('click', openGardenModal);
if (closeGardenBtn) closeGardenBtn.addEventListener('click', closeGardenModal);

if (gardenCanvas) {
    let lastSpawnTime = 0;

    function checkGardenHover(clientX, clientY) {
        if (!gardenCanvas) return;
        const rect = gardenCanvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        let foundIdx = -1;
        for (let i = 0; i < gardenWishes.length; i++) {
            const w = gardenWishes[i];
            const fx = w.flowerX || w.x;
            const fy = w.flowerY || (w.y + 50);

            const distFlower = Math.hypot(x - fx, y - fy);
            const distRibbon = Math.hypot(x - w.x, y - w.y);

            if (distFlower < 45 || distRibbon < 50) {
                foundIdx = i;
                break;
            }
        }

        if (hoveredWishIndex !== foundIdx) {
            hoveredWishIndex = foundIdx;
            if (foundIdx >= 0) {
                const targetW = gardenWishes[foundIdx];
                const fx = targetW.flowerX || targetW.x;
                const fy = targetW.flowerY || (targetW.y + 50);
                for (let k = 0; k < 6; k++) {
                    gardenFireworks.push(new GardenFireworkParticle(fx, fy));
                }
            }
        }

        gardenCanvas.style.cursor = (foundIdx >= 0) ? 'pointer' : 'crosshair';
    }

    gardenCanvas.addEventListener('mousemove', (e) => {
        checkGardenHover(e.clientX, e.clientY);
    });

    function handleGardenPointer(e) {
        const rect = gardenCanvas.getBoundingClientRect();
        const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Check if user clicked/tapped on or near an existing wish flower or wish ribbon
        let tappedWishIdx = -1;
        for (let i = 0; i < gardenWishes.length; i++) {
            const w = gardenWishes[i];
            const fx = w.flowerX || w.x;
            const fy = w.flowerY || (w.y + 50);

            const distFlower = Math.hypot(x - fx, y - fy);
            const distRibbon = Math.hypot(x - w.x, y - w.y);

            if (distFlower < 45 || distRibbon < 50) {
                tappedWishIdx = i;
                break;
            }
        }

        if (tappedWishIdx >= 0) {
            if (activeWishIndex === tappedWishIdx) {
                activeWishIndex = -1;
            } else {
                activeWishIndex = tappedWishIdx;
                const w = gardenWishes[tappedWishIdx];
                const fx = w.flowerX || w.x;
                const fy = w.flowerY || (w.y + 50);

                for (let k = 0; k < 18; k++) {
                    gardenFireworks.push(new GardenFireworkParticle(fx, fy));
                }
                gardenButterflies.push(new GardenButterfly(fx, fy));
                playFlowerBloomSound(Math.min(7, tappedWishIdx + 1));
            }
            return;
        }

        const now = Date.now();
        if (now - lastSpawnTime < 180) return;
        lastSpawnTime = now;

        spawnGardenFlower(x, y);
    }

    gardenCanvas.addEventListener('click', handleGardenPointer);
    gardenCanvas.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
            checkGardenHover(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
}

if (bloomFullGardenBtn) {
    bloomFullGardenBtn.addEventListener('click', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const count = 60;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = 25 + Math.random() * (width - 50);
                const y = 50 + Math.random() * (height - 140);
                spawnGardenFlower(x, y);
            }, i * 65);
        }
    });
}

if (clearGardenBtn) {
    clearGardenBtn.addEventListener('click', () => {
        gardenFlowers.length = 0;
        gardenFireworks.length = 0;
        gardenButterflies.length = 0;
        gardenWishes.length = 0;
        gardenFlowerCount = 0;
        hoveredWishIndex = -1;
        activeWishIndex = -1;
        if (gardenCountText) {
            gardenCountText.textContent = 'Girasoles florecidos: 0 🌻';
        }
        localStorage.removeItem(GARDEN_STORAGE_KEY);
    });
}

// Wish Modal Triggers & Logic
const openWishBtn = document.getElementById('openWishBtn');
const wishModal = document.getElementById('wishModal');
const closeWishBtn = document.getElementById('closeWishBtn');
const wishInput = document.getElementById('wishInput');
const sendWishBtn = document.getElementById('sendWishBtn');
const wishTags = document.querySelectorAll('.wish-tag');

if (openWishBtn) {
    openWishBtn.addEventListener('click', () => {
        wishModal.classList.add('active');
        if (wishInput) wishInput.focus();
    });
}

if (closeWishBtn) {
    closeWishBtn.addEventListener('click', () => {
        wishModal.classList.remove('active');
    });
}

wishTags.forEach(tag => {
    tag.addEventListener('click', () => {
        if (wishInput) {
            wishInput.value = tag.getAttribute('data-text');
        }
    });
});

if (sendWishBtn) {
    sendWishBtn.addEventListener('click', () => {
        const text = wishInput ? wishInput.value.trim() : '';
        if (!text) return;

        wishModal.classList.remove('active');
        if (wishInput) wishInput.value = '';

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const isMobile = screenW <= 600;

        const marginX = isMobile ? 30 : 80;
        const minY = isMobile ? 140 : 160;
        const maxY = Math.min(screenH * 0.45, screenH - 180);

        let bestX = marginX + Math.random() * Math.max(60, screenW - marginX * 2);
        let bestY = minY + Math.random() * Math.max(50, maxY - minY);
        let maxMinDist = 0;

        // Try candidate positions to find non-overlapping organic open spot
        for (let attempt = 0; attempt < 25; attempt++) {
            const candX = marginX + Math.random() * Math.max(60, screenW - marginX * 2);
            const candY = minY + Math.random() * Math.max(50, maxY - minY);

            let minDist = 9999;
            for (const w of gardenWishes) {
                const d = Math.hypot(candX - (w.flowerX || w.x), candY - (w.flowerY || w.y));
                if (d < minDist) minDist = d;
            }

            if (minDist > (isMobile ? 80 : 130)) {
                bestX = candX;
                bestY = candY;
                break;
            } else if (minDist > maxMinDist) {
                maxMinDist = minDist;
                bestX = candX;
                bestY = candY;
            }
        }

        const flowerX = bestX;
        const flowerY = bestY;
        const ribbonY = (flowerY < 190) ? (flowerY + (isMobile ? 38 : 48)) : (flowerY - (isMobile ? 38 : 48));
        const ribbonX = flowerX;

        const wishFlower = new GrowingGardenSunflower(flowerX, flowerY);
        wishFlower.isWishFlower = true;
        wishFlower.maxRadius = isMobile ? 20 : 32;
        wishFlower.petalColor = '#ffd54f';
        gardenFlowers.push(wishFlower);

        const newWish = {
            text: text,
            x: ribbonX,
            y: ribbonY,
            flowerX: flowerX,
            flowerY: flowerY
        };
        gardenWishes.push(newWish);

        activeWishIndex = gardenWishes.length - 1;

        for (let i = 0; i < 6; i++) {
            gardenButterflies.push(new GardenButterfly(flowerX + (-40 + Math.random() * 80), flowerY + (-40 + Math.random() * 80)));
        }
        for (let i = 0; i < 30; i++) {
            gardenFireworks.push(new GardenFireworkParticle(flowerX, flowerY));
        }

        playFlowerBloomSound(1);
        playFlowerBloomSound(5);
        saveGardenState();
    });
}
