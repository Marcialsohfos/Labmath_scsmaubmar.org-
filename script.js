// ===== LAB_MATH - ANIMATIONS MATHÉMATIQUES =====

// Configuration
const API_BASE_URL = ''; // URLs relatives
const API_ENDPOINTS = {
    activites: '/api/activites',
    realisations: '/api/realisations',
    annonces: '/api/annonces',
    offres: '/api/offres'
};

// ===== GÉNÉRATEUR D'ÉQUATIONS DYNAMIQUES =====
const equations = [
    'E = mc²',
    '∫ f(x) dx',
    '∑ n²',
    '∇ × F',
    '∂u/∂t',
    'lim x→0',
    '∏ k=1',
    '√(x²+y²)',
    'sin²θ + cos²θ = 1',
    'e^{iπ} + 1 = 0',
    'F = G(m₁m₂)/r²',
    '∇·B = 0',
    'ψ(x,t)',
    'λ = h/p',
    'Δx Δp ≥ ħ/2'
];

function createMathBackground() {
    const bg = document.createElement('div');
    bg.className = 'math-bg';
    
    for (let i = 0; i < 20; i++) {
        const eq = document.createElement('div');
        eq.className = `equation equation-${Math.floor(Math.random() * 5) + 1}`;
        eq.textContent = equations[Math.floor(Math.random() * equations.length)];
        eq.style.top = `${Math.random() * 100}%`;
        eq.style.left = `${Math.random() * 100}%`;
        eq.style.animationDelay = `${Math.random() * 10}s`;
        eq.style.fontSize = `${Math.random() * 2 + 1}rem`;
        bg.appendChild(eq);
    }
    
    document.body.insertBefore(bg, document.body.firstChild);
}

// ===== ANIMATION DE TEXTE MATHÉMATIQUE =====
function typeEquation(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== COMPTEUR MATHÉMATIQUE =====
function animateNumber(element, start, end, duration = 2000) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ===== CHARGEMENT DES DONNÉES =====
async function fetchData(endpoint) {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error(`Erreur ${endpoint}:`, error);
        return [];
    }
}

// ===== FORMATAGE DES DATES =====
function formatDate(dateString) {
    if (!dateString) return 'Date non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// ===== TRONCATURE DE TEXTE =====
function truncateText(text, maxLength = 150) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Fond mathématique
    createMathBackground();
    
    // Année courante
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Animation du titre
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        typeEquation(heroTitle, text, 50);
    }
    
    // Chargement des données selon la page
    const path = window.location.pathname;
    
    if (path.includes('admin')) {
        loadAdminData();
    } else {
        if (document.getElementById('activites-container')) loadActivites();
        if (document.getElementById('realisations-container')) loadRealisations();
        if (document.getElementById('annonces-container')) loadAnnonces();
        if (document.getElementById('offres-container')) loadOffres();
    }
});

// ===== CHARGEMENT DES ACTIVITÉS =====
async function loadActivites() {
    const container = document.getElementById('activites-container');
    if (!container) return;
    
    container.innerHTML = '<div class="math-loader"></div><p>Chargement des activités...</p>';
    
    const activites = await fetchData(API_ENDPOINTS.activites);
    
    if (activites.length === 0) {
        container.innerHTML = `
            <div class="math-card" style="grid-column: 1/-1; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">∑</div>
                <h3>Aucune activité pour le moment</h3>
                <p>Les activités scientifiques seront publiées prochainement.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    activites.slice(0, 6).forEach(activite => {
        const card = document.createElement('div');
        card.className = 'math-card';
        card.innerHTML = `
            <div style="font-size: 2rem; color: var(--primary); margin-bottom: 1rem;">∫</div>
            <h3 style="margin-bottom: 1rem;">${activite.titre}</h3>
            <p style="color: rgba(224,224,255,0.7); margin-bottom: 1rem;">
                ${truncateText(activite.description)}
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(0,255,255,0.1);">
                <span><i class="fas fa-user"></i> ${activite.auteur || 'Lab_Math'}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(activite.date_creation)}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// ===== ADMIN PANEL =====
async function loadAdminData() {
    const stats = {
        activites: (await fetchData(API_ENDPOINTS.activites)).length,
        realisations: (await fetchData(API_ENDPOINTS.realisations)).length,
        annonces: (await fetchData(API_ENDPOINTS.annonces)).length,
        offres: (await fetchData(API_ENDPOINTS.offres)).length
    };
    
    // Mise à jour des statistiques
    Object.keys(stats).forEach(key => {
        const el = document.getElementById(`stat-${key}`);
        if (el) animateNumber(el, 0, stats[key], 1500);
    });
}

// ===== SYNC MANUELLE =====
async function syncWithAdmin() {
    const adminUrl = localStorage.getItem('adminUrl') || prompt('URL de l\'admin:');
    if (!adminUrl) return;
    
    localStorage.setItem('adminUrl', adminUrl);
    
    try {
        const response = await fetch(`${adminUrl}/api/export`);
        const data = await response.json();
        
        // Sauvegarde locale
        localStorage.setItem('labmath_data', JSON.stringify(data));
        
        alert('✅ Synchronisation réussie !');
        location.reload();
    } catch (error) {
        alert('❌ Erreur de synchronisation');
    }
}

// Export global
window.syncWithAdmin = syncWithAdmin;