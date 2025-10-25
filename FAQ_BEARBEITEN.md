# FAQs bearbeiten

## So können Sie die FAQ-Fragen und -Antworten bearbeiten

Die FAQ-Inhalte befinden sich in der Datei **`faq-data.json`** und können ohne Code-Kenntnisse bearbeitet werden.

### Anleitung zum Bearbeiten:

1. Öffnen Sie die Datei `faq-data.json` in einem Text-Editor (z.B. Notepad)
2. Bearbeiten Sie die Fragen und Antworten nach folgendem Schema:

```json
{
  "faqs": [
    {
      "id": 1,
      "frage": "Ihre Frage hier",
      "antwort": "<p>Ihre Antwort mit HTML-Tags</p><ul><li>Aufzählungspunkt</li></ul>"
    }
  ]
}
```

### Wichtige Hinweise:

- **ID**: Jede FAQ muss eine eindeutige ID haben (1, 2, 3, ...)
- **Frage**: Einfacher Text ohne HTML
- **Antwort**: Kann HTML enthalten:
  - `<p>Text</p>` für Absätze
  - `<ul><li>Punkt</li></ul>` für Aufzählungen
  - `<strong>Text</strong>` für fettgedruckten Text

### Neue FAQ hinzufügen:

Kopieren Sie einen bestehenden Block und fügen Sie ihn am Ende ein:

```json
    ,
    {
      "id": 7,
      "frage": "Neue Frage?",
      "antwort": "<p>Neue Antwort</p>"
    }
```

**WICHTIG**: Vergessen Sie nicht das Komma vor dem neuen Block!

### FAQ löschen:

Entfernen Sie den gesamten Block inklusive der geschweiften Klammern `{ }`.
Achten Sie auf Kommas - das letzte Element darf kein Komma am Ende haben!

### Nach dem Bearbeiten:

1. Speichern Sie die Datei
2. Laden Sie die Website neu (Ctrl+F5)
3. Die Änderungen sind sofort sichtbar

### OneDrive-Integration:

Sie können diese Datei in OneDrive speichern und von überall bearbeiten. Die Website lädt die Daten automatisch beim Öffnen.
