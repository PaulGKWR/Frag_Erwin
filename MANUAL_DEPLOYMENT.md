# Manual Deployment Instructions

## Problem
GitHub Actions schlägt fehl weil npm install die Azure SDKs nicht installieren kann.

## Lösung: Azure Portal Kudu Console

### Schritt 1: Öffne Kudu Console
1. Gehe zu Azure Portal
2. Öffne Function App "fragerwinchatv2"
3. Klicke auf "Advanced Tools" (Kudu)
4. Klicke "Go →"
5. Oben im Menü: "Debug console" → "CMD"

### Schritt 2: Navigiere zu wwwroot
```bash
cd site\wwwroot
```

### Schritt 3: Installiere Dependencies
```bash
npm install @azure/data-tables@13.2.2 @azure/storage-blob@12.17.0 --save
```

### Schritt 4: Erstelle die neuen Ordner
```bash
mkdir statistics
mkdir faq-manager  
mkdir document-manager
mkdir shared
```

### Schritt 5: Erstelle die Dateien manuell

Du kannst die Dateien aus deinem lokalen Projekt kopieren:
- `azure-function-v3/shared/*` → `site/wwwroot/shared/`
- `azure-function-v3/statistics/*` → `site/wwwroot/statistics/`
- `azure-function-v3/faq-manager/*` → `site/wwwroot/faq-manager/`
- `azure-function-v3/document-manager/*` → `site/wwwroot/document-manager/`

**ODER** nutze die Drag & Drop Upload-Funktion in Kudu Console!

### Schritt 6: Restart Function App
Im Azure Portal: Function App → Overview → "Restart"

---

## Alternative: GitHub Actions Secret aktualisieren

Wenn du ein neues Publish Profile erstellt hast:

1. Azure Portal → Function App → "Get publish profile"
2. GitHub → Repository → Settings → Secrets → Actions
3. Update Secret: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
4. Trigger neues Deployment

---

## Schnellste Lösung: VS Code Extension

1. Installiere "Azure Functions" Extension in VS Code
2. Sign in to Azure
3. Right-click auf "azure-function-v3" Ordner
4. "Deploy to Function App..."
5. Wähle "fragerwinchatv2"

Dependencies werden automatisch installiert! ✅
