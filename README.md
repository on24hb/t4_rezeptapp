Bitte lesen Sie vorrangig die mitgelieferte Dokumenation des Projekts. Alle Informationen finden Sie noch detaillierter dort.

# MealMate - Persönliche Rezeptverwaltung

Eine Webanwendung zur Verwaltung persönlicher Rezepte, entwickelt mit **Vue.js 3** (Frontend) und **Deno** (Backend).

## Schnellstart (Empfohlen: Docker)

Die Anwendung ist als Docker Container konzipiert.

**Voraussetzung:** Docker Desktop ist installiert und läuft.

1.  Öffnen Sie ein Terminal in diesem Verzeichnis.
2.  Starten Sie die Anwendung:
    docker compose up --build
3.  Warten Sie, bis der Server gestartet ist.
4.  Öffnen Sie im Browser: **[https://localhost:8000]**
    * *Hinweis: Bitte akzeptieren Sie die Sicherheitswarnung für das lokal generierte Zertifikat.*
5.  Da keine öffentliche Registrierung implementiert ist, nutzen Sie bitte einen der Test-Accounts. Zu finden in der .env Datei oder der Dokumentation.

---

## Alternative: Manueller Start

Falls Docker nicht verfügbar ist, können Sie Frontend und Backend getrennt starten.
**Voraussetzungen:** Node.js und Deno sind installiert.

### 1. Backend starten
Wechseln Sie in das Verzeichnis server/:
cd server
deno task dev
Der Server läuft nun unter https://localhost:8000.

### 2. Frontend starten
Öffnen Sie ein neues Terminal und wechseln Sie in das Verzeichnis client/:

cd client
npm install
npm run dev
Das Frontend ist nun (meist) unter http://localhost:5173 erreichbar. Öffnen Sie diese Adresse.

Hinweise zur Sicherheit
Wichtiger Hinweis für Prüfende: In diesem Repository befinden sich bewusst die Dateien .env (mit Secrets) und *.pem (lokale Zertifikate). Dies dient ausschließlich der Vereinfachung der Korrektur und Inbetriebnahme. In einem produktiven Umfeld würden diese Dateien niemals committed werden (siehe .gitignore).

# Features der Anwendung:
CRUD: Erstellen, Lesen, Bearbeiten und Löschen von Rezepten.
Filter: Filtern nach Tags (z.B. "vegetarisch", "schnell").
Favoriten: Markieren von Lieblingsrezepten.