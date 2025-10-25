# Azure Function - Frag Erwin Chat API (Node.js)

## 🔧 Lokale Entwicklung

### 1. Environment Variables einrichten

**Option A: `.env` Datei (bereits erstellt)**
Die Datei `azure-function/.env` enthält bereits deine Keys:
```env
AZURE_OPENAI_ENDPOINT=https://frag-erwin.openai.azure.com/
AZURE_OPENAI_KEY=A7JD...
AZURE_OPENAI_DEPLOYMENT=gpt-4.1
```

**Option B: `local.settings.json` (bereits erstellt)**
Die Datei `azure-function/local.settings.json` ist für Azure Functions Core Tools.

### 2. Dependencies installieren

```bash
cd azure-function
npm install
```

### 3. Lokal testen

```bash
# Im azure-function Ordner
npm start
# oder
func start
```

Die Function läuft dann auf: `http://localhost:7071`

### 4. Testen

```bash
# Health Check
curl http://localhost:7071/api/health

# Chat Test
curl -X POST http://localhost:7071/api/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"Was sind Abwassergebühren?\"}"
```

## 🚀 Deployment zu Azure

### Automatisch via GitHub

Die Azure Function ist bereits mit deinem GitHub-Account verbunden.

1. **Keys in Azure setzen** (wichtig für Produktion!):
   - Gehe zu [Azure Portal](https://portal.azure.com)
   - Öffne deine Function App
   - Gehe zu **Configuration** → **Application settings**
   - Füge hinzu:
     - `AZURE_OPENAI_ENDPOINT`: `https://frag-erwin.openai.azure.com/`
     - `AZURE_OPENAI_KEY`: `<DEIN_API_KEY_HIER>` (aus Azure Portal kopieren)
     - `AZURE_OPENAI_DEPLOYMENT`: `gpt-4.1`
     - `AZURE_OPENAI_API_VERSION`: `2025-01-01-preview`
   - Klicke **Save**

2. **Code pushen**:
   ```bash
   git add azure-function/
   git commit -m "🚀 Node.js Azure Function"
   git push origin main
   ```

3. GitHub Actions deployed automatisch!

### Manuell via Azure CLI

```bash
cd azure-function
func azure functionapp publish <DEIN-FUNCTION-APP-NAME>
```

### Endpoints

- **Chat**: `https://<dein-function-app>.azurewebsites.net/api/chat`
- **Health Check**: `https://<dein-function-app>.azurewebsites.net/api/health`

### Umgebungsvariablen (Optional)

Falls du die Keys nicht im Code haben möchtest:

1. Gehe zu Azure Portal → Function App → Configuration
2. Füge hinzu:
   - `AZURE_OPENAI_KEY`: Dein API Key
   - `AZURE_OPENAI_ENDPOINT`: https://frag-erwin.openai.azure.com/
   - `AZURE_OPENAI_DEPLOYMENT`: gpt-4.1

3. Aktualisiere `function_app.py`:
```python
AZURE_OPENAI_KEY = os.environ.get('AZURE_OPENAI_KEY')
AZURE_OPENAI_ENDPOINT = os.environ.get('AZURE_OPENAI_ENDPOINT')
```

### Testen

```bash
# Health Check
curl https://<dein-function-app>.azurewebsites.net/api/health

# Chat Test
curl -X POST https://<dein-function-app>.azurewebsites.net/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Was sind Abwassergebühren?"}'
```

## Monitoring

- Azure Portal → Function App → Monitor
- Application Insights für detaillierte Logs
- Log Stream für Live-Debugging
