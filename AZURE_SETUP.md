# Azure OpenAI Chat Backend Configuration

## Setup Instructions

### 1. Azure OpenAI Service Setup
1. Create Azure OpenAI resource in Azure Portal
2. Deploy a model (e.g., gpt-4, gpt-35-turbo)
3. Note down:
   - Endpoint URL
   - API Key
   - Deployment Name

### 2. Azure Functions Setup (Backend)
Create an Azure Function to handle chat requests:

```javascript
// Azure Function (Node.js)
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // CORS headers
    context.res.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (req.method === 'OPTIONS') {
        context.res = { status: 200 };
        return;
    }

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_KEY;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT;

    const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

    try {
        const { message } = req.body;

        const systemPrompt = `Du bist Erwin, ein hilfsreicher KI-Assistent für Fragen zu Abwassergebühren in Deutschland. 

Antworte höflich, professionell und präzise. Konzentriere dich auf:
- Abwassergebühren und deren Berechnung
- Rechtliche Grundlagen (ohne Rechtsberatung)
- Praktische Hilfestellungen
- Kommunale Unterschiede
- Einspruchs- und Widerspruchsmöglichkeiten
- Zahlungsmodalitäten

Gib keine konkrete Rechtsberatung, sondern nur allgemeine Informationen. 
Verweise bei komplexen rechtlichen Fragen an die zuständigen Behörden oder Fachexperten.`;

        const response = await client.getChatCompletions(deploymentName, [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
        ], {
            maxTokens: 500,
            temperature: 0.7
        });

        context.res = {
            status: 200,
            body: {
                response: response.choices[0].message.content
            }
        };

    } catch (error) {
        context.log('Error:', error);
        context.res = {
            status: 500,
            body: { error: 'Internal server error' }
        };
    }
};
```

### 3. Environment Variables for Azure Function
Set these in your Azure Function App settings:
- `AZURE_OPENAI_ENDPOINT`: Your OpenAI endpoint
- `AZURE_OPENAI_KEY`: Your OpenAI API key
- `AZURE_OPENAI_DEPLOYMENT`: Your model deployment name

### 4. Frontend Integration
Replace the placeholder function in script.js:

```javascript
async function callAzureOpenAI(message) {
    const response = await fetch('YOUR_AZURE_FUNCTION_URL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
        throw new Error('Backend API call failed');
    }
    
    const data = await response.json();
    return data.response;
}
```

### 5. package.json for Azure Function
```json
{
  "name": "abwasser-chat-function",
  "version": "1.0.0",
  "description": "Azure Function for Abwassergebühren Chat",
  "main": "index.js",
  "dependencies": {
    "@azure/openai": "^1.0.0-beta.7"
  }
}
```

## Security Considerations
- Use Azure Key Vault for storing sensitive credentials
- Implement rate limiting
- Add input validation and sanitization
- Consider authentication for production use
- Monitor API usage and costs

## Deployment Steps
1. Create Azure Function App
2. Deploy function code
3. Configure environment variables
4. Test API endpoint
5. Update frontend with actual endpoint URL
6. Deploy to GitHub Pages