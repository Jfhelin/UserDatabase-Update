const express = require('express'); 
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// open the database mydb.sqlite
const db = new sqlite3.Database('mydb.sqlite');

// create table if it doesn't exist
db.run('CREATE TABLE IF NOT EXISTS users (name TEXT)');

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// handle form submission
app.post('/submit', urlencodedParser, (req, res) => {
  const name = req.body.name;
  db.run(`INSERT INTO users (name) VALUES (?)`, [name], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.redirect('/');
    }
  });
});

// return all users
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.send(rows);
    }
  });
});

// delete all users
app.post('/delete-users', (req, res) => {
  db.run('DELETE FROM users', (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.send('All users deleted');
    }
  });
});

// display form
app.get('/', (req, res) => {
  res.sendFile('form.html', { root: __dirname });
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});




