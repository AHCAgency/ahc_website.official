
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/ratings', (req, res) => {
  fs.readFile('ratings.json', (err, data) => {
    if (err) return res.json({ average: null });
    const ratings = JSON.parse(data);
    if (ratings.length === 0) return res.json({ average: null });
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    res.json({ average: avg });
  });
});

app.post('/rate', (req, res) => {
  const { rating, comment } = req.body;
  fs.readFile('ratings.json', (err, data) => {
    let ratings = [];
    if (!err) ratings = JSON.parse(data);
    ratings.push({ rating, comment, date: new Date() });
    fs.writeFile('ratings.json', JSON.stringify(ratings, null, 2), () => {
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
