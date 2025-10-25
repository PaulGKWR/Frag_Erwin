# 🔐 Environment Variables & Keys - Übersicht

## ⚠️ WICHTIG: Sicherheit

Die API Keys sind aktuell in den Dateien gespeichert. Diese Dateien werden **NICHT** zu GitHub gepusht (durch .gitignore geschützt).

## 📁 Wo sind die Keys?

### 1. **Für lokale Entwicklung:**

**Datei: `azure-function/.env`**
```env
AZURE_OPENAI_ENDPOINT=https://frag-erwin.openai.azure.com/
AZURE_OPENAI_KEY=<DEIN_API_KEY_HIER>
AZURE_OPENAI_DEPLOYMENT=gpt-4.1
AZURE_OPENAI_API_VERSION=2025-01-01-preview
```

**Datei: `azure-function/local.settings.json`**
- Gleiche Values wie .env
- Spezifisch für Azure Functions Core Tools

### 2. **Für Produktion (Azure):**

Die Keys müssen in Azure Portal eingetragen werden:

1. Gehe zu [Azure Portal](https://portal.azure.com)
2. Suche deine **Function App** (z.B. `frag-erwin-func`)
3. Klicke auf **Configuration**
4. Unter **Application settings** klicke **New application setting**
5. Füge jede Variable einzeln hinzu:

| Name | Value |
|------|-------|
| `AZURE_OPENAI_ENDPOINT` | `https://frag-erwin.openai.azure.com/` |
| `AZURE_OPENAI_KEY` | `<DEIN_API_KEY_HIER>` |
| `AZURE_OPENAI_DEPLOYMENT` | `gpt-4.1` |
| `AZURE_OPENAI_API_VERSION` | `2025-01-01-preview` |

6. Klicke **Save** und dann **Continue**

## 🔒 Sicherheits-Best Practices

### ✅ Was ist geschützt:

- ✅ `.env` ist in `.gitignore` → wird NICHT zu GitHub gepusht
- ✅ `local.settings.json` ist in `.gitignore` → wird NICHT zu GitHub gepusht
- ✅ Keys sind nur in Azure Portal für Produktion

### ⚠️ Was du beachten musst:

1. **Teile die Keys nie öffentlich**
2. **Rotiere Keys regelmäßig** (alle 90 Tage)
3. **Überwache die Nutzung** im Azure Portal

## 🔄 Keys rotieren (alle 3 Monate empfohlen)

1. Azure Portal → **Azure OpenAI** → **Keys and Endpoint**
2. Klicke **Regenerate Key 1** oder **Regenerate Key 2**
3. Kopiere den neuen Key
4. Aktualisiere:
   - Lokal: `azure-function/.env`
   - Azure: Function App → Configuration → Application settings
5. Speichern und Funktion neu starten

## 🚨 Falls ein Key kompromittiert wurde

1. **Sofort**: Gehe zu Azure Portal → Azure OpenAI → Keys and Endpoint
2. Klicke **Regenerate** für beide Keys
3. Aktualisiere alle Konfigurationen mit dem neuen Key
4. Prüfe die Usage-Logs auf ungewöhnliche Aktivität

## 📊 Monitoring

### Kosten überwachen:

1. Azure Portal → **Cost Management + Billing**
2. Erstelle ein Budget-Alert (z.B. €10/Monat)
3. Du bekommst Email bei 80%, 90%, 100%

### API-Nutzung überwachen:

1. Azure Portal → **Azure OpenAI** → **Metrics**
2. Schaue dir an:
   - Total Requests
   - Total Tokens
   - Failed Requests

## 🎯 Zusammenfassung

| Was | Wo | Zweck |
|-----|-----|-------|
| `.env` | Lokal auf deinem PC | Lokale Entwicklung |
| `local.settings.json` | Lokal auf deinem PC | Azure Functions Core Tools |
| Application Settings | Azure Portal | Produktion/Live-System |
| Code (`index.js`) | GitHub | **KEINE Keys!** Nur `process.env.*` |

**Regel**: Keys gehören NIEMALS in den Code, immer nur in Environment Variables!
