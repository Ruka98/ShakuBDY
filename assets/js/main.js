/**
 * Shakuni's Birthday Experience - Interactive Scripts
 * Crafted with love by Rukmal
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initAudioEngine();
  initGiftUnbox();
  initCakeCandles();
  initEnvelope();
  initFlipCards();
  initClickHearts();
  initLightbox();
});

/* ----------------------------------------------------
 * 1. AMBIENT FLOATING PETALS & HEARTS CANVAS
 * ---------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width > 768 ? 32 : 18, 35);

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 0.8 + 0.5;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = Math.random() * 0.02 - 0.01;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.type = Math.random() > 0.4 ? 'petal' : 'heart';
    }
    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.angle) * 0.6 + this.speedX;
      this.angle += this.spin;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'petal') {
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw miniature heart
        ctx.fillStyle = '#fb7185';
        ctx.beginPath();
        const s = this.size * 0.6;
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.3, s * 0.4, 0, s * 1.3);
        ctx.bezierCurveTo(s * 1.3, s * 0.4, s, -s * 0.5, 0, s * 0.3);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ----------------------------------------------------
 * 2. AUDIO CONTROLLER (Web Audio Synthesizer + MP3 Fallback)
 * ---------------------------------------------------- */
let audioCtx = null;
let synthTimer = null;
let isPlaying = false;
let bgAudio = null;

function initAudioEngine() {
  bgAudio = document.getElementById('bgMusic');
  const toggleBtn = document.getElementById('musicToggle');
  const soundIcon = document.getElementById('soundIcon');
  const soundStatus = document.getElementById('soundStatus');

  function startMusic() {
    if (isPlaying) return;
    isPlaying = true;
    if (toggleBtn) toggleBtn.classList.remove('sound-paused');
    if (soundStatus) soundStatus.textContent = 'Music: On';

    // Try playing the mp3 file first
    if (bgAudio && bgAudio.src && !bgAudio.src.endsWith('#')) {
      bgAudio.volume = 0.75;
      bgAudio.play().then(() => {
        // MP3 is playing fine
      }).catch((e) => {
        console.warn('MP3 playback fallback to synth:', e);
        startSynthMelody();
      });
    } else {
      startSynthMelody();
    }
  }

  function pauseMusic() {
    isPlaying = false;
    if (toggleBtn) toggleBtn.classList.add('sound-paused');
    if (soundStatus) soundStatus.textContent = 'Music: Off';
    if (bgAudio) bgAudio.pause();
    stopSynthMelody();
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseMusic();
      } else {
        startMusic();
      }
    });
  }

  window.startBirthdayMusic = startMusic;
  window.pauseBirthdayMusic = pauseMusic;
}

// Gentle romantic music-box synthesizer (C major / G / Am / F gentle arpeggios)
function startSynthMelody() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C Major
      [220.00, 261.63, 329.63, 440.00], // A Minor
      [174.61, 220.00, 261.63, 349.23], // F Major
      [196.00, 246.94, 293.66, 392.00]  // G Major
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    function playNote(freq) {
      if (!isPlaying || !audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, audioCtx.currentTime);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    }

    function step() {
      if (!isPlaying) return;
      const chord = chords[chordIdx];
      const freq = chord[noteIdx % chord.length];
      playNote(freq);

      noteIdx++;
      if (noteIdx >= 4) {
        noteIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
      synthTimer = setTimeout(step, 450);
    }

    step();
  } catch (e) {
    console.log('Synth not supported:', e);
  }
}

function stopSynthMelody() {
  if (synthTimer) {
    clearTimeout(synthTimer);
    synthTimer = null;
  }
}

function playChimeSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      }, idx * 120);
    });
  } catch (e) {}
}

/* ----------------------------------------------------
 * 3. GIFT UNBOX SCREEN
 * ---------------------------------------------------- */
