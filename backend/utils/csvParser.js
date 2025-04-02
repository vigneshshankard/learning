const fs = require('fs');
const csv = require('csv-parser');
const { Parser } = require('json2csv');

async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

function parseJSONToCSV(data) {
  const fields = Object.keys(data[0]);
  const json2csvParser = new Parser({ fields });
  return json2csvParser.parse(data);
}

module.exports = { parseCSV, parseJSONToCSV };