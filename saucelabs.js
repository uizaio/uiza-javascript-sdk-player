const username = process.env.SAUCE_USERNAME || '';
const accessKey = process.env.SAUCE_ACCESS_KEY || '';
const { TRAVIS_JOB_NUMBER } = process.env;
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

let urlSaucelabs;
let browser;

if (username && accessKey) {
  urlSaucelabs = ['http://', username, ':', accessKey, 'ondemand.us-west-1.saucelabs.com:443/wd/hub'].join('');
  browser = new Builder()
    .withCapabilities({
      browserName: 'Safari',
      deviceOrientation: 'portrait',
      platformName: 'iOS',
      browserVersion: '13.0',
      username,
      accessKey,
      tunnelIdentifier: TRAVIS_JOB_NUMBER,
    })
    .usingServer(urlSaucelabs)
    .build();

  browser.get('https://playerjs-dev.uizadev.io/test.html');

  // describe('testing javascript in the browser', function() {
  //   beforeEach(function() {
  //     return browser.get('http://127.0.0.1:3000/');
  //   });

  //   afterEach(function() {
  //     return closeBrowser();
  //   });

  //   it('test title', function(done) {
  //     browser.getTitle().then(function(title) {
  //       assert.equal(title, 'CoreDataStore');
  //       done();
  //     });
  //   });
  // });
}

function clickLink(link) {
  link.click();
}

function findLink(link) {
  const href = ['[href="', link, '"]'].join('');
  return browser.findElements(By.css(href)).then(res => {
    return res[0];
  });
}

function findButton(name) {
  const button = `//button[@data-uiza='${name}']`;
  return browser.findElements(By.xpath(button)).then(res => {
    return res[0];
  });
}

function findTimeShift() {
  const timeshift = `//div[@data-uiza='settings']//*[text()='Time Shift']`;
  return browser.findElements(By.xpath(timeshift)).then(res => {
    return res[0];
  });
}
function findId(id) {
  return browser.findElement(By.id(id)).then(res => {
    return res[0];
  });
}

function closeBrowser() {
  browser.quit();
}

function handleFailure(err) {
  console.error('Something went wrong\n', err.stack, '\n');
  closeBrowser();
}

browser.wait(findButton('settings'), 2000).then(clickLink);
browser.wait(findTimeShift(), 200).then(clickLink);
browser.wait(findTimeShift(), 20000).then(clickLink).then(closeBrowser, handleFailure);
