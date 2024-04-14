const fs = require("fs");
const path = require("path");

// Directory containing JSON files
const directory = path.join('', "scraped_data");

// Function to combine contents of JSON files
function combineJSONFiles(directory) {
  let combinedData = []; // Array to hold combined data

  // Read all files in the directory
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // Iterate through each file
    files.forEach((file) => {
      // Check if the file is a JSON file
      if (path.extname(file) === ".json") {
        // Construct the full path of the JSON file
        const filepath = path.join(directory, file);

        // Read the JSON file
        const data = fs.readFileSync(filepath, "utf8");

        try {
          // Parse the JSON data
          const jsonData = JSON.parse(data);

          // Concatenate data from all files
          combinedData = combinedData.concat(jsonData);
        } catch (error) {
          console.error(`Error parsing JSON file ${file}:`, error);
        }
      }
    });

    // Write the combined data to a new JSON file
    const filepath = path.join(directory, "combined_data.json");
    fs.writeFileSync(filepath, JSON.stringify(combinedData, null, 2));
    console.log("Combined data has been saved to combined_data.json");
  });
}

// Call the function to combine JSON files in the directory
combineJSONFiles(directory);
