/* ============================================
   IKEA-style Photography Portfolio - JS
   ============================================ */

const photos = [
  { src: 'picture/3.jpg', label: 'Mountain Light' },
  { src: 'picture/4.jpg', label: 'City Pulse' },
  { src: 'picture/5.jpg', label: 'Silhouette' },
  { src: 'picture/6.jpg', label: 'Golden Hour' },
  { src: 'picture/7.JPG', label: 'Urban Flow' },
  { src: 'picture/8.JPG', label: 'Quiet Moment' },
  { src: 'picture/9.JPG', label: 'Horizon' },
  { src: 'picture/10.jpg', label: 'Street Life' },
  { src: 'picture/11.JPG', label: 'Portrait Study' },
  { src: 'picture/12.jpg', label: 'Natural Light' },
  { src: 'picture/13.jpg', label: 'Architecture' },
  { src: 'picture/14.jpg', label: 'Shadows' },
  { src: 'picture/15.jpg', label: 'Wide View' },
  { src: 'picture/33.jpg', label: 'Texture' },
  { src: 'picture/34.jpg', label: 'Reflection' },
  { src: 'picture/35.jpg', label: 'Depth' },
  { src: 'picture/36.jpg', label: 'Motion' },
  { src: 'picture/37.jpg', label: 'Still Life' },
  { src: 'picture/38.jpg', label: 'Pattern' },
  { src: 'picture/39.jpg', label: 'Contrast' },
  { src: 'picture/40.jpg', label: 'Mood' },
  { src: 'picture/41.jpg', label: 'Vista' },
  { src: 'picture/42.jpg', label: 'Alley' },
  { src: 'picture/43.jpg', label: 'Twilight' },
];

/* ---- Menu ---- */
const menuBtn = document.getElementById('menuBtn');
const overlay = document.getElementById('menuOverlay');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  menuBtn.classList.toggle('active');
  overlay.classList.toggle('open');
  document.body.style.overflow = menuOpen ? 'hidden' : '';
  
  // stagger menu links
  if (menuOpen) {
    document.querySelectorAll('.menu-link').forEach((link, i) => {
      link.style.transitionDelay = `${i * 80}ms`;
    });
  } else {
    document.querySelectorAll('.menu-link').forEach(link => {
      link.style.transitionDelay = '0ms';
      link.style.opacity = '0';
      link.style.transform = 'translateY(40px)';
    });
  }
});

overlay.querySelectorAll('.menu-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    menuBtn.classList.remove('active');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- Lightbox ---- */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.querySelector('.lb-close');

function openLightbox(src) {
  lbImg.src = src;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lb.classList.remove('active');
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lb.classList.contains('active')) closeLightbox();
});

/* ---- Render Works Grid ---- */
function renderWorks() {
  const grid = document.getElementById('worksGrid');
  if (!grid) return;
  
  const items = photos.slice(0, 6);
  grid.innerHTML = items.map((p, i) => `
    <div class="photo-item reveal" data-src="${p.src}" style="transition-delay:${i*100}ms">
      <img src="${p.src}" alt="" loading="lazy">
      <div class="photo-label">${p.label}</div>
    </div>
  `).join('');
  
  grid.querySelectorAll('.photo-item').forEach(el => {
    el.addEventListener('click', () => openLightbox(el.dataset.src));
    observer.observe(el);
  });
}

/* ---- Render Gallery ---- */
function initGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  
  function render(filter) {
    const filtered = filter === 'all' ? photos : photos.filter(p => p.label);
    // We'll use a simpler filter by index for demo
    const cats = ['landscape','street','portrait'];
    let filtered2 = filter === 'all' ? photos : photos.filter((_, i) => {
      if (filter === 'landscape') return i % 3 === 0;
      if (filter === 'street') return i % 3 === 1;
      if (filter === 'portrait') return i % 3 === 2;
      return true;
    });
    
    grid.innerHTML = filtered2.map((p, i) => `
      <div class="photo-item reveal" data-src="${p.src}" style="transition-delay:${i*60}ms">
        <img src="${p.src}" alt="" loading="lazy">
      </div>
    `).join('');
    
    grid.querySelectorAll('.photo-item').forEach(el => {
      el.addEventListener('click', () => openLightbox(el.dataset.src));
      observer.observe(el);
    });
  }
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.filter);
    });
  });
  
  render('all');
}

/* ---- Scroll Reveal ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '30px' });

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  
  renderWorks();
  initGallery();
});