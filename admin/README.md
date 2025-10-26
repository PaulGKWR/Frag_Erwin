# 🔐 Erwin Admin System

Umfassendes Admin-Dashboard für die Verwaltung von FAQs, Dokumenten und Statistiken.

## 📍 Zugriff

**Admin-Portal:** https://frag-erwin.info/admin/

**Login-Passwort:** `ErwinAdmin2025!`

---

## 🎯 Features

### 📊 Dashboard
- Echtzeit-Statistiken (Gesamtfragen, Heute, Dieser Monat)
- Interaktive Charts (Tagesstatistik, Stundenstatistik)
- Top 10 häufigste Fragen
- Durchschnittliche Fragen pro Tag

### 📝 FAQ Manager
- ✏️ FAQs erstellen und bearbeiten
- 🗑️ FAQs löschen
- ✅ FAQs aktivieren/deaktivieren
- 🏷️ Kategorien zuweisen
- 📊 View Count tracking
- 🔍 Filter nach Kategorien

### 📄 Dokument-Manager
- 📤 Drag & Drop Upload
- 📂 Datei-Browser-Upload
- 📋 Dokumente auflisten
- 🗑️ Dokumente löschen
- 🔗 Download-Links
- 📏 Max. 10 MB pro Datei

### 🎨 Frontend-Integration
- Dropdown-Filter: "Am häufigsten genutzt"
- Pagination: 6 FAQs pro Seite
- ⭐ Top-Badges für häufige Fragen
- Automatisches View-Tracking

---

## 🛠️ Technische Details

### Backend APIs
```
/api/statistics - Statistiken & Analytics
/api/faq-manager - FAQ CRUD-Operationen
/api/document-manager - Dokument-Upload/Download/Delete
```

### Storage
- **Azure Table Storage:**
  - `QuestionTracking` - Alle Chat-Fragen
  - `FAQManagement` - FAQ-Paare
  
- **Azure Blob Storage:**
  - `fragerwinblob` - Dokumente für RAG

### Sicherheit
- Session-basiertes Login
- Passwortgeschützte Admin-APIs
- Öffentliche Endpoints für Frontend-FAQs

---

## 📖 Verwendung

### 1. Login
- Öffne https://frag-erwin.info/admin/
- Gib Passwort ein: `ErwinAdmin2025!`
- Du wirst zum Dashboard weitergeleitet

### 2. FAQ erstellen
1. Navigiere zu "FAQ Manager"
2. Klicke "+ Neue FAQ"
3. Fülle Frage, Antwort und Kategorie aus
4. Klicke "Speichern"

### 3. Dokument hochladen
1. Navigiere zu "Dokumente"
2. Ziehe Datei per Drag & Drop oder klicke auf Upload-Bereich
3. Wähle Datei aus (PDF, DOCX, TXT, MD)
4. Upload startet automatisch

### 4. Statistiken ansehen
- Dashboard zeigt automatisch alle Statistiken
- Charts werden live aktualisiert
- Top-Fragen zeigen Anzahl der Aufrufe

---

## 🔧 Konfiguration

### Passwort ändern
**Admin-Seiten (`admin/index.html`):**
```javascript
const ADMIN_PASSWORD = 'DeinNeuesPasswort123!';
```

**Azure Function Environment Variable:**
```
ADMIN_PASSWORD=DeinNeuesPasswort123!
```

### FAQ-Kategorien anpassen
Bearbeite `admin/faq-manager.html`:
```html
<select id="faq-category">
  <option value="Deine Kategorie">Deine Kategorie</option>
  ...
</select>
```

---

## 📱 Mobile Support

Alle Admin-Seiten sind responsive und funktionieren auf:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

---

## 🐛 Troubleshooting

**Problem:** Login funktioniert nicht  
**Lösung:** Lösche Browser-Cache und Session Storage

**Problem:** FAQs werden nicht geladen  
**Lösung:** Prüfe Browser Console (F12) auf Fehler

**Problem:** Dokument-Upload schlägt fehl  
**Lösung:** Überprüfe Dateigröße (max. 10 MB)

---

## 📞 Support

Bei technischen Problemen:
1. Prüfe Browser Console (F12)
2. Prüfe Azure Function Logs
3. Überprüfe Environment Variables

---

**Entwickelt mit ❤️ von KreativWerkstatt Ried**
