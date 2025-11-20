// Flask Web App JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Flask Web App loaded successfully!');
    
    // Initialize page animations
    initAnimations();
    
    // Initialize stats updater
    initStatsUpdater();
    
    // Initialize form validators
    initFormValidators();
    
    // Initialize tooltips
    initTooltips();
});

// Page Load Animations
function initAnimations() {
    // Add fade-in animation to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
    
    // Add pulse animation to stats
    const statItems = document.querySelectorAll('.stat-item h3');
    statItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        item.addEventListener('animationend', function() {
            this.classList.remove('pulse');
        });
    });
}

// Stats Updater
function initStatsUpdater() {
    const visitorCount = document.getElementById('visitor-count');
    const requestCount = document.getElementById('request-count');
    
    if (visitorCount && requestCount) {
        updateStats();
        // Update stats every 30 seconds
        setInterval(updateStats, 30000);
    }
}

function updateStats() {
    fetch('/api/stats')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const visitorCount = document.getElementById('visitor-count');
            const requestCount = document.getElementById('request-count');
            
            if (visitorCount) {
                animateNumber(visitorCount, data.visitors);
            }
            if (requestCount) {
                animateNumber(requestCount, data.total_requests);
            }
            
            // Update last visit time if available
            const lastVisit = document.querySelector('.last-visit');
            if (lastVisit && data.last_visit) {
                lastVisit.textContent = data.last_visit;
            }
            
            console.log('Stats updated:', data);
        })
        .catch(error => {
            console.log('Failed to update stats:', error);
            
            // Show friendly error message
            const visitorCount = document.getElementById('visitor-count');
            const requestCount = document.getElementById('request-count');
            
            if (visitorCount && visitorCount.textContent === '-') {
                visitorCount.textContent = 'N/A';
            }
            if (requestCount && requestCount.textContent === '-') {
                requestCount.textContent = 'N/A';
            }
        });
}

// Animate number changes
function animateNumber(element, newValue) {
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue === newValue) return;
    
    const increment = newValue > currentValue ? 1 : -1;
    const steps = Math.abs(newValue - currentValue);
    const stepDuration = Math.min(50, 500 / steps);
    
    let current = currentValue;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === newValue) {
            clearInterval(timer);
            // Add a brief highlight effect
            element.style.color = '#28a745';
            setTimeout(() => {
                element.style.color = '';
            }, 1000);
        }
    }, stepDuration);
}

// Form Validators
function initFormValidators() {
    const contactForm = document.querySelector('form[method="POST"]');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            } else {
                // Show loading state
                showLoadingState(this);
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'Bu alan zorunludur.';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            message = 'Geçerli bir e-posta adresi giriniz.';
        }
    }
    
    // Name validation
    if (field.name === 'name' && value) {
        if (value.length < 2) {
            isValid = false;
            message = 'Ad en az 2 karakter olmalıdır.';
        }
    }
    
    // Message validation
    if (field.name === 'message' && value) {
        if (value.length < 10) {
            isValid = false;
            message = 'Mesaj en az 10 karakter olmalıdır.';
        }
    }
    
    // Apply validation classes
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    
    // Show/hide validation message
    let feedback = field.parentElement.querySelector('.invalid-feedback');
    if (!feedback && !isValid) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        field.parentElement.appendChild(feedback);
    }
    
    if (feedback) {
        feedback.textContent = message;
        feedback.style.display = isValid ? 'none' : 'block';
    }
    
    return isValid;
}

function showLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span> Gönderiliyor...';
        submitBtn.disabled = true;
        
        // Restore button after 3 seconds (in case of slow response)
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
    }
}

// Initialize Bootstrap tooltips
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Utility Functions
function formatNumber(num) {
    return new Intl.NumberFormat('tr-TR').format(num);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Health Check Function
function checkHealth() {
    return fetch('/health')
        .then(response => response.json())
        .then(data => {
            console.log('Health check:', data);
            return data.status === 'healthy';
        })
        .catch(error => {
            console.error('Health check failed:', error);
            return false;
        });
}

// Auto-refresh page if server is unhealthy for too long
let unhealthyCount = 0;
setInterval(() => {
    checkHealth().then(isHealthy => {
        if (isHealthy) {
            unhealthyCount = 0;
        } else {
            unhealthyCount++;
            if (unhealthyCount >= 3) {
                console.log('Server appears to be unhealthy, refreshing page...');
                location.reload();
            }
        }
    });
}, 60000); // Check every minute

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + H for home
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        window.location.href = '/';
    }
    
    // Alt + A for about
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        window.location.href = '/about';
    }
    
    // Alt + C for contact
    if (e.altKey && e.key === 'c') {
        e.preventDefault();
        window.location.href = '/contact';
    }
});

// Console welcome message
console.log(`
🚀 Flask Web App
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐍 Python Flask Backend
🐳 Docker Containerized
⚙️  Jenkins CI/CD
☸️  Kubernetes Ready
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Keyboard Shortcuts:
Alt + H : Home
Alt + A : About
Alt + C : Contact
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Export functions for use in other scripts
window.FlaskApp = {
    updateStats,
    checkHealth,
    animateNumber,
    formatNumber,
    formatDate
};