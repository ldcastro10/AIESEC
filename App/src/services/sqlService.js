const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

let db = new sqlite3.Database('C:\\Users\\Luis Castro\\Documents\\ARTI\\Tienda Ropa MATI\\ProcesProdServ\\mati.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

app.get('/products', (req, res) => {
  db.all('SELECT * FROM mati_table', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
