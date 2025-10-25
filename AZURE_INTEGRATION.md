# 🚀 Azure Integration - Finalisierung

## ✅ Was bereits konfiguriert ist

- Azure OpenAI Deployment: **gpt-4.1**
- Endpoint: `https://frag-erwin.openai.azure.com/`
- API Key ist in der Function hinterlegt
- GitHub Verbindung zur Function App ist aktiv

## 📋 Nächste Schritte

### 1. Function App Name herausfinden

1. Gehe zu [Azure Portal](https://portal.azure.com)
2. Suche nach deiner **Function App** (wahrscheinlich `frag-erwin` oder ähnlich)
3. Kopiere die **URL** (z.B. `https://frag-erwin-func.azurewebsites.net`)

### 2. Script aktualisieren

Öffne `script.js` und ersetze diese Zeile:

```javascript
const AZURE_FUNCTION_URL = 'https://DEINE-FUNCTION-APP.azurewebsites.net/api/chat';
```

Mit deiner echten URL:

```javascript
const AZURE_FUNCTION_URL = 'https://frag-erwin-func.azurewebsites.net/api/chat';
```

### 3. Azure Function deployen

#### Option A: Automatisch via GitHub (Empfohlen)

```bash
# Im Hauptordner
git add azure-function/
git commit -m "🚀 Azure Function mit GPT-4.1 Integration"
git push origin main
```

Die GitHub-Verbindung sollte das automatisch deployen!

#### Option B: Manuell via Azure CLI

```bash
# Im azure-function Ordner
cd azure-function

# Deployen
func azure functionapp publish <DEIN-FUNCTION-APP-NAME>
```

### 4. Testen

1. **Health Check**:
   ```bash
   curl https://<dein-function-app>.azurewebsites.net/api/health
   ```
   
   Erwartete Antwort:
   ```json
   {"status":"healthy","service":"Frag Erwin Chat API"}
   ```

2. **Chat Test**:
   ```bash
   curl -X POST https://<dein-function-app>.azurewebsites.net/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"Was sind Abwassergebühren?"}'
   ```

3. **Website testen**:
   - Öffne https://paulgkwr.github.io/Frag_Erwin/
   - Klicke auf den roten Chat-Button
   - Stelle eine Frage
   - Du solltest jetzt **echte GPT-4.1 Antworten** bekommen!

## 🔒 Sicherheit (Optional aber empfohlen)

### API Key aus dem Code entfernen

1. Gehe zu Azure Portal → Function App → **Configuration**
2. Klicke auf **New application setting**
3. Füge hinzu:
   ```
   Name: AZURE_OPENAI_KEY
   Value: <DEIN_API_KEY_HIER>
   ```
4. Speichern

5. Aktualisiere `function_app.py`:
   ```python
   # Alte Zeile ersetzen:
   AZURE_OPENAI_KEY = "A7JD..."
   
   # Mit:
   AZURE_OPENAI_KEY = os.environ.get('AZURE_OPENAI_KEY')
   ```

6. Pushe die Änderung zu GitHub

## 📊 Monitoring

### Logs anschauen

1. Azure Portal → Function App → **Log stream**
2. Dort siehst du alle Requests in Echtzeit

### Application Insights

1. Azure Portal → Function App → **Application Insights**
2. Hier siehst du:
   - Response Times
   - Fehlerrate
   - Anzahl der Anfragen
   - Kosten-Tracking

## 💰 Kosten im Blick behalten

### GPT-4.1 Pricing
- **Input**: ~$10 pro 1M Tokens
- **Output**: ~$30 pro 1M Tokens

### Beispiel-Rechnung
- 1000 Chat-Nachrichten
- Durchschnittlich 100 Tokens Input + 200 Tokens Output
- **Kosten**: Ca. $7-10 pro 1000 Nachrichten

### Cost Management
1. Azure Portal → **Cost Management + Billing**
2. Richte **Budget Alerts** ein (z.B. bei €10/Monat)

## 🎉 Fertig!

Deine Website ist jetzt vollständig mit Azure OpenAI GPT-4.1 integriert!

### Features:
✅ Dynamische FAQ-Verwaltung via JSON
✅ Echter GPT-4.1 Chat-Assistent
✅ Modernes, responsives Design
✅ Pulsierender, auffälliger Chat-Button
✅ Fallback zu lokalen Antworten bei API-Ausfall
✅ CORS-fähig für GitHub Pages

## 🆘 Troubleshooting

### Function läuft nicht
```bash
# Logs checken
func azure functionapp logstream <FUNCTION-APP-NAME>
```

### CORS Fehler
Im Azure Portal → Function App → **CORS**:
- Füge hinzu: `https://paulgkwr.github.io`
- Oder `*` für alle Origins

### 401 Unauthorized
- Prüfe ob der API Key korrekt ist
- Prüfe ob der Deployment Name stimmt: `gpt-4.1`

### 429 Rate Limit
- Du hast das API-Limit erreicht
- Warte kurz oder erhöhe das Quota im Azure Portal
