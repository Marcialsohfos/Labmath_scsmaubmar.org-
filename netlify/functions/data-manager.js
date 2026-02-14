// netlify/functions/data-manager.js
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
    const dataPath = path.join(__dirname, '../../data.json');
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // Lire le fichier
        let fileContent;
        try {
            fileContent = await fs.readFile(dataPath, 'utf8');
        } catch (e) {
            // Si le fichier n'existe pas, créer une structure par défaut
            const defaultData = {
                compteurs: { activites: 0, realisations: 0, annonces: 0, offres: 0 },
                activites: [],
                realisations: [],
                annonces: [],
                offres: [],
                messages: []
            };
            await fs.writeFile(dataPath, JSON.stringify(defaultData, null, 2));
            fileContent = JSON.stringify(defaultData);
        }
        
        let data = JSON.parse(fileContent);

        // GET - Récupérer les données
        if (event.httpMethod === 'GET') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(data)
            };
        }

        // POST - Ajouter un élément
        if (event.httpMethod === 'POST') {
            const { section, item } = JSON.parse(event.body);
            
            if (!data[section]) data[section] = [];
            
            const newItem = {
                id: Date.now(),
                ...item,
                date_creation: new Date().toISOString()
            };
            
            data[section].push(newItem);
            
            // Incrémenter le compteur
            if (!data.compteurs) data.compteurs = {};
            data.compteurs[section] = (data.compteurs[section] || 0) + 1;
            
            // Sauvegarder
            await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    item: newItem,
                    compteurs: data.compteurs
                })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Méthode non autorisée' })
        };

    } catch (error) {
        console.error('Erreur:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Erreur serveur: ' + error.message })
        };
    }
};