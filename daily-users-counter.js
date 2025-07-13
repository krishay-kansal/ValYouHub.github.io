// === Daily Users & Courses Counter Animation ===
const DAILY_USERS_TARGET = 10543; // Easily update this number for backend integration
const DAILY_COURSES_TARGET = 12;
const ANIMATION_DURATION = 1800; // ms
const numberEl = document.getElementById('dailyUsersNumber');
const ringEl = document.querySelector('.progress-ring__circle');
const coursesEl = document.getElementById('dailyCoursesNumber');
const coursesRingEl = document.querySelector('.courses-ring__circle');
const confettiCanvas = document.getElementById('confettiCanvas');
let hasAnimated = false;

function animateCountUp(target, duration, el, ring) {
  let startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    let progress = Math.min((ts - startTime) / duration, 1);
    let value = Math.max(1, Math.floor(progress * target)); // Start from 1
    el.textContent = value.toLocaleString();
    animateRing(progress, ring);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target.toLocaleString() + '+';
      animateRing(1, ring);
      if (el === numberEl) launchConfetti();
    }
  }
  requestAnimationFrame(step);
}

function animateRing(progress, ring) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  ring.style.strokeDashoffset = offset;
}

// Simple confetti effect
function launchConfetti() {
  if (!confettiCanvas) return;
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = confettiCanvas.offsetWidth;
  confettiCanvas.height = confettiCanvas.offsetHeight;
  let particles = [];
  for (let i = 0; i < 32; i++) {
    particles.push({
      x: confettiCanvas.width / 2,
      y: confettiCanvas.height / 2,
      r: Math.random() * 6 + 4,
      color: `hsl(${Math.random()*360},80%,60%)`,
      vx: (Math.random()-0.5)*6,
      vy: Math.random()*-6-2,
      alpha: 1
    });
  }
  function draw() {
    ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2*Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18;
      p.alpha -= 0.018;
    });
    particles = particles.filter(p => p.alpha > 0);
    if (particles.length) requestAnimationFrame(draw);
  }
  draw();
}

// IntersectionObserver to trigger both animations
const observer = new window.IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !hasAnimated) {
      hasAnimated = true;
      animateCountUp(DAILY_USERS_TARGET, ANIMATION_DURATION, numberEl, ringEl);
      animateCountUp(DAILY_COURSES_TARGET, ANIMATION_DURATION, coursesEl, coursesRingEl);
    }
  });
}, { threshold: 0.5 });
const section = document.querySelector('.daily-users-section');
if (section) observer.observe(section);

document.addEventListener('DOMContentLoaded', function() {
  // If the counter hasn't animated yet, set a default value
  if (numberEl && numberEl.textContent === '0') {
    numberEl.textContent = '10,000+';
  }
});
