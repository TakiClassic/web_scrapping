import { chromium } from "playwright";

async function getResultsFromGoogle(query){
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://www.amazon.com.mx/');
    //await page.waitForSelector('textarea[name="q"]', { timeout: 10000 });
    await page.fill('input[name="field-keywords"]', query);
    await page.keyboard.press('Enter');

    //await page.waitForNavigation({waitUntil:'networkidle'});
    await page.waitForLoadState('networkidle');

    const listadoResultados = await page.evaluate(()=>{
        let resultados = [];
        document.querySelectorAll('div[data-ved] div a').forEach((anchor, index)=>{
            resultados.push({
                index: index,
                title: anchor.innerText,
                url: anchor.href,
            });
        });

        return resultados;
    });

    console.log(listadoResultados);
    await browser.close();
};

getResultsFromGoogle('react');