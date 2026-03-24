const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const path = require('path');

async function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if(response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
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
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('Navigating to facebook homepage...');
    await page.goto('https://www.facebook.com/bellehairbyfati/', { waitUntil: 'networkidle2', timeout: 30000 });
    
    try {
        await page.evaluate(() => {
            let btns = Array.from(document.querySelectorAll('div[role="button"]'));
            let decline = btns.find(b => b.innerText && (b.innerText.includes('Decline') || b.innerText.includes('Optionen') || b.innerText.includes('Zustimmen')));
            if(decline) decline.click();
        });
    } catch(e){}

    // wait for text to render
    await new Promise(r => setTimeout(r, 2000));
    const pageText = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync('facebook_text.txt', pageText);
    console.log('Saved page text.');

    console.log('Navigating to facebook photos...');
    await page.goto('https://www.facebook.com/bellehairbyfati/photos/', { waitUntil: 'networkidle2', timeout: 30000 });
    
    for(let i=0; i<6; i++) {
        await page.evaluate(() => window.scrollBy(0, 2000));
        await new Promise(r => setTimeout(r, 1000));
    }
    
    let imageUrls = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.map(img => img.src).filter(src => src && src.includes('scontent') && !src.includes('emoji') && src.length > 50);
    });
    
    // To get high-res images from Facebook thumbnails, we remove the resize bounds (e.g. /p320x320/ or /s206x206/)
    let highResUrls = imageUrls.map(src => {
        return src.replace(/\/[p|s|c]\d+x\d+\//g, '/').replace(/&amp;/g, '&');
    });
    
    highResUrls = [...new Set(highResUrls)];
    console.log(`Found ${highResUrls.length} potential high-res URLs.`);
    
    const limit = Math.min(30, highResUrls.length);
    for (let i = 0; i < limit; i++) {
        const dest = path.join(__dirname, 'public', 'images', `real_fb_${i+1}.jpg`);
        try {
            await download(highResUrls[i], dest);
            console.log(`Downloaded real_fb_${i+1}.jpg`);
        } catch(e) { console.log('Failed', e.message); }
    }
    
    await browser.close();
})();
