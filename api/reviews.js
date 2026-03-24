const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const placeId = process.env.GOOGLE_PLACE_ID;
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!placeId || !apiKey) {
            console.error('[BEWERTUNGEN] Fehler: API Keys fehlen!');
            return res.status(500).json({ error: 'API Keys missing in backend environment.' });
        }

        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=de`;
        const response = await axios.get(url);
        
        let result = response.data.result;
        
        // Bereinigung der Antwort (Filtert nur 4 und 5 Sterne Google-Bewertungen)
        if (result && result.reviews) {
            result.reviews = result.reviews.filter(r => r.rating >= 4);
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('[BEWERTUNGEN] Schwerer Fehler beim Abrufen der API:', error.message);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};
