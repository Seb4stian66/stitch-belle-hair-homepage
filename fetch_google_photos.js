const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PLACE_ID = process.env.GOOGLE_PLACE_ID;
const API_KEY = process.env.GOOGLE_API_KEY;

async function downloadPhoto(photoReference, index) {
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&maxheight=1600&photo_reference=${photoReference}&key=${API_KEY}`;
    
    try {
        const response = await axios({
            url: photoUrl,
            method: 'GET',
            responseType: 'stream'
        });
        
        const dest = path.join(__dirname, 'public', 'images', `real_photo_${index}.jpg`);
        const writer = fs.createWriteStream(dest);
        
        response.data.pipe(writer);
        
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Failed to download photo ${index}:`, error.message);
    }
}

async function fetchPhotos() {
    console.log('Fetching place details for photos...');
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=photos&key=${API_KEY}`;
    
    try {
        const response = await axios.get(detailsUrl);
        const photos = response.data.result.photos;
        
        if (!photos || photos.length === 0) {
            console.log('No photos found for this place.');
            return;
        }
        
        console.log(`Found ${photos.length} photos. Downloading top 5...`);
        const limit = Math.min(5, photos.length);
        
        for (let i = 0; i < limit; i++) {
            console.log(`Downloading photo ${i + 1}...`);
            await downloadPhoto(photos[i].photo_reference, i + 1);
        }
        
        console.log('Done downloading real photos.');
    } catch (error) {
        console.error('Error fetching photos:', error.message);
    }
}

fetchPhotos();
