const gtfsToGeoJSON = require('gtfs-to-gesojson');
const fs = require('fs');

let configText = fs.readFileSync('./config.json', 'utf8');
const apiKey = process.env.TRAFIKLAB_API_KEY;
configText = configText.replace('__API_KEY__', apiKey);
const config = JSON.parse(configText);

console.log('Startar konvertering av JLT GTFS till GeoJSON...');

gtfsToGeoJSON(config)
  .then(() => {
    console.log('GeoJSON-filer har skapats i /output.');
      process.exit(0);
  })
  .catch(err => {
    console.error:', err);
    process.exit(1);
  });
