// ============================================
// 1. CONFIGURATION GÉNÉRALE DU SITE
// ============================================
const CONFIG = {
    VERSION: '2.0.0',
    DEBUG: window.location.hostname === 'localhost',
    API_URL: window.location.origin,
    API_KEY: 'labmath_api_secret_2024',
    
    // Paramètres d'affichage
    DISPLAY: {
        ITEMS_PER_PAGE: 9,
        ANIMATIONS_ENABLED: true
    },
    
    // Messages système
    MESSAGES: {
        SAVE_SUCCESS: '✅ Données sauvegardées localement',
        SAVE_ERROR: '❌ Erreur lors de la sauvegarde',
        DELETE_CONFIRM: 'Êtes-vous sûr de vouloir supprimer cet élément ?'
    }
};

// ============================================
// 2. CONFIGURATION GITHUB (POUR LE DÉPLOIEMENT)
// ============================================
const GITHUB_CONFIG = {
    owner: 'marcialsohfos',       // ⚠️ À REMPLACER
    repo: 'Labmath_scsmaubmar.org-',         // ⚠️ À REMPLACER
    token: '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',     // ⚠️ À REMPLACER (Garder les guillemets)
    branch: 'main',               // 'main' ou 'master' selon votre dépôt
    file_path: 'data.json'        // Le nom du fichier à mettre à jour
};

// ============================================
// 3. ÉQUATIONS ET THÈME VISUEL
// ============================================
const MATH_EQUATIONS = [
    '∫ f(x) dx = F(b) - F(a)',
    '∑_{n=1}^{∞} 1/n² = π²/6',
    'e^{iπ} + 1 = 0',
    'E = mc²',
    'sin²θ + cos²θ = 1'
];

const MATH_COLORS = {
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    dark: '#0a0f1f',
    light: '#e0e0ff'
};

// ============================================
// 4. EXPORTS GLOBAUX (NE PAS TOUCHER)
// ============================================
window.CONFIG = CONFIG;
window.GITHUB_CONFIG = GITHUB_CONFIG;
window.MATH_EQUATIONS = MATH_EQUATIONS;
window.MATH_COLORS = MATH_COLORS;

// Log de vérification
if (window.location.pathname.includes('admin')) {
    console.log('🔧 Admin Lab_Math - Configuration GitHub prête.');
}