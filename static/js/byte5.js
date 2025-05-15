let currentSlide = 0;
let slides = [];
let presenterWindow = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get current slide from localStorage if available
        const storedSlide = localStorage.getItem('byte5CurrentSlide');
        if (storedSlide !== null) {
            currentSlide = parseInt(storedSlide);
        }
        
        // Fetch byte5 specific content
        const response = await fetch('/api/byte5-content');
        const data = await response.json();
        slides = data.slides;
        
        initializeNavigation();
        setupPresenterMode();
        updateSlide();
        setupKeyboardNavigation();
        
        // Listen for storage events to sync with presenter view
        window.addEventListener('storage', (e) => {
            if (e.key === 'byte5CurrentSlide') {
                currentSlide = parseInt(e.newValue);
                updateSlide();
                updateIndicators();
            }
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

function setupPresenterMode() {
    const presenterButton = document.getElementById('presenter-mode');
    
    presenterButton.addEventListener('click', () => {
        // Open presenter view in a new window
        if (presenterWindow === null || presenterWindow.closed) {
            presenterWindow = window.open('/presenter', 'PresenterView', 'width=1000,height=800');
            
            // Update button state
            presenterButton.innerHTML = '<i class="fas fa-external-link-alt"></i> Presenter Ansicht aktiv';
            presenterButton.classList.add('active');
            
            // Check if window was closed
            const checkWindow = setInterval(() => {
                if (presenterWindow && presenterWindow.closed) {
                    clearInterval(checkWindow);
                    presenterWindow = null;
                    presenterButton.innerHTML = '<i class="fas fa-external-link-alt"></i> Presenter Ansicht öffnen';
                    presenterButton.classList.remove('active');
                }
            }, 1000);
        } else {
            // Focus existing window
            presenterWindow.focus();
        }
    });
}

function updateSlide() {
    const slide = slides[currentSlide];
    
    // Update slide content
    const titleElement = document.getElementById('slide-title');
    titleElement.textContent = slide.title;
    
    const bulletsContainer = document.getElementById('slide-bullets');
    bulletsContainer.innerHTML = '';
    
    slide.bullets.forEach(bullet => {
        const li = document.createElement('li');
        
        // Check if the bullet contains a URL (for project links)
        if (bullet.includes('.sen.studio') || bullet.includes('.app')) {
            // Parse the emoji and domain from the bullet text
            const parts = bullet.split(' – ');
            const emoji = parts[0].split(' ')[0];
            const domain = parts[0].split(' ')[1];
            const description = parts[1];
            
            // Create the HTML with a link
            li.innerHTML = `${emoji} <a href="https://${domain}" target="_blank">${domain}</a> – ${description}`;
        } else {
            li.textContent = bullet;
        }
        
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
        
        // Update localStorage to sync with presenter view
        localStorage.setItem('byte5CurrentSlide', currentSlide);
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
            case 'p':
                // Open presenter view with 'p' key
                document.getElementById('presenter-mode').click();
                break;
        }
    });
} 