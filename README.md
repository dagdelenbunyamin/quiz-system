# Modern Quiz App

Eine moderne Quiz-Anwendung für Schulen und Klassenarbeiten, entwickelt mit Next.js, React, Tailwind CSS und Framer Motion.

## Funktionen

- Interaktives Quiz mit mehreren Antwortmöglichkeiten
- Timer für jede Frage
- Motivierende Nachrichten während des Tests
- Detaillierte Ergebnisauswertung mit Visualisierungen
- Admin-Bereich zum Verwalten von Fragen
- Responsive Design für alle Geräte

## Projektstruktur

- `app/`: Next.js App Router Komponenten
  - `page.tsx`: Startseite
  - `quiz/page.tsx`: Quiz-Interface
  - `results/page.tsx`: Ergebnisseite
  - `admin/page.tsx`: Admin-Bereich
  - `actions/question-actions.ts`: Server Actions für die Fragenverwaltung
- `components/`: React-Komponenten
  - `quiz/`: Quiz-bezogene Komponenten
  - `results/`: Ergebnis-bezogene Komponenten
  - `admin/`: Admin-bezogene Komponenten
  - `ui/`: UI-Komponenten (shadcn/ui)
- `questions.json`: Datei mit allen Quizfragen

## Fragen verwalten

Die Fragen werden in der Datei `questions.json` im Hauptverzeichnis des Projekts gespeichert. Diese Datei hat folgendes Format:

\`\`\`json
[
  {
    "id": 1,
    "question": "Fragentext",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOption": 0,
    "category": "Kategorie"
  },
  // weitere Fragen...
]
\`\`\`

Du kannst diese Datei direkt bearbeiten oder den Admin-Bereich verwenden, um Fragen hinzuzufügen, zu bearbeiten oder zu löschen.

## Admin-Bereich

Der Admin-Bereich ist unter `/admin` erreichbar. Das Standardpasswort ist "admin", kann aber über die Umgebungsvariable `ADMIN_PASSWORD` geändert werden.

## Entwicklung

1. Klone das Repository
2. Installiere die Abhängigkeiten: `npm install`
3. Starte den Entwicklungsserver: `npm run dev`
4. Öffne [http://localhost:3000](http://localhost:3000) im Browser

## Deployment

1. Baue die Anwendung: `npm run build`
2. Starte den Produktionsserver: `npm start`

## Lizenz

MIT
