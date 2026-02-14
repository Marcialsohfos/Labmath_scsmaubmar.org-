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
// Fonction pour afficher les messages dans l'admin
function renderAdminMessages() {
    const container = document.getElementById('messages-list');
    if (!container) return;

    const data = JSON.parse(localStorage.getItem('labmath_data')) || { messages: [] };
    const messages = data.messages || [];

    if (messages.length === 0) {
        container.innerHTML = '<p>Aucun message reçu.</p>';
        return;
    }

    // On trie du plus récent au plus ancien
    container.innerHTML = messages.reverse().map(msg => `
        <div class="math-card ${msg.lu ? '' : 'unread'}" style="border-left: 4px solid ${msg.lu ? '#444' : 'var(--primary)'}">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <small>${new Date(msg.date).toLocaleString('fr-FR')}</small>
                ${!msg.lu ? '<span class="badge">Nouveau</span>' : ''}
            </div>
            <h4>${msg.sujet}</h4>
            <p><strong>De:</strong> ${msg.nom} (${msg.email})</p>
            <p style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 5px; margin: 10px 0;">
                ${msg.contenu}
            </p>
            <div class="admin-actions">
                <button onclick="markAsRead(${msg.id})" class="btn-sm">
                    ${msg.lu ? 'Marquer non lu' : 'Marquer comme lu'}
                </button>
                <a href="mailto:${msg.email}?subject=Re: ${msg.sujet}" class="btn-sm btn-primary">
                    <i class="fas fa-reply"></i> Répondre par Email
                </a>
                <button onclick="deleteMessage(${msg.id})" class="btn-sm btn-danger">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// Marquer comme lu
window.markAsRead = function(id) {
    let data = JSON.parse(localStorage.getItem('labmath_data'));
    const index = data.messages.findIndex(m => m.id === id);
    if (index !== -1) {
        data.messages[index].lu = !data.messages[index].lu;
        localStorage.setItem('labmath_data', JSON.stringify(data));
        renderAdminMessages();
    }
};

// Supprimer un message
window.deleteMessage = function(id) {
    if(confirm('Supprimer ce message définitivement ?')) {
        let data = JSON.parse(localStorage.getItem('labmath_data'));
        data.messages = data.messages.filter(m => m.id !== id);
        localStorage.setItem('labmath_data', JSON.stringify(data));
        renderAdminMessages();
    }
};

// --- GESTION DES MESSAGES ---

function renderAdminMessages() {
    const container = document.getElementById('messages-list');
    const data = JSON.parse(localStorage.getItem('labmath_data')) || { messages: [] };
    const messages = data.messages || [];

    // Mise à jour des compteurs dans les stats
    const nouveaux = messages.filter(m => !m.lu).length;
    document.getElementById('stat-messages').textContent = messages.length;
    document.getElementById('stat-messages-new').textContent = `${nouveaux} nouveaux`;

    if (messages.length === 0) {
        container.innerHTML = '<p style="text-align: center; opacity: 0.5;">Aucun message reçu.</p>';
        return;
    }

    // Affichage des messages (du plus récent au plus ancien)
    container.innerHTML = [...messages].reverse().map(msg => `
        <div class="math-card" style="border-left: 4px solid ${msg.lu ? 'transparent' : 'var(--primary)'}; background: rgba(255,255,255,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h4 style="color: var(--primary); margin-bottom: 5px;">${msg.sujet}</h4>
                    <small style="color: rgba(255,255,255,0.5);">De: <strong>${msg.nom}</strong> (${msg.email}) - ${new Date(msg.date).toLocaleString('fr-FR')}</small>
                </div>
                ${!msg.lu ? '<span class="status-badge status-published">Nouveau</span>' : ''}
            </div>
            <p style="margin: 15px 0; line-height: 1.6; white-space: pre-wrap;">${msg.contenu}</p>
            <div style="display: flex; gap: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                <button class="btn btn-sm ${msg.lu ? 'btn-outline' : 'btn-primary'}" onclick="toggleRead(${msg.id})">
                    <i class="fas ${msg.lu ? 'fa-envelope-open' : 'fa-check'}"></i> ${msg.lu ? 'Marquer non lu' : 'Lu'}
                </button>
                <a href="mailto:${msg.email}?subject=Re: ${msg.sujet}" class="btn btn-sm btn-primary" style="text-decoration: none;">
                    <i class="fas fa-reply"></i> Répondre
                </a>
                <button class="action-btn delete" onclick="deleteMessage(${msg.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Changer l'état Lu/Non Lu
window.toggleRead = function(id) {
    let data = JSON.parse(localStorage.getItem('labmath_data'));
    const msg = data.messages.find(m => m.id === id);
    if (msg) {
        msg.lu = !msg.lu;
        localStorage.setItem('labmath_data', JSON.stringify(data));
        renderAdminMessages();
    }
};

// Supprimer un message
window.deleteMessage = function(id) {
    if(confirm('Supprimer définitivement ce message ?')) {
        let data = JSON.parse(localStorage.getItem('labmath_data'));
        data.messages = data.messages.filter(m => m.id !== id);
        localStorage.setItem('labmath_data', JSON.stringify(data));
        renderAdminMessages();
    }
};

// Modifier votre fonction loadAllData pour inclure l'appel
// Ajoutez renderAdminMessages() à l'intérieur de loadAllData()
