# ✅ Setup Zusammenfassung - Frag Erwin

## 📦 Was wurde erstellt?

### 1. **Environment Variables (Keys sind SICHER!)**

✅ **Lokal** (auf deinem PC, NICHT in GitHub):
- `azure-function/.env` - Deine API Keys für lokale Tests
- `azure-function/local.settings.json` - Azure Functions Settings

✅ **Git Schutz**:
- `.gitignore` verhindert, dass Keys zu GitHub gelangen
- GitHub Secret Scanning hat uns geschützt

⚠️ **Für Azure Produktion**:
- Keys müssen manuell im Azure Portal eingetragen werden (siehe unten)

### 2. **Node.js Azure Function**

📁 Dateien:
```
azure-function/
├── .env                    ← Deine Keys (lokal, nicht in Git)
├── .gitignore             ← Schützt sensitive Dateien
├── local.settings.json    ← Azure Functions Settings (lokal, nicht in Git)
├── package.json           ← Node.js Dependencies
├── host.json              ← Function App Konfiguration
├── README.md              ← Deployment-Anleitung
└── src/
    └── functions/
        └── index.js       ← Haupt-Code (KEINE Keys!)
```

### 3. **Code Details**

✅ **Sicher**: Keys werden über `process.env.*` geladen
✅ **CORS aktiviert**: Funktioniert mit GitHub Pages
✅ **2 Endpoints**:
- `/api/chat` - GPT-4.1 Chat
- `/api/health` - Status Check

## 🚀 Nächste Schritte

### Schritt 1: Function App Name herausfinden

1. Gehe zu [Azure Portal](https://portal.azure.com)
2. Suche nach **"Function App"** oder **"frag-erwin"**
3. Kopiere die URL, z.B.: `frag-erwin-func.azurewebsites.net`

### Schritt 2: Keys in Azure setzen

1. Öffne deine Function App im Azure Portal
2. Klicke links auf **Configuration**
3. Unter **Application settings** klicke **+ New application setting**
4. Füge jede Variable einzeln hinzu:

```
Name: AZURE_OPENAI_ENDPOINT
Value: https://frag-erwin.openai.azure.com/
```

```
Name: AZURE_OPENAI_KEY
Value: <DEIN_API_KEY_HIER>
```

```
Name: AZURE_OPENAI_DEPLOYMENT
Value: gpt-4.1
```

```
Name: AZURE_OPENAI_API_VERSION
Value: 2025-01-01-preview
```

5. Klicke **Save** → **Continue**
6. Die Function App startet neu (dauert ~30 Sekunden)

### Schritt 3: Frontend aktualisieren

Öffne `script.js` und ersetze:

```javascript
const AZURE_FUNCTION_URL = 'https://DEINE-FUNCTION-APP.azurewebsites.net/api/chat';
```

Mit deiner echten URL:

```javascript
const AZURE_FUNCTION_URL = 'https://frag-erwin-func.azurewebsites.net/api/chat';
```

Dann:
```bash
git add script.js
git commit -m "✨ Function App URL hinzugefügt"
git push origin main
```

### Schritt 4: Testen

**Health Check:**
```bash
curl https://frag-erwin-func.azurewebsites.net/api/health
```

Erwartete Antwort:
```json
{"status":"healthy","service":"Frag Erwin Chat API","timestamp":"..."}
```

**Chat Test:**
```bash
curl -X POST https://frag-erwin-func.azurewebsites.net/api/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"Was sind Abwassergebühren?\"}"
```

**Website Test:**
1. Öffne https://paulgkwr.github.io/Frag_Erwin/
2. Klicke auf den roten Chat-Button
3. Stelle eine Frage
4. Du solltest GPT-4.1 Antworten bekommen! 🎉

## 🔍 Wo sind die Keys?

| Datei | Zweck | In GitHub? |
|-------|-------|------------|
| `azure-function/.env` | Lokale Entwicklung | ❌ Nein (geschützt) |
| `azure-function/local.settings.json` | Azure Functions Tools | ❌ Nein (geschützt) |
| Azure Portal → Configuration | Produktion | ❌ Nein (nur in Azure) |
| `azure-function/src/functions/index.js` | Code | ✅ Ja (ABER: keine Keys!) |

## 📚 Dokumentation

- `ENVIRONMENT_VARIABLES.md` - Alles über Keys & Sicherheit
- `AZURE_INTEGRATION.md` - Detaillierte Setup-Anleitung
- `azure-function/README.md` - Function-spezifische Infos
- `FAQ_BEARBEITEN.md` - FAQs bearbeiten ohne Code

## ✅ Checkliste

- [x] Node.js Azure Function erstellt
- [x] Environment Variables konfiguriert
- [x] Keys aus GitHub entfernt (Sicherheit)
- [x] .gitignore eingerichtet
- [ ] Function App URL in script.js eintragen (↑ Schritt 3)
- [ ] Keys in Azure Portal setzen (↑ Schritt 2)
- [ ] Testen (↑ Schritt 4)

## 🆘 Hilfe benötigt?

**Frage 1: "Wo finde ich meine Function App URL?"**
→ Azure Portal → Function App → Overview → URL

**Frage 2: "Wie teste ich lokal?"**
→ `cd azure-function` → `npm install` → `npm start`

**Frage 3: "Keys sind exposed in GitHub History?"**
→ Keine Sorge! Wir haben sie vor dem Push entfernt. Aber du solltest trotzdem den Key rotieren:
   - Azure Portal → Azure OpenAI → Keys and Endpoint → Regenerate

**Frage 4: "Function App zeigt Fehler?"**
→ Azure Portal → Function App → Log stream (siehe Echtzeit-Logs)

## 🎉 Fertig!

Sobald Schritt 2 und 3 erledigt sind, hast du:
- ✅ Vollständig funktionierende Website mit GPT-4.1 Chat
- ✅ Sichere Key-Verwaltung
- ✅ Dynamische FAQ-Verwaltung
- ✅ Modernes Design mit pulsierendem Chat-Button
