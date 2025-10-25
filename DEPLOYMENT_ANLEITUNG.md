# 🚀 Finalisierung - Was jetzt noch zu tun ist

## ✅ Was du bereits gemacht hast:

1. ✅ Function App erstellt: `fragerwinbe-b2h0dghuc6fscpam.eastus-01.azurewebsites.net`
2. ✅ Environment Variables in Azure gesetzt
3. ✅ JavaScript aktualisiert mit deiner Function App URL

## ⚠️ Problem: Function Code ist noch nicht deployed!

Die Function App existiert, aber der **Node.js Code ist noch nicht hochgeladen**.

## 🔧 Lösung: Code deployen

### Option 1: Via GitHub (Empfohlen)

Du hast gesagt, die Function App ist mit GitHub verbunden. Das bedeutet:

1. **Deployment Center prüfen**:
   - Gehe zu Azure Portal → deine Function App
   - Klicke links auf **Deployment Center**
   - Prüfe ob GitHub als Source konfiguriert ist

2. **Falls GitHub verbunden**:
   - Der Code wird automatisch deployed, sobald wir pushen
   - Gehe zu nächstem Schritt

3. **Falls NICHT verbunden**:
   - Klicke **Settings** → **Source**: GitHub
   - Autorisiere dein GitHub-Konto
   - Wähle Repository: `PaulGKWR/Frag_Erwin`
   - Branch: `main`
   - Pfad: `/azure-function` (wichtig!)
   - Save

### Option 2: Via VS Code (Schneller)

1. **Azure Functions Extension installieren**:
   - Öffne VS Code Extensions (Ctrl+Shift+X)
   - Suche: "Azure Functions"
   - Installiere: "Azure Functions" von Microsoft

2. **Deployen**:
   - Drücke F1 → "Azure Functions: Deploy to Function App"
   - Wähle deine Subscription
   - Wähle: `fragerwinbe-b2h0dghuc6fscpam`
   - Wähle Ordner: `azure-function`
   - Bestätige

3. **Fertig!** 🎉

### Option 3: Via Azure CLI

```bash
# Im Hauptverzeichnis
cd azure-function

# Dependencies installieren
npm install

# Deployen (ersetze mit deinem Function App Namen)
func azure functionapp publish fragerwinbe-b2h0dghuc6fscpam --javascript
```

## 📋 Nach dem Deployment

### 1. Testen:

```bash
# Health Check
curl https://fragerwinbe-b2h0dghuc6fscpam.eastus-01.azurewebsites.net/api/health
```

Erwartete Antwort:
```json
{"status":"healthy","service":"Frag Erwin Chat API","timestamp":"..."}
```

### 2. Chat Test:

```bash
curl -X POST https://fragerwinbe-b2h0dghuc6fscpam.eastus-01.azurewebsites.net/api/chat `
  -H "Content-Type: application/json" `
  -d '{"message":"Was sind Abwassergebühren?"}'
```

### 3. CORS konfigurieren (wichtig für GitHub Pages!):

1. Azure Portal → Function App → **CORS**
2. Füge hinzu:
   - `https://paulgkwr.github.io`
   - Oder `*` (für alle Origins)
3. Save

### 4. Website pushen:

```bash
git add script.js
git commit -m "✨ Function App URL aktualisiert"
git push origin main
```

### 5. Website testen:

1. Öffne: https://paulgkwr.github.io/Frag_Erwin/
2. Hard Refresh: Ctrl+F5
3. Klicke auf den roten Chat-Button
4. Stelle eine Frage
5. Du solltest GPT-4.1 Antworten bekommen! 🎉

## 🔍 Troubleshooting

### "404 Not Found" beim Health Check?
→ **Code ist noch nicht deployed** (siehe Optionen oben)

### "500 Internal Server Error"?
→ Prüfe Azure Portal → Function App → **Log stream**
→ Wahrscheinlich fehlen Environment Variables

### "CORS Error" im Browser?
→ Azure Portal → Function App → **CORS** → Füge `https://paulgkwr.github.io` hinzu

### Chat zeigt nur Fallback-Antworten?
→ Öffne Browser DevTools (F12) → Console
→ Schau nach Fehlermeldungen

## 📊 Deployment prüfen

### Azure Portal:

1. Gehe zu deiner Function App
2. Klicke links auf **Functions**
3. Du solltest sehen:
   - ✅ `chat` (HTTP Trigger)
   - ✅ `health` (HTTP Trigger)

Falls nicht → Code ist nicht deployed!

## 🎯 Zusammenfassung

| Schritt | Status | Aktion |
|---------|--------|--------|
| Function App erstellt | ✅ Fertig | - |
| Environment Variables gesetzt | ✅ Fertig | - |
| JavaScript aktualisiert | ✅ Fertig | - |
| **Code deployen** | ⚠️ **TODO** | **Option 1, 2 oder 3 oben** |
| CORS konfigurieren | ⚠️ TODO | Nach Deployment |
| Git Push | ⚠️ TODO | `git push origin main` |
| Website testen | ⚠️ TODO | Nach Git Push |

## 🚀 Schnellste Lösung: VS Code Extension

**Empfehlung**: Nutze VS Code Azure Functions Extension (Option 2)
- **Vorteil**: Automatisch richtige Konfiguration
- **Dauer**: ~2 Minuten
- **Einfach**: Klick, Klick, Fertig

Nach Installation der Extension:
1. F1 → "Azure Functions: Deploy to Function App"
2. Wähle Function App
3. Wähle `azure-function` Ordner
4. Fertig!
