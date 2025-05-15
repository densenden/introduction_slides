let currentSlide = 0;
let slides = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/content');
        const data = await response.json();
        slides = data.slides;
        
        initializeNavigation();
        updateSlide();
        setupKeyboardNavigation();
        
        // Enter fullscreen mode automatically
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen request failed: ', err);
        });
    } catch (error) {
        console.error('Error loading content:', error);
    }
});

function initializeNavigation() {
    const indicatorsContainer = document.querySelector('.slide-indicators');
    
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'slide-indicator';
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    document.getElementById('prev-slide').addEventListener('click', () => goToSlide(currentSlide - 1));
    document.getElementById('next-slide').addEventListener('click', () => goToSlide(currentSlide + 1));
}

function updateSlide() {
    const slide = slides[currentSlide];
    
    document.getElementById('slide-title').textContent = slide.title;
    
    const bulletsContainer = document.getElementById('slide-bullets');
    bulletsContainer.innerHTML = '';
    
    slide.bullets.forEach(bullet => {
        const li = document.createElement('li');
        li.textContent = bullet;
        bulletsContainer.appendChild(li);
    });

    updateIndicators();
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.slide-indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    if (index >= 0 && index < slides.length) {
        currentSlide = index;
        updateSlide();
    }
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                goToSlide(currentSlide - 1);
                break;
            case 'ArrowRight':
                goToSlide(currentSlide + 1);
                break;
            case 'f':
                toggleFullscreen();
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                break;
        }
    });
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen request failed: ', err);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
} 