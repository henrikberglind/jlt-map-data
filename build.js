const gtfsToGeoJSON = require('gtfs-to-geojson');
const fs = require('fs');

// Ersätt platshållaren i config med vår hemliga API-nyckel
let configText = fs.readFileSync('./config.json', 'utf8');
const apiKey = process.env.TRAFIKLAB_API_KEY;
configText = configText.replace('__API_KEY__', apiKey);
const config = JSON.parse(configText);

console.log('Startar konvertering av JLT GTFS till GeoJSON...');

gtfsToGeoJSON(config)
  .then(() => {
    console.log('GeoJSON-filer har skapats i /output!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Ett fel uppstod:', err);
    process.exit(1);
  });