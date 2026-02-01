import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.luciastaqueria.com/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0"
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const items = [];

    $(".menu-item-title").each((i, el) => {
      const title = $(el).text().trim();
      const description = $(el)
        .siblings(".menu-item-description")
        .text()
        .trim();

      items.push({
         title,
         description
      });
    });

    return res
      .status(200)
      .send(JSON.stringify(items, null, 2));

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
