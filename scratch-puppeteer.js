import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Capture page errors
  page.on('pageerror', err => {
    console.log('PAGE_ERROR:', err.message);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE_ERROR:', msg.text());
  });

  try {
    await page.goto('http://localhost:1420', { waitUntil: 'networkidle0' });
    console.log('Page loaded');
    
    // Find the toggle button or admin button
    // The admin button has 'BM' or 'অ্যাডমিন' text
    const buttons = await page.$$('button');
    let adminBtn = null;
    let modeToggleBtn = null;
    for (const btn of buttons) {
        const text = await page.evaluate(el => el.innerText, btn);
        const ariaLabel = await page.evaluate(el => el.querySelector('.sr-only')?.innerText, btn);
        if (text && text.includes('BM') || text.includes('অ্যাডমিন')) adminBtn = btn;
        if (ariaLabel && ariaLabel.includes('Toggle theme')) modeToggleBtn = btn;
    }
    
    if (adminBtn) {
        console.log('Clicking Admin button...');
        await adminBtn.click();
        await new Promise(r => setTimeout(r, 1000));
    }
    
  } catch (err) {
    console.log('SCRIPT_ERROR:', err);
  } finally {
    await browser.close();
  }
})();