function initGiftUnbox() {
  const modal = document.getElementById('giftModal');
  const openBtn = document.getElementById('unwrapBtn');
  const mainContent = document.getElementById('mainContent');

  if (!openBtn || !modal) return;

  openBtn.addEventListener('click', () => {
    // Confetti explosion
    triggerBigConfetti();
    playChimeSound();

    if (window.startBirthdayMusic) {
      window.startBirthdayMusic();
    }

    // Smooth modal exit
    modal.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    modal.style.opacity = '0';
    modal.style.transform = 'scale(1.08)';

    setTimeout(() => {
      modal.style.display = 'none';
      if (mainContent) {
        mainContent.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 700);
  });
}

/* ----------------------------------------------------
 * 4. INTERACTIVE BIRTHDAY CAKE & CANDLE BLOW
 * ---------------------------------------------------- */
function initCakeCandles() {
  const cakeArea = document.getElementById('cakeArea');
  const flames = document.querySelectorAll('.candle-flame');
  const wishBanner = document.getElementById('wishBanner');
  const relightBtn = document.getElementById('relightBtn');
  let candlesBlown = false;

  function blowCandles() {
    if (candlesBlown) return;
    candlesBlown = true;

    flames.forEach((flame) => {
      flame.classList.add('blown-out');

      // Create smoke puff
      const puff = document.createElement('div');
      puff.className = 'smoke-puff';
      flame.parentElement.appendChild(puff);
      setTimeout(() => puff.remove(), 1600);
    });

    playChimeSound();
    triggerCelebrationConfetti();

    if (wishBanner) {
      wishBanner.classList.remove('hidden');
      wishBanner.classList.add('animate-bounce');
    }
  }

  if (cakeArea) {
    cakeArea.addEventListener('click', blowCandles);
  }

  if (relightBtn) {
    relightBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      candlesBlown = false;
      flames.forEach((flame) => flame.classList.remove('blown-out'));
      if (wishBanner) wishBanner.classList.add('hidden');
    });
  }
}

/* ----------------------------------------------------
 * 5. WAX-SEALED SECRET LETTER (Mobile Optimized)
 * ---------------------------------------------------- */
function initEnvelope() {
  const waxSeal = document.getElementById('waxSeal');
  const letterModal = document.getElementById('letterModal');
  const closeButtons = document.querySelectorAll('.close-letter-btn, #closeLetter, #closeLetterBottom');

  function openLetter(e) {
    if (e) e.preventDefault();
    playChimeSound();
    if (letterModal) {
      letterModal.classList.remove('hidden');
      letterModal.scrollTop = 0;
    }
    document.body.style.overflow = 'hidden'; // Lock background scroll on mobile
    triggerHeartConfetti();
  }

  function closeLetter(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (letterModal) {
      letterModal.classList.add('hidden');
    }
    document.body.style.overflow = ''; // Restore scroll
  }

  if (waxSeal && letterModal) {
    waxSeal.addEventListener('click', openLetter);
    waxSeal.addEventListener('touchend', openLetter);
  }

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', closeLetter);
    btn.addEventListener('touchend', closeLetter);
  });

  // Tap anywhere outside the letter paper on the backdrop to close
  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) {
        closeLetter(e);
      }
    });
  }

  // Escape key support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && letterModal && !letterModal.classList.contains('hidden')) {
      closeLetter(e);
    }
  });
}

/* ----------------------------------------------------
 * 6. 3D FLIP CARDS
 * ---------------------------------------------------- */
function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

/* ----------------------------------------------------
 * 7. CLICK / TOUCH HEART SPAWNER
 * ---------------------------------------------------- */
function initClickHearts() {
  const icons = ['❤️', '💖', '✨', '🌸', '💐'];
  document.addEventListener('click', (e) => {
    // Avoid triggering when clicking buttons, links, or modals
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('#waxSeal') || e.target.closest('#cakeArea') || e.target.closest('#letterModal') || e.target.closest('#imageLightbox')) {
      return;
    }

    const heart = document.createElement('div');
    heart.className = 'floating-click-heart';
    heart.textContent = icons[Math.floor(Math.random() * icons.length)];
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1200);
  });
}

/* ----------------------------------------------------
 * 8. IMAGE LIGHTBOX (Mobile Optimized)
 * ---------------------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtns = document.querySelectorAll('#closeLightbox, #closeLightboxBottom');

  if (!lightbox || !lightboxImg) return;

  function openLightbox(img) {
    lightboxImg.src = img.src;
    if (lightboxCaption) {
      lightboxCaption.textContent = img.dataset.caption || img.alt || '';
    }
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.zoomable-img').forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img));
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener('click', closeLightbox);
    btn.addEventListener('touchend', closeLightbox);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxImg) {
      closeLightbox(e);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox(e);
    }
  });
}

/* ----------------------------------------------------
 * CONFETTI HELPERS
 * ---------------------------------------------------- */
function triggerBigConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#f59e0b', '#fbbf24', '#ffffff']
    });
  }
}

function triggerCelebrationConfetti() {
  if (typeof confetti === 'function') {
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#f43f5e', '#e11d48', '#fbbf24', '#f472b6', '#38bdf8'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}

function triggerHeartConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 60,
      spread: 90,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#e11d48', '#fecdd3']
    });
  }
}

// Global hook for manual button
window.sendLoveReaction = function() {
  triggerHeartConfetti();
  playChimeSound();
};
