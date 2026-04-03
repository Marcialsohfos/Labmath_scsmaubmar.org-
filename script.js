// ===== LAB_MATH - CORE SCRIPT (VERSION AVEC COMPTEURS AUTO & DÉMOS) =====

// 1. CONFIGURATION
const DATA_FILE = 'data.json';
const LOCAL_STORAGE_KEY = 'labmath_data';
const equations = ['E = mc²', '∫ f(x) dx', '∑ n²', '∇ × F', '∂u/∂t', 'lim x→0', '∏ k=1', '√(x²+y²)', 'e^{iπ} + 1 = 0', 'Δx Δp ≥ ħ/2'];

// Configuration des démos (À MODIFIER AVEC VOS VRAIS LIENS)
const DEMOS = {
    carteInteractive: {
        url: 'https://votre-nom.netlify.app/carte_densite',
        github: 'https://github.com/votre-compte/carte-densite-labmath',
        titre: '📍 Carte interactive des densités de population',
        description: 'Visualisation dynamique des disparités de population sur un territoire.',
        categorie: 'Géospatial',
        technologies: ['Python', 'Folium', 'Leaflet']
    },
    simulateurSIR: {
        url: 'https://votre-nom.netlify.app/simulateur_sir',
        github: 'https://github.com/votre-compte/simulateur-sir-labmath',
        titre: '🦠 Simulateur épidémique SIR',
        description: 'Simulation interactive d\'une épidémie avec le modèle SIR (Sains, Infectés, Guéris).',
        categorie: 'Modélisation',
        technologies: ['JavaScript', 'Chart.js', 'HTML/CSS']
    }
};

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

// Animation des compteurs
function animateNumber(element, target) {
    if (!element) return;
    let current = 0;
    const duration = 1000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
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
        // Structure par défaut avec les sections nécessaires
        return { 
            activites: [], 
            realisations: [], 
            annonces: [], 
            offres: [], 
            messages: [],
            formations: [],
            partenaires: []
        };
    }
}

// ===== MISE À JOUR DES COMPTEURS AUTOMATIQUES =====

