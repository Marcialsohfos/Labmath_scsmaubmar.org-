// ===== LAB_MATH - CORE SCRIPT (VERSION COMPLÈTE CORRIGÉE) =====

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

// ===== CHARGEMENT DES DONNÉES (LOGIQUE CORRIGÉE) =====

async function loadAllAppData() {
    try {
        // On force le rafraîchissement depuis le serveur avec ?t=
        const response = await fetch(DATA_FILE + '?t=' + Date.now());
        if (!response.ok) throw new Error("Erreur serveur");
        
        const data = await response.json();
        
        // On synchronise le cache local avec les nouvelles données du serveur
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        console.log("Système: Données fraîches récupérées du serveur.");
        return data;
    } catch (error) {
        console.warn("Système: Serveur injoignable ou fichier absent, lecture du cache local...");
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            return JSON.parse(localData);
        }
        return { activites: [], realisations: [], annonces: [], offres: [], messages: [] };
    }
}


// ===== AFFICHAGE DES ACTIVITÉS (SITE PUBLIC) =====

async function renderActivites() {
    const container = document.getElementById('activites-container');
    if (!container) return;

    const data = await loadAllAppData();
    const activites = data.activites || [];

    // Filtrage strict des éléments publiés
    const publiees = activites.filter(a => a.est_publie === true || a.est_publie === "true");

    if (publiees.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; opacity:0.6;">Aucune activité publiée pour le moment.</p>';
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

// ===== GESTION DES MESSAGES (ADMIN) =====

function renderAdminMessages() {
    const container = document.getElementById('messages-list');
    if (!container) return;

    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { messages: [] };
    const messages = data.messages || [];

    // Mise à jour des compteurs statistiques
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

// Actions Messages
window.toggleRead = function(id) {
    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const msg = data.messages.find(m => m.id === id);
    if (msg) {
        msg.lu = !msg.lu;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        renderAdminMessages();
    }
};

window.deleteMessage = function(id) {
    if(confirm('Supprimer définitivement ce message ?')) {
        let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        data.messages = data.messages.filter(m => m.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        renderAdminMessages();
    }
};

// Ouvrir le formulaire de création
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
};

// Fermer le formulaire
window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
};
// ===== VISITES ET INITIALISATION =====

function incrementVisits() {
    let visits = localStorage.getItem('labmath_visits') || 0;
    visits = parseInt(visits) + 1;
    localStorage.setItem('labmath_visits', visits);
}

document.addEventListener('DOMContentLoaded', async () => {
    createMathBackground();
    
    // Année automatique footer
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Détection Page Public vs Admin
    if (document.getElementById('activites-container')) {
        incrementVisits(); // On ne compte les visites que sur l'index public
        renderActivites();
    }
    
    if (document.getElementById('messages-list')) {
        renderAdminMessages();
    }
});

// Alertes système
window.showAlert = function(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
};

// Téléchargement (Sync)
window.downloadData = function() {
    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showAlert('success', 'Fichier data.json généré. Remplacez-le sur GitHub.');
};
window.saveNewActivity = function(event) {
    event.preventDefault(); // Empêche la page de se recharger
    
    const titre = document.getElementById('act-titre').value;
    const desc = document.getElementById('act-desc').value;
    
    if(!titre || !desc) return showAlert('error', 'Veuillez remplir tous les champs');

    // Charger les données actuelles
    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    
    const nouvelleAct = {
        id: Date.now(),
        titre: titre,
        description: desc,
        date_creation: new Date().toISOString(),
        est_publie: true
    };

    data.activites.push(nouvelleAct);
    
    // Sauvegarder et rafraîchir
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    closeModal('modal-activite');
    showAlert('success', 'Activité ajoutée ! N’oubliez pas de télécharger et remplacer le data.json');
    
    // Si vous avez une fonction de rendu admin, lancez-la ici
    if (typeof renderAdminActivites === 'function') renderAdminActivites();
};