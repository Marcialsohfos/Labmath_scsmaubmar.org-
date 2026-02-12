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