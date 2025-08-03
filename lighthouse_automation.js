const testUrls = require('./utils/urls');
const getMountainTimeTimestamp = require('./utils/timestamp');
const lighthouse = require('lighthouse/core/index.cjs'); 
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

const timestamp = getMountainTimeTimestamp();
// const formatted = timestamp.replace(/_(\d{2})-(\d{2})-(\d{2})/, '_$1:$2:$3');

// Replace with your production URL
const url = testUrls.spectrumnet;
console.log('User testing ' + url + ' website');

(async () => {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {logLevel: 'info', output: 'html', onlyCategories: ['performance'], port: chrome.port};
  const runnerResult = await lighthouse(url, options);

  const reportHtml = runnerResult.report;

  const reportPath = path.join(__dirname, 'reports', `lighthouse-report-${timestamp}.html`);
  fs.writeFileSync(reportPath, reportHtml);

  console.log(`Lighthouse report saved to: ${reportPath}`);
  await chrome.kill();
})();
