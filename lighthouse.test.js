const lighthouse = require("lighthouse"); // Node CLI for Lighthouse https://www.npmjs.com/package/lighthouse#using-the-node-cli
const chromeLauncher = require("chrome-launcher"); // Launch Chrome from node

jest.setTimeout(60000);

const launchChromeAndRunLighthouse = (
  url,
  opts = { chromeFlags: [] },
  config = null
) =>
  chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results =>
      chrome.kill().then(() => results)
    );
  });

test("Meaningful first paint score", () =>
  launchChromeAndRunLighthouse(`https://example.com`).then(({ audits }) =>
    expect(audits["first-meaningful-paint"].score).toBeGreaterThanOrEqual(50)
  ));
