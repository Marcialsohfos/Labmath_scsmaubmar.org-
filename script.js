// ===== LAB_MATH - ANIMATIONS MATHÉMATIQUES =====

// Configuration
const API_BASE_URL = window.location.origin;
const API_ENDPOINTS = {
    activites: `${API_BASE_URL}/.netlify/functions/data-manager`,
    realisations: `${API_BASE_URL}/.netlify/functions/data-manager`,
    annonces: `${API_BASE_URL}/.netlify/functions/data-manager`,
    offres: `${API_BASE_URL}/.netlify/functions/data-manager`,
    messages: `${API_BASE_URL}/.netlify/functions/messages`
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
    // Éviter de créer plusieurs fois le même fond
    if (document.querySelector('.math-bg')) return;
    
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
        const response = await fetch(endpoint + '?t=' + Date.now()); // Éviter le cache
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data; // Retourne directement les données
    } catch (error) {
        console.error(`Erreur ${endpoint}:`, error);
        return null;
    }
}

// ===== FORMATAGE DES DATES =====
function formatDate(dateString) {
    if (!dateString) return 'Date non spécifiée';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

// ===== TRONCATURE DE TEXTE =====
function truncateText(text, maxLength = 150) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// ===== AFFICHAGE D'ALERTE =====
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    alertDiv.innerHTML = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 3000);
}

// Ajouter l'animation si elle n'existe pas
if (!document.querySelector('#alert-style')) {
    const style = document.createElement('style');
    style.id = 'alert-style';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ===== FONCTIONS DE SAUVEGARDE =====
async function saveDataToJson(data) {
    try {
        localStorage.setItem('labmath_data', JSON.stringify(data));
        console.log('💾 Données sauvegardées localement');
        return true;
    } catch (error) {
        console.error('❌ Erreur sauvegarde:', error);
        return false;
    }
}

function loadDataFromStorage() {
    const saved = localStorage.getItem('labmath_data');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Erreur parsing données:', e);
        }
    }
    return null;
}

