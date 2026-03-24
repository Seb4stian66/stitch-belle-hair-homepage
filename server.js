const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.static('public')); // Serves the files from the public folder (e.g. index.html)
app.use(express.json());

// Example Route: Get Google Reviews
// This is securely acting as a proxy. The API Key is hidden in the server environment.
app.get('/api/reviews', async (req, res) => {
    try {
        const placeId = process.env.GOOGLE_PLACE_ID;
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!placeId || !apiKey) {
            console.error('[BEWERTUNGEN] Fehler: API Keys fehlen in der .env Datei!');
            return res.status(500).json({ error: 'API Keys missing in backend.' });
        }

        console.log('[BEWERTUNGEN] Rufe echte Google-Bewertungen ab für Place ID:', placeId);
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=de`;

        const response = await axios.get(url);
        
        let result = response.data.result;
        
        // Bereinigung der Antwort (Filtert nur 4 und 5 Sterne Google-Bewertungen, wie bei Top Cut)
        if (result && result.reviews) {
            const alteAnzahl = result.reviews.length;
            result.reviews = result.reviews.filter(r => r.rating >= 4);
            console.log(`[BEWERTUNGEN] Filter aktiv: ${result.reviews.length} (von ursprünglich ${alteAnzahl}) beste Bewertungen gefunden.`);
        }

        // Send the safe, filtered data to the frontend
        res.json(result);
    } catch (error) {
        console.error('[BEWERTUNGEN] Schwerer Fehler beim Abrufen der API:', error.message);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Example Route: Get Instagram/Facebook logic (if needed) or Calendar logic
app.get('/api/calendar', async (req, res) => {
    // Add logic here to fetch from Calendar API
    res.json({ message: 'Calendar data will be here.' });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
