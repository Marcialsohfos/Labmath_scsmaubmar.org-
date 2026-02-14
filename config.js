// ============================================
// 1. CONFIGURATION GÉNÉRALE
// ============================================
const CONFIG = {
    VERSION: '2.0.0',
    DEBUG: window.location.hostname === 'localhost',
    API_URL: window.location.origin,
    API_KEY: 'labmath_api_secret_2024',
    DISPLAY: {
        ITEMS_PER_PAGE: 9,
        ANIMATIONS_ENABLED: true
    },
    MESSAGES: {
        SAVE_SUCCESS: '✅ Données sauvegardées localement',
        SAVE_ERROR: '❌ Erreur lors de la sauvegarde',
        DELETE_CONFIRM: 'Êtes-vous sûr de vouloir supprimer cet élément ?'
    }
};

// ============================================
// 2. CONFIGURATION GITHUB (SÉCURISÉE)
// ============================================
const GITHUB_CONFIG = {
    owner: 'VOTRE_PSEUDO_GITHUB', // ⚠️ À MODIFIER
    repo: 'VOTRE_NOM_DEPOT',      // ⚠️ À MODIFIER (ex: lab_math)
    branch: 'main'
};

// ============================================
// 3. ÉQUATIONS ET THÈME VISUEL
// ============================================
const MATH_EQUATIONS = [
    '∫ f(x) dx = F(b) - F(a)', '∑ 1/n² = π²/6', 
    'e^{iπ} + 1 = 0', 'E = mc²', 'sin²θ + cos²θ = 1'
];

const MATH_COLORS = {
    primary: '#00ffff', secondary: '#ff00ff', 
    accent: '#ffff00', dark: '#0a0f1f'
};

// ============================================
// 4. FONCTION DE DÉPLOIEMENT (DYNAMIQUE)
// ============================================
async function pushToGitHub() {
    const statusBtn = event.currentTarget;
    
    // On demande le token à chaque fois pour éviter qu'il soit volé ou bloqué
    const userToken = prompt("🔑 Entrez votre Token GitHub (ghp_...) pour publier :");
    
    if (!userToken || userToken.trim() === "") {
        alert("Opération annulée : Le token est nécessaire.");
        return;
    }

    statusBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Déploiement...';
    
    try {
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/data.json`;
        
        // 1. Récupérer le SHA du fichier actuel
        const getFile = await fetch(url, {
            headers: { 'Authorization': `token ${userToken}` }
        });
        
        if (!getFile.ok) throw new Error("Accès refusé. Vérifiez votre pseudo, le nom du dépôt ou le Token.");
        
        const fileData = await getFile.json();
        const sha = fileData.sha;

        // 2. Préparer les données locales
        const localData = localStorage.getItem('labmath_data');
        if (!localData) throw new Error("Aucune donnée locale trouvée à envoyer.");
        
        const content = btoa(unescape(encodeURIComponent(localData)));

        // 3. Envoyer la mise à jour
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: "Mise à jour automatique data.json",
                content: content,
                sha: sha,
                branch: GITHUB_CONFIG.branch
            })
        });

        if (response.ok) {
            alert("🚀 BRAVO ! La base GitHub est à jour. Votre site sera actualisé dans 1 minute.");
        } else {
            throw new Error("Erreur lors de l'écriture sur GitHub.");
        }
    } catch (error) {
        alert("❌ ÉCHEC : " + error.message);
    } finally {
        statusBtn.innerHTML = '<i class="fab fa-github"></i> Déployer sur GitHub';
    }
}

// ============================================
// 5. EXPORT FINAL
// ============================================
window.CONFIG = CONFIG;
window.GITHUB_CONFIG = GITHUB_CONFIG;
window.MATH_EQUATIONS = MATH_EQUATIONS;
window.MATH_COLORS = MATH_COLORS;