import { chromium } from "playwright";
import cheerio from "cheerio";

// Usa `cheerio`...


async function getResultsFromGoogle(query) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("https://www.google.com/");
  //await page.waitForSelector('input[name="q"]', { timeout: 60000 }); // Wait up to 60 seconds
  await page.waitForSelector('.search-results', { timeout: 5000 });
  await page.fill('input[name="q"]', query);
  await page.keyboard.press('Enter');

  // Espera a que la página cargue
  await page.waitForLoadState('networkidle');

  // Extrae el HTML de la página
  const html = await page.content();

  // Carga el HTML en Cheerio
  const $ = cheerio.load(html);

  // Selecciona los elementos que contienen los resultados
  const resultados = $('.g .r a');

  // Extrae el título y la URL de cada resultado
  const arrayResultados = [];
  resultados.each((index, element) => {
    const title = $(element).find('h3').text();
    const url = $(element).attr('href');

    arrayResultados.push({
      index,
      title,
      url,
    });
  });

  // Cierra el navegador
  await browser.close();

  // Devuelve el array de resultados
  return arrayResultados;
}

// Ejemplo de uso
const query = "nodejs";
const resultados = await getResultsFromGoogle(query);

console.log(resultados);