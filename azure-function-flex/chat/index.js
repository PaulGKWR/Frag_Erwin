const { app } = require('@azure/functions');
const https = require('https');

app.http('chat', {
    methods: ['GET', 'POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // CORS Headers
        const headers = {
            'Access-Control-Allow-Origin': 'https://paulgkwr.github.io',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
        };

        // Handle OPTIONS preflight
        if (request.method === 'OPTIONS') {
            return { status: 200, headers, body: '' };
        }

        // Health check endpoint
        if (request.method === 'GET') {
            return {
                status: 200,
                headers,
                body: JSON.stringify({
                    status: 'healthy',
                    service: 'Frag Erwin Chat API',
                    timestamp: new Date().toISOString()
                })
            };
        }

        // Chat endpoint
        try {
            const body = await request.json();
            const userMessage = body?.message;
            
            if (!userMessage) {
                return {
                    status: 400,
                    headers,
                    body: JSON.stringify({ error: 'Message is required' })
                };
            }

            const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
            const apiKey = process.env.AZURE_OPENAI_KEY;
            const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
            const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

            if (!endpoint || !apiKey || !deployment) {
                return {
                    status: 500,
                    headers,
                    body: JSON.stringify({ error: 'Server configuration error' })
                };
            }

            // Azure OpenAI API call using native https
            const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
            
            const postData = JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'Du bist Erwin, ein hilfreicher Assistent der Stadtwerke, spezialisiert auf Fragen zu Abwassergebühren. Antworte kurz, präzise und freundlich auf Deutsch.'
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            });

            const response = await new Promise((resolve, reject) => {
                const urlObj = new URL(url);
                const options = {
                    hostname: urlObj.hostname,
                    path: urlObj.pathname + urlObj.search,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': apiKey,
                        'Content-Length': Buffer.byteLength(postData)
                    }
                };

                const req = https.request(options, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        if (res.statusCode === 200) {
                            resolve(JSON.parse(data));
                        } else {
                            reject(new Error(`API returned ${res.statusCode}: ${data}`));
                        }
                    });
                });

                req.on('error', reject);
                req.write(postData);
                req.end();
            });

            const assistantMessage = response.choices?.[0]?.message?.content || 
                'Entschuldigung, ich konnte keine Antwort generieren.';

            return {
                status: 200,
                headers,
                body: JSON.stringify({
                    message: assistantMessage,
                    timestamp: new Date().toISOString()
                })
            };

        } catch (error) {
            context.error('Error:', error);
            return {
                status: 500,
                headers,
                body: JSON.stringify({
                    error: 'Internal server error',
                    message: error.message
                })
            };
        }
    }
});
