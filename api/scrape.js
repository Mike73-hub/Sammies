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

    // ⭐ Load HTML into Cheerio
    const $ = cheerio.load(html);

    // ⭐ Prepare final menu array
    const menu = [];

    // ⭐ Loop through each menu section
    $(".comp-menus-item").each((i, el) => {
      const category = $(el).find(".comp-menus-category-title").text().trim();

      const items = [];

      $(el)
        .find(".comp-menus-item-row")
        .each((j, itemEl) => {
          const title = $(itemEl)
            .find(".comp-menus-item-title")
            .text()
            .trim();

          const description = $(itemEl)
            .find(".comp-menus-item-description")
            .text()
            .trim();

          const price = $(itemEl)
            .find(".comp-menus-item-price")
            .text()
            .trim();

          const image = $(itemEl).find("img").attr("src") || null;

          items.push({
            title,
            description,
            price,
            image
          });
        });

      if (category && items.length > 0) {
        menu.push({ category, items });
      }
    });

    // ⭐ Return JSON instead of HTML
    return res.status(200).json(menu);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