// ===== CHARGEMENT DES ACTIVITÉS =====
async function loadActivites() {
    const container = document.getElementById('activites-container');
    if (!container) return;
    
    container.innerHTML = '<div class="math-loader"></div><p style="color: var(--primary);">Chargement des activités...</p>';
    
    const data = await fetchData(API_ENDPOINTS.activites);
    const activites = data?.activites || [];
    
    if (activites.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem; color: var(--primary);">∑</div>
                <h3 style="margin-bottom: 1rem;">Aucune activité pour le moment</h3>
                <p style="color: #666;">Les activités scientifiques seront publiées prochainement.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    activites.slice(0, 6).forEach(activite => {
        const card = document.createElement('div');
        card.className = 'math-card';
        card.innerHTML = `
            <div class="math-card-header">
                <div class="math-icon">∫</div>
                <h3 style="margin: 0;">${activite.titre || 'Sans titre'}</h3>
            </div>
            <div class="math-card-body">
                <p class="math-date">
                    <i class="far fa-calendar-alt"></i> 
                    ${formatDate(activite.date_creation)}
                </p>
                <p class="math-description">${truncateText(activite.description || 'Aucune description', 100)}</p>
            </div>
            <div class="math-card-footer" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(0,255,255,0.1);">
                <span><i class="fas fa-user"></i> ${activite.auteur || 'Lab_Math'}</span>
                <span><i class="fas fa-tag"></i> ${activite.categorie || 'Général'}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// ===== CHARGEMENT DES RÉALISATIONS =====
async function loadRealisations() {
    const container = document.getElementById('realisations-container');
    if (!container) return;
    
    container.innerHTML = '<div class="math-loader"></div><p style="color: var(--primary);">Chargement des réalisations...</p>';
    
    const data = await fetchData(API_ENDPOINTS.realisations);
    const realisations = data?.realisations || [];
    
    if (realisations.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
                <h3 style="margin-bottom: 1rem;">Aucune réalisation pour le moment</h3>
                <p style="color: #666;">Les réalisations seront publiées prochainement.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    realisations.slice(0, 6).forEach(realisation => {
        const card = document.createElement('div');
        card.className = 'math-card';
        card.innerHTML = `
            <div class="math-card-header">
                <div class="math-icon">🏆</div>
                <h3 style="margin: 0;">${realisation.titre || 'Sans titre'}</h3>
            </div>
            <div class="math-card-body">
                <p class="math-date">
                    <i class="far fa-calendar-alt"></i> 
                    ${formatDate(realisation.date_creation)}
                </p>
                <p class="math-description">${truncateText(realisation.description || 'Aucune description', 100)}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// ===== CHARGEMENT DES ANNONCES =====
async function loadAnnonces() {
    const container = document.getElementById('annonces-container');
    if (!container) return;
    
    container.innerHTML = '<div class="math-loader"></div><p style="color: var(--primary);">Chargement des annonces...</p>';
    
    const data = await fetchData(API_ENDPOINTS.annonces);
    const annonces = data?.annonces || [];
    
    if (annonces.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📢</div>
                <h3 style="margin-bottom: 1rem;">Aucune annonce pour le moment</h3>
                <p style="color: #666;">Les annonces seront publiées prochainement.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    annonces.slice(0, 6).forEach(annonce => {
        const card = document.createElement('div');
        card.className = 'math-card';
        card.innerHTML = `
            <div class="math-card-header">
                <div class="math-icon">📢</div>
                <h3 style="margin: 0;">${annonce.titre || 'Sans titre'}</h3>
            </div>
            <div class="math-card-body">
                <p class="math-date">
                    <i class="far fa-calendar-alt"></i> 
                    ${formatDate(annonce.date_creation)}
                </p>
                <p class="math-description">${truncateText(annonce.description || 'Aucune description', 100)}</p>
                ${annonce.est_active ? '<span style="color: #4CAF50; font-size: 0.9rem;">✓ Active</span>' : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

// ===== CHARGEMENT DES OFFRES =====
async function loadOffres() {
    const container = document.getElementById('offres-container');
    if (!container) return;
    
    container.innerHTML = '<div class="math-loader"></div><p style="color: var(--primary);">Chargement des offres...</p>';
    
    const data = await fetchData(API_ENDPOINTS.offres);
    const offres = data?.offres || [];
    
    if (offres.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">💼</div>
                <h3 style="margin-bottom: 1rem;">Aucune offre pour le moment</h3>
                <p style="color: #666;">Les offres seront publiées prochainement.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    offres.slice(0, 6).forEach(offre => {
        const card = document.createElement('div');
        card.className = 'math-card';
        card.innerHTML = `
            <div class="math-card-header">
                <div class="math-icon">💼</div>
                <h3 style="margin: 0;">${offre.titre || 'Sans titre'}</h3>
            </div>
            <div class="math-card-body">
                <p class="math-date">
                    <i class="far fa-calendar-alt"></i> 
                    ${formatDate(offre.date_creation)}
                </p>
                <p class="math-description">${truncateText(offre.description || 'Aucune description', 100)}</p>
                ${offre.lieu ? `<p style="margin-top: 0.5rem;"><i class="fas fa-map-marker-alt"></i> ${offre.lieu}</p>` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

// ===== ADMIN PANEL =====
async function loadAdminData() {
    try {
        const data = await fetchData(API_ENDPOINTS.activites);
        
        const stats = {
            activites: data?.activites?.length || 0,
            realisations: data?.realisations?.length || 0,
            annonces: data?.annonces?.length || 0,
            offres: data?.offres?.length || 0
        };
        
        // Mise à jour des statistiques
        Object.keys(stats).forEach(key => {
            const el = document.getElementById(`stat-${key}`);
            if (el) {
                el.textContent = stats[key];
                animateNumber(el, 0, stats[key], 1500);
            }
        });
    } catch (error) {
        console.error('Erreur chargement admin:', error);
    }
}

// ===== SYNC MANUELLE =====
async function syncWithAdmin() {
    const adminUrl = localStorage.getItem('adminUrl') || prompt('URL de l\'admin:');
    if (!adminUrl) return;
    
    localStorage.setItem('adminUrl', adminUrl);
    
    try {
        showAlert('info', 'Synchronisation en cours...');
        const response = await fetch(`${adminUrl}/api/export`);
        const data = await response.json();
        
        // Sauvegarde locale
        localStorage.setItem('labmath_data', JSON.stringify(data));
        
        showAlert('success', '✅ Synchronisation réussie !');
        setTimeout(() => location.reload(), 1500);
    } catch (error) {
        showAlert('error', '❌ Erreur de synchronisation');
    }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Fond mathématique
    createMathBackground();
    
    // Année courante
    const yearElements = document.querySelectorAll('#currentYear, .current-year, .footer-year');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });
    
    // Animation du titre (seulement sur les pages avec hero-title)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !heroTitle.hasAttribute('data-animated')) {
        const text = heroTitle.textContent;
        heroTitle.setAttribute('data-animated', 'true');
        typeEquation(heroTitle, text, 50);
    }
    
    // Chargement des données selon la page
    const path = window.location.pathname;
    
    if (path.includes('admin')) {
        loadAdminData();
    } else {
        // Détection automatique des conteneurs
        if (document.getElementById('activites-container')) {
            loadActivites();
        }
        if (document.getElementById('realisations-container')) {
            loadRealisations();
        }
        if (document.getElementById('annonces-container')) {
            loadAnnonces();
        }
        if (document.getElementById('offres-container')) {
            loadOffres();
        }
    }
    
    // Rafraîchissement périodique (optionnel)
    if (!path.includes('admin')) {
        // Recharger les données toutes les 60 secondes
        setInterval(() => {
            if (document.getElementById('activites-container')) loadActivites();
            if (document.getElementById('realisations-container')) loadRealisations();
            if (document.getElementById('annonces-container')) loadAnnonces();
            if (document.getElementById('offres-container')) loadOffres();
        }, 60000);
    }
});

// ===== EXPORT DES FONCTIONS GLOBALES =====
window.formatDate = formatDate;
window.truncateText = truncateText;
window.fetchData = fetchData;
window.showAlert = showAlert;
window.saveDataToJson = saveDataToJson;
window.loadDataFromStorage = loadDataFromStorage;
window.syncWithAdmin = syncWithAdmin;
window.loadActivites = loadActivites;
window.loadRealisations = loadRealisations;
window.loadAnnonces = loadAnnonces;
window.loadOffres = loadOffres;
window.loadAdminData = loadAdminData;