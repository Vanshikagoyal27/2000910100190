
const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;


function mergeUniqueArrays(arrays) {
  const merged = [].concat(...arrays);
  const uniqueNumbers = Array.from(new Set(merged));
  return uniqueNumbers.sort((a, b) => a - b);
}


app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.json({ numbers: [] });
  }

  try {
    const requests = urls.map(async (url) => {
      try {
        const response = await axios.get(url, { timeout: 500 });
        if (response.data && Array.isArray(response.data.numbers)) {
          return response.data.numbers;
        }
      } catch (error) {
        
      }
      return [];
    });

    const responses = await Promise.all(requests);
    const mergedNumbers = mergeUniqueArrays(responses);

    res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});