# Quick Deploy Instructions - Azure Portal Kudu

## Schritt 1: Öffne Kudu Console
1. Gehe zu: https://fragerwinchatv2.scm.azurewebsites.net
2. Login mit deinen Azure Credentials
3. Klicke oben auf: **Debug console** → **CMD**

## Schritt 2: Navigiere zu wwwroot
Führe aus:
```
cd site\wwwroot
```

## Schritt 3: Installiere Dependencies
Führe aus:
```
npm install @azure/data-tables@13.2.2 @azure/storage-blob@12.17.0 --save
```

Warte bis Installation fertig ist (ca. 1-2 Minuten).

## Schritt 4: Erstelle neue Ordner
Führe aus:
```
mkdir shared
mkdir statistics
mkdir faq-manager
mkdir document-manager
```

## Schritt 5: Upload Dateien
Jetzt kannst du per **Drag & Drop** die Dateien hochladen:

**Von deinem PC:**
```
E:\OneDrive\Desktop\VSCode\Frag_Erwin\azure-function-v3\shared\
```
**Nach Kudu:**
```
site\wwwroot\shared\
```

Wiederhole für:
- `statistics/` → `site\wwwroot\statistics\`
- `faq-manager/` → `site\wwwroot\faq-manager\`
- `document-manager/` → `site\wwwroot\document-manager\`

**Update auch die chat Function:**
- `chat/index.js` → `site\wwwroot\chat\index.js` (überschreiben)

## Schritt 6: Restart Function App
Zurück im Azure Portal:
1. Gehe zu Function App Overview
2. Klicke **"Restart"**

## Fertig! 🎉
Teste die APIs:
- https://fragerwinchatv2.azurewebsites.net/api/faq-manager?action=list
- https://frag-erwin.info/admin/

---

**Diese Methode dauert ca. 10 Minuten, ist aber 100% zuverlässig!**
