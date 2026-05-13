/* ==========================================================================
   FLORIN M - Interactive Functionality
   - Mobile navigation toggle
   - Sticky header on scroll
   - Smooth scroll
   - Scroll-to-top
   - Scroll animations (Intersection Observer)
   - Vibe selector interaction
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('nav__menu--active');
        navToggle.setAttribute('aria-expanded', isOpen);
        // Animate hamburger to X
        navToggle.classList.toggle('nav__toggle--active');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('nav__menu--active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('nav__toggle--active');
        });
    });

    // --- Sticky Header ---
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScroll = currentScroll;
    });

    // --- Scroll to Top ---
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in--visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to sections and cards
    const animateElements = document.querySelectorAll(
        '.process__card, .portfolio__item, .services__card, ' +
        '.advantage__item, .about__grid, .foundations__item, ' +
        '.testimonials__card, .contact__grid'
    );

    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // --- Vibe Selector ---
    const vibes = document.querySelectorAll('.vibe');
    vibes.forEach(vibe => {
        vibe.addEventListener('click', () => {
            vibes.forEach(v => v.classList.remove('vibe--active'));
            vibe.classList.add('vibe--active');
        });
    });

    // --- Portfolio Coverflow Carousel ---
    const coverCards = document.querySelectorAll('.portfolio__card');
    const coverPrev = document.getElementById('coverPrev');
    const coverNext = document.getElementById('coverNext');
    const coverIndicators = document.querySelectorAll('.portfolio__indicator');
    let activeIndex = 0;
    const totalCards = coverCards.length;

    function updateCoverflow() {
        coverCards.forEach((card, i) => {
            card.classList.remove('portfolio__card--active', 'portfolio__card--prev', 'portfolio__card--next');
            if (i === activeIndex) {
                card.classList.add('portfolio__card--active');
            } else if (i === (activeIndex - 1 + totalCards) % totalCards) {
                card.classList.add('portfolio__card--prev');
            } else if (i === (activeIndex + 1) % totalCards) {
                card.classList.add('portfolio__card--next');
            }
        });
        coverIndicators.forEach((dot, i) => {
            dot.classList.toggle('portfolio__indicator--active', i === activeIndex);
        });
    }

    if (coverPrev) {
        coverPrev.addEventListener('click', () => {
            activeIndex = (activeIndex - 1 + totalCards) % totalCards;
            updateCoverflow();
        });
    }

    if (coverNext) {
        coverNext.addEventListener('click', () => {
            activeIndex = (activeIndex + 1) % totalCards;
            updateCoverflow();
        });
    }

    coverIndicators.forEach(dot => {
        dot.addEventListener('click', () => {
            activeIndex = parseInt(dot.dataset.index);
            updateCoverflow();
        });
    });

    // Auto-rotate every 4s
    let coverAutoPlay = setInterval(() => {
        activeIndex = (activeIndex + 1) % totalCards;
        updateCoverflow();
    }, 4000);

    const coverWrapper = document.querySelector('.portfolio__carousel-wrapper');
    if (coverWrapper) {
        coverWrapper.addEventListener('mouseenter', () => clearInterval(coverAutoPlay));
        coverWrapper.addEventListener('mouseleave', () => {
            coverAutoPlay = setInterval(() => {
                activeIndex = (activeIndex + 1) % totalCards;
                updateCoverflow();
            }, 4000);
        });
    }
    const galleryData = {
        kitchen: [
            'images/kitchen/kitchen-1.jpeg',
            'images/kitchen/kitchen-2.jpeg',
            'images/kitchen/kitchen-3.0.jpeg',
            'images/kitchen/kitchen-3.1.jpeg',
            'images/kitchen/kitchen-4.0.jpeg',
            'images/kitchen/kitchen-4.1.jpeg',
            'images/kitchen/kitchen-5.0.jpeg',
            'images/kitchen/kitchen-5.1.jpeg',
            'images/kitchen/kitchen-6.jpeg',
            'images/kitchen/kitchen-7.jpeg'
        ],
        'living-room': [
            'images/living-room/living-room-1.jpeg'
        ],
        bathroom: [
            'images/bathroom/bathroom-1.jpeg',
            'images/bathroom/bathroom-2.jpeg'
        ]
    };

    const categoryNames = {
        kitchen: 'Kitchen',
        'living-room': 'Living Room',
        bathroom: 'Bathroom'
    };

    const galleryModal = document.getElementById('galleryModal');
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryTitle = document.getElementById('galleryTitle');
    const galleryClose = document.getElementById('galleryClose');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    let currentGalleryImages = [];
    let currentLightboxIndex = 0;

    function openGallery(category) {
        currentGalleryImages = galleryData[category] || [];
        galleryTitle.textContent = categoryNames[category] || category;
        galleryGrid.innerHTML = currentGalleryImages.map((src, i) =>
            `<div class="gallery-modal__item" data-index="${i}"><img src="${src}" alt="${categoryNames[category]} project ${i + 1}"></div>`
        ).join('');
        galleryModal.classList.add('gallery-modal--active');
        galleryModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Add click to open lightbox
        galleryGrid.querySelectorAll('.gallery-modal__item').forEach(item => {
            item.addEventListener('click', () => {
                openLightbox(parseInt(item.dataset.index));
            });
        });
    }

    function closeGallery() {
        galleryModal.classList.remove('gallery-modal--active');
        galleryModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function openLightbox(index) {
        currentLightboxIndex = index;
        lightboxImg.src = currentGalleryImages[index];
        lightbox.classList.add('lightbox--active');
        lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        lightbox.classList.remove('lightbox--active');
        lightbox.setAttribute('aria-hidden', 'true');
    }

    function lightboxPrev() {
        currentLightboxIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : currentGalleryImages.length - 1;
        lightboxImg.src = currentGalleryImages[currentLightboxIndex];
    }

    function lightboxNext() {
        currentLightboxIndex = currentLightboxIndex < currentGalleryImages.length - 1 ? currentLightboxIndex + 1 : 0;
        lightboxImg.src = currentGalleryImages[currentLightboxIndex];
    }

    // Event listeners
    document.querySelectorAll('.portfolio__view-more').forEach(btn => {
        btn.addEventListener('click', () => openGallery(btn.dataset.category));
    });

    if (galleryClose) galleryClose.addEventListener('click', closeGallery);
    if (galleryModal) galleryModal.querySelector('.gallery-modal__overlay').addEventListener('click', closeGallery);

    if (lightbox) {
        lightbox.querySelector('.lightbox__overlay').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox__arrow--prev').addEventListener('click', lightboxPrev);
        lightbox.querySelector('.lightbox__arrow--next').addEventListener('click', lightboxNext);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox && lightbox.classList.contains('lightbox--active')) {
                closeLightbox();
            } else {
                closeGallery();
            }
        }
        if (lightbox && lightbox.classList.contains('lightbox--active')) {
            if (e.key === 'ArrowLeft') lightboxPrev();
            if (e.key === 'ArrowRight') lightboxNext();
        }
    });

    // --- Newsletter Form ---
    const form = document.querySelector('.contact__form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]');
            if (email.value) {
                email.value = '';
                // Simple feedback
                const btn = form.querySelector('.btn');
                const originalText = btn.textContent;
                btn.textContent = '✓';
                setTimeout(() => { btn.textContent = originalText; }, 2000);
            }
        });
    }

    // --- Keyboard accessibility for vibe selector ---
    vibes.forEach(vibe => {
        vibe.setAttribute('tabindex', '0');
        vibe.setAttribute('role', 'button');
        vibe.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                vibe.click();
            }
        });
    });
});
