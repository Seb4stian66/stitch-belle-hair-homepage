const fs = require('fs');
const path = require('path');

console.log("\n[1/2] 🚀 Starte Template-Generierung aus kunden_daten.json...\n");

try {
    const rawData = fs.readFileSync(path.join(__dirname, '../kunden_daten.json'), 'utf8');
    const kundendaten = JSON.parse(rawData);

    let html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    
    console.log("-> Ersetze Platzhalter in index.html...");
    
    for (const key of Object.keys(kundendaten)) {
        if (!key.startsWith('_')) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, kundendaten[key] || '');
        }
    }
    
    fs.writeFileSync(path.join(__dirname, '../public/index.html'), html, 'utf8');
    console.log("✓ index.html komplett individualisiert!");

    if (kundendaten.GOOGLE_PLACE_ID && kundendaten.GOOGLE_API_KEY) {
        let envData = `GOOGLE_PLACE_ID=${kundendaten.GOOGLE_PLACE_ID}\nGOOGLE_API_KEY=${kundendaten.GOOGLE_API_KEY}\n`;
fs.writeFileSync(path.join(__dirname, '../.env'), envData, 'utf8');
        console.log("✓ .env gesichert (Reviews + Maps Key)!");
    } else {
        console.log("⚠ Keine Google API Daten in der JSON. Bewertungen und Karte bleiben leer.");
    }
    
} catch (error) {
    console.error("❌ Kritischer Fehler beim Template-Erstellen:", error.message);
}
