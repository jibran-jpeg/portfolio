import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`BROWSER LOG: ${msg.text()}`);
  });

  await page.goto('http://localhost:3000');
  
  // Wait for a few seconds to let animations run
  await new Promise(r => setTimeout(r, 4000));
  
  await browser.close();
})();
