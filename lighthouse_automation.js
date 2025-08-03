const testUrls = require('./urls');
const lighthouse = require('lighthouse/core/index.cjs'); 
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Function to generate Mountain Time timestamp
function getMountainTimeTimestamp() {
  const options = {
    timeZone: 'America/Denver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

    const parts = new Intl.DateTimeFormat('en-CA', options)
    .formatToParts(new Date())
    .reduce((acc, part) => {
      if (part.type !== 'literal') acc[part.type] = part.value;
      return acc;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day}_${parts.hour}-${parts.minute}-${parts.second}`;
}

const timestamp = getMountainTimeTimestamp();
const formatted = timestamp.replace(/_(\d{2})-(\d{2})-(\d{2})/, '_$1:$2:$3');


// Replace with your production URL
const url = testUrls.google;
console.log('User testing ' + testUrls.spectrum + ' website');

(async () => {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {logLevel: 'info', output: 'html', onlyCategories: ['performance'], port: chrome.port};
  const runnerResult = await lighthouse(url, options);

  const reportHtml = runnerResult.report;

  const reportPath = path.join(__dirname, 'reports', `lighthouse-report-${formatted}.html`);
  fs.writeFileSync(reportPath, reportHtml);

  console.log(`Lighthouse report saved to: ${reportPath}`);
  await chrome.kill();
})();
