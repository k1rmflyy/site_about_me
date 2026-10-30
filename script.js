// ---------- дождь ----------
const canvas = document.getElementById('rain');
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let drops = [];
let dpr = 1;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // на телефоне капель меньше, чтобы не грузить
  const count = Math.round((window.innerWidth * window.innerHeight) / 9000);
  drops = Array.from({ length: Math.min(count, 220) }, makeDrop);
}

function makeDrop() {
  const depth = Math.random(); // 0 — далеко, 1 — близко
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    len: 8 + depth * 18,
    speed: 2 + depth * 4,
    alpha: 0.04 + depth * 0.16
  };
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.lineWidth = 1;

  for (const d of drops) {
    ctx.strokeStyle = `rgba(220, 220, 225, ${d.alpha})`;
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x - 1, d.y + d.len);
    ctx.stroke();

    d.y += d.speed;
    if (d.y > window.innerHeight) {
      d.y = -d.len;
      d.x = Math.random() * window.innerWidth;
    }
  }

  requestAnimationFrame(draw);
}

resize();
window.addEventListener('resize', resize);
if (!reduceMotion) draw();

// ---------- плавное появление при скролле ----------
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

window.addEventListener('load', () => {
  reveals.forEach((el) => observer.observe(el));
});

// ---------- фон у меню при скролле ----------
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });
