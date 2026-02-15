# Lesegeschwindigkeit Tracker

Eine App zum Tracken der Lesegeschwindigkeit und -genauigkeit mit Spracherkennung und OCR.

## Funktionen

- ✅ Text-Eingabe (manuell oder per Foto mit OCR)
- ✅ Echtzeit-Spracherkennung
- ✅ Automatische Berechnung von Geschwindigkeit & Genauigkeit
- ✅ Personalisierte Verbesserungstipps
- ✅ Mobile-optimiert

## Deployment auf Vercel (5 Minuten)

### Voraussetzungen
- GitHub Account
- Vercel Account (kostenlos)

### Schritt-für-Schritt Anleitung

#### 1. GitHub Repository erstellen
1. Gehe zu https://github.com/new
2. Repository Name: `reading-tracker` (oder beliebig)
3. Wähle "Public"
4. Klicke "Create repository"

#### 2. Code hochladen
Es gibt zwei Möglichkeiten:

**Option A: Über GitHub Web Interface (einfacher)**
1. Klicke auf "uploading an existing file"
2. Lade diese Dateien hoch:
   - `index.html`
   - `vercel.json`
3. Klicke "Commit changes"

**Option B: Über Git (wenn Git installiert ist)**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/reading-tracker.git
git push -u origin main
```

#### 3. Mit Vercel verbinden
1. Gehe zu https://vercel.com
2. Klicke "Sign Up" und wähle "Continue with GitHub"
3. Nach dem Login: Klicke "Add New..." → "Project"
4. Wähle dein `reading-tracker` Repository
5. Klicke "Import"
6. Klicke "Deploy" (keine Änderungen nötig)

#### 4. Fertig! 🎉
Nach 30-60 Sekunden ist deine App online.
Du bekommst eine URL wie: `https://reading-tracker-xxx.vercel.app`

### App auf dem Handy verwenden
1. Öffne die Vercel-URL in Chrome auf deinem Android
2. Optional: "Zum Startbildschirm hinzufügen" für schnellen Zugriff
3. Erlaube Mikrofon-Zugriff beim ersten Mal

## Wichtige Hinweise

### Browser-Kompatibilität
- **Beste Erfahrung**: Chrome oder Edge auf Android
- Spracherkennung benötigt Internet
- Mikrofon-Berechtigung muss erteilt werden

### OCR (Text aus Foto)
- Nutzt Claude API (eingebunden, keine zusätzlichen Kosten)
- Funktioniert am besten bei:
  - Guter Beleuchtung
  - Klarer Schrift
  - Flachem Aufnahmewinkel

### Fehlerbehebung

**Mikrofon funktioniert nicht:**
- Prüfe Browser-Berechtigungen (Einstellungen → Websites → Mikrofon)
- Stelle sicher, dass du HTTPS verwendest (Vercel macht das automatisch)
- Versuche Chrome/Edge statt anderem Browser

**OCR erkennt Text nicht:**
- Foto heller machen
- Näher herangehen
- Sicherstellen, dass Text scharf ist

**Spracherkennung ungenau:**
- Deutlicher und etwas langsamer sprechen
- Näher am Mikrofon sein
- Hintergrundgeräusche minimieren

## Weitere Entwicklung

Mögliche Verbesserungen für die Zukunft:
- Verlaufs-Speicherung (LocalStorage oder Datenbank)
- Mehrere Benutzerprofile
- Fortschritts-Diagramme
- Export der Ergebnisse
- Schwierigkeitsgrade für Texte

## Technische Details

- Reines Frontend (HTML/CSS/JavaScript)
- Web Speech API für Spracherkennung
- Claude API für OCR
- Keine Server-Kosten
- Funktioniert komplett im Browser
