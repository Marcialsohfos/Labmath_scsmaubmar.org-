// ===== LAB_MATH - CORE SCRIPT (CORRIGÉ) =====

// 1. CONFIGURATION DES DONNÉES
const DATA_FILE = 'data.json';
const LOCAL_STORAGE_KEY = 'labmath_data';

// Équations pour le fond
const equations = ['E = mc²', '∫ f(x) dx', '∑ n²', '∇ × F', '∂u/∂t', 'lim x→0', '∏ k=1', '√(x²+y²)', 'e^{iπ} + 1 = 0', 'Δx Δp ≥ ħ/2'];

// ===== FONCTIONS UTILITAIRES =====

function createMathBackground() {
    const bg = document.createElement('div');
    bg.className = 'math-bg';
    for (let i = 0; i < 15; i++) {
        const eq = document.createElement('div');
        eq.className = `equation equation-${Math.floor(Math.random() * 5) + 1}`;
        eq.textContent = equations[Math.floor(Math.random() * equations.length)];
        eq.style.top = `${Math.random() * 100}%`;
        eq.style.left = `${Math.random() * 100}%`;
        eq.style.animationDelay = `${Math.random() * 10}s`;
        bg.appendChild(eq);
    }
    document.body.insertBefore(bg, document.body.firstChild);
}

function formatDate(dateString) {
    if (!dateString) return 'Récemment';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function truncateText(text, maxLength = 100) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// ===== CHARGEMENT HYBRIDE DES DONNÉES (CRUCIAL) =====
async function loadAllAppData() {
    // 1. Tenter de charger depuis le LocalStorage (modifs Admin)
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
        console.log("Données chargées depuis le cache local");
        return JSON.parse(localData);
    }

    // 2. Sinon, charger le fichier JSON
    try {
        const response = await fetch(DATA_FILE);
        if (!response.ok) throw new Error("Fichier JSON introuvable");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur de chargement des données:", error);
        return { activites: [], realisations: [], annonces: [], offres: [] };
    }
}

// ===== AFFICHAGE DES ACTIVITÉS SUR LE SITE PUBLIC =====
async function renderActivites() {
    const container = document.getElementById('activites-container');
    if (!container) return;

    const data = await loadAllAppData();
    const activites = data.activites || [];

    // Filtrer pour ne montrer que les publiées
    const publiees = activites.filter(a => a.est_publie === true || a.est_publie === "true");

    if (publiees.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Aucune activité publiée pour le moment.</p>';
        return;
    }

    container.innerHTML = publiees.map(act => `
        <div class="math-card">
            <div style="font-size: 1.5rem; color: var(--primary);">∫</div>
            <h3>${act.titre}</h3>
            <p>${truncateText(act.description)}</p>
            <div style="margin-top:1rem; font-size:0.8rem; opacity:0.7;">
                <i class="fas fa-calendar"></i> ${formatDate(act.date_creation)}
            </div>
        </div>
    `).join('');
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', async () => {
    createMathBackground();
    
    // Année automatique
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Détecter la page et charger le contenu
    if (document.getElementById('activites-container')) renderActivites();
    
    // Ajoutez ici les fonctions pour realisations, annonces, etc.
    // if (document.getElementById('realisations-container')) renderRealisations();
});

// ===== FONCTIONS POUR L'ADMIN (ACCESSIBLES PARTOUT) =====

window.showAlert = function(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
};

window.saveDataToStorage = function(data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    console.log("Système: Données synchronisées localement.");
};