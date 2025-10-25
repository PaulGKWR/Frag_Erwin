# Azure Function Portal Deployment

Da npm install nicht funktioniert, verwende das Azure Portal:

## Schritte:

### 1. Azure Portal öffnen
https://portal.azure.com

### 2. Zur Function App navigieren
- Suche nach "FragerwinBE"
- Klicke auf die Function App

### 3. Neue Function erstellen
- Links: **Functions** → **Create**
- Development Environment: **Develop in portal**
- Template: **HTTP trigger**
- Function name: **chat**
- Authorization level: **Anonymous**

### 4. Code einfügen
Kopiere den kompletten Code aus `azure-function/src/functions/index.js` und füge ihn ein.

### 5. Environment Variables sind bereits gesetzt
Die Environment Variables (AZURE_OPENAI_ENDPOINT, etc.) sind bereits im Portal unter **Configuration** → **Application settings** gesetzt.

### 6. CORS konfigurieren
- **Configuration** → **CORS**
- Füge hinzu: `https://paulgkwr.github.io`
- Speichern

### 7. Teste die Function
- URL: `https://fragerwinbe-b2h0dghuc6fscpam.eastus-01.azurewebsites.net/api/chat`
- Test im Portal mit: `{"message": "Was sind Abwassergebühren?"}`

## Alternative: Function App Package deployen

Falls Portal nicht funktioniert, können wir auch den Code direkt über Kudu hochladen oder ein komplettes Deployment Package erstellen.
