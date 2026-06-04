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

function renderGrid(id, count) {
  const grid = document.getElementById(id);
  if (!grid) return;
  
  const items = count ? photos.slice(0, count) : photos;
  
  grid.innerHTML = items.map(p => `
    <div class="photo-item" data-src="${p}">
      <img src="${p}" alt="" loading="lazy">
    </div>
  `).join('');
  
  grid.querySelectorAll('.photo-item').forEach(el => {
    el.addEventListener('click', () => openLB(el.dataset.src));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderGrid('worksGrid', 12);
  renderGrid('galleryGrid');
});