const fs = require('fs');

async function downloadGTFS() {
  const apiKey = process.env.TRAFIKLAB_API_KEY;
  
  // Vi bygger strängen genom vanlig plustecken-ihopslagning för att undvika teckenfel
  const url = "https://opendata.samtrafiken.se/gtfs/jlt/jlt.zip?key=" + apiKey;
  
  console.log("Försöker ladda ner JLT GTFS...");
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Nedladdning misslyckades. Status: ${response.status}. Svar: ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync('./jlt.zip', buffer);
  console.log("Nedladdning lyckades! Filen sparad som jlt.zip");
}

downloadGTFS().catch(err => {
  console.error(err);
  process.exit(1);
});
