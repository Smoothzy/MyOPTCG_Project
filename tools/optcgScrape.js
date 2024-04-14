const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Function to fetch the HTML content of the website
async function fetchHTML(url) {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error("Error fetching HTML:", error);
    return null;
  }
}

// Function to extract all sets from the HTML
function extractSets(html) {
  const $ = cheerio.load(html);
  const sets = [];

  const seriesContainer = $(".selectModal");

  seriesContainer.find("option").each((index, element) => {
    if ($(element).val().length > 0) {
      sets.push($(element).val());
    }
  });

  return sets;
}

// Function to extract all cards from the html
function extractCardsPerSet(html, set) {
  const $ = cheerio.load(html);
  const cards = [];

  // Create a directory to store the JSON file if it doesn't exist
  const directory = path.join("", "scraped_data");
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  const cardContainer = $(".resultCol");

  cardContainer.find(".modalCol").each((index, element) => {
    const name = $(element).find(".cardName").text();
    const attribute = $(element).find(".attribute").find("i").text();
    const cost = $(element)
      .find(".cost")
      .text()
      .replace("Cost", "")
      .replace("-", "");

    const power = $(element)
      .find(".power")
      .text()
      .replace("Power", "")
      .replace("-", "");

    const counter = $(element)
      .find(".counter")
      .text()
      .replace("Counter", "")
      .replace("-", "");

    const color = $(element)
      .find(".color")
      .text()
      .replace("Color", "")
      .replace("-", "");

    const feature = $(element)
      .find(".feature")
      .text()
      .replace("Feature", "")
      .replace("-", "");

    const effect = $(element)
      .find(".text")
      .text()
      .replace("Effect", "")
      .replace("-", "");

    const CardSet = $(element)
      .find(".getInfo")
      .text()
      .replace("Card Set(s)", "")
      .replace("-", "");

    const trigger = $(element)
      .find(".trigger")
      .text()
      .replace("Trigger", "")
      .replace("-", "");

    const imageUrl =
      process.env.NORMALLINK +
      $(element).find("img").attr("src").replace("..", "").split("?")[0];

    const type = $(element).find(".infoCol").find("span:nth(2)").text();
    const rarity = $(element).find(".infoCol").find("span:nth(1)").text();
    const id = $(element).find(".infoCol").find("span:nth(0)").text();

    cards.push({
      id,
      name,
      type,
      rarity,
      cost,
      attribute,
      power,
      counter,
      color,
      type,
      feature,
      effect,
      trigger,
      CardSet,
      imageUrl,
    });
  });

  //console.log(cards);

  const filename = `${set}.json`;

  // Write data into a JSON file in the specified directory
  const filepath = path.join(directory, filename);
  fs.writeFileSync(filepath, JSON.stringify(cards, null, 2));
  console.log(`Data has been scraped and saved to ${filepath}`);
}

// Main function to run the scraper
async function main() {
  // URL of the website
  var url = process.env.NORMALLINK;
  var html = await fetchHTML(url);
  if (html) {
    const sets = extractSets(html);

    sets.forEach(async (set, index) => {
      const filepath = path.join("scraped_data", set + ".json");

      setTimeout(async function () {
        var url = process.env.SERIESLINK + set;
        if (fs.existsSync(filepath)) {
          console.log(
            `Data from ${url} already exists in ${filepath}. Skipping...`
          );
        } else {
          var html = await fetchHTML(url);
          extractCardsPerSet(html, set);
        }
      }, 5000 * (index + 1));
    });
  }
}

main();
