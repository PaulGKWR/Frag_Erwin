const { app } = require('@azure/functions');
const { AzureOpenAI } = require('openai');

// Azure OpenAI Konfiguration aus Environment Variables
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || 'https://frag-erwin.openai.azure.com/';
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4.1';
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview';

// OpenAI Client initialisieren
const client = new AzureOpenAI({
    endpoint: AZURE_OPENAI_ENDPOINT,
    apiKey: AZURE_OPENAI_KEY,
    apiVersion: AZURE_OPENAI_API_VERSION,
    deployment: AZURE_OPENAI_DEPLOYMENT
});

// System Prompt für Erwin
const SYSTEM_PROMPT = `Du bist Erwin, ein freundlicher und kompetenter KI-Assistent für Fragen zu Abwassergebühren. 

Deine Aufgaben:
- Beantworte Fragen zu Abwassergebühren klar und verständlich
- Erkläre Berechnungsmethoden, Gebührensätze und Zahlungsmodalitäten
- Informiere über Widerspruchsmöglichkeiten und Ermäßigungen
- Sei höflich, professionell und hilfsbereit
- Verweise bei komplexen Fällen an die zuständige Verwaltung

Wichtige Informationen:
- Schmutzwassergebühr: 2,50€ pro m³ Frischwasser
- Niederschlagswassergebühr: Nach versiegelter Fläche
- Widerspruchsfrist: 1 Monat nach Bescheiderhalt
- Zahlungsfrist: 30 Tage nach Rechnungserhalt
- Ermäßigungen möglich für: Soziale Härtefälle, Regenwasserversickerung

Antworte auf Deutsch und halte deine Antworten präzise und hilfreich.`;

// Chat Endpoint
app.http('chat', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Chat-Anfrage erhalten');

        // CORS Headers
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
        };

        // Handle CORS Preflight
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: headers
            };
        }

        try {
            // Request Body parsen
            const body = await request.json();
            const userMessage = body.message;

            if (!userMessage) {
                return {
                    status: 400,
                    headers: headers,
                    body: JSON.stringify({ error: 'Keine Nachricht erhalten' })
                };
            }

            context.log(`Benutzer-Nachricht: ${userMessage}`);

            // API Call an Azure OpenAI
            const response = await client.chat.completions.create({
                model: AZURE_OPENAI_DEPLOYMENT,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 500,
                top_p: 0.95
            });

            // Antwort extrahieren
            const aiResponse = response.choices[0].message.content;
            
            context.log(`AI-Antwort generiert: ${aiResponse.substring(0, 100)}...`);

            // Erfolgreiche Antwort zurückgeben
            return {
                status: 200,
                headers: headers,
                body: JSON.stringify({
                    response: aiResponse,
                    model: AZURE_OPENAI_DEPLOYMENT
                })
            };

        } catch (error) {
            context.error(`Fehler bei API-Call: ${error.message}`);
            
            return {
                status: 500,
                headers: headers,
                body: JSON.stringify({ 
                    error: 'Interner Serverfehler',
                    details: error.message 
                })
            };
        }
    }
});

// Health Check Endpoint
app.http('health', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        return {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'healthy',
                service: 'Frag Erwin Chat API',
                timestamp: new Date().toISOString()
            })
        };
    }
});
