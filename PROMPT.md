# 🤖 MASTER PROMPT: Salon Website Template Generation

**LIEBE KI:** Wenn der Nutzer dir dieses Projekt übergibt und dich bittet, die Website für einen neuen Salon-Kunden zu generieren, **MUSST du exakt nach den folgenden strengen Regeln arbeiten**, die in vergangenen Projekten hart erlernt wurden:

## 1. Daten-Extraktion & Platzhalter (kunden_daten.json)
- Lies die Datei `kunden_daten.json` aus.
- Öffne die dort hinterlegte Website und das Instagram/Facebook-Profil.
- Analysiere die Dienstleistungen, Preise, Kontaktadressen und das Impressum.
- Überschreibe **alle** `{{PLATZHALTER}}` in der `public/index.html` mit den echten Daten. Nichts darf übrig bleiben. Fehlt eine Info, frage den Nutzer aktiv danach.

## 2. Zielgruppe & Farbgebung (WICHTIG!)
- Analysiere das Geschäft: Ist es ein klassischer **Barbershop** (hauptsächlich Männer) oder ein **Damen-/Premium-Salon**?
- **Damen-/Premium-Salon:** Behalte die aktuellen warmen Luxury-Farben (Beige, Gold, Amber) in der `index.html` und der Tailwind-Konfiguration bei.
- **Barbershop:** Ändere das gesamte Farbschema in `index.html` (im Tailwind `<script>` Container) auf maskulinere Farben (z.B. dunkles Schiefergrau, kühles Schwarz, holzige Braun-Töne oder klassisches Barber-Rot/Blau/Weiß). Auch die Schriftarten dürfen markanter/kerniger gewählt werden.

## 3. Logo-Extraktion & Veredelung
- Versuche das Logo in Höchstauflösung von der bisherigen Website zu laden.
- Falls die Qualität zu schlecht ist: **Extrahiere das Instagram-Profilbild.**
- Nutze Python/Pillow oder KI-Tools, um das Bild **hochzuskalieren (Upscaling)** und zwingend den **Hintergrund zu entfernen**, sodass der Schriftzug/das Icon professionell "schwebt" (transparentes PNG). Das Logo in der Navbar und im Hero-Bereich MUSS fließend und ohne schwarzen oder weißen Kasten aussehen.

## 4. Galerie & Bild-Formatierung (KRITISCH!)
- Extrahiere ca. 10 aktuelle, echte Bilder aus dem Instagram/Facebook-Feed.
- **GEFAHR:** Filtere strikt "Hintergrund-Tafeln", Facebook-Text-Posts, Sprüche oder reine Farbverläufe heraus (Gradients). Verwende *ausschließlich* echte Fotos von Haaren/Menschen! Nutze ggf. Python (`ImageStat.Stat(img).stddev`), um Bilder mit zu geringer Varianz (Gradients) direkt zu löschen.
- **Richtiges Framing:** Die Bilder dürfen **niemals gequetscht oder verzerrt** werden. Setze den Container des Sliders *nicht* auf absolute Höhen. Weise den Bildern/Slider-Elementen zwingend die CSS-Klassen `aspect-[4/5] object-cover` oder `aspect-square object-cover` zu, damit sie das professionelle Instagram-Hochformat perfekt nachahmen.

## 5. Deployment
- Wenn du fertig bist, teste den lokalen Build.
- Alle Bewertungen müssen via `api/reviews.js` unsichtbar durch das Vercel Serverless Backend laufen.
- Fordere den Nutzer auf, das Projekt via Vercel komplett (nicht nur den public-Ordner!) zu pushen, sobald er zufrieden ist.
