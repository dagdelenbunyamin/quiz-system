# 🧠 Modern Quiz App

Ein modernes, motivierendes Quizsystem für Schulen und Schüler – entwickelt mit **Next.js (App Router)**, **React**, **Tailwind CSS**, **Framer Motion** und **Recharts**.  
Alle Fragen werden lokal in einer `questions.json`-Datei gespeichert – kein Datenbankserver nötig.

---

## 🚀 Features

- ✅ Multiple-Choice-Quiz mit Zeitlimit
- 🎯 Visuelle Auswertung mit Kreisdiagramm
- 📱 Mobile-optimiertes UI (Tailwind + Framer Motion)
- 🔐 Admin-Bereich mit Passwortschutz
- 📝 Fragenverwaltung direkt über das Interface oder per JSON-Datei
- ⚙️ Schneller Start mit **pnpm**

---

## ⚙️ Schnellstart (lokal)

```bash
# 1. Projekt klonen
git clone https://github.com/dagdelenbunyamin/quiz-system.git
cd quiz-system

# 2. Abhängigkeiten installieren
pnpm install

# 3. Entwicklungsserver starten
pnpm run dev
```

Dann im Browser öffnen:  
🔗 http://localhost:3000

---

## 🔐 Admin-Bereich

Pfad:  
`/admin` → z. B. http://localhost:3000/admin

Zugang:  
```env
ADMIN_PASSWORD=admin
```
(setzbar in deiner `.env`-Datei)

---

## 📄 Fragenstruktur

Die Fragen werden in der Datei [`questions.json`](./questions.json) gespeichert. Beispiel:

```json
[
  {
    "id": "1",
    "question": "Welcher Berg ist der höchste der Welt?",
    "options": ["K2", "Mount Everest", "Zugspitze", "Mont Blanc"],
    "correctOption": 1,
    "category": "Geografie"
  }
]
```

---

## 📁 Projektstruktur

```bash
├── app/                # Next.js App Router Pages
├── components/         # UI-Komponenten
├── public/             # Statische Dateien
├── styles/             # Globale CSS-Dateien
├── questions.json      # Alle Quizfragen lokal gespeichert
├── .env                # Umgebungsvariablen (z. B. Admin-Passwort)
├── package.json        # Projektkonfiguration
├── tailwind.config.ts  # Tailwind-Setup
```

---

## 🌍 Deployment (optional)

Das Projekt ist bereit für Deployment mit Vercel oder anderen Node.js-fähigen Plattformen:

```bash
pnpm run build
pnpm start
```

---

## 📄 Lizenz

MIT License – frei verwendbar für Bildungs- und Entwicklungszwecke.

---

## ✨ Autor

**Bünyamin Dagdelen**  
[https://github.com/dagdelenbunyamin](https://github.com/dagdelenbunyamin)
