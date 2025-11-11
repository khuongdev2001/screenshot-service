const express = require('express');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const { sleep } = require('./utils');
const app = express();

const minimal_args = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
    '--disable-gpu',
];

app.get('/screenshot', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        res.statusCode = 403;
        res.send('url not found');
        return false;
    }
    const width = req.query.width || 800;
    const height = req.query.height || 1000;
    const delay = req.query.delay || 1000;
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/google-chrome',
        args: minimal_args
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: Number(width),
        height: Number(height),
    })
    try {
        await page.goto(url, { "waitUntil": "networkidle0" });
        if (delay) {
            await sleep(delay);
        }
        const imageBuffer = await page.screenshot({
            encoding: 'binary',
            type: 'webp',
        });
        await browser.close();
        res.set('Content-Type', 'image/png');
        res.send(await sharp(imageBuffer)
            .toFormat('webp', { quality: 100 })
            .toBuffer());
        return true;
    }
    catch (e) {
        res.statusCode = 403;
        res.send('url invalid');
        return false;
    }
});

app.listen(80, () => {
    console.log('Listening on port 80');
});