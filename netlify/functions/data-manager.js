// netlify/functions/data-manager.js
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
    const dataPath = path.join(__dirname, '../../data.json');
    
    // HEADERS CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // Lire le fichier data.json
        let data = JSON.parse(await fs.readFile(dataPath, 'utf8'));

        // GET - Récupérer les données
        if (event.httpMethod === 'GET') {
            const section = event.queryStringParameters?.section;
            if (section) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(data[section] || [])
                };
            }
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(data)
            };
        }

        // POST - Ajouter un élément
        if (event.httpMethod === 'POST') {
            const { section, item } = JSON.parse(event.body);
            
            // Initialiser la section si elle n'existe pas
            if (!data[section]) data[section] = [];
            
            // Ajouter l'élément avec un ID unique
            const newItem = {
                id: Date.now(),
                ...item,
                date_creation: new Date().toISOString()
            };
            
            data[section].push(newItem);
            
            // INCRÉMENTER LE COMPTEUR
            if (!data.compteurs) data.compteurs = {};
            data.compteurs[section] = (data.compteurs[section] || 0) + 1;
            data.compteurs.total = (data.compteurs.total || 0) + 1;
            
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

        // PUT - Mettre à jour un élément
        if (event.httpMethod === 'PUT') {
            const { section, id, updates } = JSON.parse(event.body);
            
            const index = data[section].findIndex(item => item.id === id);
            if (index !== -1) {
                data[section][index] = { ...data[section][index], ...updates };
                await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true })
                };
            }
            
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Élément non trouvé' })
            };
        }

        // DELETE - Supprimer un élément
        if (event.httpMethod === 'DELETE') {
            const { section, id } = JSON.parse(event.body);
            
            data[section] = data[section].filter(item => item.id !== id);
            
            // DÉCRÉMENTER LE COMPTEUR
            data.compteurs[section] = Math.max(0, (data.compteurs[section] || 1) - 1);
            data.compteurs.total = Math.max(0, (data.compteurs.total || 1) - 1);
            
            await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true,
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
            body: JSON.stringify({ error: 'Erreur serveur' })
        };
    }
};