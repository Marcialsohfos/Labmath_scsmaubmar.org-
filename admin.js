// admin.js - Script spécifique à l'admin
const API_URL = '/.netlify/functions/data-manager';

// Vérification authentification
if (!localStorage.getItem('labmath_admin')) {
    window.location.href = 'login.html';
}

// Déconnexion
window.logout = function() {
    localStorage.removeItem('labmath_admin');
    window.location.href = 'login.html';
};

// Charger les données
async function chargerDonnees() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        
        // Mettre à jour les compteurs
        if (data.compteurs) {
            document.getElementById('stat-activites').textContent = data.compteurs.activites || 0;
            document.getElementById('stat-realisations').textContent = data.compteurs.realisations || 0;
            document.getElementById('stat-annonces').textContent = data.compteurs.annonces || 0;
            document.getElementById('stat-offres').textContent = data.compteurs.offres || 0;
        }
        
        return data;
    } catch (error) {
        console.error('Erreur chargement:', error);
        alert('Erreur de chargement des données: ' + error.message);
        return null;
    }
}

// Ajouter un élément
window.ajouterElement = async function(section, item) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ section, item })
        });
        
        if (!response.ok) throw new Error('Erreur réseau');
        const result = await response.json();
        
        if (result.success) {
            // Mettre à jour les compteurs
            if (result.compteurs) {
                document.getElementById('stat-activites').textContent = result.compteurs.activites || 0;
                document.getElementById('stat-realisations').textContent = result.compteurs.realisations || 0;
                document.getElementById('stat-annonces').textContent = result.compteurs.annonces || 0;
                document.getElementById('stat-offres').textContent = result.compteurs.offres || 0;
            }
            
            alert('Élément ajouté avec succès !');
            return true;
        } else {
            throw new Error('Échec de l\'ajout');
        }
    } catch (error) {
        console.error('Erreur ajout:', error);
        alert('Erreur lors de l\'ajout: ' + error.message);
        return false;
    }
};

// Ouvrir le modal
window.openModal = function(type) {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
        modal.style.display = 'flex';
        
        // Remplir le titre
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) {
            modalTitle.textContent = `Ajouter ${type}`;
        }
        
        // Stocker le type
        const elementType = document.getElementById('element-type');
        if (elementType) {
            elementType.value = type;
        }
    } else {
        // Fallback si pas de modal
        const titre = prompt(`Titre de la nouvelle ${type}:`);
        if (titre) {
            const description = prompt('Description:');
            ajouterElement(type + 's', { titre, description });
        }
    }
};

// Fermer le modal
window.closeModal = function() {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
        modal.style.display = 'none';
    }
};

// Sauvegarder depuis le formulaire
window.sauvegarderElement = async function(event) {
    event.preventDefault();
    
    const type = document.getElementById('element-type')?.value;
    const titre = document.getElementById('titre')?.value;
    const description = document.getElementById('description')?.value;
    
    if (!type || !titre || !description) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    const section = type + 's';
    const item = { titre, description };
    
    const success = await ajouterElement(section, item);
    
    if (success) {
        closeModal();
        // Réinitialiser le formulaire
        document.getElementById('titre').value = '';
        document.getElementById('description').value = '';
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', chargerDonnees);