// ===== LAB_MATH - CONFIGURATION =====

const CONFIG = {
    // Mode développement/production
    DEBUG: window.location.hostname === 'localhost',
    
    // URLs API (relatives)
    API: {
        ACTIVITES: '/api/activites',
        REALISATIONS: '/api/realisations',
        ANNONCES: '/api/annonces',
        OFFRES: '/api/offres',
        UPLOAD: '/api/upload'
    },
    
    // Clé API (pour admin)
    API_KEY: 'labmath_api_secret_2024',
    
    // Paramètres d'affichage
    DISPLAY: {
        ACTIVITES_PER_PAGE: 9,
        REALISATIONS_PER_PAGE: 6,
        ANNONCES_PER_PAGE: 6,
        OFFRES_PER_PAGE: 6
    },
    
    // Messages
    MESSAGES: {
        LOADING: 'Chargement des données...',
        EMPTY: 'Aucune donnée disponible',
        ERROR: 'Erreur de chargement',
        SUCCESS: 'Opération réussie'
    }
};

// ===== ÉQUATIONS MATHÉMATIQUES POUR ANIMATIONS =====
const MATH_EQUATIONS = [
    '∫ f(x) dx = F(b) - F(a)',
    '∑_{n=1}^{∞} 1/n² = π²/6',
    'e^{iπ} + 1 = 0',
    '∇·E = ρ/ε₀',
    '∂ψ/∂t = iħ∇²ψ/2m',
    'F = G(m₁m₂)/r²',
    'E = mc²',
    'sin²θ + cos²θ = 1'
];

// ===== COULEURS THÈME MATHÉMATIQUE =====
const MATH_COLORS = {
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    dark: '#0a0f1f',
    darker: '#05080f',
    light: '#e0e0ff'
};

// ============================================
// CONFIGURATION LAB_MATH
// ============================================

const CONFIG = {
    // Version de l'application
    VERSION: '2.0.0',
    
    // URLs API (à configurer selon votre hébergement)
    API_URL: window.location.origin,
    API_KEY: 'labmath_api_secret_2024',
    
    // Paramètres d'affichage
    DISPLAY: {
        ITEMS_PER_PAGE: 9,
        ANIMATIONS_ENABLED: true
    },
    
    // Messages système
    MESSAGES: {
        SAVE_SUCCESS: '✅ Données sauvegardées avec succès',
        SAVE_ERROR: '❌ Erreur lors de la sauvegarde',
        DELETE_CONFIRM: 'Êtes-vous sûr de vouloir supprimer cet élément ?'
    }
};

// ============================================
// EXPORT DE LA CONFIGURATION
// ============================================

// Rendre la configuration disponible globalement
window.CONFIG = CONFIG;
window.MATH_EQUATIONS = MATH_EQUATIONS;
window.MATH_COLORS = MATH_COLORS;

// ============================================
// INITIALISATION RAPIDE
// ============================================

// Vérifier si on est en mode admin
if (window.location.pathname.includes('admin')) {
    console.log('🔧 Mode Admin activé');
    console.log('📁 Version:', CONFIG.VERSION);
    console.log('🔑 API:', CONFIG.API_URL);
};

// Exporter la configuration
window.CONFIG = CONFIG;