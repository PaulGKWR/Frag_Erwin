# Deployment Anleitung - in_scope Fix

## Problem
Die Azure Function gibt "Die angeforderten Informationen wurden nicht in den abgerufenen Daten gefunden" zurück, weil `in_scope: true` gesetzt ist.

## Lösung
Die Datei `frag-erwin-v3-inscope-false.zip` enthält die aktualisierte Function mit `in_scope: false`.

## Manuelles Deployment via Azure Portal

1. Öffne: https://portal.azure.com
2. Navigiere zu: Function App → **fragerwinchatv2**
3. Im linken Menü: **Deployment Center**
4. Wähle: **ZIP Deploy** (oder **Advanced Tools** → **Kudu** → **Tools** → **Zip Push Deploy**)
5. Upload: `E:\OneDrive\Desktop\VSCode\Frag_Erwin\frag-erwin-v3-inscope-false.zip`

## Alternative: PowerShell mit Credentials

```powershell
$creds = Get-Credential
Invoke-WebRequest -Uri "https://fragerwinchatv2.scm.azurewebsites.net/api/zipdeploy" `
    -Method POST `
    -InFile "E:\OneDrive\Desktop\VSCode\Frag_Erwin\frag-erwin-v3-inscope-false.zip" `
    -Headers @{ "Content-Type" = "application/zip" } `
    -Credential $creds `
    -UseBasicParsing
```

## Was wurde geändert

In `azure-function-v3/chat/index.js`:
```javascript
// Vorher:
const searchInScope = (process.env.AZURE_SEARCH_IN_SCOPE || 'true').toLowerCase() !== 'false';

// Nachher:
const searchInScope = false; // Allow answers even when no documents are found
```

Dies erlaubt dem Assistenten, auch mit seinem allgemeinen Wissen zu antworten, wenn keine Dokumente im Index gefunden werden, während er trotzdem Citations anzeigt, wenn welche gefunden werden.
