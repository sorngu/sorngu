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

const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');

let lastScroll = 0;

function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
}

function openLightbox(src) {
    lightboxImage.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function renderFeaturedPhotos() {
    const featuredGrid = document.getElementById('featuredGrid');
    if (!featuredGrid) return;
    
    const featured = photos.slice(0, 6);
    
    featuredGrid.innerHTML = featured.map(photo => `
        <div class="photo-card" data-src="${photo.src}">
            <img src="${photo.src}" alt="Photo" loading="lazy">
        </div>
    `).join('');
    
    featuredGrid.querySelectorAll('.photo-card').forEach(card => {
        card.addEventListener('click', () => openLightbox(card.dataset.src));
    });
}

function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    function renderGallery(filter = 'all') {
        const filtered = filter === 'all' ? photos : photos.filter(p => p.category === filter);
        
        galleryGrid.innerHTML = filtered.map(photo => `
            <div class="photo-card" data-src="${photo.src}" data-category="${photo.category}">
                <img src="${photo.src}" alt="Photo" loading="lazy">
            </div>
        `).join('');
        
        galleryGrid.querySelectorAll('.photo-card').forEach(card => {
            card.addEventListener('click', () => openLightbox(card.dataset.src));
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

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', handleScroll);
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
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
    
    renderFeaturedPhotos();
    initGallery();
});
