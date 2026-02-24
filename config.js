// ============================================
// 1. CONFIGURATION GÉNÉRALE
// ============================================
const CONFIG = {
    VERSION: '2.5.0',
    DEBUG: window.location.hostname === 'localhost',
    API_URL: window.location.origin,
    // Note: L'API_KEY ici est interne à votre logique d'affichage
    API_KEY: 'labmath_api_secret_2026', 
    DISPLAY: {
        ITEMS_PER_PAGE: 9,
        ANIMATIONS_ENABLED: true
    },
    MESSAGES: {
        SAVE_SUCCESS: '✅ Données sauvegardées localement',
        SAVE_ERROR: '❌ Erreur lors de la sauvegarde',
        DELETE_CONFIRM: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
        DEPLOY_SUCCESS: '🚀 Plateforme Lab_Math mise à jour avec succès !'
    }
};

// ============================================
// 2. CONFIGURATION GITHUB (LIÉE À VOTRE DÉPÔT)
// ============================================
const GITHUB_CONFIG = {
    owner: 'Marcialsohfos', 
    repo: 'Labmath_scsmaubmar.org-', 
    branch: 'main',
    filePath: 'data.json' // Le fichier qui contient vos activités/annonces
};

// ============================================
// 3. THÈME VISUEL (LAB_MATH 2026)
// ============================================
const MATH_COLORS = {
    primary: '#007bff', // Bleu mariage
    secondary: '#ffffff', // Blanc
    accent: '#00d4ff', 
    dark: '#0a0f1f'
};

// ============================================
// 4. MOTEUR DE MISE À JOUR DYNAMIQUE (AUTO-SYNC)
// ============================================
async function pushToGitHub() {
    // 1. Récupération du bouton pour l'état visuel
    const statusBtn = document.querySelector('.btn-deploy') || event.currentTarget;
    const originalText = statusBtn.innerHTML;

    // 2. Sécurité : Demande du token (non stocké dans le code pour éviter le bannissement par GitHub)
    const userToken = prompt("🔑 Admin Lab_Math : Entrez votre Token personnel (Classic ou Fine-grained) :");
    
    if (!userToken) return;

    statusBtn.disabled = true;
    statusBtn.innerHTML = '<i class="fas fa-sync fa-spin"></i> Synchronisation...';
    
    try {
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}`;
        
        // A. Récupérer le fichier actuel pour obtenir son SHA (obligatoire pour modifier)
        const getFile = await fetch(url, {
            headers: { 'Authorization': `token ${userToken}`, 'Accept': 'application/vnd.github.v3+json' }
        });
        
        if (!getFile.ok) throw new Error("Impossible d'accéder au fichier sur GitHub. Vérifiez le Token.");
        
        const fileData = await getFile.json();
        const sha = fileData.sha;

        // B. Récupérer les données depuis le localStorage (là où l'admin modifie)
        const localData = localStorage.getItem('labmath_data');
        if (!localData) throw new Error("Aucune modification détectée dans l'interface admin.");
        
        // Encodage propre pour GitHub (Base64)
        const content = btoa(unescape(encodeURIComponent(localData)));

        // C. Envoyer la mise à jour (PUT)
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Admin Update: ${new Date().toLocaleString()}`,
                content: content,
                sha: sha,
                branch: GITHUB_CONFIG.branch
            })
        });

        if (response.ok) {
            alert(CONFIG.MESSAGES.DEPLOY_SUCCESS);
        } else {
            const errorRes = await response.json();
            throw new Error(errorRes.message || "Erreur lors de la mise à jour.");
        }
    } catch (error) {
        alert("❌ ERREUR LAB_MATH : " + error.message);
    } finally {
        statusBtn.disabled = false;
        statusBtn.innerHTML = originalText;
    }
}

// Export pour utilisation globale
window.CONFIG = CONFIG;
window.GITHUB_CONFIG = GITHUB_CONFIG;
window.pushToGitHub = pushToGitHub;
