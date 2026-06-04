const photos = [
    { src: 'picture/3.jpg', category: 'landscape' },
    { src: 'picture/4.jpg', category: 'street' },
    { src: 'picture/5.jpg', category: 'portrait' },
    { src: 'picture/6.jpg', category: 'landscape' },
    { src: 'picture/7.JPG', category: 'street' },
    { src: 'picture/8.JPG', category: 'portrait' },
    { src: 'picture/9.JPG', category: 'landscape' },
    { src: 'picture/10.jpg', category: 'street' },
    { src: 'picture/11.JPG', category: 'portrait' },
    { src: 'picture/12.jpg', category: 'landscape' },
    { src: 'picture/13.jpg', category: 'street' },
    { src: 'picture/14.jpg', category: 'portrait' },
    { src: 'picture/15.jpg', category: 'landscape' },
    { src: 'picture/33.jpg', category: 'street' },
    { src: 'picture/34.jpg', category: 'portrait' },
    { src: 'picture/35.jpg', category: 'landscape' },
    { src: 'picture/36.jpg', category: 'street' },
    { src: 'picture/37.jpg', category: 'portrait' },
    { src: 'picture/38.jpg', category: 'landscape' },
    { src: 'picture/39.jpg', category: 'street' },
    { src: 'picture/40.jpg', category: 'portrait' },
    { src: 'picture/41.jpg', category: 'landscape' },
    { src: 'picture/42.jpg', category: 'street' },
    { src: 'picture/43.jpg', category: 'portrait' },
];

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');

function openLightbox(src) {
    lightboxImage.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function renderWorksGrid() {
    const worksGrid = document.getElementById('worksGrid');
    if (!worksGrid) return;
    
    const featured = photos.slice(0, 6);
    
    worksGrid.innerHTML = featured.map((photo, index) => `
        <div class="photo-item" data-src="${photo.src}" style="transition-delay: ${index * 100}ms">
            <img src="${photo.src}" alt="Photo" loading="lazy">
        </div>
    `).join('');
    
    observeElements(worksGrid.querySelectorAll('.photo-item'));
    
    worksGrid.querySelectorAll('.photo-item').forEach(item => {
        item.addEventListener('click', () => openLightbox(item.dataset.src));
    });
}

function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    function renderGallery(filter = 'all') {
        const filtered = filter === 'all' ? photos : photos.filter(p => p.category === filter);
        
        galleryGrid.innerHTML = filtered.map((photo, index) => `
            <div class="photo-item" data-src="${photo.src}" data-category="${photo.category}" style="transition-delay: ${index * 50}ms">
                <img src="${photo.src}" alt="Photo" loading="lazy">
            </div>
        `).join('');
        
        observeElements(galleryGrid.querySelectorAll('.photo-item'));
        
        galleryGrid.querySelectorAll('.photo-item').forEach(item => {
            item.addEventListener('click', () => openLightbox(item.dataset.src));
        });
    }
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGallery(btn.dataset.filter);
        });
    });
    
    renderGallery();
}

function observeElements(elements) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    elements.forEach(el => observer.observe(el));
}

function observeSectionHeaders() {
    const headers = document.querySelectorAll('.section-header, .intro-grid > *');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    headers.forEach((header, index) => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(30px)';
        header.style.transition = `opacity 0.8s ease ${index * 150}ms, transform 0.8s ease ${index * 150}ms`;
        observer.observe(header);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    renderWorksGrid();
    initGallery();
    observeSectionHeaders();
});
