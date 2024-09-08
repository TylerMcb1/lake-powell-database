import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

const url = 'https://www.usbr.gov/rsvrWater/rsv40Day.html?siteid=919&reservoirtype=Reservoir';

export async function scrapeData() {
    try {
        // Obtain webpage with puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('table#form1\\:datatable');

        // Obtain first row from webpage
        const webpage = await page.content();
        const $ = cheerio.load(webpage);
        const firstRow = $('table#form1\\:datatable tbody tr').first();

        // Extract data from each cell
        const recordData = [];
        firstRow.find('td').each((index, element) => {
            if (index === 0) {
                recordData.push($(element).text().trim());
            } else if (index === 1) {
                recordData.push(parseFloat($(element).text().trim()));
            } else {
                recordData.push(parseInt($(element).text().trim(), 10));
            }
        });

        // Close browser and returned scraped data
        await browser.close();
        return recordData;
    } catch (error) {
        console.error('Error scraping table entry: ', error.message);
    }
};