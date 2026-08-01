/* ═══════════════════════════════════════════════════════════════
   Ment704 Portfolio — JavaScript
   Intersection Observer, Carousel, Particles, Navigation
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Intersection Observer for scroll animations ── */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ── Mobile Navigation Toggle ── */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  /* ── Navbar background on scroll ── */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
      navbar.style.background = 'rgba(10, 10, 10, 0.85)';
    }
    lastScroll = currentScroll;
  });

  /* ── Back to top button ── */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Carousel ── */
  const carousel = document.getElementById('carousel');
  const slides = carousel ? carousel.querySelectorAll('.carousel-slide') : [];

  // Fallback for missing images in carousel
  slides.forEach(slide => {
    const img = slide.querySelector('.slide-image');
    if (img) {
      img.addEventListener('error', () => {
        img.style.display = 'none';
        const wrapper = img.closest('.slide-image-wrapper');
        if (wrapper) {
          wrapper.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
          wrapper.style.display = 'flex';
          wrapper.style.alignItems = 'center';
          wrapper.style.justifyContent = 'center';
          const placeholder = document.createElement('div');
          placeholder.textContent = '🖼️';
          placeholder.style.fontSize = '3rem';
          placeholder.style.opacity = '0.3';
          wrapper.appendChild(placeholder);
        }
      });
    }
  });
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  let currentSlide = 0;
  const totalSlides = slides.length;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % totalSlides);
  }

  function prevSlide() {
    showSlide((currentSlide - 1 + totalSlides) % totalSlides);
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showSlide(parseInt(dot.dataset.index));
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  if (carousel) {
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });
  }

  /* ── Hero Particles Canvas ── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let isActive = true;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(29, 185, 84, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particles (lightweight: 50 particles)
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    function animate() {
      if (!isActive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(29, 185, 84, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Pause when not visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isActive = entry.isIntersecting;
        if (isActive && !animationId) animate();
      });
    }, { threshold: 0 });

    heroObserver.observe(document.querySelector('.hero'));
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ── Roblox Stats Canvas ── */
  (function drawRobloxStats() {
    const statsCanvas = document.getElementById('robloxStats');
    if (!statsCanvas) return;

    const ctx = statsCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = statsCanvas.getBoundingClientRect();
    statsCanvas.width = rect.width * dpr;
    statsCanvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;

    // Background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(1, '#16213e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Title
    ctx.fillStyle = '#fff';
    const titleFont = 'bold ' + (W * 0.045) + 'px Inter, sans-serif';
    ctx.font = titleFont;
    ctx.textAlign = 'left';
    const titleText = 'Cascade Piano🎹';
    const titleX = W * 0.04;
    const titleY = H * 0.14;
    const titleWidth = ctx.measureText(titleText).width;
    ctx.fillText(titleText, titleX, titleY);

    // Subtitle
    ctx.fillStyle = '#B3B3B3';
    ctx.font = (W * 0.022) + 'px Inter, sans-serif';
    ctx.fillText('От: Arcane Rebels (Community)', W * 0.04, H * 0.24);

    // Stats cards
    const cards = [
      { label: 'Игроки онлайн', value: '18', unit: 'чел.', color: '#1DB954' },
      { label: 'Всего визитов', value: '1.19M', unit: 'визитов', color: '#1DB954' },
      { label: 'Длина сессии', value: '5.29', unit: 'мин.', color: '#1DB954' },
      { label: 'Рейтинг', value: '82.1', unit: '%', color: '#1DB954' },
    ];

    const cardW = W * 0.2;
    const cardH = H * 0.38;
    const startX = W * 0.04;
    const gap = (W - startX * 2 - cardW * 4) / 3;
    const cardY = H * 0.34;

    cards.forEach((card, i) => {
      const x = startX + i * (cardW + gap);

      // Card bg
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.beginPath();
      ctx.roundRect(x, cardY, cardW, cardH, 8);
      ctx.fill();

      // Top accent line
      ctx.fillStyle = card.color;
      ctx.fillRect(x, cardY, cardW, 3);

      // Label
      ctx.fillStyle = '#B3B3B3';
      ctx.font = (W * 0.018) + 'px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(card.label, x + cardW / 2, cardY + cardH * 0.28);

      // Value
      ctx.fillStyle = '#fff';
      ctx.font = 'bold ' + (W * 0.055) + 'px Inter, sans-serif';
      ctx.fillText(card.value, x + cardW / 2, cardY + cardH * 0.58);

      // Unit
      ctx.fillStyle = '#6A6A6A';
      ctx.font = (W * 0.016) + 'px Inter, sans-serif';
      ctx.fillText(card.unit, x + cardW / 2, cardY + cardH * 0.78);
    });

    // Release date
    ctx.fillStyle = '#6A6A6A';
    ctx.font = (W * 0.018) + 'px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Релиз: 19 апреля 2026', W * 0.96, H * 0.88);
  })();

  /* ── Parallax effect for hero ── */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      if (scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${rate}px)`;
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
      }
    });
  }

  /* ── Lightbox / Image Zoom ── */
  const lightboxOverlay = document.createElement('div');
  lightboxOverlay.className = 'lightbox-overlay';
  lightboxOverlay.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <img class="lightbox-img" src="" alt="">
    <button class="lightbox-close" aria-label="Закрыть">×</button>
    <div class="lightbox-controls">
      <button class="lightbox-btn" id="lbZoomOut" aria-label="Уменьшить">−</button>
      <span class="lightbox-zoom">100%</span>
      <button class="lightbox-btn" id="lbZoomIn" aria-label="Увеличить">+</button>
    </div>
  `;
  document.body.appendChild(lightboxOverlay);

  const lbImg = lightboxOverlay.querySelector('.lightbox-img');
  const lbZoomText = lightboxOverlay.querySelector('.lightbox-zoom');
  let scale = 1;
  let isDragging = false;
  let startX, startY, translateX = 0, translateY = 0;

  function updateTransform() {
    lbImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    lbZoomText.textContent = Math.round(scale * 100) + '%';
  }

  // Open on click
  document.querySelectorAll('.slide-image').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      lbImg.draggable = false;
      scale = 1;
      translateX = 0;
      translateY = 0;
      updateTransform();
      lightboxOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close
  function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxOverlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightboxOverlay.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

  // Zoom buttons
  lightboxOverlay.querySelector('#lbZoomIn').addEventListener('click', () => {
    scale = Math.min(scale + 0.25, 4);
    updateTransform();
  });
  lightboxOverlay.querySelector('#lbZoomOut').addEventListener('click', () => {
    scale = Math.max(scale - 0.25, 0.25);
    updateTransform();
  });

  // Mouse wheel zoom
  lightboxOverlay.addEventListener('wheel', (e) => {
    e.preventDefault();
    scale = Math.max(0.25, Math.min(4, scale + (e.deltaY > 0 ? -0.1 : 0.1)));
    updateTransform();
  }, { passive: false });

  // Drag to pan (only when zoomed)
  lbImg.addEventListener('mousedown', (e) => {
    if (scale <= 1) return;
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    lbImg.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    lbImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
  });

})();
