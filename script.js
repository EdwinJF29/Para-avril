// script.js

// --- CONFIGURACIÓN ---
const textElement = document.getElementById('typing-text');
const textToType = "¿Quieres ser mi San Valentín? 💘";
const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const successMsg = document.getElementById('success-msg');
const btnGroup = document.querySelector('.btn-group');
const title = document.querySelector('.title');

// Variables de estado
let charIndex = 0;
let yesScale = 1; 
const MAX_SCALE = 3; // El botón "Sí" crecerá máximo 3 veces su tamaño

// Frases para el botón "No"
const noPhrases = [
    "No", 
    "¿Estás segura?", 
    "¿De verdad?", 
    "¡Piénsalo bien!", 
    "¡Mira el otro botón!", 
    "¡No me hagas esto!", 
    "💔"
];
let phraseIndex = 0;

// 1. Efecto de Máquina de Escribir
function typeWriter() {
    if (charIndex < textToType.length) {
        textElement.innerHTML += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 80); 
    }
}

// 2. Lógica del Botón NO (Crece el Sí)
noBtn.addEventListener('click', () => {
    // Aumentar tamaño del botón Sí (con límite)
    if (yesScale < MAX_SCALE) {
        yesScale += 0.4; 
        yesBtn.style.transform = `scale(${yesScale})`;
    }

    // Cambiar texto del botón No
    phraseIndex = (phraseIndex + 1) % noPhrases.length;
    noBtn.innerText = noPhrases[phraseIndex];
});

// 3. Lógica del Botón SÍ (Éxito)
yesBtn.addEventListener('click', () => {
    // Ocultar interfaz inicial
    btnGroup.style.display = 'none';
    title.style.display = 'none';
    textElement.style.display = 'none';
    
    // Mostrar mensaje final
    successMsg.classList.remove('hidden');
    
    // Lanzar confeti de corazones
    createLoveExplosion();
});

// Inicialización
window.onload = () => {
    typeWriter();
    initHearts();
    animate();
};

// --- FONDO ANIMADO (CORAZONES) ---
const canvas = document.getElementById('heart-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let hearts = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Heart {
    constructor(x, y, size, speed, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.1;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        let topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, (this.size + topCurveHeight) / 2, 0, this.size);
        ctx.bezierCurveTo(0, (this.size + topCurveHeight) / 2, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.y -= this.speed;
        this.angle += this.spin;
        if (this.y < -this.size) {
            this.y = height + this.size;
            this.x = Math.random() * width;
        }
    }
}

function initHearts() {
    for (let i = 0; i < 40; i++) {
        createRandomHeart();
    }
}

function createRandomHeart() {
    let size = Math.random() * 20 + 10;
    let x = Math.random() * width;
    let y = Math.random() * height;
    let speed = Math.random() * 2 + 1;
    let color = `rgba(255, ${Math.floor(Math.random() * 50 + 200)}, ${Math.floor(Math.random() * 50 + 200)}, ${Math.random() * 0.5 + 0.3})`;
    hearts.push(new Heart(x, y, size, speed, color));
}

function createLoveExplosion() {
    for (let i = 0; i < 100; i++) {
        let size = Math.random() * 30 + 15;
        let x = Math.random() * width;
        let y = height + Math.random() * 50;
        let speed = Math.random() * 8 + 4;
        let color = '#ff7675';
        hearts.push(new Heart(x, y, size, speed, color));
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    hearts.forEach(heart => {
        heart.draw();
        heart.update();
    });
    requestAnimationFrame(animate);
}