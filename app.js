import { chromium } from "playwright";

async function getResultsFromGoogle(query, browser){
    const page = await browser.newPage();
    await page.goto('https://www.google.com/');
    await page.fill('textarea[name="q"]', query);
    await page.keyboard.press('Enter');

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
        console.log(resultados);
        return resultados;
    });
    return listadoResultados;
};

async function visitResultAndGetContent(resultado, browser){
    const page = await browser.newPage();
    await page.goto(resultado.url);
    await page.waitForLoadState('domcontentloaded');

    const content = await page.evaluate(() => {
        const rawText = document.querySelector('main')?.innerText || document.querySelector('body')?.innerText;
        return rawText;
    });

    //console.log(resultado);
    //console.log(content);
    return content;
};

async function startScraping(query){

    const browser = await chromium.launch();
    let allTexts = [];

    const listadoResultados = await getResultsFromGoogle(query, browser);
    //getResultsFromGoogle(query, browser);

    //console.log(listadoResultados);

    for await (const url of listadoResultados){
        const contenido = await visitResultAndGetContent(url, browser);
        //console.log(contenido);
        allTexts.push(contenido);
    };
    //console.log(allTexts);
    await browser.close();
    console.log(allTexts.index[5]);
    return allTexts;
}

let queryTerminal = process.argv.slice(2)[0];

startScraping(queryTerminal);
