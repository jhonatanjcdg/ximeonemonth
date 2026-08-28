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
    if (!isMusicPlaying) {
        startBackgroundMusic();
    }

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
    startBackgroundMusic();
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
});
