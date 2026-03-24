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
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
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
    console.log('Starting Puppeteer for Facebook Scraping...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('Navigating to facebook photos...');
    await page.goto('https://www.facebook.com/bellehairbyfati/photos/', { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Dismiss cookie banners/modals if present, ignore if not
    try {
        await page.evaluate(() => {
            let btns = Array.from(document.querySelectorAll('div[role="button"]'));
            let decline = btns.find(b => b.innerText && b.innerText.includes('Decline'));
            if(decline) decline.click();
        });
    } catch(e){}
    
    // Scroll a few times to load lazy images
    for(let i=0; i<4; i++) {
        await page.evaluate(() => window.scrollBy(0, 800));
        await new Promise(r => setTimeout(r, 2000));
    }
    
    console.log('Extracting images...');
    let imageUrls = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.map(img => img.src)
                     .filter(src => src && src.includes('scontent') && !src.includes('emoji') && !src.includes('rsrc.php'));
    });
    
    // Fix URLs to point to high res by removing Facebook's scaling/cropping params
    let highResUrls = imageUrls.map(src => {
        let regex1 = new RegExp('p\\\\d+x\\\\d+/', 'g');
        let regex2 = new RegExp('c[0-9.]+/', 'g');
        let regex3 = new RegExp('s\\\\d+x\\\\d+/', 'g');
        let s = src.replace(regex1, '').replace(regex2, '').replace(regex3, '');
        return s.replace(/&amp;/g, '&'); // Unescape
    });
    
    // Provide a generic fallback fallback if fb fails
    const fallbackUrls = [
        "https://images.unsplash.com/photo-1521590832167-7bfc120108f9?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1595476108010-b4d1f10a5146?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620846205844-3d9fc2df04f2?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2000&auto=format&fit=crop"
    ];

    highResUrls = [...new Set(highResUrls)];
    console.log(`Found ${highResUrls.length} unique images from Facebook.`);
    
    // We need 9 distinct images
    const totalNeeded = 9;
    let index = 0;
    
    for (let i = 0; i < totalNeeded; i++) {
        const dest = path.join(__dirname, 'public', 'images', `img${i+1}.jpg`);
        const urlToFetch = highResUrls[index] || fallbackUrls[i];
        
        console.log(`Downloading image ${i+1}...`);
        try {
            await download(urlToFetch, dest);
            // Verify file size
            const stats = fs.statSync(dest);
            if(stats.size < 5000 && highResUrls[index]) {
                // If the fb picture was tiny or broken, retry with fallback
                console.log(`Image ${i+1} was too small, downloading fallback...`);
                await download(fallbackUrls[i], dest);
            }
        } catch(e) {
             console.log(`Failed downloading image ${i+1}, using fallback...`);
             await download(fallbackUrls[i], dest);
        }
        index++;
    }
    
    await browser.close();
    console.log('Script completed successfully!');
})();
