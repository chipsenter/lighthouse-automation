const lighthouse = require('lighthouse/core/index.cjs'); 
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Replace with your production URL
const url = 'https://www.spectrum.com';

(async () => {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {logLevel: 'info', output: 'html', onlyCategories: ['performance'], port: chrome.port};
  const runnerResult = await lighthouse(url, options);

  const reportHtml = runnerResult.report;
  const reportPath = path.join(__dirname, `lighthouse-report-${new Date().toISOString().slice(0, 10)}.html`);
  fs.writeFileSync(reportPath, reportHtml);

  console.log(`Lighthouse report saved to: ${reportPath}`);
  await chrome.kill();
})();