async function updateStatCounters() {
    const data = await loadAllAppData();
    
    // Compter les éléments
    const projetsCount = (data.realisations || []).length;
    const formationsCount = (data.formations || []).length;
    const partenairesCount = (data.partenaires || []).length;
    
    // Mettre à jour les compteurs dans le HTML
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3) {
        animateNumber(statNumbers[0], projetsCount);
        animateNumber(statNumbers[1], formationsCount);
        animateNumber(statNumbers[2], partenairesCount);
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

// ===== NOUVEAU : RENDU DES RÉALISATIONS (AVEC DÉMOS INTÉGRÉES) =====

async function renderRealisations() {
    const container = document.getElementById('realisations-container');
    if (!container) return;
    
    const data = await loadAllAppData();
    const realisationsExistantes = data.realisations || [];
    
    // Combiner les réalisations du JSON + les démos
    const toutesLesRealisations = [
        ...realisationsExistantes,
        {
            id: 'demo_carte',
            titre: DEMOS.carteInteractive.titre,
            description: DEMOS.carteInteractive.description,
            categorie: DEMOS.carteInteractive.categorie,
            technologies: DEMOS.carteInteractive.technologies,
            demo_url: DEMOS.carteInteractive.url,
            github_url: DEMOS.carteInteractive.github,
            date_creation: new Date().toISOString(),
            est_publie: true,
            est_demo: true
        },
        {
            id: 'demo_sir',
            titre: DEMOS.simulateurSIR.titre,
            description: DEMOS.simulateurSIR.description,
            categorie: DEMOS.simulateurSIR.categorie,
            technologies: DEMOS.simulateurSIR.technologies,
            demo_url: DEMOS.simulateurSIR.url,
            github_url: DEMOS.simulateurSIR.github,
            date_creation: new Date().toISOString(),
            est_publie: true,
            est_demo: true
        }
    ];
    
    const publiees = toutesLesRealisations.filter(r => r.est_publie === true);
    
    if (publiees.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; opacity:0.6;">Aucune réalisation publiée.</p>';
        return;
    }
    
    container.innerHTML = publiees.map(projet => `
        <div class="math-card glow-card realisation-card">
            <div class="realisation-header">
                <span class="realisation-categorie">${projet.categorie || 'Projet'}</span>
                <span class="realisation-date">${formatDate(projet.date_creation)}</span>
                ${projet.est_demo ? '<span class="demo-badge">🎯 Démo interactive</span>' : ''}
            </div>
            <h3>${projet.titre}</h3>
            <p>${truncateText(projet.description, 120)}</p>
            ${projet.technologies ? `
                <div class="realisation-techs">
                    ${projet.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            ` : ''}
            <div class="realisation-buttons">
                ${projet.demo_url ? `
                    <a href="${projet.demo_url}" target="_blank" class="btn btn-primary btn-small">
                        <i class="fas fa-external-link-alt"></i> Voir la démo
                    </a>
                ` : ''}
                ${projet.github_url ? `
                    <a href="${projet.github_url}" target="_blank" class="btn btn-outline btn-small">
                        <i class="fab fa-github"></i> Code source
                    </a>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// ===== RENDU : INTERFACE ADMIN =====

async function renderAdminActivites() {
    const container = document.getElementById('admin-activites-list');
    if (!container) return;

    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { activites: [] };
    const activites = data.activites || [];

    if (activites.length === 0) {
        container.innerHTML = '<tr><td colspan="4" style="text-align:center;">Aucune activité enregistrée. </td></tr>';
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

// Admin Réalisations
async function renderAdminRealisations() {
    const container = document.getElementById('admin-realisations-list');
    if (!container) return;

    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { realisations: [] };
    const realisations = data.realisations || [];

    if (realisations.length === 0) {
        container.innerHTML = '<tr><td colspan="4" style="text-align:center;">Aucune réalisation enregistrée.</td></tr>';
        return;
    }

    container.innerHTML = realisations.map(proj => `
        <tr>
            <td><strong>${proj.titre}</strong> </td>
            <td>${proj.categorie || 'Non catégorisé'} </td>
            <td>${formatDate(proj.date_creation)}</td>
            <td>
                <div style="display:flex; gap:10px;">
                    <button class="action-btn delete" onclick="deleteRealisation(${proj.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Admin Formations
async function renderAdminFormations() {
    const container = document.getElementById('admin-formations-list');
    if (!container) return;

    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { formations: [] };
    const formations = data.formations || [];

    if (formations.length === 0) {
        container.innerHTML = '<tr><td colspan="4" style="text-align:center;">Aucune formation enregistrée.</td></tr>';
        return;
    }

    container.innerHTML = formations.map(formation => `
        <tr>
            <td><strong>${formation.titre}</strong> </td>
            <td>${formation.duree || 'Non spécifiée'}</td>
            <td><span class="status-badge ${formation.statut === 'Terminé' ? 'status-published' : 'status-draft'}">
                ${formation.statut || 'Planifiée'}
            </span></td>
            <td>
                <div style="display:flex; gap:10px;">
                    <button class="action-btn delete" onclick="deleteFormation(${formation.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Admin Partenaires
async function renderAdminPartenaires() {
    const container = document.getElementById('admin-partenaires-list');
    if (!container) return;

    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { partenaires: [] };
    const partenaires = data.partenaires || [];

    if (partenaires.length === 0) {
        container.innerHTML = '<tr><td colspan="3" style="text-align:center;">Aucun partenaire enregistré.</td></tr>';
        return;
    }

    container.innerHTML = partenaires.map(part => `
        <tr>
            <td><strong>${part.nom}</strong> </td>
            <td>${part.type || 'Partenariat'}</td>
            <td>
                <div style="display:flex; gap:10px;">
                    <button class="action-btn delete" onclick="deletePartenaire(${part.id})">
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

// ===== NOUVELLES FONCTIONS ADMIN =====

window.saveNewRealisation = function(event) {
    if (event) event.preventDefault();
    const titre = document.getElementById('real-titre')?.value;
    const desc = document.getElementById('real-desc')?.value;
    const categorie = document.getElementById('real-categorie')?.value;
    const demoUrl = document.getElementById('real-demo-url')?.value;
    const githubUrl = document.getElementById('real-github-url')?.value;
    
    if(!titre || !desc) {
        showAlert('error', 'Le titre et la description sont obligatoires !');
        return;
    }

    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (!data.realisations) data.realisations = [];
    
    data.realisations.push({
        id: Date.now(),
        titre,
        description: desc,
        categorie: categorie || 'Non catégorisé',
        demo_url: demoUrl || '',
        github_url: githubUrl || '',
        date_creation: new Date().toISOString(),
        est_publie: true
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    closeModal('modal-realisation');
    showAlert('success', 'Réalisation ajoutée ! Téléchargez le JSON pour GitHub.');
    renderAdminRealisations();
    renderRealisations();
    updateStatCounters();
};

window.saveNewFormation = function(event) {
    if (event) event.preventDefault();
    const titre = document.getElementById('form-titre')?.value;
    const duree = document.getElementById('form-duree')?.value;
    const statut = document.getElementById('form-statut')?.value;
    
    if(!titre) {
        showAlert('error', 'Le titre est obligatoire !');
        return;
    }

    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (!data.formations) data.formations = [];
    
    data.formations.push({
        id: Date.now(),
        titre,
        duree: duree || 'Non spécifiée',
        statut: statut || 'Planifiée',
        date_creation: new Date().toISOString()
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    closeModal('modal-formation');
    showAlert('success', 'Formation ajoutée !');
    renderAdminFormations();
    updateStatCounters();
};

window.saveNewPartenaire = function(event) {
    if (event) event.preventDefault();
    const nom = document.getElementById('part-nom')?.value;
    const type = document.getElementById('part-type')?.value;
    
    if(!nom) {
        showAlert('error', 'Le nom est obligatoire !');
        return;
    }

    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (!data.partenaires) data.partenaires = [];
    
    data.partenaires.push({
        id: Date.now(),
        nom,
        type: type || 'Partenariat',
        date_creation: new Date().toISOString()
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    closeModal('modal-partenaire');
    showAlert('success', 'Partenaire ajouté !');
    renderAdminPartenaires();
    updateStatCounters();
};

window.deleteRealisation = function(id) {
    if(!confirm('Supprimer cette réalisation ?')) return;
    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    data.realisations = data.realisations.filter(r => r.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    renderAdminRealisations();
    renderRealisations();
    updateStatCounters();
    showAlert('success', 'Réalisation supprimée');
};

window.deleteFormation = function(id) {
    if(!confirm('Supprimer cette formation ?')) return;
    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    data.formations = data.formations.filter(f => f.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    renderAdminFormations();
    updateStatCounters();
    showAlert('success', 'Formation supprimée');
};

window.deletePartenaire = function(id) {
    if(!confirm('Supprimer ce partenaire ?')) return;
    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    data.partenaires = data.partenaires.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    renderAdminPartenaires();
    updateStatCounters();
    showAlert('success', 'Partenaire supprimé');
};

// ===== ACTIONS GLOBALES EXISTANTES =====

window.openModal = (id) => { 
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'flex';
};
window.closeModal = (id) => { 
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
};

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
    if (!data.activites) data.activites = [];
    
    data.activites.push({
        id: Date.now(),
        titre,
        description: desc,
        date_creation: new Date().toISOString(),
        est_publie: true
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    closeModal('modal-activite');
    showAlert('success', 'Activité ajoutée ! Téléchargez le JSON pour GitHub.');
    renderAdminActivites();
    renderActivites();
};

window.deleteActivity = function(id) {
    if(!confirm('Supprimer cette activité ?')) return;
    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    data.activites = data.activites.filter(a => a.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    renderAdminActivites();
    renderActivites();
};

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
    showAlert('success', 'Fichier data.json prêt à être téléversé sur GitHub !');
};

// ===== INITIALISATION =====

document.addEventListener('DOMContentLoaded', async () => {
    createMathBackground();
    
    // Charger les données une fois au début
    await loadAllAppData();

    // Mettre à jour les compteurs automatiques
    await updateStatCounters();
    
    // Rendu automatique selon la page
    if (document.getElementById('activites-container')) renderActivites();
    if (document.getElementById('realisations-container')) renderRealisations();
    
    // Admin
    if (document.getElementById('admin-activites-list')) renderAdminActivites();
    if (document.getElementById('admin-realisations-list')) renderAdminRealisations();
    if (document.getElementById('admin-formations-list')) renderAdminFormations();
    if (document.getElementById('admin-partenaires-list')) renderAdminPartenaires();
    if (document.getElementById('messages-list')) renderAdminMessages();

    // Année automatique
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});