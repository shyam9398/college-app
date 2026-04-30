const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Server is running');
});

// 🔥 MAIN API
app.get('/colleges', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM colleges');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});