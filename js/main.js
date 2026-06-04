const photos = [
  { src: 'picture/3.jpg' }, { src: 'picture/4.jpg' },
  { src: 'picture/5.jpg' }, { src: 'picture/6.jpg' },
  { src: 'picture/7.JPG' }, { src: 'picture/8.JPG' },
  { src: 'picture/9.JPG' }, { src: 'picture/10.jpg' },
  { src: 'picture/11.JPG' }, { src: 'picture/12.jpg' },
  { src: 'picture/13.jpg' }, { src: 'picture/14.jpg' },
  { src: 'picture/15.jpg' }, { src: 'picture/33.jpg' },
  { src: 'picture/34.jpg' }, { src: 'picture/35.jpg' },
  { src: 'picture/36.jpg' }, { src: 'picture/37.jpg' },
  { src: 'picture/38.jpg' }, { src: 'picture/39.jpg' },
  { src: 'picture/40.jpg' }, { src: 'picture/41.jpg' },
  { src: 'picture/42.jpg' }, { src: 'picture/43.jpg' },
];

/* Menu */
const menuBtn = document.getElementById('menuBtn');
const overlay = document.getElementById('menuOverlay');
let open = false;

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    open = !open;
    overlay.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
    
    document.querySelectorAll('.menu-link').forEach((link, i) => {
      if (open) {
        link.style.transitionDelay = `${i * 80}ms`;
        link.style.opacity = '1';
        link.style.transform = 'translateY(0)';
      } else {
        link.style.transitionDelay = '0ms';
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
      }
    });
  });

  overlay.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
      open = false;
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* Lightbox */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.querySelector('.lb-close');

function openLB(src) {
  lbImg.src = src;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLB() {
  lb.classList.remove('active');
  document.body.style.overflow = '';
}

if (lbClose) lbClose.addEventListener('click', closeLB);
if (lb) lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lb && lb.classList.contains('active')) closeLB();
});

/* Render Works */
function renderWorks() {
  const grid = document.getElementById('worksGrid');
  if (!grid) return;
  
  const items = photos.slice(0, 6);
  grid.innerHTML = items.map((p, i) => `
    <div class="photo-item" data-src="${p.src}" style="transition-delay:${i*80}ms">
      <img src="${p.src}" alt="" loading="lazy">
    </div>
  `).join('');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  grid.querySelectorAll('.photo-item').forEach(el => {
    el.addEventListener('click', () => openLB(el.dataset.src));
    observer.observe(el);
  });
}

/* Render Gallery */
function initGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  
  function render(filter) {
    let arr = photos;
    if (filter !== 'all') {
      arr = photos.filter((_, i) => {
        if (filter === 'landscape') return i % 3 === 0;
        if (filter === 'street') return i % 3 === 1;
        if (filter === 'portrait') return i % 3 === 2;
        return true;
      });
    }
    
    grid.innerHTML = arr.map((p, i) => `
      <div class="photo-item" data-src="${p.src}" style="transition-delay:${i*50}ms">
        <img src="${p.src}" alt="" loading="lazy">
      </div>
    `).join('');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    grid.querySelectorAll('.photo-item').forEach(el => {
      el.addEventListener('click', () => openLB(el.dataset.src));
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

document.addEventListener('DOMContentLoaded', () => {
  renderWorks();
  initGallery();
});