const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

async function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const client = url.startsWith('https') ? https : http;
        client.get(url, (response) => {
            if(response.statusCode >= 200 && response.statusCode < 300) {
                response.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
            } else if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                // handle redirect
                download(response.headers.location, dest).then(resolve).catch(reject);
            } else {
                reject(new Error('Status: ' + response.statusCode));
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

(async () => {
    console.log('Starting Puppeteer for IG scraping...');
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });
    
    let imageUrls = [];

    console.log('Navigating to dumpoir.com/v/belle_hair_by_mrs.fati ...');
    try {
        await page.goto('https://dumpoir.com/v/belle_hair_by_mrs.fati', { waitUntil: 'networkidle2', timeout: 30000 });
        
        imageUrls = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('.content img'));
            return images.map(img => img.src).filter(src => src && !src.includes('avatar'));
        });
        
    } catch(err) {
        console.log('Dumpoir failed. Trying picuki...');
        try {
            await page.goto('https://www.picuki.com/profile/belle_hair_by_mrs.fati', { waitUntil: 'networkidle2', timeout: 30000 });
            imageUrls = await page.evaluate(() => {
                const boxes = Array.from(document.querySelectorAll('.box-photo img'));
                return boxes.map(img => img.src).filter(Boolean);
            });
        } catch(e) {
            console.log('Picuki failed.');
        }
    }
    
    imageUrls = [...new Set(imageUrls)];
    console.log(`Found ${imageUrls.length} image URLs.`);

    const totalNeeded = Math.min(imageUrls.length, 12);
    for (let i = 0; i < totalNeeded; i++) {
        const dest = path.join(__dirname, 'public', 'images', `ig_photo_${i+1}.jpg`);
        console.log(`Downloading image ${i+1}: ${imageUrls[i]}`);
        try {
            await download(imageUrls[i], dest);
        } catch(e) { console.log('Failed:', e.message); }
    }
    
    await browser.close();
    console.log('Scraping finished!');
})();
