# 🤖 MASTER PROMPT FÜR EINEN NEUEN SALON 🤖

**Nutzer:** Kopiere ab hier den gesamten Text und schicke ihn an die KI, wenn du einen neuen Salon aufbauen willst! Fülle einfach vorher die beiden [KLAMMERN] aus.

---

Hallo KI, 
bitte erstelle mir aus dem `salon_template_master` Ordner eine komplett neue Kunden-Website. 

**Hier sind die Kundendaten:**
- Website des Salons: [TRAGE HIER DIE WEBSITE EIN]
- Instagram des Salons: [TRAGE HIER INSTAGRAM/FACEBOOK EIN]

**Deine genauen Arbeitsanweisungen:**
1. **Auslesen (Cognitive Phase):** Besuche die Links. Analysiere das gesamte Geschäft: Wie heißt der Salon? Was sind die Öffnungszeiten? Wo ist die Adresse? Wie lautet die Telefonnummer/E-Mail? Ermittle auch die Zielgruppe (Barbershop für Herren oder Damen/Premium). 
   *Suche unbedingt auch nach dem Link zur Facebook-Seite des Salons, falls vorhanden!*
2. **Daten eintragen:** Öffne die Datei `kunden_daten.json` und fülle ALLE leeren Keys mit deinen gefundenen Ergebnissen aus. Erfinde ansprechende Texte für `SALON_SLOGAN` und `HERO_SUBTITLE`. 
3. **Automatisierung auslösen:** Sobald die `kunden_daten.json` komplett gespeichert ist, führe im Terminal den Befehl `npm install` und danach `npm run setup` aus. Dieser Befehl ersetzt automatisch alle HTML-Platzhalter und lädt die echten Kunden-Bilder herunter.
4. **Design-Check:** Prüfe, ob bei `ZIELGRUPPE` ein Barbershop steht. Wenn ja, ändere die Tailwind-Farbkonfiguration in `index.html` manuell von Beige/Gold-Tönen auf dunklere, maskuline Farben.
5. **Logo & Hero-Bild:** Tausche die Bildpfade für das Logo und das Hero-Bild gegen echte Dateien (`.png` / `.jpg`) aus, die du aus dem Netz herunterlädst (Das Logo musst du ggf. per Python freistellen).
6. **Starten:** Führe abschließend `npm run dev` aus, damit ich mir den fertigen Prototypen live im Browser unter `localhost:3000` ansehen kann!
