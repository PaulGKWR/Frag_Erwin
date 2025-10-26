# Azure Function Deployment Anleitung

## 📋 Übersicht

Das komplette Admin-System mit folgenden Features wurde implementiert:

### ✅ Backend (Azure Functions)
- **Question Tracking**: Automatisches Tracking jeder Chat-Frage
- **FAQ Management**: CRUD-Operationen für FAQ-Paare
- **Statistics API**: Liefert Statistiken und Analytics
- **Document Manager**: Upload/Download/Delete für Blob Storage

### ✅ Frontend
- **Admin Dashboard** (`/admin/dashboard.html`): Statistiken, Charts, Top-Fragen
- **FAQ Manager** (`/admin/faq-manager.html`): FAQ-Verwaltung
- **Document Upload** (`/admin/documents.html`): Dokument-Management
- **Login-Seite** (`/admin/index.html`): Passwortschutz (ErwinAdmin2025!)
- **FAQ-Filtering**: Dropdown mit "Am häufigsten genutzt" + Pagination (6/Seite)

---

## 🚀 Deployment Schritte

### 1. Environment Variables im Azure Portal hinzufügen

Gehe zu deiner Azure Function App im Azure Portal:
**Function App → Configuration → Application settings**

Füge folgende neue Environment Variables hinzu:

```
AZURE_STORAGE_CONNECTION_STRING=<Deine Azure Storage Connection String>

ADMIN_PASSWORD=ErwinAdmin2025!
```

**Hinweis:** Die Connection String findest du im Azure Portal unter:
Storage Account → Access keys → Connection string

**Wichtig:** Nach dem Hinzufügen auf "Save" klicken und die Function App wird neu gestartet.

---

### 2. Dependencies installieren

Die neuen Dependencies wurden bereits in `package.json` hinzugefügt:
- `@azure/data-tables` (für Table Storage)
- `@azure/storage-blob` (für Blob Upload)

Diese werden automatisch beim Deployment installiert.

---

### 3. Deployment via GitHub Actions

Da du bereits GitHub Actions eingerichtet hast, wird das Deployment automatisch ausgelöst durch den Push.

**Überprüfe den Deployment Status:**
1. Gehe zu: https://github.com/PaulGKWR/Frag_Erwin/actions
2. Warte bis der Workflow "Build and deploy Node.js project to Azure Function App" abgeschlossen ist
3. Status sollte "✅ Success" sein

---

### 4. Table Storage wird automatisch erstellt

Die beiden Tables werden beim ersten API-Aufruf automatisch erstellt:
- **QuestionTracking**: Speichert jede Chat-Frage
- **FAQManagement**: Speichert alle FAQ-Paare

Keine manuelle Erstellung nötig! ✨

---

## 🧪 Testing

### Admin-Seite aufrufen:
```
https://frag-erwin.info/admin/
```

**Login-Daten:**
- Passwort: `ErwinAdmin2025!`

### API-Endpoints testen:

**1. Statistics (benötigt Passwort):**
```
GET https://fragerwinchatv2.azurewebsites.net/api/statistics?action=statistics&password=ErwinAdmin2025!
```

**2. FAQ Liste (öffentlich):**
```
GET https://fragerwinchatv2.azurewebsites.net/api/faq-manager?action=listPaginated&page=1&pageSize=6
```

**3. Dokumente auflisten (benötigt Passwort):**
```
GET https://fragerwinchatv2.azurewebsites.net/api/document-manager?action=list&password=ErwinAdmin2025!
```

---

## 📊 Admin Features

### Dashboard (`/admin/dashboard.html`)
- **Statistik-Cards**: Gesamtfragen, Heute, Dieser Monat, Ø pro Tag
- **Charts**: 
  - Tagesstatistik (letzte 30 Tage)
  - Stundenstatistik (0-23 Uhr)
- **Top 10 Fragen**: Mit Anzahl der Aufrufe

### FAQ Manager (`/admin/faq-manager.html`)
- ✏️ FAQs erstellen/bearbeiten
- 🗑️ FAQs löschen
- ✅ FAQs aktivieren/deaktivieren
- 📊 View Count pro FAQ
- 🏷️ Kategorien zuweisen

### Document Manager (`/admin/documents.html`)
- 📤 Drag & Drop Upload
- 📂 Datei-Browser
- 📄 Dokumente auflisten
- 🗑️ Dokumente löschen
- 🔗 Download-Links

---

## 🎨 Frontend FAQ-Integration

Die Hauptseite (`index.html`) wurde erweitert mit:

**1. Filter-Dropdown:**
- "Alle anzeigen"
- "⭐ Am häufigsten genutzt" (sortiert nach viewCount)

**2. Pagination:**
- 6 FAQs pro Seite
- Vor/Zurück Buttons
- Seitenzahlen mit Ellipsis (...)

**3. Top-Badges:**
- FAQs im "Am häufigsten genutzt" Filter zeigen ⭐ Top Badge

**4. View-Tracking:**
- Jedes Öffnen einer FAQ wird getrackt
- View Count wird automatisch erhöht

---

## 🔒 Sicherheit

**Passwort-Schutz:**
- Admin-Login per Session Storage
- Backend-APIs prüfen Passwort bei jedem Request
- Passwort: `ErwinAdmin2025!` (kannst du ändern in beiden Dateien)

**Öffentliche Endpoints:**
- `/api/faq-manager?action=list` (FAQ-Liste für Frontend)
- `/api/faq-manager?action=listPaginated` (mit Pagination)
- `/api/faq-manager?action=categories` (Kategorie-Liste)

**Geschützte Endpoints:**
- Alle `/api/statistics` Endpoints
- FAQ Create/Update/Delete
- Dokument-Management

---

## 💰 Kosten

**Azure Table Storage:**
- ~1€/Monat für Storage
- ~0.01€ pro 10.000 Transaktionen

**Geschätzte Gesamtkosten:** 1-2€/Monat (bei normalem Traffic)

---

## 🐛 Troubleshooting

### Problem: Admin-Seite zeigt "Unauthorized"
**Lösung:** Überprüfe ob `ADMIN_PASSWORD` Environment Variable gesetzt ist

### Problem: FAQs werden nicht geladen
**Lösung:** 
1. Überprüfe ob `AZURE_STORAGE_CONNECTION_STRING` gesetzt ist
2. Checke Browser Console für Fehler
3. Teste API direkt: `/api/faq-manager?action=list`

### Problem: Question Tracking funktioniert nicht
**Lösung:**
1. Überprüfe ob Table "QuestionTracking" existiert (wird automatisch erstellt)
2. Checke Azure Function Logs im Portal

### Problem: Dokument-Upload schlägt fehl
**Lösung:**
1. Überprüfe Dateigröße (max 10 MB)
2. Überprüfe Blob Container "fragerwinblob" existiert
3. Checke Connection String

---

## 📝 Nächste Schritte

1. ✅ Warte bis GitHub Actions Deployment fertig ist
2. ✅ Rufe Admin-Seite auf: `https://frag-erwin.info/admin/`
3. ✅ Login mit Passwort: `ErwinAdmin2025!`
4. ✅ Teste alle Features
5. ✅ Erstelle erste Test-FAQs im FAQ Manager
6. ✅ Überprüfe ob Question-Tracking funktioniert nach Chat-Nutzung

---

## 📞 Support

Bei Fragen oder Problemen:
1. Checke Browser Console (F12)
2. Checke Azure Function Logs im Portal
3. Überprüfe Environment Variables

---

**🎉 Das System ist komplett einsatzbereit!**

Sobald das GitHub Actions Deployment durch ist, kannst du direkt loslegen! 🚀
