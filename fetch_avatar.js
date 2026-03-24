const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const http = require('http');

async function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const client = url.startsWith('https') ? https : http;
        client.get(url, (response) => {
            if(response.statusCode >= 200 && response.statusCode < 300) {
                response.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
            } else if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
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
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    try {
        console.log("Trying instanavigation...");
        await page.goto('https://instanavigation.com/user-profile/belle_hair_by_mrs.fati', { waitUntil: 'networkidle2' });
        const instanavUrl = await page.evaluate(() => {
            const img = document.querySelector('.user-avatar img, .profile-pic img');
            if (img) return img.src;
            // general search for profile images
            const images = Array.from(document.querySelectorAll('img'));
            const avatar = images.find(i => i.src.includes('scontent') && i.width > 50 && i.width < 300);
            return avatar ? avatar.src : null;
        });

        if(instanavUrl) {
            await download(instanavUrl, __dirname + '/public/images/original_logo.jpg');
            console.log('Avatar downloaded from instanavigation');
        } else {
            console.log("Trying picuki...");
            await page.goto('https://www.picuki.com/profile/belle_hair_by_mrs.fati', { waitUntil: 'networkidle2' });
            const picukiAvatar = await page.evaluate(() => {
                const img = document.querySelector('.profile-avatar img');
                return img ? img.src : null;
            });
            if(picukiAvatar) {
                await download(picukiAvatar, __dirname + '/public/images/original_logo.jpg');
                console.log('Avatar downloaded from picuki');
            } else {
                console.log('Could not find avatar');
            }
        }
    } catch(e) {
        console.log('Error', e);
    }
    await browser.close();
})();
