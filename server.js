const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');


const app = express();

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors())

app.get('/jokes', async (req, res) => {
  try {
    const type = req.query.type;
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci/completions',
      {
        prompt: `Tell me a ${type} joke`,
        max_tokens: 100,
        temperature: 0.7,
        n: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const joke = response.data.choices[0].text.trim().split("\n");
    res.json({ joke });
  } catch (error) {
    console.error('Error:', error.response.data);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
