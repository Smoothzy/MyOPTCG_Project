const express = require("express");

const app = express();
const fs = require("fs");
const path = require("path");

// Function to read data from combined_data.json
function getDataFromJSON(file) {
  const filepath = path.join("scraped_data", file + ".json");

  try {
    // Read the JSON file
    const data = fs.readFileSync(filepath, "utf8");

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Return the parsed JSON data
    return jsonData;
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
}

// Function to find a specific item with a specific value
function findItemWithValue(data, key, value) {
  if (!Array.isArray(data)) {
    console.error("Data is not an array.");
    return null;
  }

  // Iterate over the data array to find the item with the specific value
  for (const item of data) {
    if (item[key] === value) {
      return item;
    }
  }

  // If no item with the specific value is found, return null
  return null;
}

// Call the function to get data from combined_data.json
const jsonData = getDataFromJSON("combined_data");

// API endpoint to fetch card data
app.get("/cards", async (req, res) => {
  if (getDataFromJSON("combined_data") != "") {
    res.json(getDataFromJSON("combined_data"));
  } else {
    res.status(500).json({ error: "Failed to fetch data from the website" });
  }
});

app.get("/cards/st01", async (req, res) => {
  if (getDataFromJSON("569001") != "") {
    res.json(getDataFromJSON("569001"));
  } else {
    res.status(500).json({ error: "Failed to fetch data from the website" });
  }
});

app.get('/card/:id', (req, res) => {
  const id = req.params.id; // Extract the id parameter from the URL
  const item = jsonData.find(item => item.id === id); // Find the item with the matching id

  if (!item) {
      res.status(404).send('Item not found');
  } else {
      res.json(item); // Send the found item as JSON response
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
