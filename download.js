const fs = require('fs');
const path = require('path');

async function downloadGTFS() {
  const apiKey = process.env.TRAFIKLAB_API_KEY;
  const url = "https://opendata.samtrafiken.se/gtfs/jlt/jlt.zip?key=" + apiKey;

  const etagFilePath = path.join(__dirname, '.last-etag');
  
  // Förbered headers och läs in tidigare sparat ETag om det finns
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  };
  
  if (fs.existsSync(etagFilePath)) {
    const lastEtag = fs.readFileSync(etagFilePath, 'utf8').trim();
    if (lastEtag) {
      headers['If-None-Match'] = lastEtag;
    }
  }

  console.log("Kontrollerar om JLT GTFS har uppdaterats hos Trafiklab...");
  
  const response = await fetch(url, { headers });

  // Om Trafiklab svarar med 304 betyder det att filen inte har ändrats sedan sist
  if (response.status === 304) {
    console.log("Ingen ny data tillgänglig (HTTP 304 Not Modified). Avbryter nedladdning.");
    // Avsluta med statuskod 78 så att vår GitHub Action vet att vi kan stanna här
    process.exit(78);
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Nedladdning misslyckades. Status: ${response.status}. Svar: ${errorText}`);
  }

  // Spara den nya zip-filen om servern svarade med 200 OK
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync('./jlt.zip', buffer);
  console.log("Nedladdning lyckades! Filen sparad som jlt.zip");

  // Hämta och spara den nya ETag-headern inför nästa körning
  const newEtag = response.headers.get('etag');
  if (newEtag) {
    fs.writeFileSync(etagFilePath, newEtag, 'utf8');
    console.log(`Nytt ETag sparat: ${newEtag}`);
  }
}

downloadGTFS().catch(err => {
  console.error(err);
  process.exit(1);
});
