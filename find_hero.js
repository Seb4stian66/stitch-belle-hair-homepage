const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');

(async () => {
    const browser = await puppeteer.launch({headless: 'new', args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // Attempt to scrape Unsplash for 'cornrows'
    await page.goto('https://unsplash.com/s/photos/cornrows', {waitUntil: 'networkidle2'});
    let urls = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img[src*="images.unsplash.com/photo-"]')).map(img => img.src);
    });
    
    if(urls.length < 2) {
        // Fallback to dreadlocks
        await page.goto('https://unsplash.com/s/photos/dreadlocks', {waitUntil: 'networkidle2'});
        urls = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('img[src*="images.unsplash.com/photo-"]')).map(img => img.src);
        });
    }

    if(urls.length < 2) {
        // Fallback to braids
        await page.goto('https://unsplash.com/s/photos/braids', {waitUntil: 'networkidle2'});
        urls = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('img[src*="images.unsplash.com/photo-"]')).map(img => img.src);
        });
    }

    if (urls.length > 0) {
        // Find a good landscape image by picking the second or third one to avoid UI elements
        let rawUrl = urls[2] || urls[1] || urls[0];
        // Strip the width/height parameters to get max resolution, then ask for 1920 width
        let highResUrl = rawUrl.split('?')[0] + '?q=80&w=1920&auto=format&fit=crop';
        console.log("Downloading High-Res Image:", highResUrl);
        
        const file = fs.createWriteStream("public/images/hero_cornrows.jpg");
        https.get(highResUrl, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log("Downloaded hero_cornrows.jpg successfully.");
            });
        });
    } else {
        console.log("Failed to find images.");
    }

    await browser.close();
})();
