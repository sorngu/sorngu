const photos = [
  'picture/3.jpg', 'picture/4.jpg',
  'picture/5.jpg', 'picture/6.jpg',
  'picture/7.JPG', 'picture/8.JPG',
  'picture/9.JPG', 'picture/10.jpg',
  'picture/11.JPG', 'picture/12.jpg',
  'picture/13.jpg', 'picture/14.jpg',
  'picture/15.jpg', 'picture/33.jpg',
  'picture/34.jpg', 'picture/35.jpg',
  'picture/36.jpg', 'picture/37.jpg',
  'picture/38.jpg', 'picture/39.jpg',
  'picture/40.jpg', 'picture/41.jpg',
  'picture/42.jpg', 'picture/43.jpg',
];

/* Lightbox */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');

function openLB(src) {
  lbImg.src = src;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLB() {
  lb.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelector('.lb-close')?.addEventListener('click', closeLB);
lb?.addEventListener('click', e => { if (e.target === lb) closeLB(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lb?.classList.contains('active')) closeLB();
});

/* Observer for reveal animations */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '40px' });

/* Render grid */
function renderGrid(id, count, stagger = true) {
  const grid = document.getElementById(id);
  if (!grid) return;
  
  const items = count ? photos.slice(0, count) : photos;
  
  grid.innerHTML = items.map((p, i) => `
    <div class="photo-card" data-src="${p}" ${stagger ? `style="transition-delay:${i*60}ms"` : ''}>
      <img src="${p}" alt="" loading="lazy">
    </div>
  `).join('');
  
  grid.querySelectorAll('.photo-card').forEach(el => {
    el.addEventListener('click', () => openLB(el.dataset.src));
    observer.observe(el);
  });
}

/* Observe all .reveal elements */
function observeReveals() {
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  renderGrid('worksGrid', 9);
  renderGrid('galleryGrid');
  observeReveals();
});