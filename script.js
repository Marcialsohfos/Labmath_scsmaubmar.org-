// ===== LAB_MATH - CORE SCRIPT (VERSION FINALE TOUT-EN-UN) =====

// 1. CONFIGURATION
const DATA_FILE = 'data.json';
const LOCAL_STORAGE_KEY = 'labmath_data';
const equations = ['E = mc²', '∫ f(x) dx', '∑ n²', '∇ × F', '∂u/∂t', 'lim x→0', '∏ k=1', '√(x²+y²)', 'e^{iπ} + 1 = 0', 'Δx Δp ≥ ħ/2'];

// ===== FONCTIONS UTILITAIRES & FOND =====

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

// ===== CHARGEMENT DES DONNÉES (LOGIQUE HYBRIDE) =====

async function loadAllAppData() {
    try {
        const response = await fetch(DATA_FILE + '?t=' + Date.now());
        if (!response.ok) throw new Error("Erreur serveur");
        const data = await response.json();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return data;
    } catch (error) {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) return JSON.parse(localData);
        return { activites: [], realisations: [], annonces: [], offres: [], messages: [] };
    }
}

// ===== RENDU : INTERFACE PUBLIQUE =====

async function renderActivites() {
    const container = document.getElementById('activites-container');
    if (!container) return;
    const data = await loadAllAppData();
    const activites = data.activites || [];
    const publiees = activites.filter(a => String(a.est_publie) === "true");

    if (publiees.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; opacity:0.6;">Aucune activité publiée.</p>';
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

// ===== RENDU : INTERFACE ADMIN (LA PARTIE QUI MANQUAIT) =====

async function renderAdminActivites() {
    const container = document.getElementById('admin-activites-list');
    if (!container) return;

    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { activites: [] };
    const activites = data.activites || [];

    if (activites.length === 0) {
        container.innerHTML = '<tr><td colspan="4" style="text-align:center;">Aucune activité enregistrée.</td></tr>';
        return;
    }

    container.innerHTML = activites.map(act => `
        <tr>
            <td><strong>${act.titre}</strong></td>
            <td>${formatDate(act.date_creation)}</td>
            <td><span class="status-badge ${act.est_publie ? 'status-published' : 'status-draft'}">
                ${act.est_publie ? 'Publié' : 'Brouillon'}
            </span></td>
            <td>
                <div style="display:flex; gap:10px;">
                    <button class="action-btn delete" onclick="deleteActivity(${act.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== GESTION DES MESSAGES (ADMIN) =====

function renderAdminMessages() {
    const container = document.getElementById('messages-list');
    if (!container) return;

    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { messages: [] };
    const messages = data.messages || [];

    const nouveaux = messages.filter(m => !m.lu).length;
    const statMsg = document.getElementById('stat-messages');
    const statNew = document.getElementById('stat-messages-new');
    if (statMsg) statMsg.textContent = messages.length;
    if (statNew) statNew.textContent = `${nouveaux} nouveaux`;

    if (messages.length === 0) {
        container.innerHTML = '<p style="text-align: center; opacity: 0.5;">Aucun message reçu.</p>';
        return;
    }

    container.innerHTML = [...messages].reverse().map(msg => `
        <div class="math-card" style="border-left: 4px solid ${msg.lu ? 'rgba(255,255,255,0.1)' : 'var(--primary)'}; background: rgba(255,255,255,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h4 style="color: var(--primary); margin-bottom: 5px;">${msg.sujet}</h4>
                    <small style="color: rgba(255,255,255,0.5);">De: <strong>${msg.nom}</strong> (${msg.email})</small>
                </div>
                ${!msg.lu ? '<span class="status-badge status-published">Nouveau</span>' : ''}
            </div>
            <p style="margin: 15px 0; line-height: 1.6; white-space: pre-wrap;">${msg.contenu}</p>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-sm ${msg.lu ? 'btn-outline' : 'btn-primary'}" onclick="toggleRead(${msg.id})">
                    <i class="fas ${msg.lu ? 'fa-envelope-open' : 'fa-check'}"></i>
                </button>
                <button class="action-btn delete" onclick="deleteMessage(${msg.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== ACTIONS GLOBALES (WINDOW) =====

window.openModal = (id) => { document.getElementById(id).style.display = 'flex'; };
window.closeModal = (id) => { document.getElementById(id).style.display = 'none'; };

window.showAlert = (type, message) => {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
};

window.saveNewActivity = function(event) {
    event.preventDefault();
    const titre = document.getElementById('act-titre').value;
    const desc = document.getElementById('act-desc').value;
    
    if(!titre || !desc) return showAlert('error', 'Champs vides !');

    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    data.activites.push({
        id: Date.now(),
        titre,
        description: desc,
        date_creation: new Date().toISOString(),
        est_publie: true
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    closeModal('modal-activite');
    showAlert('success', 'Ajouté ! Téléchargez le JSON pour GitHub.');
    renderAdminActivites(); // Mise à jour immédiate
};

window.deleteActivity = function(id) {
    if(!confirm('Supprimer cette activité ?')) return;
    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    data.activites = data.activites.filter(a => a.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    renderAdminActivites();
};

window.toggleRead = function(id) {
    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const msg = data.messages.find(m => m.id === id);
    if (msg) { msg.lu = !msg.lu; localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data)); renderAdminMessages(); }
};

window.deleteMessage = function(id) {
    if(!confirm('Supprimer ce message ?')) return;
    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    data.messages = data.messages.filter(m => m.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    renderAdminMessages();
};

window.downloadData = function() {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(data);
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "data.json");
    a.click();
    showAlert('success', 'Fichier prêt !');
};

// ===== INITIALISATION =====

document.addEventListener('DOMContentLoaded', async () => {
    createMathBackground();
    
    // Charger les données une fois au début
    await loadAllAppData();

    // Rendu automatique selon la page
    if (document.getElementById('activites-container')) renderActivites();
    if (document.getElementById('admin-activites-list')) renderAdminActivites();
    if (document.getElementById('messages-list')) renderAdminMessages();

    // Année automatique
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});