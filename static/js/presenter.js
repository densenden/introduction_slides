let currentSlide = 0;
let slides = [];
let popupWindow = null;

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
        
        document.getElementById('total-slides').textContent = slides.length;
        
        setupControls();
        updateSlide();
        
        // Listen for storage events to sync with main presentation
        window.addEventListener('storage', (e) => {
            if (e.key === 'byte5CurrentSlide') {
                currentSlide = parseInt(e.newValue);
                updateSlide();
            }
        });
        
        // Setup keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    goToSlide(currentSlide - 1);
                    break;
                case 'ArrowRight':
                    goToSlide(currentSlide + 1);
                    break;
            }
        });
    } catch (error) {
        console.error('Error loading content:', error);
    }
});

function setupControls() {
    document.getElementById('prev-slide').addEventListener('click', () => goToSlide(currentSlide - 1));
    document.getElementById('next-slide').addEventListener('click', () => goToSlide(currentSlide + 1));
}

function updateSlide() {
    const slide = slides[currentSlide];
    
    // Update slide number
    document.getElementById('current-slide-num').textContent = currentSlide + 1;
    
    // Update title and bullets
    document.getElementById('slide-title').textContent = slide.title;
    document.getElementById('transcript-text').textContent = slide.transcript;
    
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
}

function goToSlide(index) {
    if (index >= 0 && index < slides.length) {
        currentSlide = index;
        updateSlide();
        
        // Update localStorage to sync with main presentation
        localStorage.setItem('byte5CurrentSlide', currentSlide);
    }
} 