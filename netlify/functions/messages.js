// netlify/functions/messages.js
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
    const dataPath = path.join(__dirname, '../../data.json');
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        let data = JSON.parse(await fs.readFile(dataPath, 'utf8'));

        // POST - Nouveau message depuis le formulaire de contact
        if (event.httpMethod === 'POST' && !event.queryStringParameters?.action) {
            const { nom, email, sujet, message } = JSON.parse(event.body);
            
            const nouveauMessage = {
                id: Date.now(),
                nom,
                email,
                sujet,
                message,
                date: new Date().toISOString(),
                lu: false,
                repondu: false,
                reponse: null,
                date_reponse: null
            };
            
            if (!data.messages) data.messages = [];
            data.messages.push(nouveauMessage);
            
            await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
            
            // Envoyer notification par email
            await envoyerNotification(nouveauMessage);
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Message envoyé avec succès' 
                })
            };
        }

        // GET - Récupérer les messages
        if (event.httpMethod === 'GET') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(data.messages || [])
            };
        }

        // PUT - Répondre à un message
        if (event.httpMethod === 'PUT') {
            const { messageId, reponse } = JSON.parse(event.body);
            
            const index = data.messages.findIndex(m => m.id === messageId);
            if (index !== -1) {
                data.messages[index].repondu = true;
                data.messages[index].reponse = reponse;
                data.messages[index].date_reponse = new Date().toISOString();
                
                await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
                
                // Envoyer la réponse par email
                await envoyerReponse(data.messages[index]);
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true })
                };
            }
            
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Message non trouvé' })
            };
        }

    } catch (error) {
        console.error('Erreur:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Erreur serveur' })
        };
    }
};

// Fonction pour envoyer une notification
async function envoyerNotification(message) {
    // Configuration Email (avec EmailJS ou autre service)
    console.log('Nouveau message reçu:', message);
    
    // Exemple avec EmailJS (côté client) ou un service SMTP
    // Vous pouvez utiliser SendGrid, Mailgun, etc.
}

// Fonction pour envoyer la réponse
async function envoyerReponse(message) {
    console.log('Réponse envoyée à', message.email, ':', message.reponse);
    
    // Ici, code pour envoyer l'email réel
    // Exemple avec SMTP
    /*
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    await transporter.sendMail({
        from: '"Lab_Math" <noreply@labmathscsmaubmar.org>',
        to: message.email,
        subject: `Re: ${message.sujet}`,
        text: `Bonjour ${message.nom},\n\n${message.reponse}\n\nCordialement,\nL'équipe Lab_Math`
    });
    */
}