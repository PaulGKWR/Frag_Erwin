const https = require('https');

module.exports = async function (context, req) {
    const method = (req.method || '').toUpperCase();
    context.log(`Incoming ${method || 'UNKNOWN'} request`);

    const allowedOrigins = new Set([
        'https://paulgkwr.github.io',
        'https://frag-erwin.info',
        'https://www.frag-erwin.info',
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ]);
    const requestOrigin = req.headers?.origin;
    const effectiveOrigin = allowedOrigins.has(requestOrigin) ? requestOrigin : 'https://paulgkwr.github.io';

    const corsHeaders = {
        'Access-Control-Allow-Origin': effectiveOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Vary': 'Origin',
        'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: corsHeaders,
            body: ''
        };
        return;
    }

    if (method === 'GET') {
        context.res = {
            status: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                status: 'healthy',
                service: 'Frag Erwin Chat API',
                timestamp: new Date().toISOString()
            })
        };
        return;
    }

    if (method !== 'POST') {
        context.res = {
            status: 405,
            headers: corsHeaders,
            body: JSON.stringify({ error: `Method ${method} not allowed` })
        };
        return;
    }

    // Chat endpoint
    try {
        let payload = req.body;
        if (!payload && req.rawBody) {
            try {
                payload = JSON.parse(req.rawBody);
            } catch (parseError) {
                context.log('Failed to parse rawBody:', parseError);
            }
        }

        if (typeof payload === 'string') {
            try {
                payload = JSON.parse(payload);
            } catch (parseError) {
                context.log('Failed to parse payload string:', parseError);
            }
        }

        const userMessage = payload?.message;

        if (!userMessage) {
            context.log('Request payload missing message field:', payload);
            context.res = {
                status: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Message is required' })
            };
            return;
        }

        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_KEY;
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
        const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

        const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
        const searchApiKey = process.env.AZURE_SEARCH_KEY;
        const searchIndex = process.env.AZURE_SEARCH_INDEX;
        const searchSemanticConfig = process.env.AZURE_SEARCH_SEMANTIC_CONFIG;
        const searchQueryType = process.env.AZURE_SEARCH_QUERY_TYPE || 'simple';
        const searchTopN = parseInt(process.env.AZURE_SEARCH_TOP_N || '5', 10);
        const searchInScope = (process.env.AZURE_SEARCH_IN_SCOPE || 'true').toLowerCase() !== 'false';
        const searchTitleField = process.env.AZURE_SEARCH_TITLE_FIELD || 'title';
        const searchUrlField = process.env.AZURE_SEARCH_URL_FIELD || 'url';
        const searchContentFields = (process.env.AZURE_SEARCH_CONTENT_FIELDS || 'content')
            .split(',')
            .map(field => field.trim())
            .filter(Boolean);
        const searchVectorField = process.env.AZURE_SEARCH_VECTOR_FIELD;
        const searchEmbeddingEndpoint = process.env.AZURE_SEARCH_EMBEDDING_ENDPOINT;
        const searchEmbeddingKey = process.env.AZURE_SEARCH_EMBEDDING_KEY;
        const searchEmbeddingDeployment = process.env.AZURE_SEARCH_EMBEDDING_DEPLOYMENT;

        if (!endpoint || !apiKey || !deployment) {
            context.log('Missing environment variables');
            context.res = {
                status: 500,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Server configuration error' })
            };
            return;
        }

        // Azure OpenAI API call using native https
        const searchConfigured = Boolean(searchEndpoint && searchApiKey && searchIndex);
        
        // Always use standard chat completions endpoint
        const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

        const payloadBody = {
            messages: [
                {
                    role: 'system',
                    content: `Du bist **Erwin**, ein sachkundiger und hilfsbereiter KI-Assistent der Gemeinde Ried. 
Deine Hauptaufgabe ist es, Fragen zu den Themen Abwasser, Entwässerung, Gebühren 
und Beiträgen zu beantworten, insbesondere auf Grundlage der offiziellen 
Beitrags- und Gebührensatzung zur Entwässerungssatzung (BGS/EWS 2025) 
und der dazugehörigen FAQ.

Richtlinien:
1. **Priorität**: Antworte vorrangig anhand der offiziellen Satzung und der FAQ.
2. **Transparenz**: Wenn du Informationen aus anderen Quellen nutzt 
   (z. B. allgemeines Hintergrundwissen aus deinem Sprachmodell), 
   erwähne dies am Ende der Antwort mit einer Formulierung wie:
   „Allgemeine Information, Quelle: öffentlich zugängliches Wissen (Stand 2025)".
3. **Zitate**: Wenn du Paragraphen, Absätze oder Werte aus der Satzung nennst, 
   zitiere sie wörtlich und gib den Paragraphen an.
4. **Verständlichkeit**: Verwende eine klare, bürgerfreundliche Sprache.
5. **Neutralität**: Bleibe sachlich, ruhig und unparteiisch.
6. **Keine Rechtsberatung**: Gib nur allgemeine Informationen und verweise 
   bei rechtlichen Detailfragen auf die Gemeinde oder Fachstellen.
7. **Struktur**: Fasse dich kurz (maximal 5 Sätze), 
   nutze bei komplexen Themen Aufzählungen für bessere Lesbarkeit.

Ziel:
Hilf Bürgerinnen und Bürgern, die Regelungen, Gebühren und Berechnungsmethoden 
verständlich nachzuvollziehen, und gib bei Bedarf Hintergrundwissen an, 
aber mach immer deutlich, ob eine Information aus der Satzung/FAQ 
oder aus allgemeinem Wissen stammt.`
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            max_tokens: 800,
            temperature: 0.5
        };

        if (searchConfigured) {
            const dataSource = {
                type: 'azure_search',
                parameters: {
                    endpoint: searchEndpoint,
                    index_name: searchIndex,
                    authentication: {
                        type: 'api_key',
                        key: searchApiKey
                    },
                    in_scope: searchInScope,
                    top_n_documents: Number.isFinite(searchTopN) ? searchTopN : 5,
                    query_type: searchQueryType,
                }
            };

            const fieldsMapping = {};
            if (searchTitleField) {
                fieldsMapping.title_field = searchTitleField;
            }
            if (searchUrlField) {
                fieldsMapping.url_field = searchUrlField;
            }
            if (searchContentFields.length) {
                fieldsMapping.content_fields = searchContentFields;
            }
            if (Object.keys(fieldsMapping).length) {
                dataSource.parameters.fields_mapping = fieldsMapping;
            }
            if (searchSemanticConfig) {
                dataSource.parameters.semantic_configuration = searchSemanticConfig;
            }
            if (searchVectorField) {
                dataSource.parameters.vector_fields = [searchVectorField];
            }
            if (searchEmbeddingEndpoint && searchEmbeddingKey) {
                dataSource.parameters.embedding_dependency = {
                    type: 'endpoint',
                    endpoint: searchEmbeddingEndpoint,
                    authentication: {
                        type: 'api_key',
                        key: searchEmbeddingKey
                    }
                };
                if (searchEmbeddingDeployment) {
                    dataSource.parameters.embedding_dependency.deployment_name = searchEmbeddingDeployment;
                }
            }

            payloadBody.data_sources = [dataSource];
            context.log('Azure Search data source attached to request (extensions API).');
        } else {
            context.log('Azure Search configuration incomplete. Proceeding without data source.');
        }

        const postData = JSON.stringify(payloadBody);

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
                        const errorPayload = {
                            statusCode: res.statusCode,
                            body: data
                        };
                        reject(new Error(JSON.stringify(errorPayload)));
                    }
                });
            });

            req.on('error', reject);
            req.write(postData);
            req.end();
        });

        const choice = response.choices?.[0] || {};
        const assistantMessage = choice.message?.content ||
            'Entschuldigung, ich konnte keine Antwort generieren.';
        const citationsFromMessage = choice.message?.context?.citations;
        const citationsFromChoice = choice.context?.citations;
        const citations = Array.isArray(citationsFromMessage) && citationsFromMessage.length
            ? citationsFromMessage
            : Array.isArray(citationsFromChoice) ? citationsFromChoice : [];

        // SAS-Token zu Blob-URLs hinzufügen
        const sasToken = process.env.AZURE_BLOB_SAS_TOKEN;
        const processedCitations = citations.map(citation => {
            let url = citation.url || citation.filepath;
            
            // Wenn es eine Blob-URL ist und kein SAS-Token hat
            if (url && url.includes('blob.core.windows.net') && !url.includes('?')) {
                if (sasToken) {
                    url = `${url}${sasToken.startsWith('?') ? sasToken : '?' + sasToken}`;
                }
            }
            
            return {
                ...citation,
                url: url
            };
        });

        context.res = {
            status: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: assistantMessage,
                citations: processedCitations,
                searchActivated: searchConfigured,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        context.log('Error:', error);
        context.res = {
            status: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
