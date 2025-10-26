# Alternative: ZIP Upload via Azure Portal

## Schritt 1: Erstelle Deployment ZIP
Komprimiere den Ordner `azure-function-v3` zu einer ZIP-Datei.

**PowerShell Befehl:**
```powershell
Compress-Archive -Path "E:\OneDrive\Desktop\VSCode\Frag_Erwin\azure-function-v3\*" -DestinationPath "E:\OneDrive\Desktop\VSCode\Frag_Erwin\function-deployment.zip" -Force
```

## Schritt 2: Azure Portal öffnen
1. Gehe zu: https://portal.azure.com
2. Melde dich mit dem **richtigen Account** an
3. Suche nach "fragerwinchatv2"
4. Öffne die Function App

## Schritt 3: Deployment via ZIP
1. In der Function App: Klicke links auf **"Deployment Center"**
2. Oder gehe direkt zu: **Advanced Tools → Go**
3. Das öffnet Kudu (mit richtigem Account)
4. In Kudu: Oben im Menü → **Tools** → **Zip Push Deploy**
5. Ziehe deine `function-deployment.zip` in den Upload-Bereich
6. Warte bis Upload fertig ist

## Schritt 4: Dependencies installieren
Nach dem ZIP Upload, in Kudu Console:
```bash
cd site\wwwroot
npm install
```

## Schritt 5: Restart
Azure Portal → Function App → Overview → **Restart**

---

Das sollte mit dem richtigen Account funktionieren!
