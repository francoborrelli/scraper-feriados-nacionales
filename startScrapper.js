const moment = require('moment');
const puppeteer = require('puppeteer');

const feriadosPage = `https://www.argentina.gob.ar/interior/feriados-nacionales-${new Date().getFullYear()}`;

const setup = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox'],
  });

  const [page] = await browser.pages();
  await page.goto(feriadosPage);
  return { browser, page };
};

async function exe() {
  const results = [];

  const { browser, page } = await setup();

  const months = await page.evaluate(() => {
    return Array.from(document.querySelector('#calendar-container').children).map((m) =>
      m.getAttribute('id')
    );
  });

  for (const [index, month] of months.entries()) {
    const selectors = [`#${month} .bg-primary`, `#${month} .bg-turistico`];

    for (const selector of selectors) {
      const holidays = await page.evaluate((s) => {
        return Array.from(document.querySelectorAll(s)).map((m) => Number(m.textContent));
      }, selector);
      holidays.forEach((date) => {
        results.push(moment().set('D', date).set('M', index).startOf('D').toDate().toISOString());
      });
    }
  }

  await browser.close();

  console.log(results.sort());
}

const doScrap = () =>
  exe()
    .then((res) => console.log('END', res))
    .catch((err) => console.log('ERROR', err));

doScrap();
